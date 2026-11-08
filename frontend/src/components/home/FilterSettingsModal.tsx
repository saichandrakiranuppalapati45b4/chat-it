import { X, Check } from "lucide-react";
import type { ChatFilterType } from "../../types/chat";

interface FilterSettingsModalProps {
  currentFilter: ChatFilterType;
  onSelectFilter: (filter: ChatFilterType) => void;
  onClose: () => void;
}

export function FilterSettingsModal({
  currentFilter,
  onSelectFilter,
  onClose,
}: FilterSettingsModalProps) {
  const options: { id: ChatFilterType; label: string; desc: string }[] = [
    { id: "all", label: "All Chats", desc: "Show all conversations" },
    { id: "unread", label: "Unread Chats", desc: "Only chats with unread messages" },
    { id: "groups", label: "Group Chats", desc: "Only multi-participant group chats" },
    { id: "favourites", label: "Favourite Chats", desc: "Starred and favourite contacts" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-[#F0F4F8] pb-3">
          <h3 className="text-base font-bold text-[#102448]">Filter Conversations</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#9FA0B5] hover:bg-slate-100 hover:text-[#555663]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelectFilter(opt.id);
                onClose();
              }}
              className={`flex w-full items-center justify-between rounded-2xl p-3 text-left transition-colors ${
                currentFilter === opt.id
                  ? "bg-blue-50/80 border border-[#2F7EDA]/30"
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div>
                <p
                  className={`text-sm font-semibold ${
                    currentFilter === opt.id ? "text-[#2F7EDA]" : "text-[#102448]"
                  }`}
                >
                  {opt.label}
                </p>
                <p className="text-xs text-[#9FA0B5]">{opt.desc}</p>
              </div>

              {currentFilter === opt.id && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2F7EDA] text-white">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
