import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

interface AuthTabsProps {
  activeTab: "signup" | "login";
  className?: string;
}

export function AuthTabs({ activeTab, className }: AuthTabsProps) {
  const isSignUp = activeTab === "signup";

  return (
    <div className={cn("mb-6 w-full", className)}>
      <div className="relative flex items-center border-b border-[#E6EFF8]">
        {isSignUp ? (
          <>
            {/* Active: Sign Up (Left) */}
            <div className="relative flex-1 pb-3 text-center">
              <span className="text-[15px] font-bold text-[#102448]">
                Sign Up
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#168CF5]" />
            </div>

            {/* Inactive: Login (Right) */}
            <Link
              to="/login"
              className="flex-1 pb-3 text-center text-[15px] font-medium text-[#627895] transition-colors hover:text-[#102448]"
            >
              Login
            </Link>
          </>
        ) : (
          <>
            {/* Active: Login (Left) */}
            <div className="relative flex-1 pb-3 text-center">
              <span className="text-[15px] font-bold text-[#102448]">
                Login
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#168CF5]" />
            </div>

            {/* Inactive: Sign Up (Right) */}
            <Link
              to="/signup"
              className="flex-1 pb-3 text-center text-[15px] font-medium text-[#627895] transition-colors hover:text-[#102448]"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
