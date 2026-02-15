import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Music, Gamepad2, CheckCheck, MessageSquare, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ChatInteractionScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [musicSync, setMusicSync] = useState('Everyone'); // Everyone, Friends, No one
    const [gameChallenges, setGameChallenges] = useState(true);
    const [readReceipts, setReadReceipts] = useState(true);
    const [typingIndicators, setTypingIndicators] = useState(true);

    const SyncOption = ({ label, value }) => (
        <TouchableOpacity
            style={[
                styles.syncOption,
                musicSync === value && styles.syncOptionActive
            ]}
            onPress={() => setMusicSync(value)}
        >
            <Text style={[
                styles.syncOptionText,
                musicSync === value && styles.syncOptionTextActive
            ]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chat & Interaction</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>Vibe Privacy</Text>
                    <Text style={styles.subtitle}>
                        Manage how you interact and share moments with others.
                    </Text>
                </View>

                {/* Social Invites Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>SOCIAL INVITES</Text>

                    <View style={styles.card}>
                        {/* Music Sync Invites */}
                        <View style={styles.cardItem}>
                            <View style={[styles.iconBox, { backgroundColor: '#FAE8FF' }]}>
                                <Music size={20} color="#D946EF" />
                            </View>
                            <Text style={styles.cardLabel}>Music Sync Invites</Text>
                        </View>

                        <View style={styles.segmentControl}>
                            <SyncOption label="Everyone" value="Everyone" />
                            <SyncOption label="Friends" value="Friends" />
                            <SyncOption label="No one" value="No one" />
                        </View>

                        <View style={styles.divider} />

                        {/* Game Challenges */}
                        <View style={styles.cardItemRow}>
                            <View style={styles.rowLeft}>
                                <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                                    <Gamepad2 size={20} color="#3B82F6" />
                                </View>
                                <View>
                                    <Text style={styles.cardLabel}>Game Challenges</Text>
                                    <Text style={styles.cardSubLabel}>Allow friends to challenge you</Text>
                                </View>
                            </View>
                            <Switch
                                trackColor={{ false: '#E5E7EB', true: '#D946EF' }}
                                thumbColor={'#FFF'}
                                ios_backgroundColor="#E5E7EB"
                                onValueChange={setGameChallenges}
                                value={gameChallenges}
                            />
                        </View>
                    </View>
                </View>

                {/* Messaging Vibes Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>MESSAGING VIBES</Text>

                    <View style={styles.card}>
                        {/* Read Receipts */}
                        <View style={styles.cardItemRow}>
                            <View style={styles.rowLeft}>
                                <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                                    <CheckCheck size={20} color="#10B981" />
                                </View>
                                <View>
                                    <Text style={styles.cardLabel}>Read Receipts</Text>
                                    <Text style={styles.cardSubLabel}>Others see when you've read a chat</Text>
                                </View>
                            </View>
                            <Switch
                                trackColor={{ false: '#E5E7EB', true: '#D946EF' }}
                                thumbColor={'#FFF'}
                                ios_backgroundColor="#E5E7EB"
                                onValueChange={setReadReceipts}
                                value={readReceipts}
                            />
                        </View>

                        <View style={styles.divider} />

                        {/* Typing Indicators */}
                        <View style={[styles.cardItemRow, { borderBottomWidth: 0 }]}>
                            <View style={styles.rowLeft}>
                                <View style={[styles.iconBox, { backgroundColor: '#FFEDD5' }]}>
                                    <MessageSquare size={20} color="#F97316" />
                                </View>
                                <View>
                                    <Text style={styles.cardLabel}>Typing Indicators</Text>
                                    <Text style={styles.cardSubLabel}>Show when you're typing</Text>
                                </View>
                            </View>
                            <Switch
                                trackColor={{ false: '#E5E7EB', true: '#D946EF' }}
                                thumbColor={'#FFF'}
                                ios_backgroundColor="#E5E7EB"
                                onValueChange={setTypingIndicators}
                                value={typingIndicators}
                            />
                        </View>
                    </View>
                </View>

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Info size={20} color="#D946EF" style={{ marginTop: 2, marginRight: 12 }} />
                    <Text style={styles.infoText}>
                        These settings help us tailor your social experience. For a deeper dive into data usage, check our <Text style={{ color: '#D946EF', fontWeight: '700' }}>Privacy Portal</Text>.
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
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 11,
        fontWeight: '800',
        color: '#9CA3AF',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 12,
        marginLeft: 4,
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
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    cardSubLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 2,
    },
    segmentControl: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 4,
        marginBottom: 8,
    },
    syncOption: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    syncOptionActive: {
        backgroundColor: '#FAE8FF', // Light purple bg
        borderWidth: 1,
        borderColor: '#F0ABFC', // Purple border
    },
    syncOptionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    syncOptionTextActive: {
        color: '#D946EF',
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 16,
    },
    cardItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#FDF4FF', // Very light purple
        borderRadius: 20,
        padding: 16,
        alignItems: 'flex-start',
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#374151',
        lineHeight: 18,
    },
});

export default ChatInteractionScreen;
