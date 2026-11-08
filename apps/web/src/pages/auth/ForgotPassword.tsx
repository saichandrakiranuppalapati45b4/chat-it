import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { AuthLayout, AuthCard } from "../../components/auth/AuthLayout";
import { AuthBranding } from "../../components/auth/AuthBranding";
import { AuthInput } from "../../components/auth/AuthInput";
import {
  auth,
  isFirebaseConfigured,
  sendPasswordResetEmail,
} from "../../lib/firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isFirebaseConfigured() || !auth) {
      setError(
        "Firebase is not configured. Please add your Firebase credentials to the .env file."
      );
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err) {
      const firebaseError = err as { code?: string; message?: string };
      switch (firebaseError.code) {
        case "auth/user-not-found":
          // Security practice: don't reveal whether user exists
          setSent(true);
          break;
        case "auth/invalid-email":
          setError("Invalid email address format");
          break;
        case "auth/too-many-requests":
          setError("Too many requests. Please try again later.");
          break;
        default:
          setError(
            firebaseError.message ??
              "Failed to send password reset email. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <AuthBranding tagline="Reset your password" />

      <AuthCard>
        <Link
          to="/login"
          className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#627895] transition-colors hover:text-[#102448]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        {sent ? (
          <div className="py-2 text-center">
            <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#168CF5]">
              <CheckCircle2 className="h-8 w-8 stroke-[2]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#102448]">
              Check your email
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#627895]">
              If an account matches <strong className="text-[#102448]">{email}</strong>, we sent a password reset link. Please check your inbox and spam folder.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex h-[46px] w-full items-center justify-center rounded-2xl text-[14px] font-semibold text-white transition-all duration-200 hover:brightness-105"
              style={{
                background:
                  "linear-gradient(135deg, #48AEFF 0%, #087CF0 100%)",
                boxShadow: "0 8px 20px -4px rgba(22, 140, 245, 0.4)",
              }}
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-5 text-[13px] leading-relaxed text-[#627895]">
              Enter the email associated with your account and we&apos;ll send you instructions to reset your password.
            </p>

            {error && (
              <div
                className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-700"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <AuthInput
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="email"
                required
                disabled={loading}
                aria-label="Email Address"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold text-white transition-all duration-200 hover:brightness-105 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168CF5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, #48AEFF 0%, #087CF0 100%)",
                  boxShadow: "0 8px 20px -4px rgba(22, 140, 245, 0.4)",
                }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link →"
                )}
              </button>
            </form>
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
