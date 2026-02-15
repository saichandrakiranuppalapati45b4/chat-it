import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { ArrowLeft, Bell, MessageSquare, Heart, UserPlus, Zap, Star } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    // State for toggles
    const [pauseAll, setPauseAll] = useState(false);
    const [messages, setMessages] = useState(true);
    const [vibes, setVibes] = useState(true);
    const [newFollowers, setNewFollowers] = useState(true);
    const [syncs, setSyncs] = useState(true);
    const [tips, setTips] = useState(false);

    const ToggleItem = ({ icon: Icon, iconColor, label, value, onValueChange, description }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
                    <Icon size={20} color={iconColor} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.itemLabel}>{label}</Text>
                    {description && <Text style={styles.itemDescription}>{description}</Text>}
                </View>
            </View>
            <Switch
                trackColor={{ false: '#E5E7EB', true: '#D946EF' }}
                thumbColor={'#FFF'}
                ios_backgroundColor="#E5E7EB"
                onValueChange={onValueChange}
                value={value}
                disabled={pauseAll && label !== 'Pause All'}
            />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Master Switch */}
                <View style={styles.section}>
                    <ToggleItem
                        icon={Bell}
                        iconColor="#F59E0B"
                        label="Pause All"
                        description="Temporarily pause all notifications"
                        value={pauseAll}
                        onValueChange={setPauseAll}
                    />
                </View>

                <Text style={styles.sectionHeader}>ACTIVITY</Text>
                <View style={styles.section}>
                    <ToggleItem
                        icon={MessageSquare}
                        iconColor="#3B82F6"
                        label="Direct Messages"
                        value={messages}
                        onValueChange={setMessages}
                    />
                    <View style={styles.divider} />
                    <ToggleItem
                        icon={Heart}
                        iconColor="#EF4444"
                        label="Vibe Likes & Comments"
                        value={vibes}
                        onValueChange={setVibes}
                    />
                    <View style={styles.divider} />
                    <ToggleItem
                        icon={UserPlus}
                        iconColor="#10B981"
                        label="New Followers"
                        value={newFollowers}
                        onValueChange={setNewFollowers}
                    />
                    <View style={styles.divider} />
                    <ToggleItem
                        icon={Zap}
                        iconColor="#8B5CF6"
                        label="Sync Matches"
                        description="When you sync with someone"
                        value={syncs}
                        onValueChange={setSyncs}
                    />
                </View>

                <Text style={styles.sectionHeader}>FROM CHAT IT</Text>
                <View style={styles.section}>
                    <ToggleItem
                        icon={Star}
                        iconColor="#F59E0B"
                        label="News & Updates"
                        description="Latest features and app tips"
                        value={tips}
                        onValueChange={setTips}
                    />
                </View>

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
        paddingBottom: 16,
        backgroundColor: '#F9FAFB',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        marginTop: 24,
        marginBottom: 12,
        marginLeft: 4,
        letterSpacing: 0.8,
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    itemLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    itemDescription: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 62, // Align with text start
    },
});
