import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, FlatList, Dimensions } from 'react-native';
import { Search, Plus, Play, Music, User, Headphones } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TRENDING = [
    { id: '1', title: 'Neon Nights', subtitle: 'Lucas & 4 others', image: 'https://via.placeholder.com/200/333/FFF?text=Neon', color: '#C623FA' },
    { id: '2', title: 'Cloud Walk', subtitle: 'Sarah is vibing', image: 'https://via.placeholder.com/200/D2B48C/FFF?text=Cloud', color: '#F59E0B' },
];

const TOP_VIBES = [
    { id: '1', title: 'Glitched Reality', tag: 'HYPERPOP', image: 'https://via.placeholder.com/150/555/FFF?text=Glitch', tagColor: '#D946EF' },
    { id: '2', title: 'Blue Monday Dreams', tag: 'LO-FI CHILL', image: 'https://via.placeholder.com/150/888/FFF?text=Lofi', tagColor: '#06B6D4' },
    { id: '3', title: 'Cyber Punk', tag: 'ELECTRONIC', image: 'https://via.placeholder.com/150/111/FFF?text=Cyber', tagColor: '#10B981' },
];

const SUGGESTED = [
    { id: '1', title: 'Afterglow Symphony', artist: 'The Midnight Bloom', status: '5 friends listening', image: 'https://via.placeholder.com/60' },
    { id: '2', title: 'Velvet Horizon', artist: 'Solar Flares', status: 'Mika & Chloe', image: 'https://via.placeholder.com/60' },
    { id: '3', title: 'Digital Pulse', artist: 'Cyber Echo', status: 'Trending in Squad', image: 'https://via.placeholder.com/60' },
];

export default function MusicScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    const renderTrending = ({ item }) => (
        <TouchableOpacity
            style={styles.trendingCard}
            onPress={() => navigation.navigate('MusicPlayer', {
                title: item.title,
                artist: item.subtitle,
                cover: item.image
            })}
        >
            <View style={styles.trendingImageContainer}>
                <Image source={{ uri: item.image }} style={styles.trendingImage} />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.4)']}
                    style={styles.trendingOverlay}
                >
                    <TouchableOpacity style={styles.syncButton}>
                        <View style={{ marginRight: 4 }}><Text style={{ fontSize: 10 }}>⚡</Text></View>
                        <Text style={styles.syncButtonText}>SYNC NOW</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
            <Text style={styles.trendingTitle}>{item.title}</Text>
            <Text style={styles.trendingSubtitle}>{item.subtitle}</Text>
        </TouchableOpacity>
    );

    const renderVibe = ({ item }) => (
        <TouchableOpacity
            style={styles.vibeCard}
            onPress={() => navigation.navigate('MusicPlayer', {
                title: item.title,
                artist: item.tag,
                cover: item.image
            })}
        >
            <Image source={{ uri: item.image }} style={styles.vibeImage} />
            <View style={styles.vibeOverlay}>
                <View style={[styles.vibeTag, { backgroundColor: item.tagColor }]}>
                    <Text style={styles.vibeTagText}>{item.tag}</Text>
                </View>
                <Text style={styles.vibeTitle}>{item.title}</Text>
            </View>
        </TouchableOpacity>
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
                    <Text style={styles.headerTitle}>Vibe Discovery</Text>
                    <TouchableOpacity style={styles.profileButton}>
                        <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profileImage} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Search size={20} color="#C623FA" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search vibes, tracks, or squads..."
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Trending with Friends */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Trending with Friends</Text>
                        <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal
                        data={TRENDING}
                        renderItem={renderTrending}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                    />

                    {/* Your Top Vibes */}
                    <Text style={[styles.sectionTitle, { marginLeft: 24, marginTop: 24, marginBottom: 16 }]}>Your Top Vibes</Text>
                    <FlatList
                        horizontal
                        data={TOP_VIBES}
                        renderItem={renderVibe}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                    />

                    {/* Suggested for the Squad */}
                    <Text style={[styles.sectionTitle, { marginLeft: 24, marginTop: 24, marginBottom: 16 }]}>Suggested for the Squad</Text>
                    <View style={styles.suggestedList}>
                        {SUGGESTED.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.songCard}
                                onPress={() => navigation.navigate('MusicPlayer', {
                                    title: item.title,
                                    artist: item.artist,
                                    cover: item.image
                                })}
                            >
                                <Image source={{ uri: item.image }} style={styles.songImage} />
                                <View style={styles.songInfo}>
                                    <Text style={styles.songTitle}>{item.title}</Text>
                                    <Text style={styles.songArtist}>
                                        {item.artist} <Text style={styles.songStatus}>• {item.status}</Text>
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.addButton}>
                                    <Plus size={20} color="#C623FA" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Bottom Padding for Nav Bar */}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>
        </LinearGradient>
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
        marginBottom: 20,
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        letterSpacing: -0.5,
    },
    profileButton: {
        padding: 2,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#F472B6',
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F3E8FF',
        shadowColor: '#C623FA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    seeAll: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#C623FA',
    },
    horizontalList: {
        paddingHorizontal: 24,
    },
    // Trending Styles
    trendingCard: {
        width: 220,
        marginRight: 16,
    },
    trendingImageContainer: {
        width: 220,
        height: 220,
        borderRadius: 24,
        backgroundColor: '#DDD',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 10,
    },
    trendingImage: {
        width: '100%',
        height: '100%',
    },
    trendingOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    syncButton: {
        backgroundColor: '#D946EF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    syncButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    trendingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    trendingSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },

    // Top Vibes Styles
    vibeCard: {
        width: 140,
        height: 180,
        borderRadius: 24,
        marginRight: 12,
        overflow: 'hidden',
        backgroundColor: '#333',
        position: 'relative',
    },
    vibeImage: {
        width: '100%',
        height: '100%',
        opacity: 0.9,
    },
    vibeOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        justifyContent: 'flex-end',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    vibeTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
    },
    vibeTagText: {
        color: '#1F2937',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    vibeTitle: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 18,
    },

    // Suggested Styles
    suggestedList: {
        paddingHorizontal: 24,
    },
    songCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    songImage: {
        width: 48,
        height: 48,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: '#EEE',
    },
    songInfo: {
        flex: 1,
    },
    songTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    songArtist: {
        fontSize: 12,
        color: '#6B7280',
    },
    songStatus: {
        color: '#C623FA',
        fontWeight: '500',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3E5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
