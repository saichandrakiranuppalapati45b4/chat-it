import { useState } from "react";
import { X, Image as ImageIcon, Sparkles } from "lucide-react";

interface AddStoryModalProps {
  onClose: () => void;
  onAddStory: (caption: string, mediaUrl: string) => void;
}

const PRESET_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&auto=format&fit=crop&q=80",
];

export function AddStoryModal({ onClose, onAddStory }: AddStoryModalProps) {
  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState(PRESET_BACKGROUNDS[0]);
  const [customUrl, setCustomUrl] = useState("");

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = customUrl.trim() || mediaUrl;
    onAddStory(caption.trim(), finalUrl);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F0F4F8] px-5 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#2F7EDA]" />
            <h3 className="text-base font-bold text-[#102448]">Add to My Story</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#9FA0B5] hover:bg-slate-100 hover:text-[#555663]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handlePost} className="p-5">
          {/* Story preview image */}
          <div className="relative mb-4 h-52 w-full overflow-hidden rounded-2xl bg-slate-100">
            <img
              src={customUrl.trim() || mediaUrl}
              alt="Story Preview"
              className="h-full w-full object-cover"
            />
            {caption.trim() && (
              <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-black/50 p-2 text-center text-xs text-white backdrop-blur-sm">
                {caption}
              </div>
            )}
          </div>

          {/* Preset image selector */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold text-[#555663]">
              Choose Background
            </label>
            <div className="flex gap-2">
              {PRESET_BACKGROUNDS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setMediaUrl(url);
                    setCustomUrl("");
                  }}
                  className={`h-11 w-11 overflow-hidden rounded-xl border-2 transition-transform ${
                    mediaUrl === url && !customUrl
                      ? "border-[#2F7EDA] scale-105"
                      : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt={`Option ${i}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom URL input */}
          <div className="mb-4">
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9FA0B5]" />
              <input
                type="url"
                placeholder="Or paste an image URL..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="h-10 w-full rounded-xl border border-[#DCE6F2] bg-white pl-9 pr-3 text-xs text-[#102448] placeholder-[#9FA0B5] outline-none focus:border-[#2F7EDA]"
              />
            </div>
          </div>

          {/* Caption input */}
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-semibold text-[#555663]">
              Story Caption
            </label>
            <input
              type="text"
              placeholder="What's happening today?..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={80}
              className="h-11 w-full rounded-xl border border-[#DCE6F2] bg-white px-3 text-xs text-[#102448] placeholder-[#9FA0B5] outline-none focus:border-[#2F7EDA]"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#48AEFF] to-[#087CF0] text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:brightness-105 active:scale-[0.99] transition-all"
          >
            Post Story
          </button>
        </form>
      </div>
    </div>
  );
}
