import { useState } from "react";
import { MessageSquare, MoreHorizontal, MessageCircle } from "lucide-react";
import type { ChatConversation } from "../../types/chat";
import { ChatListItem } from "./ChatListItem";

interface RecentChatsProps {
  chats: ChatConversation[];
  onSelectChat: (chat: ChatConversation) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleMute: (id: string) => void;
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RecentChats({
  chats,
  onSelectChat,
  onTogglePin,
  onToggleFavorite,
  onToggleMute,
  onMarkRead,
  onMarkUnread,
  onDelete,
}: RecentChatsProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <section aria-label="Recent Chats" className="mb-20">
      {/* Section Header */}
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4.5 w-4.5 text-[#627895]" />
          <h2 className="text-[16px] font-bold text-[#102448] tracking-tight">
            Recent Chats
          </h2>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-full p-1 text-[#9FA0B5] hover:bg-slate-100 hover:text-[#555663]"
            aria-label="Recent chats options"
          >
            <MoreHorizontal className="h-4.5 w-4.5" />
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

      {/* List */}
      {chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCE6F2] bg-white/50 p-8 text-center">
          <MessageCircle className="mb-2 h-10 w-10 text-[#9FA0B5]" strokeWidth={1.5} />
          <p className="text-sm font-semibold text-[#102448]">No recent conversations</p>
          <p className="mt-1 text-xs text-[#9FA0B5]">
            Start a new conversation using the compose button below
          </p>
        </div>
      ) : (
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
      )}
    </section>
  );
}
