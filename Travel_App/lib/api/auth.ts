import type { ApiOk, AuthResponse, RegisterRole } from './types';
import { apiClient, setAccessToken, setRefreshToken, storeTokens, clearTokens, getRefreshToken } from './client';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await apiClient.post<ApiOk<AuthResponse>>('/auth/login', { email, password });
  const { accessToken, refreshToken } = res.data.data;
  await storeTokens(accessToken, refreshToken);
  return res.data.data;
}

export async function register(
  email: string,
  password: string,
  fullName?: string,
  role: RegisterRole = 'TRAVELER'
): Promise<AuthResponse> {
  const res = await apiClient.post<ApiOk<AuthResponse>>('/auth/register', {
    email,
    password,
    fullName,
    name: fullName, // Add name for backend compatibility
    role,
  });
  // Note: registration may or may not return tokens depending on backend implementation
  // If backend returns tokens, store them; otherwise user needs to login separately
  if (res.data.data.accessToken && res.data.data.refreshToken) {
    const { accessToken, refreshToken } = res.data.data;
    await storeTokens(accessToken, refreshToken);
  }
  return res.data.data;
}

export async function logout(): Promise<void> {
  try {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      await apiClient.post('/auth/logout', { refreshToken });
    }
  } catch (error) {
    // Ignore logout API errors - always clear local tokens
    console.warn('Logout API call failed:', error);
  } finally {
    await clearTokens();
  }
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const res = await apiClient.post<ApiOk<{ message: string }>>('/auth/forgot-password', { email });
  return res.data.data;
}

export async function resetPassword(email: string, otp: string, password: string): Promise<{ message: string }> {
  const res = await apiClient.post<ApiOk<{ message: string }>>('/auth/change-password-otp', {
    email,
    otp,
    newPassword: password,
  });
  return res.data.data;
}

export async function oauthLogin(provider: 'google' | 'apple', idToken: string, role?: string): Promise<AuthResponse & { isNewUser?: boolean }> {
  const res = await apiClient.post<ApiOk<AuthResponse & { isNewUser?: boolean }>>(`/auth/oauth/${provider}`, {
    idToken,
    role,
  });
  const { accessToken, refreshToken } = res.data.data;
  await storeTokens(accessToken, refreshToken);
  return res.data.data;
}

export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await apiClient.post<ApiOk<{ accessToken: string; refreshToken: string }>>('/auth/refresh', {
    refreshToken,
  });
  return res.data.data;
}
