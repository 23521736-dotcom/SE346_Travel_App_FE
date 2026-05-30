import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_V1 } from '../config';

const TOKEN_KEY = 'travel_app_access_token';

export const apiClient = axios.create({
  baseURL: API_V1,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// request interceptor uses getAccessToken wrapper to avoid calling
// SecureStore methods that may not exist in some runtimes (web builds)
apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function hasLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch (_) {
    return false;
  }
}

export async function setAccessToken(token: string | null): Promise<void> {
  // prefer localStorage when available (web)
  try {
    if (hasLocalStorage()) {
      if (token) {
        window.localStorage.setItem(TOKEN_KEY, token);
      } else {
        window.localStorage.removeItem(TOKEN_KEY);
      }
      return;
    }
  } catch (_) {
    // ignore and fallback to SecureStore
  }

  // fallback to SecureStore with feature-detection
  try {
    if (token) {
      if (typeof (SecureStore as any).setItemAsync === 'function') {
        await (SecureStore as any).setItemAsync(TOKEN_KEY, token);
      } else if (typeof (SecureStore as any).setValueWithKeyAsync === 'function') {
        await (SecureStore as any).setValueWithKeyAsync(TOKEN_KEY, token);
      }
    } else {
      if (typeof (SecureStore as any).deleteItemAsync === 'function') {
        await (SecureStore as any).deleteItemAsync(TOKEN_KEY);
      } else if (typeof (SecureStore as any).deleteValueWithKeyAsync === 'function') {
        await (SecureStore as any).deleteValueWithKeyAsync(TOKEN_KEY);
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('setAccessToken fallback failed', e);
  }
}

export async function getAccessToken(): Promise<string | null> {
  try {
    if (hasLocalStorage()) {
      return window.localStorage.getItem(TOKEN_KEY);
    }
  } catch (_) {
    // ignore
  }

  try {
    if (typeof (SecureStore as any).getItemAsync === 'function') {
      return await (SecureStore as any).getItemAsync(TOKEN_KEY);
    }
    if (typeof (SecureStore as any).getValueWithKeyAsync === 'function') {
      return await (SecureStore as any).getValueWithKeyAsync(TOKEN_KEY);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('getAccessToken failed', e);
  }

  return null;
}

export function getApiErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data as any;
    if (data) {
      if (typeof data === 'string') return data;
      if (typeof data.error === 'string' && data.error) return data.error;
      if (typeof data.message === 'string' && data.message) return data.message;
      if (data.data) {
        if (typeof data.data.message === 'string') return data.data.message;
        if (typeof data.data.error === 'string') return data.data.error;
      }
      if (Array.isArray(data.errors) && data.errors.length) {
        const first = data.errors[0];
        if (typeof first === 'string') return first;
        if (first && typeof first.msg === 'string') return first.msg;
      }
      try {
        return JSON.stringify(data);
      } catch (_) {
        // fallthrough
      }
    }
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}
