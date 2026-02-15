import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Image, Dimensions } from 'react-native';
import { ChevronLeft, Plus, ChevronRight, Music, Gamepad2, Sun, Car, ListMusic } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const PLAYLISTS = [
    { id: '1', title: 'Late Night Vibes', tracks: '42 tracks', icon: Music, color: '#1F2937' },
    { id: '2', title: 'Summer Sync ☀️', tracks: '128 tracks', icon: Sun, color: undefined, image: 'https://via.placeholder.com/50' }, // Use image if available
    { id: '3', title: 'Gaming Mode', tracks: '15 tracks', icon: Gamepad2, color: '#1F2937' },
    { id: '4', title: 'Road Trip Classics', tracks: '89 tracks', icon: Car, color: '#374151' },
    { id: '5', title: 'Daily Mix 1', tracks: '50 tracks', icon: ListMusic, color: '#E5E7EB', iconColor: '#6B7280' },
];

export default function AddToPlaylistScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');

    const renderPlaylist = ({ item }) => (
        <TouchableOpacity style={styles.playlistCard}>
            <View style={styles.playlistIconContainer}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.playlistImage} />
                ) : (
                    <View style={[styles.playlistIconPlaceholder, { backgroundColor: item.color || '#E5E7EB' }]}>
                        <item.icon size={24} color={item.iconColor || '#FFF'} />
                    </View>
                )}
            </View>
            <View style={styles.playlistInfo}>
                <Text style={styles.playlistTitle}>{item.title}</Text>
                <Text style={styles.playlistTracks}>{item.tracks}</Text>
            </View>
            <ChevronRight size={20} color="#D1D5DB" />
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={['#FFF5FC', '#F3E5F5', '#E1F5FE']}
            style={styles.container}
        >
            <View style={[styles.content, { marginTop: insets.top, paddingBottom: insets.bottom }]}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                        <ChevronLeft size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add to Playlist</Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* Create New Playlist Card */}
                <TouchableOpacity style={styles.createCard}>
                    <LinearGradient
                        colors={['#A855F7', '#3B82F6']}
                        style={styles.createIconContainer}
                    >
                        <Plus size={24} color="#FFF" />
                    </LinearGradient>
                    <View style={styles.createInfo}>
                        <Text style={styles.createTitle}>Create New Playlist</Text>
                        <Text style={styles.createSubtitle}>START A NEW VIBE</Text>
                    </View>
                </TouchableOpacity>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search your playlists..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Playlists List */}
                <FlatList
                    data={PLAYLISTS}
                    renderItem={renderPlaylist}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />

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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        marginBottom: 10,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    createCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    createIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    createInfo: {
        flex: 1,
    },
    createTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    createSubtitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 1,
    },
    searchContainer: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 14,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    searchInput: {
        fontSize: 14,
        color: '#1F2937',
    },
    listContent: {
        paddingBottom: 20,
    },
    playlistCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    playlistIconContainer: {
        marginRight: 16,
    },
    playlistImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    playlistIconPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playlistInfo: {
        flex: 1,
    },
    playlistTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    playlistTracks: {
        fontSize: 12,
        color: '#6B7280',
    },
});
