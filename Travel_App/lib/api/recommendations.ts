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

const firstString = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return '';
};

const unwrapDecimalLike = (value: unknown): unknown => {
  if (!value || typeof value !== 'object') {
    return value;
  }

  const decimal = value as { toNumber?: () => number; toString?: () => string };
  if (typeof decimal.toNumber === 'function') {
    try {
      return decimal.toNumber();
    } catch {
      // Fall back to toString below.
    }
  }

  if (typeof decimal.toString === 'function' && decimal.toString !== Object.prototype.toString) {
    return decimal.toString();
  }

  return value;
};

const firstNumber = (...values: unknown[]): number => {
  for (const rawValue of values) {
    const value = unwrapDecimalLike(rawValue);
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return 0;
};

const firstNullableNumber = (...values: unknown[]): number | null => {
  for (const rawValue of values) {
    const value = unwrapDecimalLike(rawValue);
    if (value === null) {
      return null;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return null;
};

const normalizeRecommendationPlace = (raw: any): RecommendationPlace => ({
  placeId: firstString(raw?.placeId, raw?.id, raw?.Id, raw?.PlaceId, raw?.place_id),
  name: firstString(raw?.name, raw?.Name),
  region: firstString(raw?.region, raw?.Located, raw?.Location, raw?.location),
  category: firstString(raw?.category, raw?.Category),
  coverImageUrl: firstString(raw?.coverImageUrl, raw?.image, raw?.Image),
  featureLabel: firstString(raw?.featureLabel, raw?.Features, raw?.features),
  averageRating: firstNumber(raw?.averageRating, raw?.Rate, raw?.rate),
  ratingCount: firstNumber(raw?.ratingCount, raw?.NumberOfRate, raw?.numberOfRate),
  priceLevel: firstNullableNumber(raw?.priceLevel, raw?.PriceLevel, raw?.price, raw?.Price),
  score: firstNumber(raw?.score, raw?.Score),
  explanation: firstString(raw?.explanation, raw?.Explanation),
  matchPercentage: firstNumber(raw?.matchPercentage, raw?.MatchPercentage, raw?.match_percentage),
});

const normalizeRecommendationList = (raw: unknown): RecommendationPlace[] => (
  Array.isArray(raw) ? raw.map((item) => normalizeRecommendationPlace(item)) : []
);

const normalizeRecommendationsResponse = (raw: any): RecommendationsResponse => ({
  contentBased: normalizeRecommendationList(raw?.contentBased),
  serendipity: normalizeRecommendationList(raw?.serendipity),
  collaborative: normalizeRecommendationList(raw?.collaborative),
  tfidfSimilar: normalizeRecommendationList(raw?.tfidfSimilar),
  trending: normalizeRecommendationList(raw?.trending),
});

// ==================== API Functions ====================

export async function fetchRecommendations(limit?: number): Promise<RecommendationsResponse> {
  try {
    const params = limit ? { limit } : {};
    const res = await apiClient.get<{ ok: boolean; data: RecommendationsResponse }>(
      '/recommendations',
      { params }
    );
    return normalizeRecommendationsResponse(res.data.data);
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
    return normalizeRecommendationList(res.data.data);
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
    return normalizeRecommendationList(res.data.data);
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }
}
