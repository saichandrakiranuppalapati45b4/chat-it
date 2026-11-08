import { useState, useEffect, useMemo, useCallback } from "react";
import type { ChatConversation, ChatFilterType, BottomNavTab } from "../../types/chat";
import { chatService } from "../../services/chatService";
import { HomeHeader } from "../../components/home/HomeHeader";
import { StoriesSection } from "../../components/home/StoriesSection";
import { ChatSearch } from "../../components/home/ChatSearch";
import { ChatFilters } from "../../components/home/ChatFilters";
import { PinnedChats } from "../../components/home/PinnedChats";
import { RecentChats } from "../../components/home/RecentChats";
import { NewChatButton } from "../../components/home/NewChatButton";
import { BottomNavigation } from "../../components/home/BottomNavigation";
import { ChatDetailModal } from "../../components/home/ChatDetailModal";
import { CallsView } from "../../components/home/CallsView";
import { PeopleView } from "../../components/home/PeopleView";
import { SettingsView } from "../../components/home/SettingsView";

export default function Home() {
  const [chats, setChats] = useState<ChatConversation[]>(chatService.getChats());
  const [stories, setStories] = useState(chatService.getStories());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ChatFilterType>("all");
  const [activeTab, setActiveTab] = useState<BottomNavTab>("chats");
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);

  // Subscribe to reactive service changes
  useEffect(() => {
    const unsubscribe = chatService.subscribe(() => {
      setChats(chatService.getChats());
      setStories(chatService.getStories());
    });
    return unsubscribe;
  }, []);

  // Filtered chats based on search query and active filter
  const filteredChats = useMemo(() => {
    let result = [...chats];

    if (activeFilter === "unread") {
      result = result.filter((c) => c.unreadCount > 0);
    } else if (activeFilter === "groups") {
      result = result.filter((c) => c.isGroup);
    } else if (activeFilter === "favourites") {
      result = result.filter((c) => c.isFavorite);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.lastMessage.text.toLowerCase().includes(q)
      );
    }

    return result;
  }, [chats, searchQuery, activeFilter]);

  const pinnedChats = useMemo(() => {
    return filteredChats.filter((c) => c.isPinned);
  }, [filteredChats]);

  const recentChats = useMemo(() => {
    return filteredChats.filter((c) => !c.isPinned);
  }, [filteredChats]);

  const counts = useMemo(() => {
    return {
      all: chats.length,
      unread: chats.filter((c) => c.unreadCount > 0).length,
      groups: chats.filter((c) => c.isGroup).length,
      favourites: chats.filter((c) => c.isFavorite).length,
      pinned: chats.filter((c) => c.isPinned).length,
    };
  }, [chats]);

  // Handlers
  const handleTogglePin = useCallback((id: string) => {
    chatService.togglePin(id);
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    chatService.toggleFavorite(id);
  }, []);

  const handleToggleMute = useCallback((id: string) => {
    chatService.toggleMute(id);
  }, []);

  const handleMarkRead = useCallback((id: string) => {
    chatService.markAsRead(id);
  }, []);

  const handleMarkUnread = useCallback((id: string) => {
    chatService.markAsUnread(id);
  }, []);

  const handleDelete = useCallback((id: string) => {
    chatService.deleteChat(id);
  }, []);

  const handleSendMessage = useCallback((chatId: string, text: string) => {
    chatService.sendMessage(chatId, text);
  }, []);

  const handleCreateChat = useCallback(
    (title: string, avatar: string, isGroup: boolean, participantIds: string[]) => {
      const newChat = chatService.createChat(title, avatar, isGroup, participantIds);
      setSelectedChat(newChat);
    },
    []
  );

  const handleAddStory = useCallback((caption: string, mediaUrl: string) => {
    chatService.addStory(caption, mediaUrl);
  }, []);

  const handleStoryViewed = useCallback((storyId: string) => {
    chatService.markStoryViewed(storyId);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA] text-[#555663] antialiased">
      {/* Top subtle sky-blue ambient gradient matching reference image */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-48 w-full"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, rgba(184, 222, 255, 0.45) 0%, rgba(214, 236, 255, 0.25) 45%, rgba(250, 250, 250, 0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Main container */}
      <div className="relative z-10 mx-auto max-w-md px-4 pt-2">
        {/* Top Header */}
        <HomeHeader />

        {/* Tab views */}
        {activeTab === "chats" && (
          <main>
            {/* Stories Carousel Card */}
            <StoriesSection
              stories={stories}
              onAddStory={handleAddStory}
              onStoryViewed={handleStoryViewed}
            />

            {/* Search component */}
            <ChatSearch
              value={searchQuery}
              onChange={setSearchQuery}
              currentFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Horizontally scrollable filter pills */}
            <ChatFilters
              currentFilter={activeFilter}
              onSelectFilter={setActiveFilter}
              counts={counts}
            />

            {/* Pinned Chats Section */}
            <PinnedChats
              chats={pinnedChats}
              onSelectChat={setSelectedChat}
              onTogglePin={handleTogglePin}
              onToggleFavorite={handleToggleFavorite}
              onToggleMute={handleToggleMute}
              onMarkRead={handleMarkRead}
              onMarkUnread={handleMarkUnread}
              onDelete={handleDelete}
            />

            {/* Recent Chats Section */}
            <RecentChats
              chats={recentChats}
              onSelectChat={setSelectedChat}
              onTogglePin={handleTogglePin}
              onToggleFavorite={handleToggleFavorite}
              onToggleMute={handleToggleMute}
              onMarkRead={handleMarkRead}
              onMarkUnread={handleMarkUnread}
              onDelete={handleDelete}
            />

            {/* Floating compose button */}
            <NewChatButton onCreateChat={handleCreateChat} />
          </main>
        )}

        {activeTab === "calls" && <CallsView />}

        {activeTab === "people" && (
          <PeopleView
            onStartChat={(name, avatar) => {
              handleCreateChat(name, avatar, false, []);
              setActiveTab("chats");
            }}
          />
        )}

        {activeTab === "settings" && <SettingsView />}
      </div>

      {/* Glassmorphic Bottom Navigation Bar */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Active Conversation Detail Modal */}
      {selectedChat && (
        <ChatDetailModal
          chat={selectedChat}
          onClose={() => setSelectedChat(null)}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}
