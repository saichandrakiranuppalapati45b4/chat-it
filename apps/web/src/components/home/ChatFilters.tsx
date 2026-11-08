import { Star } from "lucide-react";
import type { ChatFilterType } from "../../types/chat";

interface ChatFiltersProps {
  currentFilter: ChatFilterType;
  onSelectFilter: (filter: ChatFilterType) => void;
  counts: {
    all: number;
    unread: number;
    groups: number;
    favourites: number;
  };
}

export function ChatFilters({
  currentFilter,
  onSelectFilter,
  counts,
}: ChatFiltersProps) {
  const filters: {
    id: ChatFilterType;
    label: string;
    count?: number;
    hasStar?: boolean;
  }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "unread", label: "Unread Chats", count: counts.unread },
    { id: "groups", label: "Groups", count: counts.groups },
    { id: "favourites", label: "Favourite", hasStar: true },
  ];

  return (
    <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      {filters.map((f) => {
        const isActive = currentFilter === f.id;

        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelectFilter(f.id)}
            className={`group inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-all duration-200 active:scale-95 ${
              isActive
                ? "bg-[#2F7EDA] text-white shadow-sm shadow-blue-500/25"
                : "bg-[#EDEFF3] text-[#555663] hover:bg-[#E2E6EC]"
            }`}
          >
            {f.hasStar && (
              <Star
                className={`h-3.5 w-3.5 ${
                  isActive ? "fill-white text-white" : "fill-[#9FA0B5] text-[#9FA0B5]"
                }`}
              />
            )}

            <span>{f.label}</span>

            {typeof f.count === "number" && (
              <span
                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                  isActive
                    ? "bg-white text-[#2F7EDA]"
                    : "bg-[#2F7EDA] text-white"
                }`}
              >
                {f.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
