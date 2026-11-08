import { useState } from "react";
import { Pin, MoreVertical } from "lucide-react";
import type { ChatConversation } from "../../types/chat";
import { ChatListItem } from "./ChatListItem";

interface PinnedChatsProps {
  chats: ChatConversation[];
  onSelectChat: (chat: ChatConversation) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleMute: (id: string) => void;
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PinnedChats({
  chats,
  onSelectChat,
  onTogglePin,
  onToggleFavorite,
  onToggleMute,
  onMarkRead,
  onMarkUnread,
  onDelete,
}: PinnedChatsProps) {
  const [showMenu, setShowMenu] = useState(false);

  if (chats.length === 0) return null;

  return (
    <section aria-label="Pinned Chats" className="mb-4">
      {/* Section Header */}
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {/* Angled Pin icon */}
          <div className="text-[#2F7EDA]">
            <Pin className="h-4.5 w-4.5 rotate-45 fill-current stroke-none" />
          </div>

          <h2 className="text-[16px] font-bold text-[#102448] tracking-tight">
            Pinned Chats
          </h2>

          {/* Blue count pill badge */}
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2F7EDA] text-[11px] font-bold text-white shadow-sm">
            {chats.length}
          </span>
        </div>

        {/* Header options trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-full p-1 text-[#9FA0B5] hover:bg-slate-100 hover:text-[#555663]"
            aria-label="Pinned chats options"
          >
            <MoreVertical className="h-4.5 w-4.5" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowMenu(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-7 z-40 w-44 rounded-2xl border border-white/80 bg-white/95 p-1.5 shadow-xl backdrop-blur-md animate-fade-in text-xs text-[#102448]">
                <button
                  type="button"
                  onClick={() => {
                    chats.forEach((c) => onMarkRead(c.id));
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-slate-50 font-medium"
                >
                  Mark all as read
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pinned chat rows */}
      <div className="space-y-1">
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            onClick={onSelectChat}
            onTogglePin={onTogglePin}
            onToggleFavorite={onToggleFavorite}
            onToggleMute={onToggleMute}
            onMarkRead={onMarkRead}
            onMarkUnread={onMarkUnread}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
