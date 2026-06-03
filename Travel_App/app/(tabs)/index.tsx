import ForgotPasswordScreen_email from './screens/auth/ForgotPasswordScreen_email';
import ForgotPasswordScreen_OTP from './screens/auth/ForgotPasswordScreen_OTP';
import ForgotPasswordScreen_resetPw from './screens/auth/ForgotPasswordScreen_resetPw';
import LoginScreen from './screens/auth/LoginScreen';
import LogoutScreen from './screens/auth/LogoutScreen';
import PrivacyPolicyScreen from './screens/auth/PrivacyPolicyScreen';
import ProfileScreen from './screens/auth/ProfileScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import TermsOfServiceScreen from './screens/auth/TermsOfServiceScreen';
import AddLocationScreen from './screens/owner/AddLocationScreen';
import DashboardScreen from './screens/owner/DashboardScreen';
import OwnerManagementScreen from './screens/owner/OwnerManagementScreen';
import AddCollaboratorsScreen from './screens/user/AddCollaboratorsScreen';
import AddLocationScreen_user from './screens/user/AddLocationScreen_user';
import DetailLocationScreen from './screens/user/DetailLocationScreen';
import EditingTripScreen from './screens/user/EditingTripScreen';
import EditProfileScreen from './screens/user/EditProfileScreen';
import EditTripDiaryScreen from './screens/user/EditTripDiaryScreen';
import HomeScreen from './screens/user/HomeScreen';
import MyTripScreen from './screens/user/MyTripScreen';
import NotificationScreenUser from './screens/user/NotificationScreen_user';
import PlanningTrip from './screens/user/PlanningTrip';
import SavedPlacesScreen from './screens/user/SavedPlacesScreen';
import TripDiaryScreen from './screens/user/TripDiaryScreen';
import ViewReviewsScreen from './screens/user/ViewReviewsScreen';
import WriteReviewScreen from './screens/user/WriteReviewScreen';
import SmartPlanningScreen from './screens/user/SmartPlanningScreen';
import DashboardFee_Admin from './screens/Admin/DashboardFee_Admin';
import DashboardPlace_Admin from './screens/Admin/DashboardPlace_Admin';
import DashboardUser_Admin from './screens/Admin/DashboardUser_Admin';

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from './common/colors';
import { AuthProvider, useAuth } from './context/AuthContext';

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

const AdminTabs = () => {
  return (
    <Tab.Navigator screenOptions={() => ({
      tabBarActiveTintColor: '#00B4D8',
      tabBarInactiveTintColor: 'gray'
    })}>
      <Tab.Screen
        name="User"
        component={DashboardUser_Admin}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Place"
        component={DashboardPlace_Admin}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Fee"
        component={DashboardFee_Admin}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card" size={size} color={color} />
          ),
        }}
      />
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

  const role = user.role.toLowerCase();
  const isAdmin = role === 'admin';
  const isOwner = role === 'owner';

  if (isAdmin) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={AdminTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  return isOwner ? (
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
      <Stack.Screen
        name="SmartPlanning"
        component={SmartPlanningScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <RootNavigation />
  );
}
