import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";
import type { UserStory } from "../../types/chat";

interface StoryViewerModalProps {
  stories: UserStory[];
  initialStoryIndex: number;
  onClose: () => void;
  onStoryViewed?: (storyId: string) => void;
}

export function StoryViewerModal({
  stories,
  initialStoryIndex,
  onClose,
  onStoryViewed,
}: StoryViewerModalProps) {
  const [userIndex, setUserIndex] = useState(initialStoryIndex);
  const [itemIndex, setItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState("");

  const currentStory = stories[userIndex];
  const currentItem = currentStory?.stories[itemIndex];
  const totalItems = currentStory?.stories.length ?? 0;

  // Mark story as viewed
  useEffect(() => {
    if (currentStory) {
      onStoryViewed?.(currentStory.id);
    }
  }, [currentStory, onStoryViewed]);

  const handleNext = useCallback(() => {
    if (itemIndex < totalItems - 1) {
      setItemIndex((prev) => prev + 1);
      setProgress(0);
    } else if (userIndex < stories.length - 1) {
      setUserIndex((prev) => prev + 1);
      setItemIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [itemIndex, totalItems, userIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (itemIndex > 0) {
      setItemIndex((prev) => prev - 1);
      setProgress(0);
    } else if (userIndex > 0) {
      setUserIndex((prev) => prev - 1);
      const prevTotal = stories[userIndex - 1].stories.length;
      setItemIndex(prevTotal - 1);
      setProgress(0);
    }
  }, [itemIndex, userIndex, stories]);

  // Story progress timer (5 seconds per item)
  useEffect(() => {
    if (isPaused || !currentItem) return;

    const interval = 50; // update every 50ms
    const step = 100 / ((currentItem.durationSeconds ?? 5) * (1000 / interval));

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentItem, isPaused, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === " ") setIsPaused((p) => !p);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  if (!currentStory || !currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-slate-900 sm:h-[88vh] sm:rounded-3xl sm:border sm:border-white/10"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress bars */}
        <div className="absolute left-0 right-0 top-3 z-30 flex gap-1.5 px-4">
          {currentStory.stories.map((s, idx) => {
            let width = "0%";
            if (idx < itemIndex) width = "100%";
            else if (idx === itemIndex) width = `${progress}%`;

            return (
              <div
                key={s.id}
                className="h-1 flex-1 overflow-hidden rounded-full bg-white/30 backdrop-blur-sm"
              >
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{ width }}
                />
              </div>
            );
          })}
        </div>

        {/* Header: User info & Close */}
        <div className="absolute left-0 right-0 top-6 z-30 flex items-center justify-between px-4 text-white">
          <div className="flex items-center gap-3">
            <img
              src={currentStory.userAvatar}
              alt={currentStory.userName}
              className="h-9 w-9 rounded-full border border-white/60 object-cover"
            />
            <div>
              <p className="text-sm font-semibold leading-tight text-white drop-shadow">
                {currentStory.userName}
              </p>
              <p className="text-[11px] text-white/70 drop-shadow">
                {currentItem.createdAt}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-black/40 p-2 text-white/80 backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white"
            aria-label="Close stories"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Media content */}
        <div className="relative flex-1 bg-black">
          <img
            src={currentItem.mediaUrl}
            alt={currentItem.caption ?? "Story"}
            className="h-full w-full object-cover"
          />

          {/* Navigation tap areas */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-0 top-16 bottom-20 w-1/3 text-transparent hover:text-white/40 flex items-center pl-2"
            aria-label="Previous story"
          >
            <ChevronLeft className="h-8 w-8 drop-shadow" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-0 top-16 bottom-20 w-1/3 text-transparent hover:text-white/40 flex items-center justify-end pr-2"
            aria-label="Next story"
          >
            <ChevronRight className="h-8 w-8 drop-shadow" />
          </button>

          {/* Caption overlay */}
          {currentItem.caption && (
            <div className="absolute bottom-24 left-4 right-4 z-20 rounded-2xl bg-black/40 p-3.5 text-center text-sm font-medium text-white backdrop-blur-md">
              {currentItem.caption}
            </div>
          )}
        </div>

        {/* Footer: Quick Reply & Like */}
        <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center gap-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={`Reply to ${currentStory.userName}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              className="h-11 w-full rounded-full border border-white/30 bg-white/20 pl-4 pr-10 text-sm text-white placeholder-white/60 backdrop-blur-md outline-none focus:border-white focus:bg-white/30"
            />
            {replyText.trim() && (
              <button
                type="button"
                onClick={() => {
                  setReplyText("");
                  handleNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#168CF5] p-1.5 text-white"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setLiked(!liked)}
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md transition-colors ${
              liked ? "text-red-500" : "text-white hover:text-red-400"
            }`}
            aria-label="Like story"
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
