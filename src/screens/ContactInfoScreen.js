import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Smartphone, ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';

const ContactInfoScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setEmail(user.email || '');

            const { data, error } = await supabase
                .from('profiles')
                .select('phone')
                .eq('id', user.id)
                .single();

            if (data) {
                setPhone(data.phone || '');
            }
        } catch (error) {
            console.error('Error fetching contact info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Updating phone in profiles. 
            // Email update usually requires supabase.auth.updateUser({ email: ... }) which sends a confirmation link.
            // For this UI, we'll assume we are updating the profile's phone number.

            const { error } = await supabase
                .from('profiles')
                .update({ phone: phone })
                .eq('id', user.id);

            if (error) throw error;

            Alert.alert('Success', 'Contact info updated successfully');
            navigation.goBack();

        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleVerify = (type) => {
        Alert.alert('Verify', `Verification for ${type} would be initiated here.`);
    };

    if (loading) {
        return (
            <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#D946EF" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <ArrowLeft size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>CONTACT INFO</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    <View style={styles.titleContainer}>
                        <Text style={styles.mainTitle}>Stay Connected</Text>
                        <Text style={styles.subtitle}>
                            Keep your credentials updated to never miss a beat or lose access to your profile.
                        </Text>
                    </View>

                    {/* Email Section */}
                    <Text style={styles.label}>EMAIL</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.iconContainer}>
                            <Mail size={20} color="#9CA3AF" />
                        </View>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            editable={false} // Email typically read-only or requires special flow
                        />
                        <TouchableOpacity onPress={() => handleVerify('email')}>
                            <Text style={styles.verifyText}>Verify</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Phone Section */}
                    <Text style={styles.label}>PHONE NUMBER</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.iconContainer}>
                            <Smartphone size={20} color="#9CA3AF" />
                        </View>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                        />
                        <TouchableOpacity onPress={() => handleVerify('phone')}>
                            <Text style={styles.verifyText}>Verify</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Security Info Card */}
                    <View style={styles.infoCard}>
                        <ShieldCheck size={24} color="#D946EF" style={{ marginRight: 12 }} />
                        <Text style={styles.infoCardText}>
                            This information is encrypted and used for account security, such as two-factor authentication and account recovery. We'll never share this publicly.
                        </Text>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Save Button */}
                <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                        <LinearGradient
                            colors={['#D946EF', '#C026D3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            {saving ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Or dark grey gradient as in image? Image looks dark gradient or overlay. 
        // The user prompt image is dark mode/gradient. 
        // But previous screens were light mode. I will stick to consistent light mode 
        // unless the user specifically asked for dark mode, 
        // OR I can try to match the image's dark aesthetic if it seems localized.
        // The previous screens were #F9FAFB (light). The image provided is definitely dark/blurred background.
        // I'll stick to the app's current theme (Light) for consistency, but match the layout.
        // Actually, looking at the image, it has a blur effect. 
        // I'll use standard light theme to fit the rest of the app for now. 
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
        fontSize: 14,
        fontWeight: '700',
        color: '#4B5563',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    titleContainer: {
        marginTop: 10,
        marginBottom: 30,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 22,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 8,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 1,
    },
    iconContainer: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '500',
    },
    verifyText: {
        color: '#D946EF',
        fontWeight: '700',
        fontSize: 14,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    infoCardText: {
        flex: 1,
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 20,
    },
    footer: {
        paddingHorizontal: 20,
        backgroundColor: '#F9FAFB', // Matches container
    },
    saveButton: {
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#D946EF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    gradientButton: {
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ContactInfoScreen;
