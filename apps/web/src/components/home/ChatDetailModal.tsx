import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Send,
  Smile,
  Paperclip,
  CheckCheck,
} from "lucide-react";
import type { ChatConversation } from "../../types/chat";

interface ChatDetailModalProps {
  chat: ChatConversation;
  onClose: () => void;
  onSendMessage: (chatId: string, text: string) => void;
}

interface MessageBubble {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

export function ChatDetailModal({
  chat,
  onClose,
  onSendMessage,
}: ChatDetailModalProps) {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<MessageBubble[]>([
    {
      id: "m-old-1",
      sender: "them",
      text: "Hey! How have you been?",
      time: "10:15 AM",
    },
    {
      id: "m-old-2",
      sender: "me",
      text: "I'm doing great! Just working on Chat-it updates 🚀",
      time: "10:18 AM",
    },
    {
      id: "m-old-3",
      sender: "them",
      text: chat.lastMessage.text,
      time: chat.lastMessage.timestamp,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: MessageBubble = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text: inputText.trim(),
      time: "Just now",
    };

    setMessages((prev) => [...prev, newMsg]);
    onSendMessage(chat.id, inputText.trim());
    setInputText("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex h-full w-full max-w-lg flex-col overflow-hidden bg-[#FAFAFA] sm:h-[88vh] sm:rounded-3xl sm:border sm:border-white/60 sm:shadow-2xl">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-[#E8EFF6] bg-white/90 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-[#555663] transition-colors hover:bg-slate-100"
              aria-label="Back to chats"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="relative">
              <img
                src={chat.avatar}
                alt={chat.title}
                className="h-10 w-10 rounded-full object-cover"
              />
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-[#102448]">
                {chat.title}
              </h2>
              <p className="text-[11px] text-[#9FA0B5]">
                {chat.isOnline ? "Online" : "Last seen recently"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-xl p-2 text-[#2F7EDA] hover:bg-blue-50"
              aria-label="Voice Call"
            >
              <Phone className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              className="rounded-xl p-2 text-[#2F7EDA] hover:bg-blue-50"
              aria-label="Video Call"
            >
              <Video className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              className="rounded-xl p-2 text-[#9FA0B5] hover:bg-slate-100"
              aria-label="More"
            >
              <MoreVertical className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Messages list */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          <div className="my-2 flex justify-center">
            <span className="rounded-full bg-slate-200/60 px-3 py-1 text-[11px] font-medium text-[#627895]">
              Today
            </span>
          </div>

          {messages.map((m) => {
            const isMe = m.sender === "me";
            return (
              <div
                key={m.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                    isMe
                      ? "rounded-tr-none bg-gradient-to-br from-[#44A2FF] to-[#177EEB] text-white"
                      : "rounded-tl-none border border-[#E8EFF6] bg-white text-[#102448]"
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                      isMe ? "text-white/80" : "text-[#9FA0B5]"
                    }`}
                  >
                    <span>{m.time}</span>
                    {isMe && <CheckCheck className="h-3 w-3 stroke-[2.5]" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 border-t border-[#E8EFF6] bg-white p-3"
        >
          <button
            type="button"
            className="rounded-xl p-2 text-[#9FA0B5] hover:bg-slate-100"
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-11 w-full rounded-2xl border border-[#DCE6F2] bg-[#F7F9FC] pl-4 pr-10 text-sm text-[#102448] placeholder-[#9FA0B5] outline-none focus:border-[#2F7EDA] focus:bg-white"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9FA0B5] hover:text-[#555663]"
              aria-label="Emoji"
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-[#44A2FF] to-[#177EEB] text-white shadow-md shadow-blue-500/25 transition-all hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
