import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, ChevronRight, Pause, ArrowLeftRight, User, Trash2, AlertTriangle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

export default function AccountManagementScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    const handleLogout = async () => {
        // For delete/deactivate, we might want to just show an alert for now as per "try to fix it out" matching UI.
        // But if user wants functionality, we can add it later.
    };

    const ManagementCard = ({ icon: Icon, iconBg, iconColor, label, subtitle, isDestructive, hasWarning }) => (
        <TouchableOpacity style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
                <Icon size={20} color={iconColor} />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.label, isDestructive && styles.destructiveText]}>{label}</Text>
                <Text style={[styles.subtitle, isDestructive && styles.destructiveSubtitle]}>{subtitle}</Text>
            </View>
            {hasWarning ? (
                <AlertTriangle size={20} color="#F87171" style={{ opacity: 0.5 }} />
            ) : (
                <ChevronRight size={20} color="#D1D5DB" />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Management</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <Text style={styles.description}>
                    Manage your account status and data. Some changes might take a few days to process.
                </Text>

                <View style={styles.cardContainer}>
                    <ManagementCard
                        icon={Pause}
                        iconBg="#FFEDD5" // Light Orange
                        iconColor="#F97316" // Orange
                        label="Deactivate Account"
                        subtitle="Temporarily hide your profile"
                    />

                    <ManagementCard
                        icon={ArrowLeftRight}
                        iconBg="#F3E8FF" // Light Purple
                        iconColor="#A855F7" // Purple
                        label="Switch Account Type"
                        subtitle="Personal or Creator tools"
                    />

                    <ManagementCard
                        icon={User}
                        iconBg="#DBEAFE" // Light Blue
                        iconColor="#3B82F6" // Blue
                        label="Request Account Data"
                        subtitle="Get a copy of your info"
                    />
                </View>

                {/* Delete Section - Spaced out */}
                <View style={styles.deleteContainer}>
                    <ManagementCard
                        icon={Trash2}
                        iconBg="#FEE2E2" // Light Red
                        iconColor="#EF4444" // Red
                        label="Delete Account"
                        subtitle="Permanently remove your data"
                        isDestructive={true}
                        hasWarning={true}
                    />
                </View>

                <Text style={styles.footerText}>SECURITY PROTOCOL V4.2</Text>

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
    backButton: {
        padding: 4,
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
    description: {
        marginTop: 16,
        marginBottom: 24,
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    cardContainer: {
        gap: 16,
    },
    deleteContainer: {
        marginTop: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12, // fallback for gap if needed, or use gap in parent
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    destructiveText: {
        color: '#EF4444',
    },
    destructiveSubtitle: {
        color: '#F87171',
    },
    footerText: {
        marginTop: 40,
        textAlign: 'center',
        fontSize: 10,
        fontWeight: 'bold',
        color: '#D1D5DB',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});
