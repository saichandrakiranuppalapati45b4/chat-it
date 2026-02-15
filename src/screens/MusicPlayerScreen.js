import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { ChevronDown, MoreHorizontal, User, Shuffle, SkipBack, Play, SkipForward, Repeat, Heart, Share2, Flame, Sparkles, Pause } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function MusicPlayerScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const [isPlaying, setIsPlaying] = useState(true);

    // Default data if none provided
    const { title = "Midnight City", artist = "M83", album = "Hurry Up, We're Dreaming", cover = "https://via.placeholder.com/300/333/FFF?text=M83" } = route.params || {};

    return (
        <LinearGradient
            colors={['#FFF5FC', '#F3E5F5', '#E1F5FE']}
            style={styles.container}
        >
            <View style={[styles.content, { marginTop: insets.top, paddingBottom: insets.bottom }]}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                        <ChevronDown size={24} color="#1F2937" />
                    </TouchableOpacity>

                    <View style={styles.syncBadge}>
                        <View style={styles.syncDot} />
                        <Text style={styles.syncText}>SYNCING WITH ALEX</Text>
                    </View>

                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('MusicOptions')}>
                        <MoreHorizontal size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                {/* Album Art Section */}
                <View style={styles.albumArtContainer}>
                    <Image source={{ uri: cover }} style={styles.albumArt} />

                    {/* Listening Avatars Bubble */}
                    <View style={styles.listeningBubble}>
                        <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.listenerAvatar} />
                        <View style={styles.moreListenersBadge}>
                            <Text style={styles.moreListenersText}>+3</Text>
                        </View>
                    </View>
                </View>

                {/* Track Info */}
                <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle}>{title}</Text>
                    <Text style={styles.trackSubtitle}>{artist} • {album}</Text>
                </View>

                {/* Waveform Visualization (Mock) */}
                <View style={styles.waveformContainer}>
                    {[...Array(25)].map((_, i) => {
                        // Create a fake waveform pattern
                        const height = Math.max(10, Math.random() * 40 + 10);
                        return (
                            <View
                                key={i}
                                style={[
                                    styles.waveBar,
                                    { height, opacity: i < 10 ? 1 : 0.4 } // Simulated progress
                                ]}
                            />
                        );
                    })}
                </View>

                {/* Progress Bar */}
                <View style={styles.progressSection}>
                    <View style={styles.progressBarBg}>
                        <View style={styles.progressBarFill} />
                    </View>
                    <View style={styles.timeLabels}>
                        <Text style={styles.timeText}>1:42</Text>
                        <Text style={styles.timeText}>4:03</Text>
                    </View>
                </View>

                {/* Playback Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity><Shuffle size={24} color="#9CA3AF" /></TouchableOpacity>

                    <TouchableOpacity><SkipBack size={32} color="#1F2937" /></TouchableOpacity>

                    <TouchableOpacity style={styles.playButton} onPress={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? (
                            <Pause size={32} color="#FFF" fill="#FFF" />
                        ) : (
                            <Play size={32} color="#FFF" fill="#FFF" style={{ marginLeft: 4 }} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity><SkipForward size={32} color="#1F2937" /></TouchableOpacity>

                    <TouchableOpacity><Repeat size={24} color="#9CA3AF" /></TouchableOpacity>
                </View>

                {/* Bottom Reactions */}
                <View style={styles.bottomReactions}>
                    <TouchableOpacity style={styles.reactionButton}>
                        <Flame size={24} color="#F59E0B" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reactionButton}>
                        <Heart size={24} color="#EF4444" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reactionButton}>
                        <Sparkles size={24} color="#FBBF24" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.reactionButton, styles.shareButton]}>
                        <Share2 size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>

            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-between', // Distribute space evenly
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
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
    syncBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F3E8FF',
    },
    syncDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D946EF',
        marginRight: 8,
    },
    syncText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1F2937',
        letterSpacing: 0.5,
    },

    // Album Art
    albumArtContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        position: 'relative',
        shadowColor: '#C623FA', // Glow effect
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    albumArt: {
        width: width * 0.7,
        height: width * 0.7, // Square
        borderRadius: 24,
        backgroundColor: '#DDD',
    },
    listeningBubble: {
        position: 'absolute',
        bottom: -10,
        right: 10,
        flexDirection: 'row',
    },
    listenerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#FFF',
    },
    moreListenersBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#111827',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
        marginLeft: -15, // Overlap
    },
    moreListenersText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 10,
    },

    // Track Info
    trackInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    trackTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 6,
        textAlign: 'center',
    },
    trackSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
    },

    // Waveform
    waveformContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginBottom: 10,
    },
    waveBar: {
        width: 3,
        backgroundColor: '#C623FA', // Using the app's purple theme
        marginHorizontal: 2,
        borderRadius: 2,
    },

    // Progress
    progressSection: {
        marginBottom: 20,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 2,
        marginBottom: 8,
    },
    progressBarFill: {
        width: '35%',
        height: '100%',
        backgroundColor: '#C623FA', // Matching purple
        borderRadius: 2,
    },
    timeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        fontSize: 10,
        color: '#9CA3AF',
        fontWeight: '600',
    },

    // Controls
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30, // Tighter controls
        marginBottom: 30,
    },
    playButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#D946EF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#D946EF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },

    // Bottom Reactions
    bottomReactions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingVertical: 12, // Compact
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 10,
    },
    reactionButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    shareButton: {
        backgroundColor: '#F3F4F6',
    },
});
