import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import type { UserStory } from "../../types/chat";
import { StoryAvatar } from "./StoryAvatar";
import { StoryViewerModal } from "./StoryViewerModal";
import { AddStoryModal } from "./AddStoryModal";

interface StoriesSectionProps {
  stories: UserStory[];
  onAddStory: (caption: string, mediaUrl: string) => void;
  onStoryViewed: (storyId: string) => void;
}

export function StoriesSection({
  stories,
  onAddStory,
  onStoryViewed,
}: StoriesSectionProps) {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <section aria-label="Stories" className="mb-4">
      {/* Prominent blue gradient card matching reference design */}
      <div
        className="relative overflow-hidden rounded-[26px] p-4 sm:p-5 shadow-[0_12px_28px_-6px_rgba(26,128,245,0.32)]"
        style={{
          background: "linear-gradient(135deg, #44A2FF 0%, #177EEB 100%)",
        }}
      >
        {/* Ambient subtle glow inside card */}
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-40 blur-2xl"
          style={{ background: "#FFFFFF" }}
          aria-hidden="true"
        />

        {/* Card header */}
        <div className="relative z-10 mb-3.5 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-white tracking-tight">
            My Story
          </h2>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white focus:outline-none"
              aria-label="Story options"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowMenu(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-8 z-40 w-44 rounded-2xl border border-white/60 bg-white/95 p-1.5 shadow-xl backdrop-blur-md animate-fade-in text-[#102448] text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setIsAddOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-slate-50 font-medium"
                  >
                    Add new story
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMenu(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-slate-50 font-medium text-[#9FA0B5]"
                  >
                    Story privacy
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stories horizontal carousel */}
        <div className="relative z-10 flex items-center gap-4 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          {/* Add Story Button */}
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="group flex flex-col items-center gap-1.5 focus:outline-none shrink-0"
          >
            <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-2 border-dashed border-white/80 bg-white/15 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105 group-hover:bg-white/25 group-active:scale-95">
              <Plus className="h-6 w-6 text-white" strokeWidth={2.4} />
            </div>
            <span className="text-[12px] font-medium text-white">
              Add Story
            </span>
          </button>

          {/* User story avatars */}
          {stories.map((story, index) => (
            <div key={story.id} className="shrink-0">
              <StoryAvatar
                story={story}
                onClick={() => setSelectedStoryIndex(index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialStoryIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
          onStoryViewed={onStoryViewed}
        />
      )}

      {/* Add Story Modal */}
      {isAddOpen && (
        <AddStoryModal
          onClose={() => setIsAddOpen(false)}
          onAddStory={onAddStory}
        />
      )}
    </section>
  );
}
