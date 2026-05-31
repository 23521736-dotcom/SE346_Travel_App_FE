import AddLocationScreen from './screens/AddLocationScreen';
import DashboardScreen from './screens/DashboardScreen';
import DetailLocationScreen from './screens/DetailLocationScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import EditTripDiaryScreen from './screens/EditTripDiaryScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen_email from './screens/ForgotPasswordScreen_email';
import ForgotPasswordScreen_OTP from './screens/ForgotPasswordScreen_OTP';
import ForgotPasswordScreen_resetPw from './screens/ForgotPasswordScreen_resetPw';
import LogoutScreen from './screens/LogoutScreen';
import TermsOfServiceScreen from './screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import MyTripScreen from './screens/MyTripScreen';
import NotificationScreenUser from './screens/NotificationScreen_user';
import OwnerManagementScreen from './screens/OwnerManagementScreen';
import PlanningTrip from './screens/PlanningTrip';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import SavedPlacesScreen from './screens/SavedPlacesScreen';
import TripDiaryScreen from './screens/TripDiaryScreen';
import ViewReviewsScreen from './screens/ViewReviewsScreen';
import WriteReviewScreen from './screens/WriteReviewScreen';
import EditingTripScreen from './screens/EditingTripScreen';
import AddLocationScreen_user from './screens/AddLocationScreen_user';
import AddCollaboratorsScreen from './screens/AddCollaboratorsScreen';

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from './common/colors';
import { AuthProvider, useAuth } from './context/AuthContext';
import { forgotPassword } from '@/lib/api/auth';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={() => ({
      tabBarActiveTintColor: '#00B4D8',
      tabBarInactiveTintColor: 'gray'
    })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false, tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved Places"
        component={SavedPlacesScreen}

        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="My Trip"
        component={MyTripScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreenUser}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }} />
    </Tab.Navigator>
  );
};

const OwnerTabs = () => {
  return (
    <Tab.Navigator screenOptions={() => ({
      tabBarActiveTintColor: '#00B4D8',
      tabBarInactiveTintColor: 'gray'
    })}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerShown: false, tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen name="New" component={OwnerManagementScreen}
        options={{
          headerShown: false,
          title: '',
          tabBarIcon: () => (
            <View style={{
              top: -15,
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#00B4D8',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#00B4D8',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 5,
              elevation: 8,
              borderWidth: 4,
              borderColor: '#FFFFFF',
            }}>
              <Ionicons
                name="add"
                size={38}
                color="white"
                style={{ fontWeight: 'bold' }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }} />
    </Tab.Navigator>
  );
};


const RootNavigation = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Terms of Service" component={TermsOfServiceScreen} />
        <Stack.Screen name="ForgotPassword_email" component={ForgotPasswordScreen_email} />
        <Stack.Screen name="ForgotPassword_OTP" component={ForgotPasswordScreen_OTP} />
        <Stack.Screen name="ForgotPassword_resetPw" component={ForgotPasswordScreen_resetPw} />
      </Stack.Navigator>
    );
  }

  return user.role === 'admin' ? (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={OwnerTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Add Location"
        component={AddLocationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Log Out"
        component={LogoutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Privacy Policy"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Terms of Service"
        component={TermsOfServiceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={{
          headerShown: true,
          presentation: 'modal',
          title: "Edit Profile",
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerShadowVisible: false,
          headerTintColor: '#000',
        }}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail Location"
        component={DetailLocationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PlanningTrip"
        component={PlanningTrip}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditingTrip"
        component={EditingTripScreen}
        options={{ headerShown: false }} />
      <Stack.Screen
        name="AddLocation_user"
        component={AddLocationScreen_user}
        options={{ headerShown: false }} />
      <Stack.Screen
        name="AddCollaborators"
        component={AddCollaboratorsScreen}
        options={{ headerShown: false }} />
      <Stack.Screen
        name="Trip Diary"
        component={TripDiaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edit Trip Diary"
        component={EditTripDiaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Log Out"
        component={LogoutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Privacy Policy"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Terms of Service"
        component={TermsOfServiceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="All Reviews"
        component={ViewReviewsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Write Review"
        component={WriteReviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={{
          headerShown: true,
          presentation: 'modal',
          title: "Edit Profile",
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerShadowVisible: false,
          headerTintColor: '#000',
        }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
