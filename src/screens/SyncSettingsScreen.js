import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView, Image, Dimensions } from 'react-native';
import { ChevronLeft, MoreHorizontal, X, UserPlus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const PARTNERS = [
    { id: '1', name: 'Alex River', status: 'Listening to "Midnight City"', image: 'https://via.placeholder.com/50', active: true },
    { id: '2', name: 'Sarah Chen', status: 'Active now', image: 'https://via.placeholder.com/50', active: true },
    { id: '3', name: 'Jordan K.', status: 'Synching vibes', image: 'https://via.placeholder.com/50', active: true },
];

export default function SyncSettingsScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [allowFriends, setAllowFriends] = useState(true);
    const [showListening, setShowListening] = useState(true);
    const [highQuality, setHighQuality] = useState(false);

    return (
        <LinearGradient
            colors={['#FFF5FC', '#F3E5F5', '#E1F5FE']}
            style={styles.container}
        >
            <View style={[styles.content, { marginTop: insets.top, paddingBottom: insets.bottom }]}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                        <ChevronLeft size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Sync Settings</Text>
                    <TouchableOpacity style={styles.iconButton}>
                        <MoreHorizontal size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Settings Toggles */}
                    <View style={styles.card}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingLabelContainer}>
                                <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
                                    <UserPlus size={20} color="#6366F1" />
                                </View>
                                <Text style={styles.settingLabel}>Allow Friends to Join</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#E5E7EB", true: "#C623FA" }}
                                thumbColor={"#FFF"}
                                onValueChange={setAllowFriends}
                                value={allowFriends}
                            />
                        </View>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingLabelContainer}>
                                <View style={[styles.iconBox, { backgroundColor: '#F0F9FF' }]}>
                                    <View style={styles.eyeIcon} />
                                    {/* Using a simple View to simulate the eye icon from image, or just use Lucide Eye if available logic permits, but prompts suggest specific UI. Let's use Lucide for consistency */}
                                    <Text style={{ fontSize: 20 }}>👁️</Text>
                                </View>
                                <View>
                                    <Text style={styles.settingLabel}>Show what I'm</Text>
                                    <Text style={styles.settingLabel}>listening to</Text>
                                </View>
                            </View>
                            <Switch
                                trackColor={{ false: "#E5E7EB", true: "#C623FA" }}
                                thumbColor={"#FFF"}
                                onValueChange={setShowListening}
                                value={showListening}
                            />
                        </View>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingLabelContainer}>
                                <View style={[styles.iconBox, { backgroundColor: '#F5F3FF' }]}>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#7C3AED' }}>HQ</Text>
                                </View>
                                <Text style={styles.settingLabel}>High Quality Sync</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#E5E7EB", true: "#C623FA" }}
                                thumbColor={"#FFF"}
                                onValueChange={setHighQuality}
                                value={highQuality}
                            />
                        </View>
                    </View>

                    {/* Active Sync Partners Header */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Active Sync Partners</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>3 ACTIVE</Text>
                        </View>
                    </View>

                    {/* Partners List */}
                    {PARTNERS.map((partner) => (
                        <View key={partner.id} style={styles.partnerCard}>
                            <View style={styles.partnerInfo}>
                                <Image source={{ uri: partner.image }} style={styles.partnerImage} />
                                <View style={partner.active ? styles.onlineDot : null} />
                                <View>
                                    <Text style={styles.partnerName}>{partner.name}</Text>
                                    <Text style={styles.partnerStatus}>{partner.status}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.removeButton}>
                                <X size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    ))}

                </ScrollView>

                {/* Add New Partner Button */}
                <TouchableOpacity style={styles.addButton}>
                    <LinearGradient
                        colors={['#D946EF', '#22D3EE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.addButtonText}>Add New Partner</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        marginBottom: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    badge: {
        backgroundColor: '#F0ABFC', // Light purple/pink
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#A21CAF', // Darker purple text
        letterSpacing: 0.5,
    },
    partnerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 12,
        marginBottom: 12,
    },
    partnerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    partnerImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
        backgroundColor: '#DDD',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        left: 36,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#34D399', // Green
        borderWidth: 2,
        borderColor: '#FFF',
    },
    partnerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    partnerStatus: {
        fontSize: 12,
        color: '#6B7280',
    },
    removeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        marginTop: 10,
        marginBottom: 20,
    },
    gradientButton: {
        paddingVertical: 16,
        borderRadius: 24,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
