import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Info, Search, X, Plus, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ClosePersonsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const innerCircle = [
        { id: 1, name: 'Felix', image: 'https://i.pravatar.cc/150?u=1' },
        { id: 2, name: 'Luna Vibe', image: 'https://i.pravatar.cc/150?u=2' },
        { id: 3, name: 'Zion', image: 'https://i.pravatar.cc/150?u=3' },
        { id: 4, name: 'Maya', image: 'https://i.pravatar.cc/150?u=4' },
        { id: 5, name: 'Kai', image: 'https://i.pravatar.cc/150?u=5' },
        { id: 6, name: 'Amara', image: 'https://i.pravatar.cc/150?u=6' },
        { id: 7, name: 'Leo King', image: 'https://i.pravatar.cc/150?u=7' },
        { id: 8, name: 'Chloe', image: 'https://i.pravatar.cc/150?u=8' },
    ];

    const suggestions = [
        { id: 1, name: 'Jasper Smith', status: 'Added you', image: 'https://i.pravatar.cc/150?u=9' },
        { id: 2, name: 'Sasha Rae', status: 'Close friend', image: 'https://i.pravatar.cc/150?u=10' },
    ];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Close Friends</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Info size={24} color="#D946EF" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.sparkleContainer}>
                        <Sparkles size={20} color="#D946EF" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.infoTitle}>Exclusive Syncing</Text>
                        <Text style={styles.infoDescription}>
                            Priority notifications and exclusive music syncs are only shared with these people.
                        </Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Find friends to add..."
                        placeholderTextColor="#9CA3AF"
                        style={styles.searchInput}
                    />
                </View>

                {/* Inner Circle Grid */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>YOUR INNER CIRCLE</Text>
                    <Text style={styles.sectionCount}>(8)</Text>
                </View>

                <View style={styles.gridContainer}>
                    {innerCircle.map((person) => (
                        <View key={person.id} style={styles.gridItem}>
                            <View style={styles.avatarContainer}>
                                <LinearGradient
                                    colors={['#A78BFA', '#E879F9']}
                                    style={styles.avatarGradient}
                                >
                                    <View style={styles.avatarInner}>
                                        <Image source={{ uri: person.image }} style={styles.avatarImage} />
                                    </View>
                                </LinearGradient>
                                <TouchableOpacity style={styles.removeButton}>
                                    <X size={12} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.gridName}>{person.name}</Text>
                        </View>
                    ))}

                    {/* Add New Button */}
                    <TouchableOpacity style={styles.gridItem}>
                        <View style={styles.addNewContainer}>
                            <Plus size={24} color="#9CA3AF" />
                        </View>
                        <Text style={[styles.gridName, { color: '#9CA3AF' }]}>Add New</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Add Suggestions */}
                <Text style={styles.sectionTitle}>QUICK ADD SUGGESTIONS</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsContainer}>
                    {suggestions.map((person) => (
                        <View key={person.id} style={styles.suggestionCard}>
                            <Image source={{ uri: person.image }} style={styles.suggestionAvatar} />
                            <View style={styles.suggestionInfo}>
                                <Text style={styles.suggestionName}>{person.name}</Text>
                                <Text style={styles.suggestionStatus}>{person.status}</Text>
                            </View>
                            <TouchableOpacity style={styles.suggestionAddButton}>
                                <Plus size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Very light background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
        alignItems: 'flex-start',
    },
    sparkleContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    infoDescription: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 50,
        marginBottom: 30,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#4B5563',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginRight: 6,
    },
    sectionCount: {
        fontSize: 12,
        fontWeight: '800',
        color: '#D946EF',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start', // Start aligned
        gap: 16, // Use gap for spacing
        marginBottom: 40,
    },
    gridItem: {
        alignItems: 'center',
        width: (width - 40 - 32) / 3, // (Screen width - padding - gaps) / 3 columns
        marginBottom: 16,
    },
    avatarContainer: {
        marginBottom: 8,
    },
    avatarGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        padding: 2, // Border width
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#1F2937',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    gridName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center',
    },
    addNewContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: '#FFF',
    },
    suggestionsContainer: {
        paddingRight: 20,
        gap: 12,
    },
    suggestionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 16,
        width: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    suggestionAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    suggestionInfo: {
        flex: 1,
    },
    suggestionName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1F2937',
    },
    suggestionStatus: {
        fontSize: 10,
        color: '#D946EF', // Purple status
        fontWeight: '500',
    },
    suggestionAddButton: {
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: '#E879F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ClosePersonsScreen;
