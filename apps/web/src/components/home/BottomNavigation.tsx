import { MessageCircle, Phone, Users, Settings } from "lucide-react";
import type { BottomNavTab } from "../../types/chat";

interface BottomNavigationProps {
  activeTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
}

export function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  const tabs: {
    id: BottomNavTab;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  }[] = [
    { id: "chats", label: "Chats", icon: MessageCircle },
    { id: "calls", label: "Calls", icon: Phone },
    { id: "people", label: "People", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pb-safe"
    >
      <div className="w-full max-w-md border-t border-[#E8EFF6] bg-white/95 px-3 py-2 shadow-[0_-4px_25px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:mb-4 sm:rounded-3xl sm:border sm:shadow-lg">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center transition-all duration-200 focus:outline-none ${
                  isActive
                    ? "rounded-2xl bg-[#E1F0FF] px-5 py-1.5"
                    : "px-3 py-1.5 hover:text-[#555663]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`h-5 w-5 transition-transform duration-150 ${
                    isActive
                      ? "text-[#2F7EDA] scale-105"
                      : "text-[#9FA0B5]"
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.9}
                />
                <span
                  className={`mt-0.5 text-[11px] leading-tight ${
                    isActive
                      ? "font-bold text-[#2F7EDA]"
                      : "font-medium text-[#9FA0B5]"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
