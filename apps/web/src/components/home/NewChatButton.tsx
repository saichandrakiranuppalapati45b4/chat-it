import { useState } from "react";
import { Pencil } from "lucide-react";
import { NewChatModal } from "./NewChatModal";

interface NewChatButtonProps {
  onCreateChat: (
    title: string,
    avatar: string,
    isGroup: boolean,
    participantIds: string[]
  ) => void;
}

export function NewChatButton({ onCreateChat }: NewChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-5 sm:right-8 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#168CF5] text-white shadow-[0_8px_20px_-3px_rgba(22,140,245,0.5)] transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#168CF5]/30"
        aria-label="New chat or compose"
      >
        <Pencil className="h-6 w-6 stroke-[2.2]" />
      </button>

      {isOpen && (
        <NewChatModal
          onClose={() => setIsOpen(false)}
          onCreateChat={onCreateChat}
        />
      )}
    </>
  );
}
