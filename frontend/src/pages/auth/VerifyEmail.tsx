import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { OTPVerification } from "../../components/auth/OTPVerification";
import { authService } from "../../services/authService";
import {
  auth,
  isFirebaseConfigured,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "../../lib/firebase";
import { AuthLayout, AuthCard } from "../../components/auth/AuthLayout";
import { AuthBranding } from "../../components/auth/AuthBranding";
import { ShieldAlert, ArrowLeft, RefreshCw } from "lucide-react";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve short-lived in-memory registration session
  const pending = authService.getPendingRegistration();
  const routerState = (location.state || {}) as {
    email?: string;
    transactionId?: string;
  };

  const email = pending?.email || routerState.email || "";
  const transactionId = pending?.transactionId || routerState.transactionId || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [firestoreRetryNeeded, setFirestoreRetryNeeded] = useState(false);
  const [createdFirebaseUser, setCreatedFirebaseUser] = useState<{
    uid: string;
    idToken: string;
    verificationToken: string;
  } | null>(null);

  // If in-memory credentials have expired or page was refreshed without credentials in memory
  if (!pending || !pending.password || !transactionId) {
    return (
      <AuthLayout>
        <AuthBranding tagline="Connect. Chat. Share." />
        <AuthCard>
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-sm">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#102448]">
              Registration Session Expired
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#627895]">
              To protect your security, passwords are held only in short-lived memory and are never persisted across page refreshes.
            </p>
            <p className="mt-1 text-xs text-[#627895]">
              Please restart registration to receive a new verification code.
            </p>

            <div className="mt-6">
              <Link
                to="/signup"
                state={{ email }}
                className="inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-2xl text-[14px] font-semibold text-white transition-all hover:brightness-105"
                style={{
                  background: "linear-gradient(135deg, #48AEFF 0%, #087CF0 100%)",
                  boxShadow: "0 8px 20px -4px rgba(22, 140, 245, 0.4)",
                }}
              >
                Restart Registration →
              </Link>
            </div>

            <div className="mt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#627895] hover:text-[#102448]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Login
              </Link>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  // Recovery handler if Firestore profile save failed after Firebase user was created
  const handleRetryProfileSave = async () => {
    if (!createdFirebaseUser) return;
    setIsLoading(true);
    setError(undefined);

    try {
      // 1. Retry saving profile to Firestore
      await authService.saveUserProfile({
        uid: createdFirebaseUser.uid,
        displayName: pending.fullName.trim(),
        email: pending.email.trim(),
        phoneNumber: pending.phone || null,
      });

      // 2. Finalize registration on Worker
      const completeResult = await authService.completeRegistration(
        transactionId,
        createdFirebaseUser.verificationToken,
        createdFirebaseUser.idToken
      );

      if (!completeResult.success) {
        setError(completeResult.error || "Failed to complete registration on server.");
        setIsLoading(false);
        return;
      }

      // 3. Clear session and redirect to Home
      authService.clearPendingRegistration();
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? `Profile save retry failed: ${err.message}`
          : "Failed to save profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(undefined);
    setSuccessMessage(undefined);

    try {
      // 1. Verify OTP with Cloudflare Worker
      const verifyResult = await authService.verifyRegistrationOtp(
        transactionId,
        otp
      );

      if (!verifyResult.success || !verifyResult.verificationToken) {
        setError(verifyResult.error || "Verification failed. Please check your code.");
        setIsLoading(false);
        return;
      }

      const verificationToken = verifyResult.verificationToken;

      // 2. Check Firebase configuration
      if (!isFirebaseConfigured() || !auth) {
        setError("Firebase Authentication is not configured. Please check your configuration.");
        setIsLoading(false);
        return;
      }

      // 3. Create Firebase Account using verified email and memory-held password
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          pending.email.trim(),
          pending.password
        );
      } catch (firebaseErr) {
        const fbError = firebaseErr as { code?: string; message?: string };
        if (fbError.code === "auth/email-already-in-use") {
          // Registration recovery: Account was previously created in Firebase Auth
          // (e.g. prior attempt interrupted before Firestore profile or Worker completion).
          // Authenticate with the verified credentials to recover and finalize setup.
          try {
            userCredential = await signInWithEmailAndPassword(
              auth,
              pending.email.trim(),
              pending.password
            );
          } catch {
            setError(
              "An account with this email already exists with a different password. Please log in or reset your password."
            );
            setIsLoading(false);
            return;
          }
        } else {
          setError(fbError.message || "Failed to create Firebase user account.");
          setIsLoading(false);
          return;
        }
      }

      const user = userCredential.user;
      const uid = user.uid;

      // 4. Obtain genuine Firebase ID token to send to Cloudflare Worker
      const idToken = await user.getIdToken();

      // 5. Update Firebase Auth user display name
      try {
        await updateProfile(user, {
          displayName: pending.fullName.trim(),
        });
      } catch (profileErr) {
        console.warn("Could not update Firebase displayName:", profileErr);
      }

      // Save state in case Firestore profile write fails and needs user-triggered retry
      setCreatedFirebaseUser({
        uid,
        idToken,
        verificationToken,
      });

      // 6. Store user profile in Cloud Firestore users/{uid}
      try {
        await authService.saveUserProfile({
          uid,
          displayName: pending.fullName.trim(),
          email: pending.email.trim(),
          phoneNumber: pending.phone || null,
        });
      } catch (firestoreErr) {
        console.error("Firestore user profile save error:", firestoreErr);
        setFirestoreRetryNeeded(true);
        setError(
          "Your account was created, but initializing your profile timed out. Click 'Retry Initializing Profile' below."
        );
        setIsLoading(false);
        return;
      }

      // 7. Complete registration on Cloudflare Worker (verifying ID token server-side)
      const completeResult = await authService.completeRegistration(
        transactionId,
        verificationToken,
        idToken
      );

      if (!completeResult.success) {
        setError(
          completeResult.error ||
            "Account created, but failed to complete registration confirmation with the server."
        );
        setIsLoading(false);
        return;
      }

      // 8. Wipe in-memory registration session password & navigate to Home
      authService.clearPendingRegistration();
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during verification."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isResending) return;
    setIsResending(true);
    setError(undefined);
    setSuccessMessage(undefined);

    try {
      const resendResult = await authService.resendRegistrationOtp(transactionId);

      if (!resendResult.success) {
        setError(resendResult.error || "Could not resend code. Please try again.");
      } else {
        setSuccessMessage("A fresh 6-digit verification code has been sent!");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to verification server."
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    const prefillEmail = pending.email;
    const prefillName = pending.fullName;
    const prefillPhone = pending.phone;
    authService.clearPendingRegistration();
    navigate("/signup", {
      state: {
        fullName: prefillName,
        email: prefillEmail,
        phone: prefillPhone,
      },
    });
  };

  if (firestoreRetryNeeded) {
    return (
      <AuthLayout>
        <AuthBranding tagline="Connect. Chat. Share." />
        <AuthCard>
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-sm">
              <RefreshCw className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#102448]">
              Complete Profile Setup
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#627895]">
              Your email was verified and your authentication account was created successfully.
            </p>
            <p className="mt-1 text-xs text-[#627895]">
              Please retry initializing your profile database record to finish setting up your account.
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6">
              <button
                type="button"
                onClick={handleRetryProfileSave}
                disabled={isLoading}
                className="inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-2xl text-[14px] font-semibold text-white transition-all hover:brightness-105 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #48AEFF 0%, #087CF0 100%)",
                  boxShadow: "0 8px 20px -4px rgba(22, 140, 245, 0.4)",
                }}
              >
                {isLoading ? "Saving Profile..." : "Retry Initializing Profile →"}
              </button>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <OTPVerification
      email={email}
      onVerify={handleVerifyOtp}
      onResend={handleResendOtp}
      onChangeEmail={handleChangeEmail}
      isLoading={isLoading}
      isResending={isResending}
      error={error}
      successMessage={successMessage}
      initialCooldown={pending?.cooldownSeconds || 60}
    />
  );
}
