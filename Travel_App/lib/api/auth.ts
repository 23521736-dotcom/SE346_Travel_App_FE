import type { ApiOk, AuthResponse, RegisterRole } from './types';
import { apiClient, setAccessToken } from './client';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await apiClient.post<ApiOk<AuthResponse>>('/auth/login', { email, password });
  await setAccessToken(res.data.data.accessToken);
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
    role,
  });
  return res.data.data;
}

export async function logout(): Promise<void> {
  await setAccessToken(null);
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const res = await apiClient.post<ApiOk<{ message: string }>>('/auth/forgot-password', { email });
  return res.data.data;
}

export async function oauthLogin(provider: 'google' | 'apple', idToken: string, role?: string): Promise<AuthResponse & { isNewUser?: boolean }> {
  const res = await apiClient.post<ApiOk<AuthResponse & { isNewUser?: boolean }>>(`/auth/oauth/${provider}`, {
    idToken,
    role,
  });
  await setAccessToken(res.data.data.accessToken);
  return res.data.data;
}
