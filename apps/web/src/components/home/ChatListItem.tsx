import { useState } from "react";
import { CheckCheck, Pin, MoreVertical, VolumeX, Star, Trash2 } from "lucide-react";
import type { ChatConversation } from "../../types/chat";

interface ChatListItemProps {
  chat: ChatConversation;
  onClick: (chat: ChatConversation) => void;
  onTogglePin?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onToggleMute?: (id: string) => void;
  onMarkRead?: (id: string) => void;
  onMarkUnread?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ChatListItem({
  chat,
  onClick,
  onTogglePin,
  onToggleFavorite,
  onToggleMute,
  onMarkRead,
  onMarkUnread,
  onDelete,
}: ChatListItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative group">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick(chat)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick(chat);
          }
        }}
        className="flex w-full items-center gap-3.5 rounded-2xl p-2.5 transition-all duration-150 hover:bg-[#F2F6FA] active:bg-[#EAF0F8] text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7EDA]"
      >
        {/* Avatar container with pin, story ring, or online indicator */}
        <div className="relative shrink-0">
          <div
            className={`h-[52px] w-[52px] rounded-full p-[2px] ${
              chat.hasStoryRing
                ? "ring-2 ring-[#2F7EDA] ring-offset-2"
                : ""
            }`}
          >
            <img
              src={chat.avatar}
              alt={chat.title}
              className="h-full w-full rounded-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  chat.title
                )}&background=2F7EDA&color=fff`;
              }}
            />
          </div>

          {/* Blue Pin badge at bottom-right of avatar */}
          {chat.isPinned && (
            <div
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2F7EDA] text-white shadow-sm ring-2 ring-white"
              title="Pinned conversation"
            >
              <Pin className="h-3 w-3 fill-current stroke-none" />
            </div>
          )}

          {/* Green Online status dot at bottom-right */}
          {!chat.isPinned && chat.isOnline && (
            <div
              className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
              title="Online"
            />
          )}
        </div>

        {/* Middle: Title & Message preview */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[15px] font-bold text-[#102448]">
              {chat.title}
            </h3>
            {chat.isMuted && (
              <VolumeX className="h-3.5 w-3.5 shrink-0 text-[#9FA0B5]" />
            )}
            {chat.isFavorite && (
              <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
            )}
          </div>

          <p className="mt-0.5 truncate text-[13px] text-[#627895]">
            {chat.lastMessage.text}
          </p>
        </div>

        {/* Right: Timestamp & Status badge */}
        <div className="flex shrink-0 flex-col items-end gap-1.5 pl-2">
          <span
            className={`text-[11.5px] font-medium ${
              chat.unreadCount > 0 ? "text-[#2F7EDA]" : "text-[#9FA0B5]"
            }`}
          >
            {chat.lastMessage.timestamp}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Unread count pill badge */}
            {chat.unreadCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2F7EDA] px-1.5 text-[11px] font-bold text-white shadow-sm">
                {chat.unreadCount}
              </span>
            ) : (
              /* Double blue checkmark for read receipt */
              chat.lastMessage.isRead && (
                <span title="Read">
                  <CheckCheck
                    className="h-4 w-4 text-[#2F7EDA]"
                    strokeWidth={2.4}
                  />
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Row context options trigger button (visible on hover) */}
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="rounded-full bg-white/90 p-1 text-[#9FA0B5] shadow-sm hover:text-[#102448] backdrop-blur-sm"
          aria-label="Chat options"
        >
          <MoreVertical className="h-3.5 w-3.5" />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
              }}
              aria-hidden="true"
            />
            <div className="absolute right-0 top-7 z-40 w-44 rounded-2xl border border-white/80 bg-white/95 p-1.5 shadow-xl backdrop-blur-md animate-fade-in text-xs text-[#102448]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin?.(chat.id);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-slate-50 font-medium"
              >
                <Pin className="h-3.5 w-3.5 text-[#2F7EDA]" />
                {chat.isPinned ? "Unpin chat" : "Pin to top"}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.(chat.id);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-slate-50 font-medium"
              >
                <Star className="h-3.5 w-3.5 text-amber-500" />
                {chat.isFavorite ? "Remove favorite" : "Add to favorites"}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (chat.unreadCount > 0) {
                    onMarkRead?.(chat.id);
                  } else {
                    onMarkUnread?.(chat.id);
                  }
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-slate-50 font-medium"
              >
                <CheckCheck className="h-3.5 w-3.5 text-[#2F7EDA]" />
                {chat.unreadCount > 0 ? "Mark as read" : "Mark as unread"}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMute?.(chat.id);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-slate-50 font-medium"
              >
                <VolumeX className="h-3.5 w-3.5 text-[#9FA0B5]" />
                {chat.isMuted ? "Unmute notifications" : "Mute notifications"}
              </button>

              <div className="my-1 border-t border-[#F0F4F8]" />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(chat.id);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-red-50 font-medium text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete chat
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
