import { useState, useCallback, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User as UserIcon, Mail, Phone, AlertCircle } from "lucide-react";
import { AuthLayout, AuthCard } from "../../components/auth/AuthLayout";
import { AuthBranding } from "../../components/auth/AuthBranding";
import { AuthTabs } from "../../components/auth/AuthTabs";
import { AuthInput } from "../../components/auth/AuthInput";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { SocialAuthButtons } from "../../components/auth/SocialAuthButtons";
import { authService } from "../../services/authService";

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password))
    return "Password must include at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must include at least one lowercase letter";
  if (!/[0-9]/.test(password))
    return "Password must include at least one number";
  return null;
}

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = (location.state || {}) as {
    fullName?: string;
    email?: string;
    phone?: string;
  };

  const [fullName, setFullName] = useState(prefill.fullName || "");
  const [email, setEmail] = useState(prefill.email || "");
  const [phone, setPhone] = useState(prefill.phone || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const isSubmitting = loading || socialLoading;

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (phone.trim() && !/^\+?[\d\s\-()]{7,15}$/.test(phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const passwordError = validatePassword(password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fullName, email, phone, password, confirmPassword]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    try {
      setLoading(true);
      setErrors({});

      // STEP 2 — Request OTP from Cloudflare Worker before creating Firebase account
      const otpResult = await authService.sendRegistrationOtp(
        email.trim().toLowerCase(),
        fullName.trim()
      );

      if (!otpResult.success || !otpResult.transactionId) {
        setErrors({
          general:
            otpResult.error ||
            "Failed to send verification email. Please check your credentials.",
        });
        setLoading(false);
        return;
      }

      // Store short-lived in-memory session (never in URL or storage)
      authService.setPendingRegistration({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
        transactionId: otpResult.transactionId,
        cooldownSeconds: otpResult.cooldownSeconds || 60,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      // Clear local password state before navigating
      setPassword("");
      setConfirmPassword("");

      // STEP 3 — Navigate to OTP verification screen (only non-sensitive metadata in state)
      navigate("/verify-email", {
        state: {
          email: email.trim().toLowerCase(),
          transactionId: otpResult.transactionId,
        },
      });
    } catch (err) {
      setErrors({
        general:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSocialError(error: string) {
    setErrors({ general: error });
  }

  return (
    <AuthLayout>
      <AuthBranding tagline="Connect. Chat. Share." />

      <AuthCard>
        <AuthTabs activeTab="signup" />

        {errors.general && (
          <div
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-700 animate-fade-in"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="leading-snug">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          <AuthInput
            icon={UserIcon}
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName)
                setErrors((prev) => ({ ...prev, fullName: undefined }));
            }}
            error={errors.fullName}
            autoComplete="name"
            required
            disabled={isSubmitting}
            aria-label="Full Name"
          />

          <AuthInput
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            autoComplete="email"
            required
            disabled={isSubmitting}
            aria-label="Email Address"
          />

          <AuthInput
            icon={Phone}
            type="tel"
            placeholder="Phone Number (Optional)"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone)
                setErrors((prev) => ({ ...prev, phone: undefined }));
            }}
            error={errors.phone}
            autoComplete="tel"
            disabled={isSubmitting}
            aria-label="Phone Number"
          />

          <PasswordInput
            placeholder="Create Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            autoComplete="new-password"
            required
            disabled={isSubmitting}
            aria-label="Create Password"
          />

          <PasswordInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword)
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
            disabled={isSubmitting}
            aria-label="Confirm Password"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold text-white transition-all duration-200 hover:brightness-105 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168CF5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #48AEFF 0%, #087CF0 100%)",
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
                Sending Verification Code...
              </span>
            ) : (
              "Create Account →"
            )}
          </button>
        </form>

        <SocialAuthButtons
          onError={handleSocialError}
          onLoading={setSocialLoading}
          disabled={isSubmitting}
        />

        <p className="mt-5 text-center text-[13px] text-[#627895]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#168CF5] transition-colors hover:text-[#087CF0] hover:underline"
          >
            Login
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
