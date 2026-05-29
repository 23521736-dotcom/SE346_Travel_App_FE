import type { ApiOk, ReviewListItem } from './types';
import { apiClient } from './client';

export async function fetchPlaceReviews(placeId: string): Promise<ReviewListItem[]> {
  const res = await apiClient.get<ApiOk<ReviewListItem[]>>(`/places/${placeId}/reviews`, {
    params: { limit: 50 },
  });
  return res.data.data;
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
  return res.data.data;
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
