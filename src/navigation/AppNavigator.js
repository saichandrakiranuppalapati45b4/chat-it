import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Loading"
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: 'transparent' }
                }}
            >
                <Stack.Screen name="Loading" component={LoadingScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="SignUpBasics" component={require('../screens/SignUpBasicsScreen').default} />
                <Stack.Screen name="SignUpProfilePic" component={require('../screens/SignUpProfilePicScreen').default} />
                <Stack.Screen name="MainTabs" component={require('./MainTabNavigator').default} />
                <Stack.Screen name="ChatDetail" component={require('../screens/ChatDetailScreen').default} />
                <Stack.Screen name="MusicPlayer" component={require('../screens/MusicPlayerScreen').default} options={{ presentation: 'modal' }} />
                <Stack.Screen
                    name="MusicOptions"
                    component={require('../screens/MusicOptionsScreen').default}
                    options={{
                        presentation: 'transparentModal',
                        cardOverlayEnabled: true,
                        animationEnabled: true,
                    }}
                />
                <Stack.Screen name="SyncSettings" component={require('../screens/SyncSettingsScreen').default} />
                <Stack.Screen name="ArtistProfile" component={require('../screens/ArtistProfileScreen').default} />
                <Stack.Screen
                    name="ShareVibe"
                    component={require('../screens/ShareVibeScreen').default}
                    options={{
                        presentation: 'transparentModal',
                        cardOverlayEnabled: true,
                        animationEnabled: true,
                    }}
                />
                <Stack.Screen name="AddToPlaylist" component={require('../screens/AddToPlaylistScreen').default} />
                <Stack.Screen name="ReportVibe" component={require('../screens/ReportVibeScreen').default} />
                <Stack.Screen name="Settings" component={require('../screens/SettingsScreen').default} />
                <Stack.Screen name="AccountCenter" component={require('../screens/AccountCenterScreen').default} />
                <Stack.Screen name="AccountManagement" component={require('../screens/AccountManagementScreen').default} />
                <Stack.Screen name="PastVibeHistory" component={require('../screens/PastVibeHistoryScreen').default} />
                <Stack.Screen name="MyVibeActivity" component={require('../screens/MyVibeActivityScreen').default} />
                <Stack.Screen name="Notification" component={require('../screens/NotificationScreen').default} />
                <Stack.Screen name="TimePlanning" component={require('../screens/TimePlanningScreen').default} />
                <Stack.Screen name="ClosePersons" component={require('../screens/ClosePersonsScreen').default} />
                <Stack.Screen name="BlockedVibes" component={require('../screens/BlockedVibesScreen').default} />
                <Stack.Screen name="VibeSetting" component={require('../screens/VibeSettingScreen').default} />
                <Stack.Screen name="ChatInteraction" component={require('../screens/ChatInteractionScreen').default} />
                <Stack.Screen name="TagsMentions" component={require('../screens/TagsMentionsScreen').default} />
                <Stack.Screen name="Comments" component={require('../screens/CommentsScreen').default} />
                <Stack.Screen name="PersonalDetails" component={require('../screens/PersonalDetailsScreen').default} />
                <Stack.Screen name="ContactInfo" component={require('../screens/ContactInfoScreen').default} />
                <Stack.Screen name="Profiles" component={require('../screens/ProfilesScreen').default} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
