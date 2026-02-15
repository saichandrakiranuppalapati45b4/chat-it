import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { ArrowLeft, MoreVertical, Link, Play, Heart, Plus, Smile, Flame, PartyPopper, Music } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function ChatDetailScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { name, avatar, isOnline } = route.params || { name: 'Sarah J.', avatar: 'https://via.placeholder.com/100', isOnline: true };
    const [message, setMessage] = useState('');

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>

                <View style={styles.headerContent}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                        {/* Story/Online Ring */}
                        <View style={styles.onlineRing} />
                    </View>
                    <View>
                        <Text style={styles.headerName}>{name}</Text>
                        <Text style={styles.headerStatus}>● Tuning Together</Text>
                    </View>
                </View>

                <TouchableOpacity>
                    <MoreVertical size={24} color="#C623FA" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Music Player Card */}
                <LinearGradient
                    colors={['#FFF', '#F3E5F5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.musicCard}
                >
                    <View style={styles.musicRow}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/150' }}
                            style={styles.albumArt}
                        />
                        {/* Fake Audio Wave */}
                        <View style={styles.waveOverlay}>
                            {/* In a real app, use Lottie or svg for wave animation */}
                        </View>
                        <View style={styles.musicInfo}>
                            <Text style={styles.songTitle}>Midnight City</Text>
                            <Text style={styles.artistName}>M83 • Hurry Up, We're Dreaming</Text>

                            {/* Progress Bar Mockup */}
                            <View style={styles.progressBarContainer}>
                                <View style={styles.progressBarFill} />
                                <View style={styles.progressKnob} />
                            </View>
                            <View style={styles.timeRow}>
                                <Text style={styles.timeText}>1:42</Text>
                                <Text style={styles.timeText}>4:03</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.linkButton}>
                            <Link size={16} color="#C623FA" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* Date Separator */}
                <View style={styles.dateSeparator}>
                    <Text style={styles.dateText}>Today 9:30 PM</Text>
                </View>

                {/* System Message */}
                <View style={styles.systemMessage}>
                    <Music size={16} color="#C623FA" style={{ marginRight: 8 }} />
                    <Text style={styles.systemMessageText}>{name} started a Tune Together session</Text>
                </View>

                {/* Incoming Message */}
                <View style={styles.messageContainer}>
                    <Image source={{ uri: avatar }} style={styles.messageAvatar} />
                    <View style={styles.incomingBubble}>
                        <Text style={styles.incomingText}>Have you heard this new remix? It's absolute fire 🔥</Text>
                    </View>
                </View>

                {/* Outgoing Message */}
                <View style={[styles.messageContainer, { justifyContent: 'flex-end' }]}>
                    <LinearGradient
                        colors={['#D946EF', '#C026D3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.outgoingBubble}
                    >
                        <Text style={styles.outgoingText}>Wait, I haven't! Let's listen.</Text>
                    </LinearGradient>
                    <Image source={{ uri: 'https://via.placeholder.com/100' }} style={[styles.messageAvatar, { marginLeft: 8, marginRight: 0 }]} />
                </View>

                {/* Incoming Message 2 */}
                <View style={styles.messageContainer}>
                    <Image source={{ uri: avatar }} style={styles.messageAvatar} />
                    <View style={styles.incomingBubble}>
                        <Text style={styles.incomingText}>The sax solo coming up is crazy 🎷</Text>
                    </View>
                </View>
                <Text style={styles.seenText}>Seen just now</Text>

                {/* Floating Reactions */}
                <View style={styles.floatingReactions}>
                    <Text style={{ fontSize: 24 }}>🔥</Text>
                    <Text style={{ fontSize: 24, marginLeft: 200, marginTop: 10 }}>💜</Text>
                </View>

                {/* Decorative */}
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Music size={32} color="#9CA3AF" />
                        <Text style={{ fontSize: 24 }}>✨</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Input Area */}
            <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 10 }]}>
                <TouchableOpacity style={styles.plusButton}>
                    <Plus size={24} color="#C623FA" />
                </TouchableOpacity>

                <View style={styles.textInputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Send a message..."
                        placeholderTextColor="#9CA3AF"
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity>
                        <Smile size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.heartButton}>
                    <Heart size={24} color="#FFF" fill="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={[styles.quickReactions, { bottom: insets.bottom + 80 }]}>
                <Text style={styles.quickReactionEmoji}>🔥</Text>
                <Text style={styles.quickReactionEmoji}>💃</Text>
                <Text style={styles.quickReactionEmoji}>🤯</Text>
                <Text style={styles.quickReactionEmoji}>🙌</Text>
            </View>
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
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    onlineRing: {
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: '#C623FA',
    },
    headerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerStatus: {
        fontSize: 12,
        color: '#C623FA',
        fontWeight: '500',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    musicCard: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#C623FA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    musicRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    albumArt: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#000',
    },
    musicInfo: {
        flex: 1,
        marginLeft: 12,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    artistName: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
    },
    progressBarContainer: {
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        marginBottom: 4,
        position: 'relative',
    },
    progressBarFill: {
        width: '40%',
        height: '100%',
        backgroundColor: '#06B6D4', // Cyan color from design
        borderRadius: 2,
    },
    progressKnob: {
        position: 'absolute',
        left: '40%',
        top: -2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#06B6D4',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        fontSize: 10,
        color: '#9CA3AF',
    },
    linkButton: {
        padding: 8,
        backgroundColor: '#F3E5F5',
        borderRadius: 12,
        marginLeft: 8,
        alignSelf: 'flex-start',
    },
    dateSeparator: {
        alignItems: 'center',
        marginBottom: 16,
    },
    dateText: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
        color: '#6B7280',
    },
    systemMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 16,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#F3E5F5',
    },
    systemMessageText: {
        fontSize: 12,
        color: '#C623FA',
        fontWeight: '600',
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-end',
    },
    messageAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    incomingBubble: {
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 20,
        borderBottomLeftRadius: 4,
        maxWidth: '75%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    incomingText: {
        fontSize: 15,
        color: '#1F2937',
        lineHeight: 22,
    },
    outgoingBubble: {
        padding: 12,
        borderRadius: 20,
        borderBottomRightRadius: 4,
        maxWidth: '75%',
    },
    outgoingText: {
        fontSize: 15,
        color: '#FFF',
        fontWeight: '500',
    },
    seenText: {
        fontSize: 10,
        color: '#9CA3AF',
        marginLeft: 50,
        marginBottom: 8,
    },
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    plusButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    textInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        paddingHorizontal: 16,
        height: 48,
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    heartButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#C623FA',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#C623FA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    quickReactions: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    quickReactionEmoji: {
        fontSize: 24,
    },
    floatingReactions: {
        marginTop: 20,
        marginBottom: 40,
    }
});
