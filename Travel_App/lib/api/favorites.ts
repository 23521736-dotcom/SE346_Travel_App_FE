import type { ApiOk, PlaceListItem } from './types';
import { normalizePlaceListItem } from './types';
import { apiClient } from './client';

export async function fetchFavorites(limit?: number, offset?: number): Promise<PlaceListItem[]> {
  const params: Record<string, any> = {};
  if (limit !== undefined) params.limit = limit;
  if (offset !== undefined) params.offset = offset;

  const res = await apiClient.get<ApiOk<PlaceListItem[]>>('/users/me/favorites', { params });
  return res.data.data.map((item) => normalizePlaceListItem(item as any));
}

export async function addFavorite(placeId: string): Promise<void> {
  await apiClient.post(`/users/me/favorites/places/${placeId}`);
}

export async function removeFavorite(placeId: string): Promise<void> {
  await apiClient.delete(`/users/me/favorites/places/${placeId}`);
}
