import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BlockedVibesScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const blockedUsers = [
        { id: 1, name: '@cool_alex', time: 'BLOCKED 2 DAYS AGO', image: 'https://i.pravatar.cc/150?u=11' },
        { id: 2, name: '@vibe_killer', time: 'BLOCKED 1 WEEK AGO', image: 'https://i.pravatar.cc/150?u=12' },
        { id: 3, name: '@shadow_user', time: 'BLOCKED 1 MONTH AGO', image: 'https://i.pravatar.cc/150?u=13' },
        { id: 4, name: '@not_the_vibe', time: 'BLOCKED 2 MONTHS AGO', image: 'https://i.pravatar.cc/150?u=14' },
    ];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <LinearGradient
                colors={['#FAE8FF', '#F9FAFB']}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Blocked Vibes</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.description}>
                    When you block a vibe, they won't be able to message you, see your profile, or find your posts. They won't be notified that you blocked them.
                </Text>

                <View style={styles.listContainer}>
                    {blockedUsers.map((user) => (
                        <View key={user.id} style={styles.userCard}>
                            <Image source={{ uri: user.image }} style={styles.avatar} />
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{user.name}</Text>
                                <Text style={styles.blockedTime}>{user.time}</Text>
                            </View>
                            <TouchableOpacity style={styles.unblockButton}>
                                <Text style={styles.unblockText}>Unblock</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Footer Safe Space */}
                <View style={styles.footer}>
                    <Shield size={24} color="#9CA3AF" style={{ marginBottom: 8 }} />
                    <Text style={styles.footerText}>SAFE SPACE ENABLED</Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    headerGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    description: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 30,
        textAlign: 'left',
    },
    listContainer: {
        gap: 16,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
        backgroundColor: '#E5E7EB',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 15,
        fontWeight: '800', // Bold/Heavy font
        color: '#1F2937',
        marginBottom: 2,
    },
    blockedTime: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    unblockButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB', // Subtle border as seen in some UI kits, or could be shadow
        // Image shows white button, likely has shadow or border
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    unblockText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1F2937',
    },
    footer: {
        alignItems: 'center',
        marginTop: 60,
        opacity: 0.6,
    },
    footerText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#9CA3AF',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
});

export default BlockedVibesScreen;
