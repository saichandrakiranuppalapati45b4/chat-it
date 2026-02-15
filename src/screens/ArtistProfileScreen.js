import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { ChevronLeft, MoreHorizontal, CheckCircle, MoreVertical } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TOP_TRACKS = [
    { id: '1', title: 'Riptide', album: 'Dream Your Life Away', duration: '3:24', image: 'https://via.placeholder.com/60' },
    { id: '2', title: 'Georgia', album: 'Dream Your Life Away', duration: '3:50', image: 'https://via.placeholder.com/60' },
    { id: '3', title: 'Saturday Sun', album: 'Nation of Two', duration: '3:41', image: 'https://via.placeholder.com/60' },
    { id: '4', title: 'Mess is Mine', album: 'Dream Your Life Away', duration: '3:43', image: 'https://via.placeholder.com/60' },
];

export default function ArtistProfileScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Background */}
            <LinearGradient
                colors={['#FFECD2', '#FCB69F']} // Soft peach/orange gradient from image
                style={[styles.headerBackground, { paddingTop: insets.top + 10 }]}
            >
                <View style={styles.navBar}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                        <ChevronLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <MoreHorizontal size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Artist Banner Image Wrapper */}
                <View style={styles.bannerContainer}>
                    <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.bannerImage} />
                </View>
            </LinearGradient>

            <View style={styles.contentContainer}>
                {/* Artist Info */}
                <View style={styles.artistHeader}>
                    <View style={styles.nameRow}>
                        <Text style={styles.artistName}>Vance Joy</Text>
                        <CheckCircle size={20} color="#3B82F6" fill="#FFF" style={{ marginLeft: 8 }} />
                    </View>
                    <Text style={styles.genre}>Alternative / Indie Pop</Text>

                    <TouchableOpacity>
                        <LinearGradient
                            colors={['#8B5CF6', '#3B82F6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.followButton}
                        >
                            <Text style={styles.followButtonText}>Follow</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>MONTHLY LISTENERS</Text>
                        <Text style={styles.statValue}>24,812,403</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>FOLLOWERS</Text>
                        <Text style={styles.statValue}>4.2M</Text>
                    </View>
                </View>

                {/* Top Tracks */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Top Tracks</Text>
                    <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
                </View>

                <View style={styles.tracksList}>
                    {TOP_TRACKS.map((track, index) => (
                        <View key={track.id} style={styles.trackRow}>
                            <Text style={styles.trackIndex}>{index + 1}</Text>
                            <Image source={{ uri: track.image }} style={styles.trackImage} />
                            <View style={styles.trackInfo}>
                                <Text style={styles.trackTitle}>{track.title}</Text>
                                <Text style={styles.trackAlbum}>{track.album}</Text>
                            </View>
                            <Text style={styles.trackDuration}>{track.duration}</Text>
                            <TouchableOpacity>
                                <MoreVertical size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Artist Pick */}
                <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 16 }]}>Artist Pick</Text>
                <View style={styles.artistPickCard}>
                    <Image source={{ uri: 'https://via.placeholder.com/80' }} style={styles.pickImage} />
                    <View style={styles.pickContent}>
                        <View style={styles.pickHeader}>
                            <Image source={{ uri: 'https://via.placeholder.com/20' }} style={styles.miniAvatar} />
                            <Text style={styles.pickLabel}>ADDED BY VANCE JOY</Text>
                        </View>
                        <Text style={styles.pickTitle}>Latest Single: Clarity</Text>
                        <Text style={styles.pickSubtitle}>Playlist • 12 tracks</Text>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCFCFC',
    },
    headerBackground: {
        height: 300,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        alignItems: 'center',
    },
    navBar: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerContainer: {
        width: 180,
        height: 240, // Creating that abstract overlap look
        borderRadius: 90, // Oval shape
        backgroundColor: '#E5D0B2', // Color from image
        transform: [{ rotate: '-15deg' }, { translateY: 20 }],
        opacity: 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    bannerImage: {
        // Placeholder styling for abstract art
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        paddingHorizontal: 24,
        marginTop: 20,
    },
    artistHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    artistName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    genre: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    followButton: {
        paddingHorizontal: 32,
        paddingVertical: 10,
        borderRadius: 24,
    },
    followButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    statItem: {
        alignItems: 'flex-start',
    },
    statLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 1,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E5E7EB',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    seeAll: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#D946EF',
    },
    tracksList: {

    },
    trackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    trackIndex: {
        width: 20,
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: 'bold',
        marginRight: 12,
    },
    trackImage: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#EEE',
        marginRight: 16,
    },
    trackInfo: {
        flex: 1,
    },
    trackTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    trackAlbum: {
        fontSize: 12,
        color: '#6B7280',
    },
    trackDuration: {
        fontSize: 12,
        color: '#9CA3AF',
        marginRight: 16,
    },
    artistPickCard: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFF',
        borderRadius: 20,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    pickImage: {
        width: 64,
        height: 64,
        borderRadius: 32, // Circle? Or rounded square? Image shows Circle
        backgroundColor: '#EEE',
        marginRight: 16,
    },
    pickContent: {
        justifyContent: 'center',
    },
    pickHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    miniAvatar: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#D1D5DB', // Gold/Bronze
        marginRight: 6,
    },
    pickLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 0.5,
    },
    pickTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    pickSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
});
