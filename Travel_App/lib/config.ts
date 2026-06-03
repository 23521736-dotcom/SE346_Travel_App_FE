import Constants from 'expo-constants';
import { Platform } from 'react-native';

function isLocalhostUrl(value?: string | null): boolean {
  if (!value) return false;
  return /:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i.test(value);
}

function getExpoHostUrl(port: number): string | null {
  const hostUri =
    (Constants.expoConfig as any)?.hostUri ||
    (Constants as any)?.expoGoConfig?.debuggerHost ||
    (Constants as any)?.manifest2?.extra?.expoClient?.hostUri ||
    (Constants as any)?.manifest?.debuggerHost;

  if (!hostUri || typeof hostUri !== 'string') {
    return null;
  }

  const host = hostUri.split(':')[0]?.trim();
  if (!host) {
    return null;
  }

  if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') {
    return null;
  }

  return `http://${host}:${port}`;
}

function defaultApiBaseUrl(): string {
  const expoHostUrl = getExpoHostUrl(8000);
  if (expoHostUrl) {
    return expoHostUrl;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }
  return 'http://10.208.131.222:8000';
}

function resolveApiBaseUrl(): string {
  // Biến môi trường luôn được ưu tiên cao nhất – kể cả localhost
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (envUrl) {
    return envUrl;
  }

  // Tiếp theo là extra config trong app.json
  const extraUrl = (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined)?.trim();
  if (extraUrl) {
    return extraUrl;
  }

  // Cuối cùng là fallback mặc định
  return defaultApiBaseUrl();
}

export const API_BASE_URL =
  resolveApiBaseUrl();

export const API_V1 = `${API_BASE_URL}/api/v1`;