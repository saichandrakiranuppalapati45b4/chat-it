import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, Platform } from 'react-native';
import { Bell, Search, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Home, Gamepad2, Headphones, User, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock Data
const STORIES = [
    { id: '1', user: 'My Story', image: 'https://via.placeholder.com/100', isUser: true },
    { id: '2', user: 'Liam_99', image: 'https://via.placeholder.com/100' },
    { id: '3', user: 'SarahJ', image: 'https://via.placeholder.com/100' },
    { id: '4', user: 'TechnoKing', image: 'https://via.placeholder.com/100' },
    { id: '5', user: 'Maya', image: 'https://via.placeholder.com/100' },
];

const POSTS = [
    {
        id: '1',
        user: 'TechnoTess',
        userAvatar: 'https://via.placeholder.com/50',
        content: 'https://via.placeholder.com/400x500/004d40/ffffff?text=Post+Content',
        caption: 'The vibe last night was absolutely unreal! 🎆 Can\'t wait for the next drop. #music #concert #vibes',
        likes: '1,245',
        comments: '86',
        time: '2 HOURS AGO',
        status: 'Listening to Midnight City',
        statusIcon: Headphones,
        isLive: true
    },
    {
        id: '2',
        user: 'GamerKai',
        userAvatar: 'https://via.placeholder.com/50',
        content: 'https://via.placeholder.com/400x400/e0f2f1/000000?text=New+Setup',
        caption: 'New setup finally complete. Rate it 1-10! 👇',
        likes: '342',
        comments: '24',
        time: '5 HOURS AGO',
        status: 'Playing Pixel Jump',
        statusIcon: Gamepad2,
    }
];

export default function HomeScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    const renderStory = ({ item }) => (
        <View style={styles.storyContainer}>
            <View style={[styles.storyRing, item.isUser ? styles.noRing : null]}>
                <Image source={{ uri: item.image }} style={styles.storyImage} />
                {item.isUser && (
                    <View style={styles.addStoryButton}>
                        <Plus size={12} color="#FFF" />
                    </View>
                )}
            </View>
            <Text style={styles.storyUser} numberOfLines={1}>{item.user}</Text>
        </View>
    );

    const renderPost = ({ item }) => (
        <View style={styles.postContainer}>
            {/* Header */}
            <View style={styles.postHeader}>
                <View style={styles.postHeaderLeft}>
                    <Image source={{ uri: item.userAvatar }} style={styles.postAvatar} />
                    <View>
                        <Text style={styles.postUsername}>{item.user}</Text>
                        {item.status && (
                            <View style={styles.statusContainer}>
                                {item.statusIcon && <item.statusIcon size={12} color="#C623FA" style={{ marginRight: 4 }} />}
                                <Text style={styles.statusText}>{item.status}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <MoreHorizontal size={24} color="#6B7280" />
            </View>

            {/* Content */}
            <View style={styles.postContentContainer}>
                <Image source={{ uri: item.content }} style={styles.postImage} />
                {item.isLive && (
                    <View style={styles.liveTag}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>Live Now</Text>
                    </View>
                )}
            </View>

            {/* Actions */}
            <View style={styles.actionContainer}>
                <View style={styles.actionLeft}>
                    <TouchableOpacity style={styles.actionButton}><Heart size={26} color="#1F2937" /></TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}><MessageCircle size={26} color="#1F2937" /></TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}><Send size={26} color="#1F2937" /></TouchableOpacity>
                </View>
                <TouchableOpacity><Bookmark size={26} color="#1F2937" /></TouchableOpacity>
            </View>

            {/* Likes & Caption */}
            <View style={styles.textContainer}>
                <Text style={styles.likesText}>Liked by <Text style={styles.boldText}>Liam_99</Text> and <Text style={styles.boldText}>{item.likes} others</Text></Text>

                <Text style={styles.captionText}>
                    <Text style={styles.boldText}>{item.user} </Text>
                    {item.caption.split(' ').map((word, index) => (
                        word.startsWith('#') ? <Text key={index} style={styles.hashtag}>{word} </Text> : <Text key={index}>{word} </Text>
                    ))}
                </Text>

                <Text style={styles.commentsText}>View all {item.comments} comments</Text>
                <Text style={styles.timeText}>{item.time}</Text>
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
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoIcon}>⚡</Text>
                        <Text style={styles.logoText}>Chat It</Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconButton}><Plus size={24} color="#1F2937" /></TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}><Search size={24} color="#1F2937" /></TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Bell size={24} color="#1F2937" />
                            <View style={styles.notificationDot} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Stories */}
                    <View style={styles.storiesSection}>
                        <FlatList
                            horizontal
                            data={STORIES}
                            renderItem={renderStory}
                            keyExtractor={item => item.id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.storiesList}
                        />
                    </View>

                    {/* Feed */}
                    <View style={styles.feedSection}>
                        {POSTS.map(post => (
                            <View key={post.id}>
                                {renderPost({ item: post })}
                            </View>
                        ))}
                    </View>

                    {/* Spacer for Bottom Nav */}
                    <View style={{ height: 20 }} />
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
        paddingHorizontal: 16,
        paddingTop: 10, // Additional padding below status bar
        paddingBottom: 10,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        fontSize: 24,
        marginRight: 8,
        color: '#C623FA',
        fontWeight: 'bold',
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    headerIcons: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 16,
    },
    notificationDot: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1,
        borderColor: '#FFF',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    storiesSection: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    storiesList: {
        paddingHorizontal: 16,
    },
    storyContainer: {
        alignItems: 'center',
        marginRight: 16,
    },
    storyRing: {
        width: 68,
        height: 68,
        borderRadius: 34,
        borderWidth: 2,
        borderColor: '#C623FA',
        padding: 3,
        marginBottom: 4,
    },
    noRing: {
        borderColor: 'transparent',
        borderStyle: 'dashed', // visual trick or just create a different container
    },
    storyImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        backgroundColor: '#E5E7EB',
    },
    addStoryButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#C623FA',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    storyUser: {
        fontSize: 12,
        color: '#1F2937',
        width: 64,
        textAlign: 'center',
    },
    // Post Styles
    postContainer: {
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 24,
        marginHorizontal: 12,
        paddingBottom: 16,
        marginTop: 12,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    postHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#E5E7EB',
    },
    postUsername: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#1F2937',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 11,
        color: '#C623FA',
        fontWeight: '500',
    },
    postContentContainer: {
        width: '100%',
        height: 400, // Fixed height for aesthetic
        position: 'relative',
    },
    postImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
    liveTag: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
        marginRight: 6,
    },
    liveText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    actionLeft: {
        flexDirection: 'row',
    },
    actionButton: {
        marginRight: 16,
    },
    textContainer: {
        paddingHorizontal: 16,
    },
    likesText: {
        fontSize: 14,
        color: '#1F2937',
        marginBottom: 6,
    },
    boldText: {
        fontWeight: 'bold',
    },
    captionText: {
        fontSize: 14,
        color: '#1F2937',
        lineHeight: 20,
        marginBottom: 6,
    },
    hashtag: {
        color: '#C623FA',
    },
    commentsText: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 4,
    },
    timeText: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 2,
    },
    timeText: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 2,
    },
});
