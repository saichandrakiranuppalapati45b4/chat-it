import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { ArrowLeft, MoreHorizontal, Music, Gamepad2, Trophy, Heart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const MUSIC_HISTORY = [
    {
        id: '1',
        type: 'music',
        user: 'Sarah',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
        action: 'Synced',
        target: 'Starboy',
        time: 'TODAY, 2:45 PM',
        streak: 'Vibe Streak +5',
    },
    {
        id: '2',
        type: 'music',
        user: 'Mia',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
        action: 'Synced',
        target: 'Flowers',
        time: 'OCT 12, 6:15 PM',
    },
];

const GAMES_HISTORY = [
    {
        id: '1',
        type: 'game',
        user: 'James',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop',
        action: 'Beat James in',
        target: 'Vibe Trivia',
        time: 'TODAY, 4:12 PM',
        streak: 'Win Streak +3',
    },
    {
        id: '2',
        type: 'game',
        user: 'Leo',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
        action: 'Played',
        target: 'Rhythm Tap',
        suffix: 'with Leo',
        time: 'YESTERDAY, 9:30 PM',
    },
    {
        id: '3',
        type: 'game',
        user: 'System', // Trophy case
        isSystem: true,
        action: 'New High Score',
        suffix: 'in Emoji Quiz',
        time: 'OCT 14, 2:15 PM',
    },
    {
        id: '4',
        type: 'game',
        user: 'Mia',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
        action: 'Won a match against',
        target: 'Mia',
        time: 'OCT 12, 8:45 PM',
    },
];

export default function PastVibeHistoryScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('Music'); // 'Music' or 'Games'

    const data = activeTab === 'Music' ? MUSIC_HISTORY : GAMES_HISTORY;

    const renderItem = ({ item, index }) => {
        const isGame = activeTab === 'Games';
        const isAchievement = item.isSystem;

        return (
            <View style={styles.timelineItem}>
                {/* Timeline Line & Dot */}
                <View style={styles.timelineLeft}>
                    <View style={styles.timelineLine} />
                    <View style={styles.timelineDotContainer}>
                        <View style={styles.timelineDot} />
                    </View>
                </View>

                {/* Content Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.timestamp}>{item.time}</Text>
                        <TouchableOpacity>
                            <MoreHorizontal size={16} color="#D1D5DB" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardContent}>
                        <View style={styles.avatarContainer}>
                            {isAchievement ? (
                                <LinearGradient
                                    colors={['#60A5FA', '#3B82F6']}
                                    style={styles.achievementIcon}
                                >
                                    <Trophy size={20} color="#FFF" />
                                </LinearGradient>
                            ) : (
                                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                            )}

                            {/* Type Badge (Music Note or Controller) */}
                            <View style={[styles.typeBadge, { backgroundColor: isGame ? '#3B82F6' : '#A855F7' }]}>
                                {isGame ? <Gamepad2 size={10} color="#FFF" /> : <Music size={10} color="#FFF" />}
                            </View>
                        </View>

                        <View style={styles.textContent}>
                            <Text style={styles.actionText}>
                                {item.action}{' '}
                                {item.target && (
                                    <Text style={[styles.highlightText, { color: isGame ? '#3B82F6' : '#D946EF' }]}>
                                        {item.target}
                                    </Text>
                                )}
                                {item.suffix && ` ${item.suffix}`}
                                {!item.target && !item.suffix && ` with ${item.user}`}
                            </Text>
                        </View>
                    </View>

                    {item.streak && (
                        <View style={[styles.streakBadge, { backgroundColor: isGame ? '#E0F2FE' : '#FAE8FF' }]}>
                            {isGame ? null : <Heart size={10} color="#D946EF" style={{ marginRight: 4 }} fill="#D946EF" />}
                            <Text style={[styles.streakText, { color: isGame ? '#0EA5E9' : '#D946EF' }]}>
                                {item.streak}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Past Vibe History</Text>
                <TouchableOpacity style={styles.backButton}>
                    <MoreHorizontal size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            {/* Toggle Switch */}
            <View style={styles.toggleContainer}>
                <View style={styles.toggleBackground}>
                    <TouchableOpacity
                        style={[styles.toggleButton, activeTab === 'Music' && styles.activeToggle]}
                        onPress={() => setActiveTab('Music')}
                    >
                        <Text style={[styles.toggleText, activeTab === 'Music' && styles.activeToggleText]}>Music</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleButton, activeTab === 'Games' && styles.activeToggle]}
                        onPress={() => setActiveTab('Games')}
                    >
                        <Text style={[styles.toggleText, activeTab === 'Games' && { color: '#3B82F6' }]}>Games</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Very light blue/gray background from image
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#F9FAFB',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    backButton: {
        padding: 4,
    },
    toggleContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    toggleBackground: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 12,
    },
    activeToggle: {
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    activeToggleText: {
        color: '#D946EF', // Pink for music
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    timelineLeft: {
        width: 30, // Space for dot and line
        alignItems: 'center',
        //   backgroundColor: 'red', // debug
    },
    timelineLine: {
        position: 'absolute',
        top: 0,
        bottom: -20, // Extend to next item
        width: 1,
        backgroundColor: '#E5E7EB', // Light purple line
    },
    timelineDotContainer: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#F3E8FF', // Light purple ring
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24, // Align with card top approx
        zIndex: 1,
    },
    timelineDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D946EF',
    },
    card: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginLeft: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    timestamp: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarContainer: {
        marginRight: 12,
        position: 'relative',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    achievementIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeBadge: {
        position: 'absolute',
        bottom: -2,
        right: -4,
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    textContent: {
        flex: 1,
    },
    actionText: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '500',
        lineHeight: 20,
    },
    highlightText: {
        fontWeight: 'bold',
    },
    streakBadge: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    streakText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
});
