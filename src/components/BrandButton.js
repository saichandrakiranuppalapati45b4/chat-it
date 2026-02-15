import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function BrandButton({ title, onPress, style }) {
    // Gradient from bright purple #C623FA to deep blue-purple #4D55F3
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, style]}>
            <LinearGradient
                colors={['#C623FA', '#4D55F3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <Text style={styles.text}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        shadowColor: '#C623FA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    gradient: {
        flex: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
