import type { ApiOk, PlaceDetail, PlaceListItem } from './types';
import { normalizePlaceDetail, normalizePlaceListItem } from './types';
import { apiClient } from './client';
import { normalizePlaceCategory } from '../placeCategories';

export async function fetchPlaces(category?: string): Promise<PlaceListItem[]> {
  const q = normalizePlaceCategory(category);
  const res = await apiClient.get<ApiOk<PlaceListItem[]>>('/places', {
    params: q ? { category: q, limit: 50 } : { limit: 50 },
  });
  return res.data.data.map((item) => normalizePlaceListItem(item as any));
}

export async function fetchPlaceDetail(placeId: string): Promise<PlaceDetail> {
  const res = await apiClient.get<ApiOk<PlaceDetail>>(`/places/${placeId}`);
  return normalizePlaceDetail(res.data.data as any);
}
