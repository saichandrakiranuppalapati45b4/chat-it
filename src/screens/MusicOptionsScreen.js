import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated, Pressable } from 'react-native';
import { ChevronRight, CheckSquare, User, Sparkles, ListPlus, Flag } from 'lucide-react-native';

const { height } = Dimensions.get('window');

export default function MusicOptionsScreen({ navigation }) {
    const MENU_ITEMS = [
        { id: '1', icon: CheckSquare, label: 'Sync Settings', color: '#6366F1' }, // Indigo for Sync
        { id: '2', icon: User, label: 'View Artist Profile', color: '#8B5CF6' }, // Purple for User
        { id: '3', icon: Sparkles, label: 'Share Vibe', color: '#EC4899' }, // Pink for Share
        { id: '4', icon: ListPlus, label: 'Add to Playlist', color: '#06B6D4' }, // Cyan for Playlist
        { id: '5', icon: Flag, label: 'Report Vibe', color: '#6B7280' }, // Gray for Report
    ];

    return (
        <View style={styles.container}>
            {/* Transparent backdrop to close modal */}
            <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

            {/* Bottom Sheet Content */}
            <View style={styles.sheetContainer}>
                {/* Handle Bar */}
                <View style={styles.handleBarContainer}>
                    <View style={styles.handleBar} />
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {MENU_ITEMS.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={() => {
                                if (item.label === 'Sync Settings') {
                                    navigation.goBack(); // Close modal first
                                    navigation.navigate('SyncSettings');
                                } else if (item.label === 'View Artist Profile') {
                                    navigation.goBack();
                                    navigation.navigate('ArtistProfile');
                                } else if (item.label === 'Share Vibe') {
                                    navigation.goBack();
                                    navigation.navigate('ShareVibe');
                                } else if (item.label === 'Add to Playlist') {
                                    navigation.goBack();
                                    navigation.navigate('AddToPlaylist');
                                } else if (item.label === 'Report Vibe') {
                                    navigation.goBack();
                                    navigation.navigate('ReportVibe');
                                } else {
                                    console.log(item.label);
                                }
                            }}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                                <item.icon size={24} color={item.color} />
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <ChevronRight size={20} color="#D1D5DB" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent dimming
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    sheetContainer: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    handleBarContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    handleBar: {
        width: 40,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E5E7EB',
    },
    menuContainer: {
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    closeButton: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 20,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
});
