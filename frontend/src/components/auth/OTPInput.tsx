import { useRef, useEffect, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "../../lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  error = false,
  autoFocus = true,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into individual digits
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const setDigit = (index: number, digit: string) => {
    const chars = Array.from({ length }, (_, i) => value[i] || "");
    chars[index] = digit;
    const newValue = chars.join("").slice(0, length);
    onChange(newValue);
  };

  const handleChange = (index: number, char: string) => {
    // Only accept numeric digits
    const cleaned = char.replace(/\D/g, "");
    if (!cleaned) {
      setDigit(index, "");
      return;
    }

    // Take the last entered character if multiple
    const lastChar = cleaned.slice(-1);
    setDigit(index, lastChar);

    // Auto-advance to next input
    if (index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Move to previous box and clear it
        inputRefs.current[index - 1]?.focus();
        setDigit(index - 1, "");
      } else {
        setDigit(index, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").replace(/\D/g, "");
    if (!pasted) return;

    const trimmed = pasted.slice(0, length);
    onChange(trimmed);

    // Move focus to next empty box or the last box
    const nextIndex = Math.min(trimmed.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${index + 1} of verification code`}
          className={cn(
            "h-13 w-11 sm:h-14 sm:w-13 rounded-2xl border text-center text-xl sm:text-2xl font-bold transition-all duration-200 outline-none",
            "bg-white text-[#102448] shadow-sm",
            digit ? "border-[#168CF5] bg-blue-50/20" : "border-[#DCE6F2]",
            "focus:border-[#168CF5] focus:ring-4 focus:ring-[#168CF5]/15",
            error && "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-red-500/15",
            disabled && "cursor-not-allowed opacity-50 bg-slate-50"
          )}
        />
      ))}
    </div>
  );
}
