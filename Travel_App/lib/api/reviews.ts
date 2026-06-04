import type { ApiOk, ReviewListItem } from './types';
import { normalizeReviewListItem } from './types';
import { apiClient } from './client';

function unwrapReviewsResponse(raw: unknown): unknown[] {
  if (Array.isArray(raw)) {
    return raw;
  }

  if (!raw || typeof raw !== 'object') {
    return [];
  }

  const data = (raw as any).data;
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === 'object') {
    const nested = (data as any).reviews ?? (data as any).items ?? (data as any).results ?? (data as any).rows;
    if (Array.isArray(nested)) {
      return nested;
    }
  }

  const nested = (raw as any).reviews ?? (raw as any).items ?? (raw as any).results ?? (raw as any).rows;
  return Array.isArray(nested) ? nested : [];
}

export async function fetchPlaceReviews(placeId: string, limit?: number, offset?: number): Promise<ReviewListItem[]> {
  const params: Record<string, any> = {};
  if (limit !== undefined) params.limit = limit;
  if (offset !== undefined) params.offset = offset;
  if (!params.limit) params.limit = 50;

  const res = await apiClient.get<ApiOk<ReviewListItem[]>>(`/places/${placeId}/reviews`, { params });
  return unwrapReviewsResponse(res.data).map((item) => normalizeReviewListItem(item as any));
}

export async function createReview(
  placeId: string,
  body: { rating: number; content: string; imageUrls?: string[] }
): Promise<void> {
  await apiClient.post(`/places/${placeId}/reviews`, body);
}

export async function updateReview(
  reviewId: string,
  body: { rating: number; content: string; imageUrls?: string[] }
): Promise<ReviewListItem> {
  const res = await apiClient.patch<ApiOk<ReviewListItem>>(`/reviews/${reviewId}`, body);
  return normalizeReviewListItem(res.data.data as any);
}

export async function deleteReview(reviewId: string): Promise<void> {
  await apiClient.delete(`/reviews/${reviewId}`);
}

export async function toggleReviewLike(reviewId: string): Promise<{ liked: boolean; likes: number }> {
  const res = await apiClient.post<ApiOk<{ liked: boolean; likes: number }>>(
    `/reviews/${reviewId}/likes/toggle`
  );
  return res.data.data;
}
