import type { ApiOk } from './types';
import { apiClient } from './client';

export type AdminPlaceOwner = {
  Id: number;
  Name: string;
  Email: string;
};

export type AdminPlace = {
  Id: string;
  Name: string;
  Region: string;
  Category: string;
  Status: 'PENDING' | 'APPROVED' | 'REJECTED';
  RejectionReason: string | null;
  ReviewedAt: string | null;
  AverageRating: number;
  RatingCount: number;
  CoverImageUrl: string;
  About: string;
  FeatureLabel: string;
  Images: string[];
  Owner: AdminPlaceOwner | null;
};

export type AdminUser = {
  id: number;
  username: string | null;
  email: string;
  fullName: string | null;
  role: 'TRAVELER' | 'OWNER' | 'ADMIN';
  isBanned: boolean;
  createdAt: string;
  ownedPlacesCount: number;
  reviewsCount: number;
};

const firstString = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
  }
  return '';
};

const firstNumber = (...values: unknown[]): number => {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return 0;
};

const firstBoolean = (...values: unknown[]): boolean => {
  for (const value of values) {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value !== 0;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (['true', '1', 'yes', 'y', 'banned', 'ban', 'inactive', 'disabled'].includes(normalized)) return true;
      if (['false', '0', 'no', 'n', 'active', 'enabled'].includes(normalized)) return false;
    }
  }
  return false;
};

const normalizeRole = (value: unknown): AdminUser['role'] => {
  const role = typeof value === 'string' ? value.toUpperCase() : '';
  return role === 'OWNER' || role === 'ADMIN' ? role : 'TRAVELER';
};

const normalizeAdminUser = (raw: any): AdminUser => ({
  id: firstNumber(raw?.id, raw?.Id, raw?.userId, raw?.UserId),
  username: firstString(raw?.username, raw?.Username) || null,
  email: firstString(raw?.email, raw?.Email),
  fullName: firstString(raw?.fullName, raw?.FullName, raw?.name, raw?.Name) || null,
  role: normalizeRole(raw?.role ?? raw?.Role),
  isBanned: firstBoolean(raw?.isBanned, raw?.IsBanned, raw?.is_banned, raw?.banned, raw?.Banned, raw?.status, raw?.Status),
  createdAt: firstString(raw?.createdAt, raw?.CreatedAt, raw?.created_at, raw?.joinDate, raw?.JoinDate),
  ownedPlacesCount: firstNumber(raw?.ownedPlacesCount, raw?.OwnedPlacesCount, raw?.placesCount, raw?.PlacesCount),
  reviewsCount: firstNumber(raw?.reviewsCount, raw?.ReviewsCount, raw?.reviewCount, raw?.ReviewCount),
});

export async function fetchAdminPlaces(params?: {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  limit?: number;
  offset?: number;
}): Promise<{ items: AdminPlace[]; meta: { total: number; limit: number; offset: number } }> {
  const res = await apiClient.get<ApiOk<AdminPlace[]>>('/admin/places', { params });
  return {
    items: res.data.data,
    meta: {
      total: res.data.meta?.total ?? 0,
      limit: res.data.meta?.limit ?? 50,
      offset: res.data.meta?.offset ?? 0,
    },
  };
}

export async function approvePlace(placeId: string): Promise<{ ok: true; placeId: string }> {
  const res = await apiClient.post<{ ok: true; data: { ok: true; placeId: string } }>(
    `/admin/places/${placeId}/approve`
  );
  return res.data.data;
}

export async function rejectPlace(
  placeId: string,
  rejectionReason?: string
): Promise<{ ok: true; placeId: string }> {
  const res = await apiClient.post<{ ok: true; data: { ok: true; placeId: string } }>(
    `/admin/places/${placeId}/reject`,
    { rejectionReason }
  );
  return res.data.data;
}

export async function deleteAdminPlace(placeId: string): Promise<{ ok: true }> {
  const res = await apiClient.delete<{ ok: true; data: { ok: true } }>(
    `/admin/places/${placeId}`
  );
  return res.data.data;
}

export async function fetchAdminUsers(params?: {
  search?: string;
  role?: 'TRAVELER' | 'OWNER' | 'ADMIN';
  isBanned?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{ items: AdminUser[]; meta: { total: number; limit: number; offset: number } }> {
  const res = await apiClient.get<ApiOk<AdminUser[]>>('/admin/users', { params });
  return {
    items: Array.isArray(res.data.data) ? res.data.data.map(normalizeAdminUser) : [],
    meta: {
      total: res.data.meta?.total ?? 0,
      limit: res.data.meta?.limit ?? 50,
      offset: res.data.meta?.offset ?? 0,
    },
  };
}

export async function banUser(
  userId: number,
  isBanned: boolean,
  reason?: string
): Promise<{ ok: true; userId: number }> {
  const res = await apiClient.post<{ ok: true; data: { ok: true; userId: number } }>(
    `/admin/users/${userId}/ban`,
    { isBanned, reason }
  );
  return res.data.data;
}

export async function changeUserRole(
  userId: number,
  role: 'TRAVELER' | 'OWNER' | 'ADMIN'
): Promise<{ ok: true; userId: number }> {
  const res = await apiClient.patch<{ ok: true; data: { ok: true; userId: number } }>(
    `/admin/users/${userId}/role`,
    { role }
  );
  return res.data.data;
}
