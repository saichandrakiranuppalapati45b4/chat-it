import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ArrowLeft, ChevronRight, User, Shield, Database, MousePointer2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const ACCOUNT_SETTINGS = [
    {
        icon: User,
        iconBg: '#3B82F6', // Blue
        label: 'Personal Details',
        subtitle: 'Contact info, birthday, and ID',
        route: 'PersonalDetails',
    },
    {
        icon: Shield,
        iconBg: '#8B5CF6', // Purple
        label: 'Password & Security',
        subtitle: 'Login, 2FA, and alerts',
    },
    {
        icon: Database,
        iconBg: '#D946EF', // Pink
        label: 'Your Info & Permissions',
        subtitle: 'Access, download, and manage data',
    },
    {
        icon: MousePointer2,
        iconBg: '#4F46E5', // Indigo
        label: 'Ad Preferences',
        subtitle: 'Control how ads find your vibe',
    },
];

export default function AccountCenterScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    const SettingCard = ({ icon: Icon, iconBg, label, subtitle, route }) => (
        <TouchableOpacity
            style={styles.settingCard}
            onPress={() => route && navigation.navigate(route)}
        >
            <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
                <Icon size={20} color="#FFF" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.settingLabel}>{label}</Text>
                <Text style={styles.settingSubtitle}>{subtitle}</Text>
            </View>
            <ChevronRight size={20} color="#D1D5DB" />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Center</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Hero Text */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Manage your connected experiences</Text>
                    <Text style={styles.heroSubtitle}>Control settings for your connected accounts across Chat It and partner vibes.</Text>
                </View>

                {/* Profiles Section */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeader}>PROFILES</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Profiles')}>
                        <Text style={styles.addAccountText}>Add account</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('Profiles')}>
                    <View style={styles.avatarContainer}>
                        {/* Placeholder Avatar - using User icon if image fails, but mimicking the design text */}
                        <View style={styles.avatarPlaceholder}>
                            <User size={24} color="#D97706" />
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>⚡</Text>
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.profileName}>alex_vibe_99</Text>
                        <Text style={styles.profileSubtext}>Chat It, Vibe Lab</Text>
                    </View>
                    <ChevronRight size={20} color="#D1D5DB" />
                </TouchableOpacity>

                {/* Account Settings Section */}
                <Text style={[styles.sectionHeader, { marginTop: 24 }]}>ACCOUNT SETTINGS</Text>

                {ACCOUNT_SETTINGS.map((item, index) => (
                    <SettingCard
                        key={index}
                        icon={item.icon}
                        iconBg={item.iconBg}
                        label={item.label}
                        subtitle={item.subtitle}
                        route={item.route}
                    />
                ))}

                {/* Footer Links */}
                <View style={styles.footer}>
                    <Text style={styles.footerHeading}>Looking for something else?</Text>
                    <View style={styles.footerLinksRow}>
                        <TouchableOpacity><Text style={styles.footerLink}>Help Center</Text></TouchableOpacity>
                        <TouchableOpacity><Text style={styles.footerLink}>Privacy Policy</Text></TouchableOpacity>
                    </View>
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
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#F9FAFB',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    heroSection: {
        marginTop: 16,
        marginBottom: 24,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionHeader: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    addAccountText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#D946EF', // Pinkish purple
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 8,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FDE68A', // Light orange/yellow
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#D946EF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    badgeText: {
        fontSize: 10,
        color: '#FFF',
    },
    textContainer: {
        flex: 1,
    },
    profileName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    profileSubtext: {
        fontSize: 12,
        color: '#6B7280',
    },
    settingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12, // Squircle shape
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    footer: {
        marginTop: 24,
        alignItems: 'center',
    },
    footerHeading: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 12,
    },
    footerLinksRow: {
        flexDirection: 'row',
        gap: 24,
    },
    footerLink: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6B7280',
    },
});
