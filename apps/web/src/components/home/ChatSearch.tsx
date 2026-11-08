import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ChatFilterType } from "../../types/chat";
import { FilterSettingsModal } from "./FilterSettingsModal";

interface ChatSearchProps {
  value: string;
  onChange: (value: string) => void;
  currentFilter: ChatFilterType;
  onFilterChange: (filter: ChatFilterType) => void;
}

export function ChatSearch({
  value,
  onChange,
  currentFilter,
  onFilterChange,
}: ChatSearchProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="relative mb-3.5">
      <div className="relative flex h-[50px] w-full items-center rounded-2xl border border-[#E5EDF5] bg-white px-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all focus-within:border-[#2F7EDA] focus-within:ring-4 focus-within:ring-[#2F7EDA]/10">
        {/* Search icon */}
        <Search className="h-5 w-5 shrink-0 text-[#9FA0B5]" strokeWidth={2} />

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search chats..."
          className="h-full flex-1 bg-transparent px-3 text-sm text-[#102448] placeholder-[#9FA0B5] outline-none"
        />

        {/* Clear search query button if text present */}
        {value.trim() && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="mr-2 rounded-full p-1 text-[#9FA0B5] hover:bg-slate-100 hover:text-[#555663]"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Filter button with SlidersHorizontal */}
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-[#2F7EDA] transition-colors hover:bg-blue-50 focus:outline-none"
          aria-label="Filter chats"
        >
          <SlidersHorizontal className="h-5 w-5" strokeWidth={2.1} />
        </button>
      </div>

      {isFilterOpen && (
        <FilterSettingsModal
          currentFilter={currentFilter}
          onSelectFilter={onFilterChange}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}
