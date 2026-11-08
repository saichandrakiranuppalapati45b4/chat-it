import {
  Bell,
  Lock,
  Globe,
  Palette,
  HelpCircle,
  LogOut,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function SettingsView() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-[17px] font-bold text-[#102448] px-1">Settings</h2>

      {/* User profile card */}
      <div className="flex items-center gap-4 rounded-3xl border border-[#E8EFF6] bg-white p-4 shadow-sm">
        <div className="relative h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-[#4AA3FF] to-[#1A80F5] p-0.5 text-white shadow-md">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#2F7EDA] font-bold text-lg">
              {(user?.displayName || user?.email || "U")[0].toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-[#102448]">
            {user?.displayName || "Chat-it User"}
          </h3>
          <p className="truncate text-xs text-[#9FA0B5]">
            {user?.email || "user@chat-it.app"}
          </p>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Online
          </span>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-2">
        <div className="overflow-hidden rounded-3xl border border-[#E8EFF6] bg-white">
          <button
            type="button"
            className="flex w-full items-center justify-between p-3.5 transition-colors hover:bg-slate-50 border-b border-[#F0F4F8]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2F7EDA]">
                <Bell className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-semibold text-[#102448]">Notifications & Sounds</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#9FA0B5]" />
          </button>

          <button
            type="button"
            className="flex w-full items-center justify-between p-3.5 transition-colors hover:bg-slate-50 border-b border-[#F0F4F8]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-semibold text-[#102448]">Privacy & Security</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#9FA0B5]" />
          </button>

          <button
            type="button"
            className="flex w-full items-center justify-between p-3.5 transition-colors hover:bg-slate-50 border-b border-[#F0F4F8]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Palette className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-semibold text-[#102448]">Appearance & Wallpaper</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#9FA0B5]" />
          </button>

          <button
            type="button"
            className="flex w-full items-center justify-between p-3.5 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Globe className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-semibold text-[#102448]">App Language</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#9FA0B5]" />
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#E8EFF6] bg-white">
          <button
            type="button"
            className="flex w-full items-center justify-between p-3.5 transition-colors hover:bg-slate-50 border-b border-[#F0F4F8]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-[#555663]">
                <HelpCircle className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-semibold text-[#102448]">Help & FAQ</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#9FA0B5]" />
          </button>

          <button
            type="button"
            className="flex w-full items-center justify-between p-3.5 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-[#555663]">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-semibold text-[#102448]">About Chat-it (v1.0.0)</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#9FA0B5]" />
          </button>
        </div>

        {/* Sign Out Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50/70 py-3.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100/70 active:scale-98"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
