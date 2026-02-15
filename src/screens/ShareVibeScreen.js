import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Pressable } from 'react-native';
import { Link, Instagram, Share2, Copy } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ShareVibeScreen({ navigation }) {
    const RECENT_CHATS = [
        { id: '1', name: 'Alex', image: 'https://via.placeholder.com/50', color: '#60A5FA' }, // Blue ring
        { id: '2', name: 'Sarah', image: 'https://via.placeholder.com/50', color: undefined },
        { id: '3', name: 'Jordan', image: 'https://via.placeholder.com/50', color: undefined },
        { id: '4', name: 'Ben', image: 'https://via.placeholder.com/50', color: undefined },
    ];

    return (
        <View style={styles.container}>
            {/* Transparent backdrop to close modal */}
            <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

            {/* Bottom Sheet Content */}
            <View style={styles.sheetContainer}>
                {/* Handle Bar */}
                <View style={styles.handleBarContainer}>
                    <View style={styles.handleBar} />
                </View>

                <Text style={styles.title}>Share Vibe</Text>

                {/* Recent Chats */}
                <Text style={styles.sectionLabel}>RECENT CHATS</Text>
                <View style={styles.recentChatsContainer}>
                    {RECENT_CHATS.map((chat) => (
                        <TouchableOpacity key={chat.id} style={styles.chatItem}>
                            <View style={[styles.avatarContainer, chat.color && { borderColor: chat.color, borderWidth: 2 }]}>
                                <Image source={{ uri: chat.image }} style={styles.avatar} />
                            </View>
                            <Text style={styles.chatName}>{chat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Social Share Options */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialItem}>
                        <LinearGradient
                            colors={['#833AB4', '#FD1D1D', '#FCAF45']}
                            style={styles.socialIcon}
                        >
                            <Instagram size={24} color="#FFF" />
                        </LinearGradient>
                        <Text style={styles.socialLabel}>Stories</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialItem}>
                        <View style={[styles.socialIcon, { backgroundColor: '#FFFC00' }]}>
                            {/* Snapchat ghost icon simulation or basic placeholder since lucide doesn't have snapchat */}
                            <View style={styles.ghostIcon} />
                        </View>
                        <Text style={styles.socialLabel}>Snapchat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialItem}>
                        <View style={[styles.socialIcon, { backgroundColor: '#000' }]}>
                            {/* TikTok note icon simulation */}
                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>♪</Text>
                        </View>
                        <Text style={styles.socialLabel}>TikTok</Text>
                    </TouchableOpacity>
                </View>

                {/* Copy Link Button */}
                <TouchableOpacity style={styles.copyButton}>
                    <Link size={20} color="#22D3EE" style={{ marginRight: 8 }} />
                    <Text style={styles.copyButtonText}>Copy Link</Text>
                </TouchableOpacity>

                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)', // Darker dimming
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    sheetContainer: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 16,
    },
    handleBarContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    handleBar: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 1,
        marginBottom: 16,
    },
    recentChatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        paddingHorizontal: 8,
    },
    chatItem: {
        alignItems: 'center',
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        padding: 2, // inner padding for border effect
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 28,
    },
    chatName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Changed to space-around for better centering matching image
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    socialItem: {
        alignItems: 'center',
    },
    socialIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    socialLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937',
    },
    ghostIcon: {
        width: 24,
        height: 24,
        backgroundColor: '#FFF',
        borderRadius: 12, // simplified ghost
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    copyButton: {
        backgroundColor: '#111827', // Black
        borderRadius: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    copyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
});
