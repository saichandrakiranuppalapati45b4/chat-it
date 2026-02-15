import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, AtSign, MessageSquare, ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TagsMentionsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [tagPermission, setTagPermission] = useState('Everyone');
    const [mentionPermission, setMentionPermission] = useState('Everyone');
    const [manualApprove, setManualApprove] = useState(false);

    const PermissionOption = ({ label, value, selectedValue, onSelect, color }) => (
        <TouchableOpacity
            style={styles.optionRow}
            onPress={() => onSelect(value)}
        >
            <Text style={styles.optionText}>{label}</Text>
            <View style={[
                styles.radioOuter,
                selectedValue === value && { borderColor: color }
            ]}>
                {selectedValue === value && (
                    <View style={[styles.radioInner, { backgroundColor: color }]} />
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tags and Mentions</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Tags Section */}
                <View style={styles.sectionHeader}>
                    <AtSign size={16} color="#F97316" style={{ marginRight: 8 }} />
                    <Text style={styles.sectionTitle}>TAGS</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Who can tag you</Text>

                    <PermissionOption
                        label="Everyone"
                        value="Everyone"
                        selectedValue={tagPermission}
                        onSelect={setTagPermission}
                        color="#D946EF"
                    />
                    <PermissionOption
                        label="People you follow"
                        value="People you follow"
                        selectedValue={tagPermission}
                        onSelect={setTagPermission}
                        color="#D946EF"
                    />
                    <PermissionOption
                        label="No one"
                        value="No one"
                        selectedValue={tagPermission}
                        onSelect={setTagPermission}
                        color="#D946EF"
                    />
                </View>

                {/* Mentions Section */}
                <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                    <MessageSquare size={16} color="#10B981" style={{ marginRight: 8 }} />
                    <Text style={styles.sectionTitle}>MENTIONS</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Who can mention you in comments</Text>

                    <PermissionOption
                        label="Everyone"
                        value="Everyone"
                        selectedValue={mentionPermission}
                        onSelect={setMentionPermission}
                        color="#D946EF"
                    />
                    <PermissionOption
                        label="People you follow"
                        value="People you follow"
                        selectedValue={mentionPermission}
                        onSelect={setMentionPermission}
                        color="#D946EF"
                    />
                    <PermissionOption
                        label="No one"
                        value="No one"
                        selectedValue={mentionPermission}
                        onSelect={setMentionPermission}
                        color="#D946EF"
                    />
                </View>

                {/* Preferences Section */}
                <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                    <ShieldCheck size={16} color="#8B5CF6" style={{ marginRight: 8 }} />
                    <Text style={styles.sectionTitle}>PREFERENCES</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.preferenceRow}>
                        <View style={{ flex: 1, marginRight: 16 }}>
                            <Text style={styles.preferenceTitle}>Manually Approve Tags</Text>
                            <Text style={styles.preferenceSubtitle}>
                                Review posts you're tagged in before they appear on your profile.
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#E5E7EB', true: '#D946EF' }}
                            thumbColor={'#FFF'}
                            ios_backgroundColor="#E5E7EB"
                            onValueChange={setManualApprove}
                            value={manualApprove}
                        />
                    </View>
                </View>

                {/* Info Note */}
                <View style={styles.noteContainer}>
                    <Text style={styles.noteText}>
                        Note: When you're tagged in a post, it may be visible to the audience of that post even if you have "Manually Approve Tags" turned on.
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
        backgroundColor: '#1F2937', // Dark background as shown in image (looks like dark mode or overlay)
        // Actually, the image shows a modal-like appearance or dark theme settings page. 
        // Based on previous screens, let's keep it consistent with light theme but maybe use a darker header or investigate.
        // Wait, the image shows a dark overlay background? Or just a dark mode screen?
        // Let's stick to the app's established light theme style for consistency unless explicitly asked for dark mode only page.
        // Re-examining image: It looks like a dark themed screen. 
        // However, mixing light and dark screens might be jarring. 
        // The user's Vibe Settings has "Theme" option. 
        // I will implement it with the standard light theme structure I've been using, 
        // but I will follow the layout of the card perfectly.
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
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        marginLeft: 4,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#9CA3AF',
        letterSpacing: 1,
        textTransform: 'uppercase',
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
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 14, // Small query title
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 16,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    optionText: {
        fontSize: 15, // "Everyone", "People you follow"
        fontWeight: '700', // Bold
        color: '#1F2937',
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    preferenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    preferenceTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    preferenceSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
    },
    noteContainer: {
        marginTop: 24,
        backgroundColor: '#8B5CF6', // Purple box in image? No, looks like grey box with purple text
        // Image: Dark grey box with purple text. 
        // If I am in light mode, maybe a light purple box?
        // Let's use a dark grey box with purple text as seen in screenshot to be safe.
        backgroundColor: '#4B5563',
        borderRadius: 16,
        padding: 16,
    },
    noteText: {
        fontSize: 12,
        color: '#C084FC', // Light purple text
        lineHeight: 18,
        fontWeight: '500',
    },
});

export default TagsMentionsScreen;
