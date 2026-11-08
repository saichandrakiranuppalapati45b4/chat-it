import type { ChatConversation, UserStory, ChatFilterType } from "../types/chat";
import { INITIAL_CHATS, INITIAL_STORIES } from "./mockData";
import { db, isFirebaseConfigured } from "../lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

const STORAGE_KEY_CHATS = "chatit_conversations_v1";
const STORAGE_KEY_STORIES = "chatit_stories_v1";

class ChatService {
  private chats: ChatConversation[] = [];
  private stories: UserStory[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const savedChats = localStorage.getItem(STORAGE_KEY_CHATS);
      if (savedChats) {
        this.chats = JSON.parse(savedChats);
      } else {
        this.chats = [...INITIAL_CHATS];
        this.persistChats();
      }

      const savedStories = localStorage.getItem(STORAGE_KEY_STORIES);
      if (savedStories) {
        this.stories = JSON.parse(savedStories);
      } else {
        this.stories = [...INITIAL_STORIES];
        this.persistStories();
      }
    } catch {
      this.chats = [...INITIAL_CHATS];
      this.stories = [...INITIAL_STORIES];
    }

    // Attempt background Firestore sync if configured
    this.syncFromFirestore();
  }

  private persistChats() {
    try {
      localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(this.chats));
    } catch (err) {
      console.warn("Storage save error:", err);
    }
    this.notify();
  }

  private persistStories() {
    try {
      localStorage.setItem(STORAGE_KEY_STORIES, JSON.stringify(this.stories));
    } catch (err) {
      console.warn("Storage save error:", err);
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private async syncFromFirestore() {
    if (!isFirebaseConfigured() || !db) return;
    try {
      const chatsRef = collection(db, "chats");
      const q = query(chatsRef, orderBy("lastMessage.createdAt", "desc"), limit(20));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const firestoreChats: ChatConversation[] = [];
        snap.forEach((doc) => {
          firestoreChats.push({ id: doc.id, ...(doc.data() as Omit<ChatConversation, "id">) });
        });
        if (firestoreChats.length > 0) {
          this.chats = firestoreChats;
          this.persistChats();
        }
      }
    } catch {
      // Graceful fallback to local mock data layer
    }
  }

  public getChats(): ChatConversation[] {
    return [...this.chats];
  }

  public getStories(): UserStory[] {
    return [...this.stories];
  }

  public getPinnedChats(): ChatConversation[] {
    return this.chats.filter((c) => c.isPinned);
  }

  public getRecentChats(): ChatConversation[] {
    return this.chats.filter((c) => !c.isPinned);
  }

  public filterChats(queryText: string, filter: ChatFilterType): ChatConversation[] {
    let result = [...this.chats];

    // Filter by type
    if (filter === "unread") {
      result = result.filter((c) => c.unreadCount > 0);
    } else if (filter === "groups") {
      result = result.filter((c) => c.isGroup);
    } else if (filter === "favourites") {
      result = result.filter((c) => c.isFavorite);
    }

    // Search query
    if (queryText.trim()) {
      const q = queryText.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.lastMessage.text.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getCounts() {
    const all = this.chats.length;
    const unread = this.chats.filter((c) => c.unreadCount > 0).length;
    const groups = this.chats.filter((c) => c.isGroup).length;
    const favourites = this.chats.filter((c) => c.isFavorite).length;
    const pinned = this.chats.filter((c) => c.isPinned).length;
    return { all, unread, groups, favourites, pinned };
  }

  public togglePin(chatId: string) {
    this.chats = this.chats.map((c) =>
      c.id === chatId ? { ...c, isPinned: !c.isPinned } : c
    );
    this.persistChats();
  }

  public toggleFavorite(chatId: string) {
    this.chats = this.chats.map((c) =>
      c.id === chatId ? { ...c, isFavorite: !c.isFavorite } : c
    );
    this.persistChats();
  }

  public toggleMute(chatId: string) {
    this.chats = this.chats.map((c) =>
      c.id === chatId ? { ...c, isMuted: !c.isMuted } : c
    );
    this.persistChats();
  }

  public markAsRead(chatId: string) {
    this.chats = this.chats.map((c) =>
      c.id === chatId
        ? {
            ...c,
            unreadCount: 0,
            lastMessage: { ...c.lastMessage, isRead: true },
          }
        : c
    );
    this.persistChats();
  }

  public markAsUnread(chatId: string) {
    this.chats = this.chats.map((c) =>
      c.id === chatId
        ? {
            ...c,
            unreadCount: c.unreadCount > 0 ? c.unreadCount : 1,
            lastMessage: { ...c.lastMessage, isRead: false },
          }
        : c
    );
    this.persistChats();
  }

  public deleteChat(chatId: string) {
    this.chats = this.chats.filter((c) => c.id !== chatId);
    this.persistChats();
  }

  public sendMessage(chatId: string, text: string) {
    if (!text.trim()) return;
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: "current-user",
      text: text.trim(),
      timestamp: "Just now",
      createdAt: Date.now(),
      isRead: false,
      isDelivered: true,
    };

    this.chats = this.chats.map((c) =>
      c.id === chatId
        ? {
            ...c,
            lastMessage: newMessage,
          }
        : c
    );

    // Reorder: active chat moves to top of its group
    this.chats.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);
    this.persistChats();
  }

  public createChat(title: string, avatar: string, isGroup: boolean, participantIds: string[] = []): ChatConversation {
    const newChat: ChatConversation = {
      id: `chat-${Date.now()}`,
      title,
      avatar,
      isGroup,
      participantCount: isGroup ? participantIds.length + 1 : 2,
      isPinned: false,
      isFavorite: false,
      isOnline: true,
      hasStoryRing: false,
      unreadCount: 0,
      lastMessage: {
        id: `msg-${Date.now()}`,
        senderId: "system",
        text: isGroup ? "Group created" : "Conversation started",
        timestamp: "Just now",
        createdAt: Date.now(),
        isRead: true,
        isDelivered: true,
      },
      participants: participantIds.map((id) => ({
        id,
        name: title,
        avatar,
        isOnline: true,
      })),
    };

    this.chats = [newChat, ...this.chats];
    this.persistChats();
    return newChat;
  }

  public addStory(caption: string, mediaUrl: string): UserStory {
    const newStoryItem = {
      id: `story-item-${Date.now()}`,
      mediaUrl: mediaUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      caption,
      createdAt: "Just now",
      durationSeconds: 5,
    };

    const existingUserStoryIndex = this.stories.findIndex((s) => s.userId === "current-user");

    if (existingUserStoryIndex >= 0) {
      this.stories[existingUserStoryIndex].stories.unshift(newStoryItem);
      this.stories[existingUserStoryIndex].hasUnseenStory = true;
    } else {
      this.stories.unshift({
        id: `story-${Date.now()}`,
        userId: "current-user",
        userName: "You",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        hasUnseenStory: true,
        stories: [newStoryItem],
      });
    }

    this.persistStories();
    return this.stories[0];
  }

  public markStoryViewed(storyId: string) {
    this.stories = this.stories.map((s) =>
      s.id === storyId ? { ...s, hasUnseenStory: false } : s
    );
    this.persistStories();
  }
}

export const chatService = new ChatService();
