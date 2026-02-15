import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, AtSign, Cake, ShieldCheck, Info, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';

const PersonalDetailsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [profile, setProfile] = useState({
        email: '',
        phone: '',
        birthday: '',
        identity_confirmed: false
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('email, phone, birthday, identity_confirmed')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            } else {
                setProfile({
                    email: user.email || '', // Email is usually in auth.users, but might be synced to profiles if needed. For now using auth email.
                    phone: data.phone || '',
                    birthday: data.birthday || '',
                    identity_confirmed: data.identity_confirmed || false
                });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = () => {
        Alert.alert('Info', 'To update details, we would typically open an edit form here.');
    };

    const DetailCard = ({ icon: Icon, iconBg, iconColor, title, subtitle, onPress }) => (
        <TouchableOpacity style={styles.card} onPress={onPress || handleUpdate}>
            <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                <Icon size={24} color={iconColor} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardSubtitle}>{subtitle || 'Not set'}</Text>
            </View>
            <ChevronRight size={20} color="#D1D5DB" />
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
                <Text style={styles.headerTitle}>Personal Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>Your Vibe Essentials</Text>
                    <Text style={styles.subtitle}>
                        Chat It uses this info to keep your account secure and help others find you.
                    </Text>
                </View>

                <View style={styles.cardsContainer}>
                    <DetailCard
                        icon={AtSign}
                        iconBg="#E0F2FE"
                        iconColor="#3B82F6"
                        title="Contact Info"
                        subtitle={`${profile.email}\n${profile.phone || 'Add phone number'}`}
                        onPress={() => navigation.navigate('ContactInfo')}
                    />

                    <DetailCard
                        icon={Cake}
                        iconBg="#F3E8FF"
                        iconColor="#A855F7"
                        title="Birthday"
                        subtitle={profile.birthday || 'Add birthday'}
                    />

                    <DetailCard
                        icon={ShieldCheck}
                        iconBg="#FCE7F3"
                        iconColor="#EC4899"
                        title="Identity Confirmation"
                        subtitle={profile.identity_confirmed ? 'Confirmed' : 'Not confirmed'}
                    />
                </View>

                {/* Info Note */}
                <View style={styles.infoBox}>
                    <Info size={16} color="#6B7280" style={{ marginTop: 2, marginRight: 12 }} />
                    <Text style={styles.infoText}>
                        Chat It uses your personal details to personalize your experience and maintain account integrity. Some information might be visible to others based on your privacy settings.
                    </Text>
                </View>

                <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                    <LinearGradient
                        colors={['#D946EF', '#C026D3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.updateButtonText}>Update Details</Text>
                    </LinearGradient>
                </TouchableOpacity>

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
    cardsContainer: {
        gap: 16,
        marginBottom: 24,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 1,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16, // Squircle
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 32,
        paddingHorizontal: 4,
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#6B7280', // Grey text
        lineHeight: 18,
    },
    updateButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#D946EF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
    },
});

export default PersonalDetailsScreen;
