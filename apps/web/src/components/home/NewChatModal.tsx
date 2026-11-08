import { useState } from "react";
import { X, Search, Users, UserPlus, Check } from "lucide-react";
import { AVAILABLE_CONTACTS } from "../../services/mockData";

interface NewChatModalProps {
  onClose: () => void;
  onCreateChat: (
    title: string,
    avatar: string,
    isGroup: boolean,
    participantIds: string[]
  ) => void;
}

export function NewChatModal({ onClose, onCreateChat }: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  const filteredContacts = AVAILABLE_CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const toggleSelectContact = (id: string) => {
    if (selectedContactIds.includes(id)) {
      setSelectedContactIds((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedContactIds((prev) => [...prev, id]);
    }
  };

  const handleStartDirectChat = (contact: typeof AVAILABLE_CONTACTS[0]) => {
    onCreateChat(contact.name, contact.avatar, false, [contact.id]);
    onClose();
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedContactIds.length === 0) return;

    onCreateChat(
      groupName.trim(),
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150&auto=format&fit=crop&q=80",
      true,
      selectedContactIds
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex max-h-[85vh] w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F0F4F8] px-5 py-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#2F7EDA]" />
            <h3 className="text-base font-bold text-[#102448]">
              {isCreatingGroup ? "Create New Group" : "New Chat"}
            </h3>
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

        {/* Search & Mode Toggle */}
        <div className="border-b border-[#F0F4F8] p-4">
          {!isCreatingGroup ? (
            <>
              {/* Search contacts input */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9FA0B5]" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#DCE6F2] bg-[#F7F9FC] pl-9 pr-3 text-xs text-[#102448] placeholder-[#9FA0B5] outline-none focus:border-[#2F7EDA] focus:bg-white"
                />
              </div>

              {/* New Group button */}
              <button
                type="button"
                onClick={() => setIsCreatingGroup(true)}
                className="flex w-full items-center gap-3 rounded-2xl bg-blue-50/70 p-3 text-left transition-colors hover:bg-blue-100/70"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2F7EDA] text-white">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#102448]">New Group Chat</p>
                  <p className="text-[11px] text-[#627895]">
                    Chat with friends, family or teams
                  </p>
                </div>
              </button>
            </>
          ) : (
            <form onSubmit={handleCreateGroup} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#555663]">
                  Group Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekend Crew, Project Alpha"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                  className="h-10 w-full rounded-xl border border-[#DCE6F2] bg-white px-3 text-xs text-[#102448] placeholder-[#9FA0B5] outline-none focus:border-[#2F7EDA]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-medium text-[#627895]">
                  Select members ({selectedContactIds.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreatingGroup(false)}
                  className="text-[11px] font-semibold text-[#2F7EDA] hover:underline"
                >
                  Back to 1-on-1
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Contacts List */}
        <div className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#9FA0B5]">
            Contacts
          </p>

          {filteredContacts.map((contact) => {
            const isSelected = selectedContactIds.includes(contact.id);

            return (
              <div
                key={contact.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (isCreatingGroup) {
                    toggleSelectContact(contact.id);
                  } else {
                    handleStartDirectChat(contact);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    if (isCreatingGroup) toggleSelectContact(contact.id);
                    else handleStartDirectChat(contact);
                  }
                }}
                className={`flex w-full items-center justify-between rounded-2xl p-2.5 text-left transition-colors cursor-pointer ${
                  isSelected ? "bg-blue-50/80" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    {contact.isOnline && (
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#102448]">
                      {contact.name}
                    </p>
                    <p className="text-[11px] text-[#9FA0B5]">{contact.status}</p>
                  </div>
                </div>

                {isCreatingGroup && (
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                      isSelected
                        ? "border-[#2F7EDA] bg-[#2F7EDA] text-white"
                        : "border-[#C6D1D7] bg-white"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Group creation submit button */}
        {isCreatingGroup && (
          <div className="border-t border-[#F0F4F8] p-4">
            <button
              type="button"
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedContactIds.length === 0}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#44A2FF] to-[#177EEB] text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Group ({selectedContactIds.length} members)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
