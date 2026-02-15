import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Search, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock Data
const PINNED_CHATS = [
    {
        id: '1',
        name: 'Ariya Goulding',
        message: 'Have a good day, Roman!',
        time: '10:27 AM',
        unread: 1,
        avatar: 'https://via.placeholder.com/100',
        isOnline: true
    },
    {
        id: '2',
        name: 'Omari Norris',
        message: 'Hi, good to hear from you.',
        time: '9:48 AM',
        unread: 0,
        avatar: 'https://via.placeholder.com/100',
        isOnline: true
    }
];

const ALL_CHATS = [
    {
        id: '3',
        name: 'Sherri Matthews',
        message: 'Hey there, I\'m having tro...',
        time: '11:24 AM',
        unread: 3,
        avatar: 'https://via.placeholder.com/100',
        isOnline: false
    },
    {
        id: '4',
        name: 'Marcus King',
        message: 'I\'m ready to buy this thing...',
        time: '9:48 AM',
        unread: 0,
        avatar: 'https://via.placeholder.com/100',
        isOnline: false
    },
    {
        id: '5',
        name: 'Alia Jones',
        message: 'Can we reschedule?',
        time: 'Yesterday',
        unread: 0,
        avatar: 'https://via.placeholder.com/100',
        isOnline: false
    },
    {
        id: '6',
        name: 'David Chen',
        message: 'Sent a photo.',
        time: 'Yesterday',
        unread: 0,
        avatar: 'https://via.placeholder.com/100',
        isOnline: false
    }
];

export default function ChatScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [searchText, setSearchText] = useState('');

    const renderChatItem = ({ item, isPinned }) => (
        <TouchableOpacity
            style={styles.chatCard}
            onPress={() => navigation.navigate('ChatDetail', {
                name: item.name,
                avatar: item.avatar,
                isOnline: item.isOnline
            })}
        >
            <View style={styles.avatarContainer}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                {isPinned && <View style={styles.onlineRing} />}
            </View>

            <View style={styles.chatDetails}>
                <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <View style={styles.messageRow}>
                    <Text style={styles.messageText} numberOfLines={1}>{item.message}</Text>
                    {item.unread > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{item.unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F9FAFB', '#F3F4F6']}
                style={styles.background}
            />

            <View style={[styles.contentContainer, { paddingTop: insets.top }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Chat</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Plus size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search chats..."
                        placeholderTextColor="#9CA3AF"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                <FlatList
                    data={ALL_CHATS}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => renderChatItem({ item, isPinned: false })}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={() => (
                        <>
                            {/* Pinned Section */}
                            <Text style={styles.sectionTitle}>PINNED</Text>
                            {PINNED_CHATS.map(chat => (
                                <View key={chat.id} style={{ marginBottom: 12 }}>
                                    {renderChatItem({ item: chat, isPinned: true })}
                                </View>
                            ))}

                            {/* All Chats Section */}
                            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>ALL CHATS</Text>
                        </>
                    )}
                    // Add padding at bottom for navigation bar
                    ListFooterComponent={<View style={{ height: 100 }} />}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    contentContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#111827',
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#C623FA', // Purple from user design
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#C623FA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: 24,
        paddingHorizontal: 16,
        height: 50,
        borderRadius: 25, // Rounded pill shape
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#1F2937',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6B7280',
        marginBottom: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 24,
        marginBottom: 12,
        // Soft shadow from design
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(243, 244, 246, 0.6)',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E5E7EB',
    },
    onlineRing: {
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#C623FA', // Or blue based on design, trying purple to match theme
    },
    chatDetails: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    chatName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    timeText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    messageText: {
        flex: 1,
        fontSize: 14,
        color: '#6B7280',
        marginRight: 8,
    },
    unreadBadge: {
        backgroundColor: '#C623FA',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
