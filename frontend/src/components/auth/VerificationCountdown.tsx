import { useState, useEffect } from "react";
import { RotateCw } from "lucide-react";

interface VerificationCountdownProps {
  initialSeconds?: number;
  onResend: () => Promise<void> | void;
  isResending?: boolean;
}

export function VerificationCountdown({
  initialSeconds = 60,
  onResend,
  isResending = false,
}: VerificationCountdownProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResendClick = async () => {
    if (secondsLeft > 0 || isResending) return;
    await onResend();
    setSecondsLeft(60); // Reset countdown on resend
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-center text-xs text-[#627895]">
      {secondsLeft > 0 ? (
        <span className="flex items-center gap-1.5">
          <span>Didn&apos;t receive code? Resend in</span>
          <strong className="font-semibold text-[#168CF5]">
            {formatTime(secondsLeft)}
          </strong>
        </span>
      ) : (
        <button
          type="button"
          onClick={handleResendClick}
          disabled={isResending}
          className="group inline-flex items-center gap-1.5 font-semibold text-[#168CF5] transition-colors hover:text-[#087CF0] focus:outline-none disabled:opacity-50"
        >
          <RotateCw
            className={`h-3.5 w-3.5 transition-transform ${
              isResending ? "animate-spin" : "group-hover:rotate-45"
            }`}
          />
          <span>{isResending ? "Sending code..." : "Resend verification code"}</span>
        </button>
      )}
    </div>
  );
}
