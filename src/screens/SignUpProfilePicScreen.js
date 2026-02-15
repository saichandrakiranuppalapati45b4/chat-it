import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, Alert, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import { ChevronLeft, Plus, Check, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import GradientLayout from '../components/GradientLayout';
import BrandButton from '../components/BrandButton';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

export default function SignUpProfilePicScreen({ navigation, route }) {
    const { userId, username } = route.params || {};
    const [image, setImage] = useState(null); // Local URI
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5, // Compress for faster upload
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Could not open image picker.');
        }
    };

    const uploadImage = async () => {
        if (!image) return;
        setUploading(true);

        try {
            // 1. Prepare file for upload
            const arrayBuffer = await fetch(image).then(res => res.arrayBuffer());
            const fileExt = image.split('.').pop().toLowerCase() || 'jpg';
            const fileName = `${userId}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 2. Upload to Supabase Storage 'avatars' bucket
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, arrayBuffer, {
                    contentType: `image/${fileExt}`,
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            // 3. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 4. Update Profile with Avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', userId);

            if (updateError) throw updateError;

            navigateToHome();

        } catch (error) {
            console.log('Upload error:', error);
            Alert.alert('Upload Failed', error.message || 'Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const navigateToHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
        Alert.alert('Welcome!', `All set, ${username}! Please log in.`);
    };

    return (
        <GradientLayout>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <ChevronLeft size={24} color="#1F2937" />
                        </TouchableOpacity>

                        <View style={styles.progressContainer}>
                            <View style={styles.progressDot} />
                            <View style={styles.progressDot} />
                            <View style={[styles.progressDot, styles.activeDot]} />
                        </View>

                        <View style={{ width: 40 }} />
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Your Vibe,</Text>
                            <Text style={styles.title}>Your Face</Text>
                            <Text style={styles.subtitle}>Let everyone see the real you.</Text>
                        </View>

                        <View style={styles.centerContainer}>
                            <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
                                <View style={styles.imageContainer}>
                                    {image ? (
                                        <Image source={{ uri: image }} style={styles.image} />
                                    ) : (
                                        <View style={styles.placeholderContainer}>
                                            <User size={80} color="#C623FA" />
                                        </View>
                                    )}
                                </View>
                                <View style={styles.plusButton}>
                                    <Plus size={24} color="#FFF" />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Bottom */}
                        <View style={styles.bottomContainer}>
                            <Text style={styles.instructionText}>Show the squad who you are</Text>
                            <Text style={styles.subInstructionText}>Upload a clear photo for better vibes.</Text>

                            <BrandButton
                                title={uploading ? "Uploading..." : "Finish & Vibe"}
                                onPress={image ? uploadImage : navigateToHome}
                                style={styles.finishButton}
                                icon={!uploading && Check}
                                disabled={uploading}
                            />

                            <TouchableOpacity onPress={navigateToHome} style={styles.skipButton}>
                                <Text style={styles.skipText}>Skip for now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </SafeAreaView>
        </GradientLayout>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        zIndex: 10,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F3E8FF',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#C623FA',
        width: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    textContainer: {
        marginTop: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1F2937',
        lineHeight: 38,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 8,
    },
    centerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    imageWrapper: {
        position: 'relative',
        shadowColor: '#C623FA',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    imageContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        padding: 4,
        backgroundColor: '#C623FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 192,
        height: 192,
        borderRadius: 96,
        backgroundColor: '#FFF',
    },
    placeholderContainer: {
        width: 192,
        height: 192,
        borderRadius: 96,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#C623FA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    bottomContainer: {
        alignItems: 'center',
        width: '100%',
    },
    instructionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
        textAlign: 'center',
    },
    subInstructionText: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 24,
        textAlign: 'center',
    },
    finishButton: {
        width: '100%',
        marginBottom: 16,
    },
    skipButton: {
        padding: 10,
    },
    skipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9CA3AF',
    },
});
