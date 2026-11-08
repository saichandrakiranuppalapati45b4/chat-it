import { useState, useCallback, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Check, AlertCircle } from "lucide-react";
import { AuthLayout, AuthCard } from "../../components/auth/AuthLayout";
import { AuthBranding } from "../../components/auth/AuthBranding";
import { AuthTabs } from "../../components/auth/AuthTabs";
import { AuthInput } from "../../components/auth/AuthInput";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { SocialAuthButtons } from "../../components/auth/SocialAuthButtons";
import {
  auth,
  isFirebaseConfigured,
  signInWithEmailAndPassword,
} from "../../lib/firebase";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const isSubmitting = loading || socialLoading;

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    if (!isFirebaseConfigured() || !auth) {
      setErrors({
        general:
          "Firebase is not configured. Please add your Firebase credentials to the .env file.",
      });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await signInWithEmailAndPassword(auth, email.trim(), password);

      navigate("/");
    } catch (err) {
      const error = err as { code?: string; message?: string };
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setErrors({
            general: "Invalid email or password. Please try again.",
          });
          break;
        case "auth/user-disabled":
          setErrors({
            general:
              "This account has been disabled. Please contact support.",
          });
          break;
        case "auth/too-many-requests":
          setErrors({
            general:
              "Too many failed login attempts. Please reset your password or try again later.",
          });
          break;
        default:
          setErrors({
            general:
              error.message ?? "Login failed. Please check your credentials.",
          });
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSocialError(error: string) {
    setErrors({ general: error });
  }

  return (
    <AuthLayout>
      <AuthBranding tagline="Welcome back!" />

      <AuthCard>
        <AuthTabs activeTab="login" />

        {errors.general && (
          <div
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-700"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p>{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          <AuthInput
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            autoComplete="email"
            required
            disabled={isSubmitting}
            aria-label="Email Address"
          />

          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            autoComplete="current-password"
            required
            disabled={isSubmitting}
            aria-label="Password"
          />

          <div className="flex items-center justify-between pt-1">
            {/* Custom styled Remember Me checkbox */}
            <label className="group flex cursor-pointer select-none items-center gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={rememberMe}
                onClick={() => setRememberMe(!rememberMe)}
                disabled={isSubmitting}
                className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168CF5] ${
                  rememberMe
                    ? "bg-[#168CF5] text-white"
                    : "border border-[#DCE6F2] bg-white group-hover:border-[#168CF5]"
                }`}
              >
                {rememberMe && <Check className="h-3 w-3 stroke-[3]" />}
              </button>
              <span className="text-[13px] font-normal text-[#102448]">
                Remember me
              </span>
            </label>

            <Link
              to="/forgot-password"
              className="text-[13px] font-medium text-[#168CF5] transition-colors hover:text-[#087CF0] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

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
                Logging in...
              </span>
            ) : (
              "Login →"
            )}
          </button>
        </form>

        <SocialAuthButtons
          onError={handleSocialError}
          onLoading={setSocialLoading}
          disabled={isSubmitting}
        />

        <p className="mt-5 text-center text-[13px] text-[#627895]">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#168CF5] transition-colors hover:text-[#087CF0] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
