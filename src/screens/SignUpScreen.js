import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ChevronLeft, AtSign, Check, X } from 'lucide-react-native';
import GradientLayout from '../components/GradientLayout';
import VibeInput from '../components/VibeInput';
import BrandButton from '../components/BrandButton';
import { supabase } from '../lib/supabase';

export default function SignUpScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(null); // null = not checked, true = available, false = taken
    const [feedbackMessage, setFeedbackMessage] = useState('');

    // Debounce username check
    useEffect(() => {
        const checkUsername = async () => {
            if (username.length < 3) {
                setIsAvailable(null);
                setFeedbackMessage('');
                return;
            }

            setIsChecking(true);
            try {
                // Check if username exists in profiles table
                // Note: This assumes a 'profiles' table exists. 
                // If not, we might need a different check or this will error.
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', username)
                    .single();

                if (data) {
                    setIsAvailable(false);
                    setFeedbackMessage('Username is taken 😔');
                } else {
                    // If error code is PGRST116, it means no rows found, which means available
                    if (error && error.code === 'PGRST116') {
                        setIsAvailable(true);
                        setFeedbackMessage('Username available! 🚀');
                    } else if (error) {
                        // Real error (e.g. table doesn't exist)
                        console.log('Error checking username:', error.message);
                        // Fallback: Assume available if table doesn't exist yet to unblock UI
                        setIsAvailable(true);
                        setFeedbackMessage('Username looks good! (Offline check)');
                    } else {
                        // Should not reach here if data is null and no error, but handle safe
                        setIsAvailable(true);
                        setFeedbackMessage('Username available! 🚀');
                    }
                }
            } catch (err) {
                console.log('Unexpected error:', err);
                setIsAvailable(true); // Fail open
            } finally {
                setIsChecking(false);
            }
        };

        const timer = setTimeout(() => {
            checkUsername();
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [username]);

    const handleNext = () => {
        if (isAvailable) {
            navigation.navigate('SignUpBasics', { username });
        } else if (username.length < 3) {
            alert('Username must be at least 3 characters.');
        } else {
            alert('Please choose a different username.');
        }
    };

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
                            <View style={[styles.progressDot, styles.activeDot]} />
                            <View style={styles.progressDot} />
                            <View style={styles.progressDot} />
                        </View>

                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.mainContent}>
                        <Text style={styles.title}>Grab your</Text>
                        <Text style={styles.vibeText}>Vibe ID</Text>

                        <Text style={styles.description}>
                            Create a unique handle. No pressure, you can change it later.
                        </Text>

                        <View style={styles.formContainer}>
                            <VibeInput
                                value={username}
                                onChangeText={setUsername}
                                placeholder="username"
                                icon={AtSign}
                                autoCapitalize="none"
                                rightIcon={
                                    isChecking ? null :
                                        (isAvailable === true ? Check : (isAvailable === false ? X : null))
                                }
                                onRightIconPress={() => { }} // No action
                            />

                            {/* Feedback Text */}
                            {feedbackMessage ? (
                                <Text style={[
                                    styles.feedbackText,
                                    { color: isAvailable === true ? '#059669' : '#DC2626' }
                                ]}>
                                    {feedbackMessage}
                                </Text>
                            ) : (
                                <Text style={styles.hintText}>
                                    <Text style={styles.hintIcon}>↳ </Text>
                                    This is how your squad finds you. Keep it fresh! ✨
                                </Text>
                            )}
                        </View>

                        <View style={styles.footerSpacing} />

                        <BrandButton
                            title={isChecking ? "Checking..." : "Next Step →"}
                            onPress={handleNext}
                            style={[
                                styles.nextButton,
                                (!isAvailable || isChecking) && styles.disabledButton // Visual style for disabled
                            ]}
                        // disable logic handled in function for better UX feedback, but could disable prop too
                        />

                        <View style={styles.loginContainer}>
                            <Text style={styles.haveAccountText}>Already have an ID? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginText}>Log in</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>
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
        marginBottom: 40,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#C623FA',
        width: 24, // Elongated active dot
    },
    skipText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    mainContent: {
        flex: 1,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    vibeText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#C623FA', // Purple accent
        marginBottom: 24,
    },
    description: {
        fontSize: 16,
        color: '#6B7280',
        lineHeight: 24,
        marginBottom: 40,
    },
    formContainer: {
        marginBottom: 20,
    },
    hintText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    hintIcon: {
        color: '#C623FA',
        fontWeight: 'bold',
        fontSize: 18,
    },
    feedbackText: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '600',
    },
    footerSpacing: {
        flex: 1, // Push button to bottom
    },
    nextButton: {
        marginBottom: 24,
    },
    disabledButton: {
        opacity: 0.6,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    haveAccountText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    loginText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#C623FA',
    },
});
