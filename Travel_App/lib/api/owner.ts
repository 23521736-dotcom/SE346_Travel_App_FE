import type { PromotionItem } from '../types/promotion';
import type { ApiOk } from './types';
import { apiClient } from './client';

export type OwnerPlace = {
  Id: string;
  Name: string;
  Location: string;
  Image: string;
};

export type OwnerPlaceDetail = OwnerPlace & {
  category: string;
  about: string;
  featureLabel: string;
  priceLevel: number | null;
  latitude: number | null;
  longitude: number | null;
  promotions: PromotionItem[];
};

export async function fetchOwnerPlaces(): Promise<OwnerPlace[]> {
  const res = await apiClient.get<ApiOk<OwnerPlace[]>>('/owner/places');
  return res.data.data;
}

export async function fetchOwnerPlace(placeId: string): Promise<OwnerPlaceDetail> {
  const res = await apiClient.get<ApiOk<OwnerPlaceDetail>>(`/owner/places/${placeId}`);
  return res.data.data;
}

export async function createOwnerPlace(body: {
  name: string;
  region: string;
  category: string;
  about: string;
  coverImageUrl: string;
  featureLabel?: string;
  promotions?: { title: string; isActive?: boolean; schedule: PromotionItem['schedule'] }[];
}): Promise<OwnerPlace> {
  const res = await apiClient.post<ApiOk<OwnerPlace>>('/owner/places', body);
  return res.data.data;
}

export async function updateOwnerPlace(
  placeId: string,
  body: Partial<{
    name: string;
    region: string;
    category: string;
    about: string;
    coverImageUrl: string;
    featureLabel: string;
  }>
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
  body: { title: string; isActive?: boolean; schedule: PromotionItem['schedule'] }
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
