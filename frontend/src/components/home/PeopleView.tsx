import { useState } from "react";
import { Search, UserPlus, MessageCircle, Phone } from "lucide-react";
import { AVAILABLE_CONTACTS } from "../../services/mockData";

interface PeopleViewProps {
  onStartChat: (name: string, avatar: string) => void;
}

export function PeopleView({ onStartChat }: PeopleViewProps) {
  const [query, setQuery] = useState("");

  const contacts = AVAILABLE_CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase().trim())
  );

  return (
    <div className="space-y-4 pb-24">
      {/* Search contacts */}
      <div className="relative flex h-[48px] w-full items-center rounded-2xl border border-[#E5EDF5] bg-white px-3.5 shadow-sm">
        <Search className="h-4.5 w-4.5 text-[#9FA0B5]" />
        <input
          type="text"
          placeholder="Search people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-full flex-1 bg-transparent px-3 text-xs text-[#102448] placeholder-[#9FA0B5] outline-none"
        />
      </div>

      <div className="flex items-center justify-between px-1">
        <h2 className="text-[17px] font-bold text-[#102448]">Contacts ({contacts.length})</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#2F7EDA]"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add Contact
        </button>
      </div>

      <div className="space-y-1.5">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center justify-between rounded-2xl p-3 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                {contact.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#102448]">{contact.name}</h3>
                <p className="text-xs text-[#9FA0B5]">{contact.status}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onStartChat(contact.name, contact.avatar)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#2F7EDA] hover:bg-blue-50"
                aria-label={`Chat with ${contact.name}`}
              >
                <MessageCircle className="h-4.5 w-4.5" />
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#9FA0B5] hover:bg-slate-100"
                aria-label={`Call ${contact.name}`}
              >
                <Phone className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
