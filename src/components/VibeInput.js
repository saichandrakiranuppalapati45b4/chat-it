import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

export default function VibeInput({
    value,
    onChangeText,
    placeholder,
    icon: Icon,
    secureTextEntry,
    rightIcon: RightIcon,
    onRightIconPress,
    autoCapitalize = 'none'
}) {
    return (
        <View style={styles.container}>
            {Icon && (
                <View style={styles.iconContainer}>
                    <Icon size={20} color="#9CA3AF" />
                </View>
            )}
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
            />
            {RightIcon && (
                <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconContainer}>
                    <RightIcon size={20} color="#9CA3AF" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6', // Light gray background
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 16,
    },
    iconContainer: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        height: '100%',
    },
    rightIconContainer: {
        marginLeft: 12,
    },
});
