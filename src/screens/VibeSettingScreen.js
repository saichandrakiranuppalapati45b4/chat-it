import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Moon, Sun, Monitor, Music, Cloud, Play, Gamepad, Info, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const VibeSettingScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [theme, setTheme] = useState('Dark'); // Light, Dark, System
    const [musicService, setMusicService] = useState('Spotify'); // Spotify, Apple, SoundCloud
    const [difficulty, setDifficulty] = useState('Casual'); // Casual, Pro

    const ThemeOption = ({ label, value, icon: Icon }) => (
        <TouchableOpacity
            style={[
                styles.themeOption,
                theme === value && styles.themeOptionActive
            ]}
            onPress={() => setTheme(value)}
        >
            <Text style={[
                styles.themeOptionText,
                theme === value && styles.themeOptionTextActive
            ]}>{label}</Text>
        </TouchableOpacity>
    );

    const MusicServiceOption = ({ label, value, icon: Icon, color }) => (
        <TouchableOpacity
            style={[
                styles.musicOption,
                musicService === value && styles.musicOptionActive
            ]}
            onPress={() => setMusicService(value)}
        >
            <View style={[
                styles.musicIconContainer,
                musicService === value ? { backgroundColor: color } : { backgroundColor: '#F3F4F6' }
            ]}>
                <Icon size={20} color={musicService === value ? '#FFF' : '#9CA3AF'} fill={musicService === value ? '#FFF' : 'none'} />
            </View>
            <Text style={[
                styles.musicOptionText,
                musicService === value && styles.musicOptionTextActive
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
                <Text style={styles.headerTitle}>VIBE SETTINGS</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Intro Card */}
                <View style={styles.introCard}>
                    <Text style={styles.introTitle}>
                        Personalize your <Text style={{ color: '#8B5CF6' }}>Vibe</Text>
                    </Text>
                    <Text style={styles.introSubtitle}>
                        Tailor how Chat It looks and feels. Your vibe, your rules.
                    </Text>
                </View>

                {/* Appearance Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.sectionIcon, { backgroundColor: '#A855F7' }]}>
                            {/* Small dot icon simulation */}
                        </View>
                        <Text style={styles.sectionTitle}>APPEARANCE</Text>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
                                <Moon size={20} color="#A855F7" fill="#A855F7" />
                            </View>
                            <Text style={styles.cardTitle}>Theme</Text>
                        </View>

                        <View style={styles.segmentControl}>
                            <ThemeOption label="Light" value="Light" icon={Sun} />
                            <ThemeOption label="Dark" value="Dark" icon={Moon} />
                            <ThemeOption label="System" value="System" icon={Monitor} />
                        </View>
                    </View>
                </View>

                {/* Audio Experience Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Music size={12} color="#3B82F6" style={{ marginRight: 6 }} />
                        <Text style={styles.sectionTitle}>AUDIO EXPERIENCE</Text>
                    </View>

                    <View style={styles.card}>

                        <TouchableOpacity style={styles.menuItem}>
                            <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                                <Music size={20} color="#2563EB" />
                            </View>
                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuTitle}>Music Service</Text>
                                <Text style={styles.menuSubtitle}>SPOTIFY CONNECTED</Text>
                            </View>
                            <ArrowLeft size={16} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
                        </TouchableOpacity>

                        <View style={styles.musicOptionsRow}>
                            <MusicServiceOption label="Spotify" value="Spotify" icon={Play} color="#1DB954" />
                            <MusicServiceOption label="Apple" value="Apple" icon={Music} color="#FA233B" />
                            <MusicServiceOption label="SoundCloud" value="SoundCloud" icon={Cloud} color="#FF5500" />
                        </View>
                    </View>
                </View>

                {/* Mini-Games Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Gamepad size={12} color="#F97316" style={{ marginRight: 6 }} />
                        <Text style={styles.sectionTitle}>MINI-GAMES</Text>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconBox, { backgroundColor: '#FFEDD5' }]}>
                                <Gamepad size={20} color="#EA580C" />
                            </View>
                            <Text style={styles.cardTitle}>Difficulty Level</Text>
                            <View style={{ flex: 1 }} />
                            <Info size={18} color="#D1D5DB" />
                        </View>

                        <View style={styles.difficultyRow}>
                            <TouchableOpacity
                                style={[styles.difficultyOption, difficulty === 'Casual' && styles.difficultyOptionActive]}
                                onPress={() => setDifficulty('Casual')}
                            >
                                <Text style={[styles.difficultyText, difficulty === 'Casual' && styles.difficultyTextActive]}>Casual</Text>
                                {difficulty === 'Casual' ? (
                                    <View style={styles.radioActive}>
                                        <View style={styles.radioInner} />
                                    </View>
                                ) : (
                                    <View style={styles.radioInactive} />
                                )}
                            </TouchableOpacity>

                            <View style={{ width: 16 }} />

                            <TouchableOpacity
                                style={[styles.difficultyOption, difficulty === 'Pro' && styles.difficultyOptionActive]}
                                onPress={() => setDifficulty('Pro')}
                            >
                                <Text style={[styles.difficultyText, difficulty === 'Pro' && styles.difficultyTextActive]}>Pro</Text>
                                {difficulty === 'Pro' ? (
                                    <View style={styles.radioActive}>
                                        <View style={styles.radioInner} />
                                    </View>
                                ) : (
                                    <View style={styles.radioInactive} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footerText}>
                    SETTINGS WILL BE APPLIED INSTANTLY TO{'\n'}YOUR VIBE PROFILE.
                </Text>

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
        fontSize: 14, // Matches image small caps title
        fontWeight: '800',
        color: '#374151',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    introCard: {
        backgroundColor: '#F9FAFB', // Or subtle gradient/white
        // Image shows white card with rounded corners? Actually looks like key banner.
        // Let's make it a white card.
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        // No shadow in image, just clean white on extremely light bg?
        // Let's add slight shadow for separation if bg is F9FAFB
    },
    introTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },
    introSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    sectionIcon: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
        // Using icon component instead for some sections
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#9CA3AF',
        letterSpacing: 1.2,
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
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1F2937',
    },
    segmentControl: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        padding: 4,
    },
    themeOption: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    themeOptionActive: {
        backgroundColor: '#8B5CF6', // Purple
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    themeOptionText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    themeOptionTextActive: {
        color: '#FFF',
        fontWeight: '700',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 10,
        fontWeight: '700',
        color: '#3B82F6', // Blue
    },
    musicOptionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    musicOption: {
        flex: 1,
        alignItems: 'center',
    },
    musicOptionActive: {
        // Style for active state container if needed?
        // Image shows 'Spotify' active with green icon/text?
        // Or background card? Image shows Spotify has a ring/card around it.
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#EFF6FF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginTop: -12, // Pop out effect
        marginBottom: -12,
        zIndex: 10,
    },
    musicIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    musicOptionText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    musicOptionTextActive: {
        color: '#111827',
        fontWeight: '800',
    },
    difficultyRow: {
        flexDirection: 'row',
    },
    difficultyOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 16,
    },
    difficultyOptionActive: {
        backgroundColor: '#F9FAFB',
        // Image shows "Casual" checked with purple radio
    },
    difficultyText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    difficultyTextActive: {
        color: '#111827',
    },
    radioInactive: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    radioActive: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#A855F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#A855F7',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        lineHeight: 16,
        letterSpacing: 1,
        marginTop: 20,
    },
});

export default VibeSettingScreen;
