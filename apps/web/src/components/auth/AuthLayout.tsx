import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#EAF4FF] px-4 py-8 sm:px-6">
      {/* Background soft ambient orbs matching reference design */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {/* Large top-right gradient sphere */}
        <div
          className="absolute -right-16 -top-16 h-80 w-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(114, 190, 255, 0.6) 0%, rgba(144, 207, 255, 0.35) 45%, rgba(234, 244, 255, 0) 75%)",
          }}
        />

        {/* Medium mid-left sphere */}
        <div
          className="absolute -left-12 top-1/4 h-52 w-52 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 45% 45%, rgba(94, 180, 255, 0.5) 0%, rgba(135, 202, 255, 0.3) 50%, rgba(234, 244, 255, 0) 75%)",
          }}
        />

        {/* Bottom-left large gradient bloom */}
        <div
          className="absolute -bottom-24 -left-20 h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(100, 184, 255, 0.55) 0%, rgba(150, 210, 255, 0.3) 55%, rgba(234, 244, 255, 0) 75%)",
          }}
        />

        {/* Mid-right floating sphere */}
        <div
          className="absolute -right-8 top-1/2 h-64 w-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(104, 186, 255, 0.45) 0%, rgba(160, 216, 255, 0.25) 50%, rgba(234, 244, 255, 0) 75%)",
          }}
        />

        {/* Small bottom-right decorative accent orb */}
        <div
          className="absolute bottom-16 right-12 h-14 w-14 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(22, 140, 245, 0.6) 0%, rgba(72, 174, 255, 0.3) 70%, rgba(234, 244, 255, 0) 100%)",
          }}
        />
      </div>

      {/* Centered card content */}
      <div className="relative z-10 w-full max-w-[420px] transition-all">
        {children}
      </div>
    </div>
  );
}

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/70 px-6 py-7 shadow-xl backdrop-blur-xl sm:px-8 sm:py-8",
        className
      )}
      style={{
        background: "rgba(255, 255, 255, 0.84)",
        boxShadow:
          "0 20px 45px -12px rgba(22, 140, 245, 0.14), 0 2px 10px rgba(16, 36, 72, 0.04)",
      }}
    >
      {children}
    </div>
  );
}
