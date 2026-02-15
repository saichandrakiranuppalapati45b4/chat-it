import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, ChevronRight, User } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

const ProfilesScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [linkedAccounts, setLinkedAccounts] = useState([]);
    const [syncProfile, setSyncProfile] = useState(true);
    const [crossAppMessaging, setCrossAppMessaging] = useState(false);

    useEffect(() => {
        fetchLinkedAccounts();
    }, []);

    const fetchLinkedAccounts = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('linked_accounts')
                .select('*')
                .eq('user_id', user.id);

            if (error) throw error;
            setLinkedAccounts(data || []);

            // Mocking initial sync state for now or fetching from privacy_settings if we added it there
            // setSyncProfile(user_prefs.sync_profile);
        } catch (error) {
            console.error('Error fetching profiles:', error);
            // Fallback for demo if no table yet
            setLinkedAccounts([
                { id: '1', platform_username: 'alex_vibe_99', platform: 'Chat It, Vibe Lab', is_synced: true, badge: '⚡', color: '#D946EF' },
                { id: '2', platform_username: 'alex.studio', platform: 'SoundScape', is_synced: true, badge: '❄️', color: '#3B82F6' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const addAccount = () => {
        Alert.alert('Add Account', 'This would open an OAuth flow to link a new account.');
    };

    const ProfileItem = ({ name, subtext, avatarColor, badgeIcon, badgeColor }) => (
        <TouchableOpacity style={styles.profileItem}>
            <View style={styles.avatarContainer}>
                <View style={[styles.avatarPlaceholder, { backgroundColor: avatarColor || '#D69E79' }]}>
                    <User size={24} color="#FFF" />
                </View>
                <View style={styles.badge}>
                    <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeIcon}</Text>
                </View>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.profileName}>{name}</Text>
                <Text style={styles.profileSubtext}>{subtext}</Text>
            </View>
            <ChevronRight size={20} color="#E5E7EB" />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#D946EF" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profiles</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>Your Connected Accounts</Text>
                    <Text style={styles.subtitle}>
                        Manage your identities across Chat It and the Vibe Network.
                    </Text>
                </View>

                {/* Profiles Card */}
                <View style={styles.card}>
                    {linkedAccounts.length === 0 ? (
                        <Text style={{ padding: 20, textAlign: 'center', color: '#6B7280' }}>No linked accounts found.</Text>
                    ) : (
                        linkedAccounts.map((account, index) => (
                            <React.Fragment key={account.id}>
                                <ProfileItem
                                    name={account.platform_username}
                                    subtext={account.platform}
                                    avatarColor={account.color || '#D69E79'}
                                    badgeIcon={account.badge || '🔗'}
                                    badgeColor={account.color || '#D946EF'}
                                />
                                {index < linkedAccounts.length - 1 && <View style={styles.divider} />}
                            </React.Fragment>
                        ))
                    )}

                    {linkedAccounts.length > 0 && <View style={styles.divider} />}

                    <TouchableOpacity style={styles.addAccountRow} onPress={addAccount}>
                        <View style={styles.addIconContainer}>
                            <Plus size={20} color="#D946EF" />
                        </View>
                        <Text style={styles.addAccountText}>Add account</Text>
                    </TouchableOpacity>
                </View>

                {/* Syncing Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>MANAGE SYNCING</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.toggleRow}>
                        <View style={{ flex: 1, marginRight: 16 }}>
                            <Text style={styles.toggleTitle}>Sync Profile Info</Text>
                            <Text style={styles.toggleSubtitle}>
                                Automatically update your photo and name across all connected profiles.
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#E5E7EB', true: '#D946EF' }}
                            thumbColor={'#FFF'}
                            ios_backgroundColor="#E5E7EB"
                            onValueChange={setSyncProfile}
                            value={syncProfile}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.toggleRow}>
                        <View style={{ flex: 1, marginRight: 16 }}>
                            <Text style={styles.toggleTitle}>Cross-App Messaging</Text>
                            <Text style={styles.toggleSubtitle}>
                                Receive notifications from all platforms in your Chat It inbox.
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#E5E7EB', true: '#D946EF' }}
                            thumbColor={'#FFF'}
                            ios_backgroundColor="#E5E7EB"
                            onValueChange={setCrossAppMessaging}
                            value={crossAppMessaging}
                        />
                    </View>
                </View>

                {/* Info Note */}
                <View style={styles.noteContainer}>
                    <Text style={styles.noteText}>
                        Note: Removing an account will unsync all shared data and preferences immediately.
                    </Text>
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
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    titleContainer: {
        marginBottom: 24,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 1,
        marginBottom: 24,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    badgeText: {
        fontSize: 12,
    },
    textContainer: {
        flex: 1,
    },
    profileName: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1F2937',
    },
    profileSubtext: {
        fontSize: 13,
        color: '#6B7280',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 12,
    },
    addAccountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    addIconContainer: {
        width: 48,
        height: 48, // Keeping height consistent with avatars for alignment
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB', // Dashed border simulated with solid for now, or use dashed
        borderStyle: 'dashed',
        marginRight: 16,
    },
    addAccountText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#D946EF',
    },
    sectionHeader: {
        marginBottom: 12,
        marginLeft: 4,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#9CA3AF',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    toggleTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 4,
    },
    toggleSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
    },
    noteContainer: {
        backgroundColor: '#FDF4FF', // Light pink/purple bg
        borderRadius: 16,
        padding: 16,
        marginTop: 8,
    },
    noteText: {
        fontSize: 12,
        color: '#D946EF',
        fontWeight: '600',
        lineHeight: 18,
        textAlign: 'center',
    },
});

export default ProfilesScreen;
