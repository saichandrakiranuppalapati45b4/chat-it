import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GradientLayout({ children, style }) {
    // Gradient from top (light pink/purple) to bottom (light blue/cyan)
    // Approximate based on design: Top #FFF0FA -> Bottom #E0F7FA
    return (
        <LinearGradient
            colors={['#FFF5FC', '#F3E5F5', '#E1F5FE']}
            locations={[0, 0.4, 1]}
            style={styles.background}
        >
            <SafeAreaView style={[styles.container, style]}>
                {children}
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
});
