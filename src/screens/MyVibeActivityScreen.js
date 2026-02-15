import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { ArrowLeft, Share2, TrendingUp, Zap, Trophy, Heart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const WEEKLY_DATA = [
    { day: 'M', value: 0.3, active: false },
    { day: 'T', value: 0.5, active: false },
    { day: 'W', value: 0.4, active: false },
    { day: 'T', value: 0.8, active: true },
    { day: 'F', value: 0.6, active: false },
    { day: 'S', value: 0.2, active: false },
    { day: 'S', value: 0.35, active: false },
];

const GAMES_DATA = [
    { value: 0.2 },
    { value: 0.3 },
    { value: 0.25 },
    { value: 0.4 },
    { value: 0.5 },
    { value: 0.3 },
    { value: 0.2 },
];

const SYNC_PARTNERS = [
    {
        id: '1',
        name: 'Alex Rivera',
        score: '98% Sync Score',
        vibes: '1.2k vibes',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
        icon: Heart,
        iconColor: '#D946EF',
        online: true,
    },
    {
        id: '2',
        name: 'Luna Skye',
        score: '92% Sync Score',
        vibes: '856 vibes',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
        icon: Zap,
        iconColor: '#8B5CF6',
        online: false,
    },
    {
        id: '3',
        name: 'Jordan X',
        score: '85% Sync Score',
        vibes: '430 vibes',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
        icon: TrendingUp,
        iconColor: '#F97316',
        online: true,
    },
];

export default function MyVibeActivityScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    const StatCard = ({ label, value, unit, trend, trendValue, isMax, color }) => (
        <View style={styles.statCard}>
            <View>
                <Text style={styles.statLabel}>{label}</Text>
                <View style={styles.statValueRow}>
                    <Text style={styles.statValue}>{value}</Text>
                    <Text style={[styles.statUnit, { color: color }]}>{unit}</Text>
                </View>
            </View>
            <View style={[styles.trendBadge, { backgroundColor: isMax ? '#FAE8FF' : '#ECFDF5' }]}>
                {isMax ? <Zap size={10} color={color} fill={color} /> : <TrendingUp size={10} color="#10B981" />}
                <Text style={[styles.trendText, { color: isMax ? color : '#10B981' }]}> {trendValue}</Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <ArrowLeft size={20} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Vibe Activity</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Share2 size={20} color="#1F2937" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <StatCard
                        label="WEEKLY LISTENING"
                        value="42.5"
                        unit="HRS"
                        trendValue="12%"
                        color="#D946EF"
                    />
                    <StatCard
                        label="VIBE STREAK"
                        value="18"
                        unit="DAYS"
                        trendValue="MAX"
                        isMax
                        color="#D946EF"
                    />
                </View>

                {/* Total Listening Chart */}
                <View style={[styles.largeCard, { height: 280 }]}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.cardTitle}>Total Listening Time</Text>
                            <Text style={styles.cardSubtitle}>Average 6.2 hrs / day</Text>
                        </View>
                        <View style={styles.liveBadge}>
                            <Text style={styles.liveText}>LIVE</Text>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        {WEEKLY_DATA.map((item, index) => (
                            <View key={index} style={styles.barGroup}>
                                <View style={styles.barTrack}>
                                    <View style={styles.barTrackBg} />
                                    <LinearGradient
                                        colors={item.active ? ['#E879F9', '#D946EF'] : ['#F3E8FF', '#F3E8FF']}
                                        style={[styles.barFill, { height: `${item.value * 100}%`, backgroundColor: item.active ? undefined : '#F3F4F6' }]}
                                    />
                                </View>
                                <Text style={[styles.axisLabel, item.active && styles.activeAxisLabel]}>{item.day}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Games Won Card */}
                <View style={[styles.largeCard, { height: 180 }]}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.cardTitle}>Games Won</Text>
                            <View style={styles.gamesStatContainer}>
                                <Text style={styles.gamesValue}>124</Text>
                                <View style={styles.newBadge}>
                                    <Text style={styles.newBadgeText}>+24 new</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.trophyContainer}>
                            <Trophy size={20} color="#8B5CF6" />
                        </View>
                    </View>

                    {/* Fixed Height Chart Container */}
                    <View style={styles.miniChartWrapper}>
                        <View style={styles.miniChartContainer}>
                            {GAMES_DATA.map((item, index) => (
                                <View key={index} style={[styles.miniBar, { height: 20 + (item.value * 40), backgroundColor: index === 4 ? '#8B5CF6' : '#ede9fe' }]} />
                            ))}
                        </View>
                    </View>
                </View>

                {/* Top Sync Partners */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Top Sync Partners</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                {SYNC_PARTNERS.map((partner) => (
                    <View key={partner.id} style={styles.partnerCard}>
                        <View style={styles.avatarWrapper}>
                            <Image source={{ uri: partner.avatar }} style={styles.avatar} />
                            {partner.online && <View style={styles.onlineStatus} />}
                        </View>
                        <View style={styles.partnerDetails}>
                            <Text style={styles.partnerName}>{partner.name}</Text>
                            <Text style={styles.partnerScore}>{partner.score}</Text>
                        </View>
                        <View style={[styles.vibePill, { backgroundColor: '#F9FAFB' }]}>
                            <partner.icon size={12} color={partner.iconColor} style={{ marginRight: 4 }} fill={partner.iconColor} />
                            <Text style={styles.vibeCount}>{partner.vibes}</Text>
                        </View>
                    </View>
                ))}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 12,
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
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
        height: 130, // Optimized height
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    statLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    statValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
    },
    statUnit: {
        fontSize: 12, // Unit size
        fontWeight: '800',
        marginLeft: 6,
        textTransform: 'uppercase',
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4, // More compact
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    trendText: {
        fontSize: 10,
        fontWeight: '700',
        marginLeft: 4,
    },
    largeCard: {
        backgroundColor: '#FFF',
        borderRadius: 28,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
        justifyContent: 'space-between', // Push chart to bottom
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    liveBadge: {
        backgroundColor: '#111827',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    liveText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 140, // Reduced chart height
        alignItems: 'flex-end',
        paddingHorizontal: 8,
    },
    barGroup: {
        alignItems: 'center',
        flex: 1,
    },
    barTrack: {
        width: 32,
        height: 120, // Track matches container roughly
        borderRadius: 16,
        justifyContent: 'flex-end',
        marginBottom: 8,
        position: 'relative',
        overflow: 'hidden',
    },
    barTrackBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#F9FAFB',
    },
    barFill: {
        width: '100%',
        borderRadius: 16,
    },
    axisLabel: {
        fontSize: 12,
        color: '#D1D5DB',
        fontWeight: '600',
    },
    activeAxisLabel: {
        color: '#111827',
        fontWeight: '800',
    },
    gamesStatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    gamesValue: {
        fontSize: 26,
        fontWeight: '800',
        color: '#111827',
    },
    newBadge: {
        backgroundColor: '#0F172A',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 10,
    },
    newBadgeText: {
        color: '#22D3EE',
        fontSize: 10,
        fontWeight: '700',
    },
    trophyContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    miniChartWrapper: {
        justifyContent: 'flex-end',
        flex: 1,
    },
    miniChartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 60,
        paddingHorizontal: 0,
    },
    miniBar: {
        width: 32,
        borderRadius: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },
    seeAllText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#D946EF',
    },
    partnerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    avatarWrapper: {
        position: 'relative',
        marginRight: 14,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
    },
    onlineStatus: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#84CC16',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    partnerDetails: {
        flex: 1,
    },
    partnerName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    partnerScore: {
        fontSize: 12,
        color: '#6B7280',
    },
    vibePill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    vibeCount: {
        fontSize: 11,
        fontWeight: '700',
        color: '#374151',
    },
});
