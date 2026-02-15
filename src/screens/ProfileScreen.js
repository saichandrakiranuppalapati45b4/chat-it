import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Settings, Share, MapPin, Grid, Clapperboard, Bookmark, QrCode, Edit3, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3;

const POSTS = [
    { id: '1', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', pinned: false }, // Cyberpunk City
    { id: '2', image: 'https://images.unsplash.com/photo-1470229722913-7ea995c21128?q=80&w=2074&auto=format&fit=crop', pinned: false }, // Concert
    { id: '3', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop', pinned: false }, // 3D Head
    { id: '4', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2047&auto=format&fit=crop', pinned: false }, // Car Interior
    { id: '5', image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1964&auto=format&fit=crop', pinned: true }, // City Night (Pinned)
    { id: '6', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop', pinned: false }, // Portrait
    { id: '7', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop', pinned: false }, // Tech
    { id: '8', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?q=80&w=1931&auto=format&fit=crop', pinned: false }, // Arcade
    { id: '9', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop', pinned: false }, // Retro
];

export default function ProfileScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('grid'); // 'grid', 'media', 'saved'

    const renderPost = ({ item }) => (
        <TouchableOpacity style={styles.postContainer}>
            <Image source={{ uri: item.image }} style={styles.postImage} />
            {item.pinned && (
                <View style={styles.pinnedTag}>
                    <Text style={styles.pinnedText}>📍 Pinned</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={{ paddingTop: insets.top }}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Share size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>PROFILE</Text>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Settings')}>
                        <Settings size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                {/* Profile Info */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarWrapper}>
                        <LinearGradient
                            colors={['#D946EF', '#8B5CF6', '#22D3EE']}
                            style={styles.avatarRing}
                        >
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop' }}
                                    style={styles.avatar}
                                />
                            </View>
                        </LinearGradient>
                        <View style={styles.statusPill}>
                            <View style={styles.equalizer}>
                                <View style={[styles.bar, { height: 8 }]} />
                                <View style={[styles.bar, { height: 12 }]} />
                                <View style={[styles.bar, { height: 6 }]} />
                            </View>
                            <Text style={styles.statusText}>Listening to Drake</Text>
                            <View style={styles.onlineDot} />
                        </View>
                    </View>

                    <Text style={styles.username}>@cyber_babe_99</Text>
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>Chloe • Level 42</Text>
                        <Text style={styles.rankIcon}>👾</Text>
                    </View>

                    <View style={styles.locationRow}>
                        <MapPin size={14} color="#EF4444" fill="#EF4444" />
                        <Text style={styles.locationText}> NYC | Digital Artist 🎨</Text>
                    </View>

                    <Text style={styles.bio}>Living for the glitches in the matrix.</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>12.5k</Text>
                        <Text style={styles.statLabel}>FOLLOWERS</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>342</Text>
                        <Text style={styles.statLabel}>FOLLOWING</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: '#D946EF' }]}>890k</Text>
                        <Text style={styles.statLabel}>VIBES</Text>
                    </View>
                </View>

                {/* Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.editButton}>
                        <Edit3 size={16} color="#1F2937" style={{ marginRight: 8 }} />
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.qrButton}>
                        <QrCode size={20} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                {/* Tab Bar */}
                <View style={styles.tabBar}>
                    <TouchableOpacity
                        style={[styles.tabItem, activeTab === 'grid' && styles.activeTabItem]}
                        onPress={() => setActiveTab('grid')}
                    >
                        <Grid size={24} color={activeTab === 'grid' ? '#111827' : '#9CA3AF'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabItem, activeTab === 'media' && styles.activeTabItem]}
                        onPress={() => setActiveTab('media')}
                    >
                        <Clapperboard size={24} color={activeTab === 'media' ? '#111827' : '#9CA3AF'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabItem, activeTab === 'saved' && styles.activeTabItem]}
                        onPress={() => setActiveTab('saved')}
                    >
                        <Bookmark size={24} color={activeTab === 'saved' ? '#111827' : '#9CA3AF'} />
                    </TouchableOpacity>
                </View>

                {/* Content Grid */}
                <View style={styles.gridContainer}>
                    <View style={styles.row}>
                        {POSTS.slice(0, 3).map(item => <Image key={item.id} source={{ uri: item.image }} style={styles.gridImage} />)}
                    </View>
                    <View style={styles.row}>
                        {POSTS.slice(3, 6).map(item => (
                            <View key={item.id} style={styles.gridImageContainer}>
                                <Image source={{ uri: item.image }} style={styles.gridImage} />
                                {item.pinned && (
                                    <View style={styles.pinnedBadge}>
                                        <Text style={{ fontSize: 8, fontWeight: 'bold' }}>📍 Pinned</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                    <View style={styles.row}>
                        {POSTS.slice(6, 9).map(item => <Image key={item.id} source={{ uri: item.image }} style={styles.gridImage} />)}
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    iconButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        letterSpacing: 1,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 10,
    },
    avatarWrapper: {
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -16,
        zIndex: 1,
    },
    avatarContainer: {
        width: 112,
        height: 112,
        borderRadius: 56,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 104,
        height: 104,
        borderRadius: 52,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 2,
    },
    equalizer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 12,
        marginRight: 6,
    },
    bar: {
        width: 3,
        backgroundColor: '#D946EF',
        marginHorizontal: 1,
        borderRadius: 1,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937',
        marginRight: 6,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 24,
        marginBottom: 4,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#D946EF',
    },
    rankIcon: {
        fontSize: 14,
        marginLeft: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationText: {
        fontSize: 14,
        color: '#4B5563',
    },
    bio: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
        marginBottom: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 0.5,
    },
    verticalDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#E5E7EB',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 12,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    qrButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tabBar: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTabItem: {
        borderBottomColor: '#D946EF',
    },
    gridContainer: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
    },
    gridImageContainer: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH,
        borderWidth: 1,
        borderColor: '#FFF',
    },
    gridImage: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH,
        borderWidth: 1,
        borderColor: '#FFF',
    },
    pinnedBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: '#FFF',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    }
});
