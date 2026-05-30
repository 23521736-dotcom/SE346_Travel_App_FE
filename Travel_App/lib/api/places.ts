import type { ApiOk, PlaceDetail, PlaceListItem } from './types';
import { normalizePlaceDetail, normalizePlaceListItem } from './types';
import { apiClient } from './client';

const categoryQuery: Record<string, string> = {
  Attractions: 'attractions',
  Dining: 'dining',
  Festivals: 'festivals',
};

export async function fetchPlaces(category: string): Promise<PlaceListItem[]> {
  const q = categoryQuery[category] ?? 'attractions';
  const res = await apiClient.get<ApiOk<PlaceListItem[]>>('/places', {
    params: { category: q, limit: 50 },
  });
  return res.data.data.map((item) => normalizePlaceListItem(item as any));
}

export async function fetchPlaceDetail(placeId: string): Promise<PlaceDetail> {
  const res = await apiClient.get<ApiOk<PlaceDetail>>(`/places/${placeId}`);
  return normalizePlaceDetail(res.data.data as any);
}
