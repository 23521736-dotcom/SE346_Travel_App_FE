import { Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from './context/ThemeContext';

export default function TabLayout() {
    const { colors: themeColors } = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: themeColors.primary,
                headerShown: false,
                tabBarStyle: {
                    display: 'none'
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Trang chủ',
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Khám phá',
                }}
            />
            <Tabs.Screen name="AuthStyles" options={{ href: null }} />
            <Tabs.Screen name="screens/auth/LoginScreen" options={{ href: null }} />
            <Tabs.Screen name="screens/auth/RegisterScreen" options={{ href: null }} />
        </Tabs>
    );
}
