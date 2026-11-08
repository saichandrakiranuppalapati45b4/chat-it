import type { UserStory } from "../../types/chat";

interface StoryAvatarProps {
  story: UserStory;
  onClick: () => void;
}

export function StoryAvatar({ story, onClick }: StoryAvatarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5 focus:outline-none"
    >
      <div className="relative">
        {/* Story ring */}
        <div
          className={`h-[58px] w-[58px] rounded-full p-[2px] transition-transform duration-200 group-hover:scale-105 group-active:scale-95 ${
            story.hasUnseenStory
              ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
              : "bg-white/40"
          }`}
        >
          <img
            src={story.userAvatar}
            alt={story.userName}
            className="h-full w-full rounded-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback placeholder
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                story.userName
              )}&background=168CF5&color=fff`;
            }}
          />
        </div>
      </div>

      <span className="max-w-[64px] truncate text-[12px] font-medium text-white transition-opacity group-hover:opacity-100">
        {story.userName}
      </span>
    </button>
  );
}
