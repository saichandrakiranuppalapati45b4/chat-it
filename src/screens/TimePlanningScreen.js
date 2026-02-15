import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch, Dimensions } from 'react-native';
import { ArrowLeft, Info, HelpCircle, Coffee, BellOff, Hourglass, Smartphone, ChevronRight, Home, Search, MessageSquare, User, Clock, Timer, Plus, TrendingDown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Custom Slider Component
const CustomSlider = ({ value, labelLeft, labelRight }) => {
    // Visual representation only for now
    // Value 0-100
    // Simulating centered thumb for "3h 30m" look
    const thumbPosition = 45; // Approx 45% based on image

    return (
        <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
                <View style={[styles.sliderTrackBg, { width: '100%' }]} />
            </View>

            <View style={[styles.sliderThumb, { left: `${thumbPosition}%` }]}>
                <Timer size={20} color="#D946EF" fill="#D946EF" />
            </View>

            <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>{labelLeft}</Text>
                <Text style={styles.sliderLabel}>{labelRight}</Text>
            </View>
        </View>
    );
};

export default function TimePlanningScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [scheduleBreaks, setScheduleBreaks] = useState(true);
    const [quietMode, setQuietMode] = useState(false);

    // Circle config
    const size = width * 0.65;
    const strokeWidth = 24; // Thicker stroke
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    // Visually it looks like ~75% progress starting from top (or bottom?)
    // Actually looks like starting from top (12 o'clock) going clockwise to ~8 o'clock
    const progress = 0.70;
    const strokeDashoffset = circumference - (progress * circumference);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Time Planning</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Info size={24} color="#1F2937" fill="#1F2937" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Circular Progress Section */}
                <View style={styles.progressSection}>
                    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
                        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                            <Defs>
                                <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <Stop offset="0%" stopColor="#D946EF" />
                                    <Stop offset="100%" stopColor="#8B5CF6" />
                                </LinearGradient>
                            </Defs>
                            <Circle
                                stroke="#E5E7EB" // Visible light gray track
                                cx={center}
                                cy={center}
                                r={radius}
                                strokeWidth={strokeWidth}
                                fill="none"
                            />
                            {/* Progress Arc */}
                            <Circle
                                stroke="url(#grad)"
                                cx={center}
                                cy={center}
                                r={radius}
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                fill="none"
                            />
                        </Svg>

                        <View style={styles.progressContent}>
                            <Text style={styles.progressLabel}>SPENT TODAY</Text>
                            <Text style={styles.progressValue}>2h 45m</Text>
                            <View style={styles.progressTrendContainer}>
                                <TrendingDown size={14} color="#10B981" />
                                <Text style={styles.progressTrend}> 12% less</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.motivationalText}>
                        You're doing great! Your digital{'\n'}vibe is balanced today.
                    </Text>
                </View>

                {/* Daily Limit Card */}
                <View style={styles.limitCard}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.cardLabel}>SET DAILY VIBE LIMIT</Text>
                            <Text style={styles.cardValueLarge}>3h 30m</Text>
                        </View>

                    </View>

                    <CustomSlider labelLeft="30m" labelRight="8h" />
                </View>

                {/* Settings Items */}
                <View style={styles.settingsGroup}>

                    {/* Schedule Breaks */}
                    <View style={styles.settingItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
                            <Coffee size={22} color="#EA580C" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.settingTitle}>Schedule Breaks</Text>
                            <Text style={styles.settingSubtitle}>Remind me every 45 mins</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#E5E7EB', true: '#D946EF' }}
                            thumbColor={'#FFF'}
                            ios_backgroundColor="#E5E7EB"
                            onValueChange={setScheduleBreaks}
                            value={scheduleBreaks}
                        />
                    </View>

                    {/* Quiet Mode */}
                    <View style={styles.settingItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
                            <BellOff size={22} color="#4F46E5" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.settingTitle}>Quiet Mode</Text>
                            <Text style={styles.settingSubtitle}>Mute notifications 10PM - 7AM</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#E5E7EB', true: '#D946EF' }}
                            thumbColor={'#FFF'}
                            ios_backgroundColor="#E5E7EB"
                            onValueChange={setQuietMode}
                            value={quietMode}
                        />
                    </View>

                    {/* App Limits */}
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                            <Smartphone size={22} color="#059669" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.settingTitle}>Individual App Limits</Text>
                            <Text style={styles.settingSubtitle}>Manage specific vibes</Text>
                        </View>
                        <ChevronRight size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                </View>

                <Text style={styles.footerText}>DIGITAL WELLBEING STARTS WITH A SINGLE STEP</Text>

                <View style={{ height: 100 }} />
            </ScrollView>



        </View>
    );
}

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
        paddingBottom: 16,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '800', // Bold title
        color: '#111827',
    },
    content: {
        paddingHorizontal: 20,
    },
    progressSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    progressContent: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    progressLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 1.5,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    progressValue: {
        fontSize: 42, // Large value
        fontWeight: '900', // Extra bold
        color: '#111827',
        marginBottom: 4,
        letterSpacing: -1,
    },
    progressTrendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressTrend: {
        fontSize: 13,
        fontWeight: '700',
        color: '#10B981',
    },
    motivationalText: {
        textAlign: 'center',
        color: '#6B7280',
        marginTop: 24,
        lineHeight: 20,
        fontSize: 13,
        fontWeight: '500',
    },
    limitCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    cardLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    cardValueLarge: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
    },
    timerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FAE8FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderContainer: {
        paddingTop: 8,
        marginBottom: 8,
    },
    sliderTrack: {
        height: 6,
        backgroundColor: '#E5E7EB', // Light gray track
        borderRadius: 3,
        width: '100%',
        justifyContent: 'center',
    },
    sliderTrackBg: {
        height: '100%',
        borderRadius: 3,
    },
    sliderThumb: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FAE8FF', // Light purple bg
        borderWidth: 2,
        borderColor: '#FFF',
        top: -17, // Center vertically
        marginLeft: -20, // Center thumb
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderThumbInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFF',
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    sliderLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    settingsGroup: {
        gap: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16, // Increase padding
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 6,
        elevation: 1,
        marginBottom: 12,
    },
    iconBox: {
        width: 48, // Slightly larger icon box
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 10,
        fontWeight: '700',
        color: '#D1D5DB',
        letterSpacing: 1,
        marginTop: 30,
        textTransform: 'uppercase',
    },


});
