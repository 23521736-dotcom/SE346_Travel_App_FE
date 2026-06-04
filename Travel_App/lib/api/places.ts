import type { PromotionItem } from '../types/promotion';
import type { ApiOk, PlaceDetail, PlaceListItem } from './types';
import { normalizePlaceDetail, normalizePlaceListItem } from './types';
import { apiClient } from './client';
import { normalizePlaceCategory } from '../placeCategories';

export async function fetchPlaces(params?: {
  category?: string;
  search?: string;
  region?: string;
  minRating?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}): Promise<PlaceListItem[]> {
  const category = params?.category ? normalizePlaceCategory(params.category) : undefined;

  const queryParams: Record<string, any> = {
    limit: params?.limit || 50,
    offset: params?.offset || 0,
  };

  if (category) queryParams.category = category;
  if (params?.search) queryParams.search = params.search;
  if (params?.region) queryParams.region = params.region;
  if (params?.minRating !== undefined) queryParams.minRating = params.minRating;
  if (params?.maxPrice !== undefined) queryParams.maxPrice = params.maxPrice;

  const res = await apiClient.get<ApiOk<PlaceListItem[]>>('/places', {
    params: queryParams,
  });
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
  const uniquePlaceIds = Array.from(new Set(placeIds.filter(Boolean)));
  const entries: Array<readonly [string, boolean]> = [];
  const batchSize = 4;

  for (let index = 0; index < uniquePlaceIds.length; index += batchSize) {
    const batch = uniquePlaceIds.slice(index, index + batchSize);
    const batchEntries = await Promise.all(
      batch.map(async (placeId) => {
        try {
          const promotions = await fetchPlacePromotions(placeId);
          return [placeId, promotions.some((promotion) => promotion.isActive !== false)] as const;
        } catch {
          return [placeId, false] as const;
        }
      })
    );
    entries.push(...batchEntries);
  }

  return new Set(entries.filter(([, hasPromotion]) => hasPromotion).map(([placeId]) => placeId));
}
