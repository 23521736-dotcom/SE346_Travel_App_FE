import type { PromotionItem } from '../../app/(tabs)/types/promotion';
import type { ApiOk, PlaceListItem } from './types';
import { apiClient } from './client';

export type OwnerPlace = PlaceListItem;

export type OwnerPlaceDetail = OwnerPlace & {
  category: string;
  about: string;
  featureLabel: string;
  priceLevel: number | null;
  latitude: number | null;
  longitude: number | null;
  promotions: PromotionItem[];
};

export type OwnerPromotionBody = {
  title: string;
  isActive?: boolean;
  schedule: PromotionItem['schedule'];
};
//type cho body gửi lên BE khi tạo hoặc sửa địa điểm.
export type OwnerPlaceBody = {
  name: string;
  region: string;
  category: string;
  about: string;
  coverImageUrl: string;
  imageUrls?: string[];
  featureLabel?: string;
  priceLevel?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  promotions?: OwnerPromotionBody[];
};

export async function fetchOwnerPlaces(ownerId: number): Promise<OwnerPlace[]> {
  const res = await apiClient.get<ApiOk<OwnerPlace[]>>('/owner/places', {
    params: { ownerId },
  });
  return res.data.data;
}

export async function fetchOwnerPlace(placeId: string): Promise<OwnerPlaceDetail> {
  const res = await apiClient.get<ApiOk<OwnerPlaceDetail>>(`/owner/places/${placeId}`);
  return res.data.data;
}

export async function createOwnerPlace(body: OwnerPlaceBody): Promise<OwnerPlace> {
  const res = await apiClient.post<ApiOk<OwnerPlace>>('/owner/places', body);
  return res.data.data;
}

export async function updateOwnerPlace(
  placeId: string,
  body: Partial<OwnerPlaceBody>
): Promise<OwnerPlace> {
  const res = await apiClient.patch<ApiOk<OwnerPlace>>(`/owner/places/${placeId}`, body);
  return res.data.data;
}

export async function deleteOwnerPlace(placeId: string): Promise<void> {
  await apiClient.delete(`/owner/places/${placeId}`);
}

export async function fetchPlacePromotions(placeId: string): Promise<PromotionItem[]> {
  const res = await apiClient.get<ApiOk<PromotionItem[]>>(`/owner/places/${placeId}/promotions`);
  return res.data.data;
}

export async function createPromotion(
  placeId: string,
  body: OwnerPromotionBody
): Promise<PromotionItem> {
  const res = await apiClient.post<ApiOk<PromotionItem>>(`/owner/places/${placeId}/promotions`, body);
  return res.data.data;
}

export async function updatePromotion(
  promotionId: string,
  body: Partial<{ title: string; isActive: boolean; schedule: PromotionItem['schedule'] }>
): Promise<PromotionItem> {
  const res = await apiClient.patch<ApiOk<PromotionItem>>(`/owner/promotions/${promotionId}`, body);
  return res.data.data;
}

export async function togglePromotion(promotionId: string): Promise<PromotionItem> {
  const res = await apiClient.post<ApiOk<PromotionItem>>(`/owner/promotions/${promotionId}/toggle`);
  return res.data.data;
}

export async function deletePromotion(promotionId: string): Promise<void> {
  await apiClient.delete(`/owner/promotions/${promotionId}`);
}
