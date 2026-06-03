import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { FloatingChatbot } from '@/components/chatbot/FloatingChatbot';
import { AuthProvider, useAuth } from './(tabs)/context/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
        {user && <FloatingChatbot />}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <RootLayoutContent />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
