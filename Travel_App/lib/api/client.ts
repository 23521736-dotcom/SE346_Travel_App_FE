import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_V1 } from '../config';

const TOKEN_KEY = 'travel_app_access_token';
const REFRESH_TOKEN_KEY = 'travel_app_refresh_token';

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
     
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for automatic token refresh
let isRefreshing = false;
let failedQueue: { resolve: (value: string) => void; reject: (reason: unknown) => void }[] = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors and prevent infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Import refreshAccessToken function to avoid circular dependency
        const { refreshAccessToken } = await import('./auth');
        const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);

        // Store new tokens
        await storeTokens(accessToken, newRefreshToken);

        // Process queued requests with new token
        failedQueue.forEach(({ resolve }) => resolve(accessToken));
        failedQueue = [];

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - reject all queued requests and clear tokens
        failedQueue.forEach(({ reject }) => reject(refreshError));
        failedQueue = [];
        await clearTokens();

        // Note: Navigation to login should be handled by the auth context
        // which will detect the missing token
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

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
     
    console.warn('getAccessToken failed', e);
  }

  return null;
}

export async function setRefreshToken(token: string | null): Promise<void> {
  // prefer localStorage when available (web)
  try {
    if (hasLocalStorage()) {
      if (token) {
        window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
      } else {
        window.localStorage.removeItem(REFRESH_TOKEN_KEY);
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
        await (SecureStore as any).setItemAsync(REFRESH_TOKEN_KEY, token);
      } else if (typeof (SecureStore as any).setValueWithKeyAsync === 'function') {
        await (SecureStore as any).setValueWithKeyAsync(REFRESH_TOKEN_KEY, token);
      }
    } else {
      if (typeof (SecureStore as any).deleteItemAsync === 'function') {
        await (SecureStore as any).deleteItemAsync(REFRESH_TOKEN_KEY);
      } else if (typeof (SecureStore as any).deleteValueWithKeyAsync === 'function') {
        await (SecureStore as any).deleteValueWithKeyAsync(REFRESH_TOKEN_KEY);
      }
    }
  } catch (e) {
     
    console.warn('setRefreshToken fallback failed', e);
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    if (hasLocalStorage()) {
      return window.localStorage.getItem(REFRESH_TOKEN_KEY);
    }
  } catch (_) {
    // ignore
  }

  try {
    if (typeof (SecureStore as any).getItemAsync === 'function') {
      return await (SecureStore as any).getItemAsync(REFRESH_TOKEN_KEY);
    }
    if (typeof (SecureStore as any).getValueWithKeyAsync === 'function') {
      return await (SecureStore as any).getValueWithKeyAsync(REFRESH_TOKEN_KEY);
    }
  } catch (e) {
     
    console.warn('getRefreshToken failed', e);
  }

  return null;
}

export async function clearTokens(): Promise<void> {
  await setAccessToken(null);
  await setRefreshToken(null);
}

export async function storeTokens(accessToken: string, refreshToken: string): Promise<void> {
  await setAccessToken(accessToken);
  await setRefreshToken(refreshToken);
}

export function getApiErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    if (err.code === 'ERR_CANCELED' || err.code === 'ECONNABORTED' || err.message.toLowerCase().includes('timeout')) {
      return 'Save request timed out. Please check that the backend is running, then try again.';
    }
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
      if (data.issues?.fieldErrors) {
        const firstField = Object.keys(data.issues.fieldErrors)[0];
        const firstMessage = firstField ? data.issues.fieldErrors[firstField]?.[0] : null;
        if (firstMessage) return `${firstField}: ${firstMessage}`;
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
