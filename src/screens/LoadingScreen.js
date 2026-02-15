import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import GradientLayout from '../components/GradientLayout';

export default function LoadingScreen({ navigation }) {
    useEffect(() => {
        // Simulate loading assets or checks
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <GradientLayout>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    {/* Placeholder for Logo */}
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoIcon}>💬</Text>
                    </View>
                    <Text style={styles.brandTitle}>
                        Chat<Text style={styles.brandAccent}>It</Text>
                    </Text>
                    <Text style={styles.tagline}>Chat. Play. Vibe Together.</Text>
                </View>

                <View style={styles.footer}>
                    <ActivityIndicator size="small" color="#C623FA" />
                    <Text style={styles.loadingText}>LOADING VIBES...</Text>
                </View>
            </View>
        </GradientLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    logoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    logoIcon: {
        fontSize: 50,
    },
    brandTitle: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    brandAccent: {
        color: '#4D55F3',
    },
    tagline: {
        fontSize: 16,
        color: '#4B5563',
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 60,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 12,
        color: '#9CA3AF',
        letterSpacing: 1.5,
        fontWeight: 'bold',
    },
});
