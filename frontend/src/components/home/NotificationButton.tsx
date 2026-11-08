import { useState } from "react";
import { Bell, CheckCheck, X } from "lucide-react";

export function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(true);

  const notifications = [
    {
      id: "n1",
      title: "Rahul Mehta",
      message: "Sent you a new voice message",
      time: "5m ago",
    },
    {
      id: "n2",
      title: "Priya Sharma",
      message: "Shared a new story update",
      time: "1h ago",
    },
    {
      id: "n3",
      title: "Friends Group",
      message: "Sneha added you to Weekend Trip planning",
      time: "3h ago",
    },
  ];

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnread(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E8EFF6] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:bg-slate-50 hover:shadow-md active:scale-95"
      >
        <Bell className="h-5 w-5 text-[#555663]" strokeWidth={1.9} />
        {unread && (
          <span
            className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#FF3B30] ring-2 ring-white"
            aria-hidden="true"
          />
        )}
      </button>

      {/* Notifications dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-14 z-50 w-80 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur-xl sm:w-88 animate-fade-in">
            <div className="mb-3 flex items-center justify-between border-b border-[#F0F4F8] pb-2">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#102448]">Notifications</h4>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#2F7EDA]">
                  {notifications.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-[#9FA0B5] hover:bg-slate-100 hover:text-[#555663]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#2F7EDA]">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#102448]">{n.title}</p>
                    <p className="truncate text-xs text-[#555663]">{n.message}</p>
                    <span className="text-[10px] text-[#9FA0B5]">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 border-t border-[#F0F4F8] pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F7EDA] hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all as read
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
