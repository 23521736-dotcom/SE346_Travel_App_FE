import type { PromotionItem } from '../types/promotion';
import type { ApiOk, PlaceDetail, PlaceListItem } from './types';
import { normalizePlaceDetail, normalizePlaceListItem } from './types';
import { apiClient } from './client';
import { normalizePlaceCategory } from '../placeCategories';

export async function fetchPlaces(category?: string, limit?: number, offset?: number): Promise<PlaceListItem[]> {
  const q = normalizePlaceCategory(category);
  const params: Record<string, any> = q ? { category: q } : {};
  if (limit !== undefined) params.limit = limit;
  if (offset !== undefined) params.offset = offset;
  if (!params.limit) params.limit = 50;

  const res = await apiClient.get<ApiOk<PlaceListItem[]>>('/places', { params });
  return res.data.data.map((item) => normalizePlaceListItem(item as any));
}

export async function fetchPlaceDetail(placeId: string): Promise<PlaceDetail> {
  const res = await apiClient.get<ApiOk<PlaceDetail>>(`/places/${placeId}`);
  return normalizePlaceDetail(res.data.data as any);
}

export async function fetchPlacePromotions(placeId: string): Promise<PromotionItem[]> {
  const res = await apiClient.get<ApiOk<PromotionItem[]>>(`/places/${placeId}/promotions`);
  return res.data.data;
}

export async function fetchPromotionPlaceIds(placeIds: string[]): Promise<Set<string>> {
  const entries = await Promise.all(
    placeIds.map(async (placeId) => {
      try {
        const promotions = await fetchPlacePromotions(placeId);
        return [placeId, promotions.some((promotion) => promotion.isActive !== false)] as const;
      } catch {
        return [placeId, false] as const;
      }
    })
  );

  return new Set(entries.filter(([, hasPromotion]) => hasPromotion).map(([placeId]) => placeId));
}
