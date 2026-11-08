import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Lock, Eye, EyeOff } from "lucide-react";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ error, className, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="w-full">
        <div className="relative">
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <Lock
              className="h-[18px] w-[18px] text-[#627895]"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>
          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            className={cn(
              "h-[50px] w-full rounded-2xl border border-[#DCE6F2] bg-white pl-12 pr-12 text-[14px] text-[#102448] placeholder-[#8FA0B5] outline-none transition-all duration-200",
              "focus:border-[#168CF5] focus:ring-4 focus:ring-[#168CF5]/10",
              "hover:border-[#168CF5]/40",
              error &&
                "border-red-400 focus:border-red-500 focus:ring-red-500/15",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#627895] transition-colors hover:text-[#102448] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168CF5]/40"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <Eye className="h-[18px] w-[18px]" strokeWidth={1.8} />
            ) : (
              <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.8} />
            )}
          </button>
        </div>
        {error && (
          <p className="mt-1.5 pl-1 text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
