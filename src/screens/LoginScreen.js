import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AtSign, Lock, Eye, EyeOff, Music } from 'lucide-react-native';
import GradientLayout from '../components/GradientLayout';
import VibeInput from '../components/VibeInput';
import BrandButton from '../components/BrandButton';
import { supabase } from '../lib/supabase';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) {
                    console.log('Supabase connection error:', error.message);
                } else {
                    console.log('Supabase connection successful. Session:', data.session ? 'Active' : 'None');
                }
            } catch (err) {
                console.log('Unexpected error connecting to Supabase:', err);
            }
        };
        checkConnection();
    }, []);

    const handleLogin = async () => {
        const input = username.trim(); // Removed .toLowerCase() to allow exact match
        const passwordInput = password.trim();

        if (!input || !passwordInput) {
            alert('Please enter both username and password.');
            return;
        }

        setLoading(true);
        try {
            // Look up the email from the database using the username
            const { data: email, error: lookupError } = await supabase
                .rpc('get_email_by_username', { input_username: input });

            if (lookupError) {
                console.error('Lookup Error:', lookupError);
                // Helpful for debugging: show if function is missing
                alert(`Login Error: ${lookupError.message}`);
                setLoading(false);
                return;
            }

            if (!email) {
                alert('Username not found. Please check your username and try again.');
                setLoading(false);
                return;
            }

            // Now sign in with the email we found
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: passwordInput,
            });

            if (error) {
                if (error.message.includes('Email not confirmed')) {
                    alert('Please verify your email address. Check your inbox! 📧');
                } else if (error.message.includes('Invalid login credentials')) {
                    alert('Incorrect password. Please try again.');
                } else {
                    alert(error.message);
                }
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                });
            }
        } catch (err) {
            alert('An unexpected error occurred.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GradientLayout>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={styles.container}>

                    <View style={styles.header}>
                        <View style={styles.logoIconContainer}>
                            <Music size={24} color="#FFF" />
                        </View>
                        <Text style={styles.headerTitle}>Chat It</Text>
                    </View>

                    <View style={styles.mainContent}>
                        <View>
                            <Text style={styles.welcomeText}>Welcome back,</Text>
                            <Text style={styles.vibeText}>Vibe-er</Text>
                            <Text style={styles.subtitle}>Ready to sync up? Log in to continue.</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <Text style={styles.label}>USERNAME</Text>
                            <VibeInput
                                value={username}
                                onChangeText={setUsername}
                                placeholder="vibemaster99"
                                icon={AtSign}
                                autoCapitalize="none"
                            />

                            <View style={styles.passwordHeader}>
                                <Text style={styles.label}>PASSWORD</Text>
                                <TouchableOpacity onPress={() => console.log('Forgot password?')}>
                                    <Text style={styles.forgotText}>Forgot?</Text>
                                </TouchableOpacity>
                            </View>
                            <VibeInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••••••"
                                icon={Lock}
                                secureTextEntry={!showPassword}
                                rightIcon={showPassword ? Eye : EyeOff}
                                onRightIconPress={() => setShowPassword(!showPassword)}
                            />

                            <BrandButton
                                title="ENTER THE CHAT →"
                                onPress={handleLogin}
                                style={styles.loginButton}
                            />
                        </View>

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR VIBE WITH</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.socialButtonsContainer}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Text style={styles.socialButtonText}>Phone OTP</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1 }} />

                        <View style={styles.signupContainer}>
                            <Text style={styles.noAccountText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={styles.signupText}>Join the party</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </GradientLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#C623FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    vibeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#C623FA',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 20,
    },
    formContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    passwordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 4,
    },
    forgotText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#C623FA',
    },
    loginButton: {
        marginTop: 16,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        paddingHorizontal: 16,
        fontSize: 10,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    socialButton: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 16,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    socialButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    noAccountText: {
        fontSize: 14,
        color: '#6B7280',
    },
    signupText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#C623FA',
    },
});
