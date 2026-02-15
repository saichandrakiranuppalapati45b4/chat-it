import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const REPORT_REASONS = [
    { id: '1', label: 'Inappropriate Content' },
    { id: '2', label: 'Copyright Issue' },
    { id: '3', label: 'Spam or Misleading' },
    { id: '4', label: 'Harassment' },
    { id: '5', label: 'Violence or Self-harm' },
];

export default function ReportVibeScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [selectedReason, setSelectedReason] = useState(null);
    const [details, setDetails] = useState('');

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            <View style={[styles.content, { marginTop: insets.top }]}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                        <ChevronLeft size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Report Vibe</Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* Title & Description */}
                <Text style={styles.pageTitle}>What's the issue?</Text>
                <Text style={styles.pageSubtitle}>Select a reason that best describes what's wrong with this content.</Text>

                {/* Reasons List */}
                <View style={styles.reasonsContainer}>
                    {REPORT_REASONS.map((reason) => (
                        <TouchableOpacity
                            key={reason.id}
                            style={styles.reasonCard}
                            onPress={() => setSelectedReason(reason.id)}
                        >
                            <Text style={styles.reasonLabel}>{reason.label}</Text>
                            <View style={[
                                styles.radioOuter,
                                selectedReason === reason.id && styles.radioOuterSelected
                            ]}>
                                {selectedReason === reason.id && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Additional Details */}
                <Text style={styles.inputLabel}>ADDITIONAL DETAILS</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Tell us more about the issue..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={details}
                    onChangeText={setDetails}
                />

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButtonContainer} onPress={() => navigation.goBack()}>
                    <LinearGradient
                        colors={['#D946EF', '#C026D3']}
                        style={styles.submitButton}
                    >
                        <Text style={styles.submitButtonText}>Submit Report</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCFCFC',
    },
    content: {
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        marginBottom: 20,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        // Shadow
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
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    pageSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 24,
        lineHeight: 20,
    },
    reasonsContainer: {
        marginBottom: 24,
    },
    reasonCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 24,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    reasonLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: '#C026D3', // Purple
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#C026D3',
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 1,
        marginBottom: 12,
        marginTop: 8,
    },
    textInput: {
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        padding: 20,
        height: 120,
        fontSize: 16,
        color: '#1F2937',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 32,
    },
    submitButtonContainer: {
        width: '100%',
    },
    submitButton: {
        paddingVertical: 18,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
