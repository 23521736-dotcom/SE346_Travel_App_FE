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
  limit?: number;
  offset?: number;
}): Promise<{ items: AdminUser[]; meta: { total: number; limit: number; offset: number } }> {
  const res = await apiClient.get<ApiOk<AdminUser[]>>('/admin/users', { params });
  return {
    items: res.data.data,
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
