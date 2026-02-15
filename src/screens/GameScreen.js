import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, Platform } from 'react-native';
import { Bell, Search, Gamepad2, Zap, Palette, Dice5, User, Home, MessageCircle, Headphones, Trophy, ArrowRight, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock Data
const MATCHES = [
    { id: '1', game: 'Word Battle', opponent: 'Sarah_99', status: 'YOUR TURN', progress: 0.6, icon: '✏️', color: '#E8F5E9', iconBg: '#C8E6C9' },
    { id: '2', game: 'Emoji Quiz', opponent: 'Alex_K', status: 'WAITING', progress: 0.3, icon: '🏆', color: '#FFF3E0', iconBg: '#FFE0B2' },
    { id: '3', game: 'Fast Tap', opponent: 'TechnoTess', status: 'YOUR TURN', progress: 0.8, icon: '⚡', color: '#E3F2FD', iconBg: '#BBDEFB' },
];

const QUICK_PLAY = [
    { id: '1', title: 'Word Battle', players: '12k Playing', image: 'https://via.placeholder.com/150/1F2937/FFFFFF?text=AB', icon: '🅰️' },
    { id: '2', title: 'Fast Tap', players: '8k Playing', image: 'https://via.placeholder.com/150/1F2937/FFFFFF?text=⚡', icon: '⚡' },
    { id: '3', title: 'Emoji Quiz', players: '5.4k Playing', image: 'https://via.placeholder.com/150/FFE0B2/000000?text=😂', icon: '☺' },
    { id: '4', title: 'Draw It', players: '3.2k Playing', image: 'https://via.placeholder.com/150/1F2937/FFFFFF?text=✏️', icon: '🖌️' },
];

export default function GameScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    const renderMatch = ({ item }) => (
        <View style={styles.matchCard}>
            <View style={styles.matchHeader}>
                <View style={[styles.matchIconContainer, { backgroundColor: item.iconBg }]}>
                    <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                </View>
                {item.status === 'YOUR TURN' && (
                    <View style={styles.turnBadge}>
                        <Text style={styles.turnText}>YOUR TURN</Text>
                    </View>
                )}
            </View>
            <Text style={styles.matchGame}>{item.game}</Text>
            <Text style={styles.matchOpponent}>vs. {item.opponent}</Text>

            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
            </View>
            <View style={styles.matchFooter}>
                <Text style={styles.roundText}>Round 3/5</Text>
                <Text style={[styles.statusText, { color: item.status === 'YOUR TURN' ? '#3B82F6' : '#9CA3AF' }]}>
                    {item.status === 'YOUR TURN' ? 'Waiting for you...' : 'In active match'}
                </Text>
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={['#FFF5FC', '#F3E5F5', '#E1F5FE']}
            locations={[0, 0.4, 1]}
            style={styles.background}
        >
            <View style={[styles.container, { paddingTop: insets.top }]}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.avatar} />
                            <View style={styles.onlineDot} />
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.userName}>Arcade</Text>
                                <Text style={{ fontSize: 16, marginLeft: 6 }}>🕹️</Text>
                            </View>
                            <Text style={styles.userStatus}>Ready to play?</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.iconButton}>
                        <Bell size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                {/* Sync Bar */}
                <View style={styles.syncBar}>
                    <View style={styles.equalizer}>
                        {[1, 2, 3, 2, 1].map((h, i) => (
                            <View key={i} style={[styles.eqBar, { height: h * 4 }]} />
                        ))}
                    </View>
                    <Text style={styles.syncText}>NOW SYNCING: BLINDING LIGHTS</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Your Matches */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Your Matches</Text>
                        <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
                    </View>

                    <FlatList
                        horizontal
                        data={MATCHES}
                        renderItem={renderMatch}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.matchesList}
                    />

                    {/* Quick Play Grid */}
                    <Text style={[styles.sectionTitle, { marginLeft: 24, marginTop: 24, marginBottom: 16 }]}>Quick Play</Text>
                    <View style={styles.gridContainer}>
                        {QUICK_PLAY.map((game) => (
                            <TouchableOpacity key={game.id} style={styles.gameTile}>
                                <Image source={{ uri: game.image }} style={styles.gameImage} />
                                <View style={styles.gameOverlay}>
                                    <View style={styles.gameIconBadge}>
                                        <Text>{game.icon}</Text>
                                    </View>
                                </View>
                                <View style={styles.gameInfo}>
                                    <Text style={styles.gameTitle}>{game.title}</Text>
                                    <Text style={styles.gamePlayers}>{game.players}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Random Challenge Banner */}
                    <View style={styles.bannerContainer}>
                        <LinearGradient
                            colors={['#FFF0F5', '#F3E5F5']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.randomBanner}
                        >
                            <View style={styles.bannerIcon}>
                                <Dice5 size={32} color="#FFF" />
                            </View>
                            <View style={{ flex: 1, paddingHorizontal: 16 }}>
                                <Text style={styles.bannerTitle}>Random</Text>
                                <Text style={styles.bannerTitle}>Challenge</Text>
                                <Text style={styles.bannerSubtitle}>We pick a game for you and a friend.</Text>
                            </View>
                            <TouchableOpacity style={styles.arrowButton}>
                                <ArrowRight size={20} color="#1F2937" />
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>

                <View style={{ height: 20 }} />

            </View>
        </LinearGradient >
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#C623FA',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    userStatus: {
        fontSize: 14,
        color: '#6B7280',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    syncBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        paddingVertical: 8,
        marginBottom: 20,
    },
    equalizer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 16,
        marginRight: 8,
    },
    eqBar: {
        width: 3,
        backgroundColor: '#C623FA',
        marginHorizontal: 1,
        borderRadius: 2,
    },
    syncText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#C623FA',
        letterSpacing: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    seeAll: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#C623FA',
        backgroundColor: '#F3E8FF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    matchesList: {
        paddingHorizontal: 24,
    },
    matchCard: {
        width: 280,
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 16,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    matchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    matchIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    turnBadge: {
        backgroundColor: '#4ADE80',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    turnText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#14532D',
    },
    matchGame: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    matchOpponent: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 3,
        marginBottom: 12,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4ADE80',
        borderRadius: 3,
    },
    matchFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    roundText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    // Grid
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 24,
        justifyContent: 'space-between',
    },
    gameTile: {
        width: (width - 64) / 2, // 2 columns with spacing
        backgroundColor: '#FFF',
        borderRadius: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    gameImage: {
        width: '100%',
        height: 120,
        backgroundColor: '#1F2937',
    },
    gameOverlay: {
        position: 'absolute',
        top: 12,
        left: 12,
    },
    gameIconBadge: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameInfo: {
        padding: 12,
    },
    gameTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    gamePlayers: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    // Banner
    bannerContainer: {
        paddingHorizontal: 24,
        marginTop: 8,
    },
    randomBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3E8FF',
    },
    bannerIcon: {
        width: 60,
        height: 60,
        borderRadius: 18,
        backgroundColor: '#C623FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        lineHeight: 22,
    },
    bannerSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    arrowButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
});
