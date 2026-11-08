import { Phone, Video, ArrowDownLeft, ArrowUpRight, PhoneCall } from "lucide-react";

export function CallsView() {
  const calls = [
    {
      id: "call-1",
      name: "Rahul Mehta",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      type: "incoming",
      isVideo: true,
      time: "Today, 11:30 AM",
      status: "missed",
    },
    {
      id: "call-2",
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      type: "outgoing",
      isVideo: false,
      time: "Yesterday, 04:15 PM",
      status: "answered",
      duration: "14m 20s",
    },
    {
      id: "call-3",
      name: "Together ❤️",
      avatar: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=150&auto=format&fit=crop&q=80",
      type: "outgoing",
      isVideo: true,
      time: "Nov 5, 08:00 PM",
      status: "answered",
      duration: "42m 10s",
    },
  ];

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[17px] font-bold text-[#102448]">Recent Calls</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#2F7EDA]"
        >
          <PhoneCall className="h-3.5 w-3.5" />
          New Call
        </button>
      </div>

      <div className="space-y-1.5">
        {calls.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-2xl p-3 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <img
                src={c.avatar}
                alt={c.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-sm font-bold text-[#102448]">{c.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-[#9FA0B5]">
                  {c.type === "incoming" ? (
                    <ArrowDownLeft
                      className={`h-3.5 w-3.5 ${
                        c.status === "missed" ? "text-red-500" : "text-emerald-500"
                      }`}
                    />
                  ) : (
                    <ArrowUpRight className="h-3.5 w-3.5 text-blue-500" />
                  )}
                  <span>{c.time}</span>
                  {c.duration && <span>• {c.duration}</span>}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[#2F7EDA] hover:bg-blue-50"
              aria-label={`Call ${c.name}`}
            >
              {c.isVideo ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
