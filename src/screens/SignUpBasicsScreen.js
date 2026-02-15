import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Modal, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import { ChevronLeft, User, Phone, Lock, Eye, EyeOff, ChevronDown, Check, Search, Mail } from 'lucide-react-native';
import GradientLayout from '../components/GradientLayout';
import VibeInput from '../components/VibeInput';
import BrandButton from '../components/BrandButton';
import { COUNTRY_CODES } from '../lib/countryCodes';
import { supabase } from '../lib/supabase';

export default function SignUpBasicsScreen({ navigation, route }) {
    const { username } = route.params || {};

    // Redirect if username is missing (e.g. app reload)
    useEffect(() => {
        if (!username) {
            Alert.alert(
                'Missing Details',
                'We lost your username! Please go back and enter it again.',
                [{ text: 'Go Back', onPress: () => navigation.navigate('SignUp') }]
            );
        }
    }, [username]);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Country Code State
    const defaultCountry = COUNTRY_CODES.find(c => c.code === 'US') || COUNTRY_CODES[0];
    const [countryCode, setCountryCode] = useState(defaultCountry);
    const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleNext = async () => {
        if (!fullName || !email || !contactNumber || !password || !username) {
            Alert.alert('Missing info', 'Please fill in all the details to vibe! ✨');
            return;
        }

        setLoading(true);
        const fullPhoneNumber = `${countryCode.dial}${contactNumber}`;

        try {
            console.log('Attempting sign up with:', { email, username, full_name: fullName, phone: fullPhoneNumber });

            // 1. Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                        full_name: fullName,
                        avatar_url: '',
                    }
                }
            });

            if (authError) throw authError;

            // Check if email confirmation is required (session might be null)
            if (authData?.user && !authData.session) {
                Alert.alert(
                    'Check your email! 📧',
                    'We sent you a confirmation link. Please check your inbox to finish signing up.',
                    [
                        { text: 'OK', onPress: () => navigation.navigate('Login') }
                    ]
                );
                return;
            }

            if (authData?.user) {
                // 2. Create Profile Record
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert([ // Use upsert to handle potential partial failures or re-runs
                        {
                            id: authData.user.id,
                            username: username,
                            full_name: fullName,
                            email: email, // Save email for login lookup
                            phone_number: fullPhoneNumber, // Now saving phone number
                            website: '',
                            avatar_url: '',
                            updated_at: new Date(),
                        }
                    ], { onConflict: 'id' }); // Conflict on ID

                if (profileError) {
                    console.error('Profile creation error:', profileError);
                    throw new Error(`Failed to save profile details: ${profileError.message}`);
                }

                console.log('Profile created successfully!');

                // Success! Navigate to Profile Pic screen
                navigation.navigate('SignUpProfilePic', { userId: authData.user.id, username });
            }
        } catch (error) {
            console.error('Sign Up Flow Error:', error);
            Alert.alert('Sign Up Failed', error.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    // Filter countries based on search
    const filteredCountries = useMemo(() => {
        if (!searchQuery) return COUNTRY_CODES;
        const lowerText = searchQuery.toLowerCase();
        return COUNTRY_CODES.filter(item =>
            item.name.toLowerCase().includes(lowerText) ||
            item.code.toLowerCase().includes(lowerText) ||
            item.dial.includes(lowerText)
        );
    }, [searchQuery]);

    const renderCountryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.countryItem}
            onPress={() => {
                setCountryCode(item);
                setIsCountryModalVisible(false);
                setSearchQuery('');
            }}
        >
            <Text style={styles.countryFlag}>{item.flag}</Text>
            <Text style={styles.countryName}>{item.name} ({item.code})</Text>
            <Text style={styles.countryDial}>{item.dial}</Text>
            {countryCode.code === item.code && <Check size={16} color="#C623FA" />}
        </TouchableOpacity>
    );

    return (
        <GradientLayout>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <ChevronLeft size={24} color="#1F2937" />
                        </TouchableOpacity>

                        <View style={styles.progressContainer}>
                            <View style={styles.progressDot} />
                            <View style={[styles.progressDot, styles.activeDot]} />
                            <View style={styles.progressDot} />
                        </View>

                        <View style={{ width: 40 }} />
                    </View>

                    <View style={styles.mainContent}>
                        <Text style={styles.title}>The Basics</Text>
                        <Text style={styles.subtitle}>Let's get your profile set up.</Text>

                        <View style={styles.formContainer}>
                            <Text style={styles.label}>FULL NAME</Text>
                            <VibeInput
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="e.g. Alex Rivera"
                                icon={User}
                            />

                            <Text style={styles.label}>EMAIL ADDRESS</Text>
                            <VibeInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="alex@example.com"
                                icon={Mail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <Text style={styles.label}>CONTACT NUMBER</Text>
                            <View style={styles.phoneInputContainer}>
                                <TouchableOpacity
                                    style={styles.countryCodeButton}
                                    onPress={() => setIsCountryModalVisible(true)}
                                >
                                    <Text style={styles.selectedFlag}>{countryCode.flag}</Text>
                                    <Text style={styles.selectedDial}>{countryCode.dial}</Text>
                                    <ChevronDown size={16} color="#6B7280" />
                                </TouchableOpacity>

                                <View style={{ flex: 1 }}>
                                    <VibeInput
                                        value={contactNumber}
                                        onChangeText={setContactNumber}
                                        placeholder="(555) 000-0000"
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            <Text style={styles.label}>SET PASSWORD</Text>
                            <VibeInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••••••"
                                icon={Lock}
                                secureTextEntry={!showPassword}
                                rightIcon={showPassword ? Eye : EyeOff}
                                onRightIconPress={() => setShowPassword(!showPassword)}
                            />
                            <Text style={styles.passwordHint}>Strong password</Text>
                        </View>

                        <View style={styles.footerSpacing} />

                        <BrandButton
                            title={loading ? "Creating Account..." : "Next Step →"}
                            onPress={handleNext}
                            style={styles.nextButton}
                            disabled={loading}
                        />

                        <Text style={styles.termsText}>
                            By continuing, you agree to our <Text style={styles.linkText}>Terms</Text> & <Text style={styles.linkText}>Privacy Policy</Text>
                        </Text>

                    </View>

                </ScrollView>

                {/* Country Code Modal */}
                <Modal
                    visible={isCountryModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsCountryModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Country</Text>
                                <TouchableOpacity onPress={() => setIsCountryModalVisible(false)}>
                                    <Text style={styles.closeButton}>Close</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.searchContainer}>
                                <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search country or code..."
                                    placeholderTextColor="#9CA3AF"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoCorrect={false}
                                />
                            </View>

                            <FlatList
                                data={filteredCountries}
                                keyExtractor={(item) => item.code}
                                renderItem={renderCountryItem}
                                showsVerticalScrollIndicator={false}
                                initialNumToRender={20}
                                maxToRenderPerBatch={20}
                                keyboardShouldPersistTaps="handled"
                            />
                        </View>
                    </View>
                </Modal>

            </KeyboardAvoidingView>
        </GradientLayout>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F3E8FF',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#C623FA',
        width: 24,
    },
    mainContent: {
        flex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
    },
    formContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    countryCodeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 12,
        height: 56,
        marginRight: 12,
        justifyContent: 'center',
    },
    selectedFlag: {
        fontSize: 20,
        marginRight: 4,
    },
    selectedDial: {
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '500',
        marginRight: 4,
    },
    passwordHint: {
        fontSize: 12,
        color: '#C623FA',
        marginTop: 8,
        fontWeight: '500',
    },
    footerSpacing: {
        flex: 1,
        minHeight: 20,
    },
    nextButton: {
        marginBottom: 16,
    },
    termsText: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 18,
    },
    linkText: {
        color: '#C623FA',
        fontWeight: '600',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        height: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    closeButton: {
        color: '#C623FA',
        fontWeight: '600',
        fontSize: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        height: '100%',
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    countryFlag: {
        fontSize: 24,
        marginRight: 16,
    },
    countryName: {
        fontSize: 16,
        color: '#1F2937',
        flex: 1,
    },
    countryDial: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '600',
        marginRight: 16,
    },
});
