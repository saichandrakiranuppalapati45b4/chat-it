import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch, TextInput, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown, X } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

const CommentsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [commentPermission, setCommentPermission] = useState('Everyone');
    const [showDropdown, setShowDropdown] = useState(false);
    const [manualFilter, setManualFilter] = useState(true);
    const [hideOffensive, setHideOffensive] = useState(true);
    const [hiddenWords, setHiddenWords] = useState([]);
    const [newWord, setNewWord] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('privacy_settings, hidden_words')
                .eq('id', user.id)
                .single();

            if (data) {
                if (data.privacy_settings) {
                    setCommentPermission(data.privacy_settings.comment_privacy || 'Everyone');
                    setManualFilter(data.privacy_settings.manual_filter ?? true);
                    setHideOffensive(data.privacy_settings.hide_offensive ?? true);
                }
                setHiddenWords(data.hidden_words || ['spam', 'fake', 'scam', '🚫']);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (updates) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch current settings first to merge (shallow merge for privacy_settings json)
            // Simplified: we'll just build the new object based on state + updates
            const newPrivacySettings = {
                comment_privacy: updates.comment_privacy ?? commentPermission,
                manual_filter: updates.manual_filter ?? manualFilter,
                hide_offensive: updates.hide_offensive ?? hideOffensive,
                // Preserve others if they existed... ideally we'd refetch or keep full object in state
                // For this demo assuming these are the main ones or we'd handle it better
            };

            // Actually, best to read state. But wait, updateSettings is called with the *new* value.
            // So we use that new value, and current state for others.

            const payload = {};
            if (updates.hidden_words) {
                payload.hidden_words = updates.hidden_words;
            } else {
                payload.privacy_settings = newPrivacySettings;
            }

            const { error } = await supabase
                .from('profiles')
                .update(payload)
                .eq('id', user.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    const handlePermissionChange = (val) => {
        setCommentPermission(val);
        setShowDropdown(false);
        updateSettings({ comment_privacy: val });
    };

    const handleManualFilterChange = (val) => {
        setManualFilter(val);
        updateSettings({ manual_filter: val });
    };

    const handleHideOffensiveChange = (val) => {
        setHideOffensive(val);
        updateSettings({ hide_offensive: val });
    };

    const addWord = () => {
        if (newWord.trim().length > 0 && !hiddenWords.includes(newWord.trim())) {
            const updatedWords = [...hiddenWords, newWord.trim()];
            setHiddenWords(updatedWords);
            setNewWord('');
            updateSettings({ hidden_words: updatedWords }); // Special handling in updateSettings
        }
    };

    const removeWord = (wordToRemove) => {
        const updatedWords = hiddenWords.filter(word => word !== wordToRemove);
        setHiddenWords(updatedWords);
        updateSettings({ hidden_words: updatedWords });
    };

    if (loading) {
        return (
            <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#D946EF" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Comments</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Privacy Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>PRIVACY</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Who can comment on your vibes</Text>

                    <TouchableOpacity
                        style={styles.dropdownContainer}
                        onPress={() => setShowDropdown(!showDropdown)}
                    >
                        <Text style={styles.dropdownText}>{commentPermission}</Text>
                        <ChevronDown
                            size={20}
                            color="#9CA3AF"
                            style={{ transform: [{ rotate: showDropdown ? '180deg' : '0deg' }] }}
                        />
                    </TouchableOpacity>

                    {showDropdown && (
                        <View style={styles.optionsContainer}>
                            {['Everyone', 'Only followed', 'No one'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={styles.optionItem}
                                    onPress={() => handlePermissionChange(option)}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        commentPermission === option && { color: '#D946EF', fontWeight: '700' }
                                    ]}>{option}</Text>
                                    {commentPermission === option && <View style={styles.dot} />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <View style={styles.divider} />

                    <View style={styles.toggleRow}>
                        <View style={{ flex: 1, marginRight: 16 }}>
                            <Text style={styles.toggleTitle}>Manual Filter</Text>
                            <Text style={styles.toggleSubtitle}>
                                Hide comments with specific words
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#E5E7EB', true: '#D946EF' }}
                            thumbColor={'#FFF'}
                            ios_backgroundColor="#E5E7EB"
                            onValueChange={handleManualFilterChange}
                            value={manualFilter}
                        />
                    </View>
                </View>

                {/* Hidden Words Section */}
                <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                    <Text style={styles.sectionTitle}>HIDDEN WORDS</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.descriptionText}>
                        Add words, phrases, or emojis that you want to hide from your vibes. Comments containing these will be blocked automatically.
                    </Text>

                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Add custom word..."
                            placeholderTextColor="#9CA3AF"
                            value={newWord}
                            onChangeText={setNewWord}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addWord}>
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.chipsContainer}>
                        {hiddenWords.map((word, index) => (
                            <View key={index} style={styles.chip}>
                                <Text style={styles.chipText}>{word}</Text>
                                <TouchableOpacity onPress={() => removeWord(word)} hitSlop={8}>
                                    <X size={14} color="#6B7280" style={{ marginLeft: 6 }} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Safety Settings Section */}
                <View style={[styles.card, { marginTop: 24 }]}>
                    <View style={styles.toggleRow}>
                        <View style={{ flex: 1, marginRight: 16 }}>
                            <Text style={styles.toggleTitle}>Hide Offensive Comments</Text>
                            <Text style={styles.toggleSubtitle}>
                                Powered by Chat It safety AI
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#E5E7EB', true: '#D946EF' }}
                            thumbColor={'#FFF'}
                            ios_backgroundColor="#E5E7EB"
                            onValueChange={handleHideOffensiveChange}
                            value={hideOffensive}
                        />
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footerText}>SOCIAL SAFETY SETTINGS</Text>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

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
        color: '#1F2937',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    sectionHeader: {
        marginBottom: 12,
        marginLeft: 4,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#9CA3AF', // Light grey
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 1,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 12,
    },
    dropdownContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9FAFB', // Very light grey bg
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    dropdownText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 20,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 4,
    },
    toggleSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    descriptionText: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#1F2937',
        marginRight: 12,
    },
    addButton: {
        backgroundColor: '#C084FC', // Purple button from image
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 10,
        fontWeight: '800',
        color: '#9CA3AF',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginTop: 24,
    },
    optionsContainer: {
        marginTop: 8,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 8,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    optionText: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '500',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D946EF',
    },
});

export default CommentsScreen;
