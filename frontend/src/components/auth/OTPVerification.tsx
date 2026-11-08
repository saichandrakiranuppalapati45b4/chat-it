import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthLayout, AuthCard } from "./AuthLayout";
import { AuthBranding } from "./AuthBranding";
import { OTPInput } from "./OTPInput";
import { VerificationCountdown } from "./VerificationCountdown";

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onChangeEmail?: () => void;
  isLoading?: boolean;
  isResending?: boolean;
  error?: string;
  successMessage?: string;
  initialCooldown?: number;
}

export function OTPVerification({
  email,
  onVerify,
  onResend,
  onChangeEmail,
  isLoading = false,
  isResending = false,
  error,
  successMessage,
  initialCooldown = 60,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (otp.length < 6) {
      setLocalError("Please enter the complete 6-digit verification code.");
      return;
    }

    await onVerify(otp);
  };

  const activeError = error || localError;

  return (
    <AuthLayout>
      <AuthBranding tagline="Connect. Chat. Share." />

      <AuthCard>
        {/* Back / Change Email Link */}
        <div className="mb-4 flex items-center justify-between">
          {onChangeEmail ? (
            <button
              type="button"
              onClick={onChangeEmail}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#627895] transition-colors hover:text-[#102448]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Change email
            </button>
          ) : (
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#627895] transition-colors hover:text-[#102448]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Sign Up
            </Link>
          )}

          <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#168CF5]">
            <Mail className="h-3 w-3" />
            Step 2 of 2
          </span>
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#168CF5] shadow-sm">
            <Mail className="h-7 w-7 stroke-[1.8]" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#102448]">
            Verify your email
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-[#627895]">
            We&apos;ve sent a 6-digit verification code to
          </p>
          <p className="font-semibold text-xs text-[#102448] mt-0.5 break-all">
            {email}
          </p>
        </div>

        {/* Error message */}
        {activeError && (
          <div
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-700 animate-fade-in"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="leading-snug">{activeError}</p>
          </div>
        )}

        {/* Success message (e.g. on resend) */}
        {successMessage && (
          <div
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-700 animate-fade-in"
            role="status"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <p className="leading-snug">{successMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="py-1">
            <OTPInput
              value={otp}
              onChange={(val) => {
                setOtp(val);
                if (localError) setLocalError("");
              }}
              length={6}
              disabled={isLoading}
              error={Boolean(activeError)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className="flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold text-white transition-all duration-200 hover:brightness-105 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168CF5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #48AEFF 0%, #087CF0 100%)",
              boxShadow: "0 8px 20px -4px rgba(22, 140, 245, 0.4)",
            }}
          >
            {isLoading ? (
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
                Verifying Code...
              </span>
            ) : (
              "Verify & Create Account →"
            )}
          </button>
        </form>

        {/* Cooldown and Resend */}
        <div className="mt-5 border-t border-[#F0F4F8] pt-4">
          <VerificationCountdown
            initialSeconds={initialCooldown}
            onResend={onResend}
            isResending={isResending}
          />
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
