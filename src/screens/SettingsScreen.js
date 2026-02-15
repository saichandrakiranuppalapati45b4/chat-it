import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ArrowLeft, User, Search, Clock, Activity, Bell, Calendar, Heart, Ban, Sliders, Headphones, Music, MessageSquare, ChevronRight, AtSign } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';

const SECTIONS = [
    {
        title: 'ACCOUNT',
        items: [
            { icon: User, iconBg: '#E0F2FE', iconColor: '#0EA5E9', label: 'Account Management', route: 'AccountManagement' },
            { icon: Clock, iconBg: '#EDE9FE', iconColor: '#8B5CF6', label: 'Past Vibe', route: 'PastVibeHistory' },
            { icon: Activity, iconBg: '#FAE8FF', iconColor: '#D946EF', label: 'My Vibe Activity', route: 'MyVibeActivity' },
        ],
    },
    {
        title: 'ESSENTIAL',
        items: [
            { icon: Bell, iconBg: '#FEF3C7', iconColor: '#F59E0B', label: 'Notification', route: 'Notification' },
            { icon: Calendar, iconBg: '#DCFCE7', iconColor: '#10B981', label: 'Time Planning', route: 'TimePlanning' },

        ],
    },
    {
        title: 'CONNECTIONS',
        items: [
            { icon: Heart, iconBg: '#FEE2E2', iconColor: '#EF4444', label: 'Close Friends', route: 'ClosePersons' },
            { icon: Ban, iconBg: '#F3F4F6', iconColor: '#6B7280', label: 'Blocked Vibes', route: 'BlockedVibes' },
        ],
    },
    {
        title: 'CONTENT & PRIVACY',
        items: [
            { icon: Sliders, iconBg: '#E0F2FE', iconColor: '#0EA5E9', label: 'Vibe Settings', route: 'VibeSetting' },
            { icon: MessageSquare, iconBg: '#DCFCE7', iconColor: '#10B981', label: 'Chatting and Vibe Settings', route: 'ChatInteraction' },
            { icon: AtSign, iconBg: '#FFEDD5', iconColor: '#F97316', label: 'Tags and Mentions', route: 'TagsMentions' },
            { icon: MessageSquare, iconBg: '#FCE7F3', iconColor: '#EC4899', label: 'Comments', route: 'Comments' },
        ],
    },
];

export default function SettingsScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const SettingItem = ({ icon: Icon, iconBg, iconColor, label, onPress }) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress}>
            <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
                <Icon size={18} color={iconColor} />
            </View>
            <Text style={styles.settingLabel}>{label}</Text>
            <ChevronRight size={16} color="#D1D5DB" />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings & Privacy</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search settings"
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Account Center Banner */}
                <TouchableOpacity style={styles.accountCenterBanner} onPress={() => navigation.navigate('AccountCenter')}>
                    <LinearGradient
                        colors={['#D946EF20', '#8B5CF620']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.accountCenterIcon}>
                        <User size={20} color="#FFF" />
                    </View>
                    <View style={styles.accountCenterText}>
                        <Text style={styles.accountCenterTitle}>Account Center</Text>
                        <Text style={styles.accountCenterSubtitle}>Security, password & details</Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                </TouchableOpacity>

                {SECTIONS.map((section, index) => (
                    <View key={index} style={styles.sectionContainer}>
                        <Text style={styles.sectionHeader}>{section.title}</Text>
                        <View style={styles.sectionCard}>
                            {section.items.map((item, itemIndex) => (
                                <SettingItem
                                    key={itemIndex}
                                    icon={item.icon}
                                    iconBg={item.iconBg}
                                    iconColor={item.iconColor}
                                    label={item.label}
                                    onPress={() => item.route ? navigation.navigate(item.route) : null}
                                />
                            ))}
                        </View>
                    </View>
                ))}

                <Text style={styles.versionText}>Version 2.15.0(12.32.12)</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Light gray background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: '#F9FAFB',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6', // Slightly darker gray for input? Or keep identical to bg?
        // Actually, typically search bars have a distinct background if container is distinct.
        // Let's make search bar transparent/integrated
        marginHorizontal: 20,
        marginVertical: 10,
        paddingHorizontal: 12,
        height: 40,
        borderRadius: 8,
        // No background color in image? It looks like "Search settings" is just text.
        // But functionally needs a box. Let's do minimal.
        backgroundColor: '#FFF',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
    },
    accountCenterBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 16,
        borderRadius: 12,
        overflow: 'hidden', // for gradient
        backgroundColor: '#FFF', // Fallback
        borderWidth: 1,
        borderColor: '#F3EBFF', // Light purple
    },
    accountCenterIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#C026D3', // Fuchsia/Purple
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    accountCenterText: {
        flex: 1,
    },
    accountCenterTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    accountCenterSubtitle: {
        fontSize: 11,
        color: '#6B7280',
    },
    sectionContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9CA3AF',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    sectionCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingVertical: 4,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingLabel: {
        flex: 1,
        fontSize: 13, // Slightly smaller per image
        fontWeight: '600',
        color: '#1F2937',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 11,
        color: '#D1D5DB',
        marginTop: 30,
        marginBottom: 8,
    },
    logoutText: {
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600',
        color: '#EF4444',
    },
});
