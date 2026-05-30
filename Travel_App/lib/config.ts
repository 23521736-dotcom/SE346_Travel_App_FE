import Constants from 'expo-constants';
import { Platform } from 'react-native';

function resolveApiBaseUrl(): string | undefined {
  if (Platform.OS === 'web') {
    try {
      const host = typeof window !== 'undefined' && window.location?.hostname ? window.location.hostname : 'localhost';
      return `http://${host}:8000`;
    } catch {
      return 'http://localhost:8000';
    }
  }

  return (
    (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ||
    process.env.EXPO_PUBLIC_API_BASE_URL
  );
}

const apiBaseUrl = resolveApiBaseUrl();

if (!apiBaseUrl) {
  throw new Error('Missing EXPO_PUBLIC_API_BASE_URL');
}

export const API_BASE_URL = apiBaseUrl.replace(/\/$/, '');

export const API_V1 = `${API_BASE_URL}/api/v1`;
