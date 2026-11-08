export interface UserStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  hasUnseenStory: boolean;
  stories: {
    id: string;
    mediaUrl: string;
    caption?: string;
    createdAt: string;
    durationSeconds?: number;
  }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string; // e.g. "10:24 AM", "Yesterday", "2h ago", "Just now"
  createdAt: number; // millisecond timestamp for sorting
  isRead: boolean;
  isDelivered: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  avatar: string;
  isGroup: boolean;
  participantCount?: number;
  isPinned: boolean;
  isFavorite: boolean;
  isMuted?: boolean;
  isOnline?: boolean;
  hasStoryRing?: boolean;
  unreadCount: number;
  lastMessage: ChatMessage;
  participants: {
    id: string;
    name: string;
    avatar: string;
    isOnline?: boolean;
  }[];
}

export type ChatFilterType = "all" | "unread" | "groups" | "favourites";

export type BottomNavTab = "chats" | "calls" | "people" | "settings";
