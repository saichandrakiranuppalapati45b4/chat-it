import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import type { LucideIcon } from "lucide-react";

export interface AuthInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ icon: Icon, error, className, id, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <Icon
                className="h-[18px] w-[18px] text-[#627895]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "h-[50px] w-full rounded-2xl border border-[#DCE6F2] bg-white text-[14px] text-[#102448] placeholder-[#8FA0B5] outline-none transition-all duration-200",
              "focus:border-[#168CF5] focus:ring-4 focus:ring-[#168CF5]/10",
              "hover:border-[#168CF5]/40",
              Icon ? "pl-12 pr-4" : "px-4",
              error &&
                "border-red-400 focus:border-red-500 focus:ring-red-500/15",
              className
            )}
            {...props}
          />
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

AuthInput.displayName = "AuthInput";
