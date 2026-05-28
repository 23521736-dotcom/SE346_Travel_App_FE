import AddLocationScreen from './screens/AddLocationScreen';
import DashboardScreen from './screens/DashboardScreen';
import DetailLocationScreen from './screens/DetailLocationScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import EditTripDiaryScreen from './screens/EditTripDiaryScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import LogoutScreen from './screens/LogoutScreen';
import MyTripScreen from './screens/MyTripScreen';
import OwnerManagementScreen from './screens/OwnerManagementScreen';
import PlanningTrip from './screens/PlanningTrip';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import TripDiaryScreen from './screens/TripDiaryScreen';
import TripSettingScreen from './screens/TripSettingScreen';
import ViewReviewsScreen from './screens/ViewReviewsScreen';

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
        name="My Trip"
        component={MyTripScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
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
        name="TripSetting"
        component={TripSettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PlanningTrip"
        component={PlanningTrip}
        options={{ headerShown: false }}
      />
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
        name="All Reviews"
        component={ViewReviewsScreen}
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
