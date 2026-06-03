import { apiClient, getApiErrorMessage } from './client';

// ==================== Types ====================

export type RecommendationPlace = {
  placeId: string;
  name: string;
  region: string;
  category: string;
  coverImageUrl: string;
  featureLabel: string;
  averageRating: number;
  ratingCount: number;
  priceLevel: number | null;
  score: number;
  explanation: string;
  matchPercentage: number;
};

export type RecommendationsResponse = {
  contentBased: RecommendationPlace[];
  serendipity: RecommendationPlace[];
  collaborative: RecommendationPlace[];
  tfidfSimilar: RecommendationPlace[];
  trending: RecommendationPlace[];
};

// ==================== API Functions ====================

export async function fetchRecommendations(limit?: number): Promise<RecommendationsResponse> {
  try {
    const params = limit ? { limit } : {};
    const res = await apiClient.get<{ ok: boolean; data: RecommendationsResponse }>(
      '/recommendations',
      { params }
    );
    return res.data.data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }
}

export async function fetchSimilarPlaces(placeId: string, limit?: number): Promise<RecommendationPlace[]> {
  try {
    const params = limit ? { limit } : {};
    const res = await apiClient.get<{ ok: boolean; data: RecommendationPlace[] }>(
      `/recommendations/similar/${placeId}`,
      { params }
    );
    return res.data.data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }
}

export async function fetchTrending(limit?: number): Promise<RecommendationPlace[]> {
  try {
    const params = limit ? { limit } : {};
    const res = await apiClient.get<{ ok: boolean; data: RecommendationPlace[] }>(
      '/recommendations/trending',
      { params }
    );
    return res.data.data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }
}
