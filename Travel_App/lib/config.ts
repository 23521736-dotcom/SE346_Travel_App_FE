const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error('Missing EXPO_PUBLIC_API_BASE_URL');
}

export const API_BASE_URL = apiBaseUrl.replace(/\/$/, '');

export const API_V1 = `${API_BASE_URL}/api/v1`;
