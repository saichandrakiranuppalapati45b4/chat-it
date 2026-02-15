import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Home, Gamepad2, MessageCircle, Headphones, User, Plus } from 'lucide-react-native';
import ChatScreen from '../screens/ChatScreen';
import HomeScreen from '../screens/HomeScreen';
import MusicScreen from '../screens/MusicScreen';
import GameScreen from '../screens/GameScreen';

const Tab = createBottomTabNavigator();

import ProfileScreen from '../screens/ProfileScreen';

function CustomTabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.bottomNavContainer}>
            <View style={styles.bottomNav}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    // Render different icons based on route name
                    let Icon;
                    let label;
                    if (route.name === 'Home') {
                        Icon = Home;
                        label = 'Home';
                    } else if (route.name === 'Game') {
                        Icon = Gamepad2;
                        label = 'Game';
                    } else if (route.name === 'Chat') {
                        Icon = MessageCircle;
                        label = 'Chat';
                    } else if (route.name === 'Music') {
                        Icon = Headphones;
                        label = 'Music';
                    } else if (route.name === 'Profile') {
                        Icon = User;
                        label = 'Profile';
                    }

                    // Special styling for active state
                    const color = isFocused ? '#C623FA' : '#9CA3AF';
                    const fill = isFocused ? '#C623FA' : 'none'; // Optional fill for active

                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            style={styles.navItem}
                        >
                            {/* Only fill Home and Game if focused, or based on design preference */}
                            <Icon size={26} color={color} fill={isFocused && (route.name === 'Home' || route.name === 'Game') ? '#C623FA' : 'transparent'} />
                            <Text style={[styles.navText, { color }]}>{label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Game" component={GameScreen} />
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name="Music" component={MusicScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    bottomNavContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 34 : 12, // Manual safe area padding for tab bar
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 10,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navText: {
        fontSize: 10,
        marginTop: 4,
        fontWeight: '600',
    },
});
