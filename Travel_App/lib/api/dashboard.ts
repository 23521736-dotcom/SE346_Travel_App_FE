import type { ApiOk } from './types';
import { apiClient } from './client';

export type DashboardMetricPair = {
  before: number;
  after: number;
};

export type DashboardSummary = {
  placeId: string;
  placeName: string;
  saves: number;
  growthPercent: number;
};

export type DashboardPromotionImpact = {
  campaignId: string;
  campaignName: string;
  placeId: string;
  placeName: string;
  comments: DashboardMetricPair;
  saves: DashboardMetricPair;
  badReviews: DashboardMetricPair;
};

export type DashboardPlacePerformance = {
  id: string;
  name: string;
  imageUrl: string;
  averageRating: number;
  ratingCount: number;
  comments: number;
  saves: number;
  badReviews: number;
};

export type OwnerDashboardData = {
  summary: DashboardSummary;
  campaigns: DashboardPromotionImpact[];
  places: DashboardPlacePerformance[];
};

type RawReview = {
  Rate?: number;
  rate?: number;
  Rating?: number;
  rating?: number;
  ratingValue?: number;
  createdAt?: string;
  CreatedAt?: string;
  date?: string;
  Date?: string;
  updatedAt?: string;
  UpdatedAt?: string;
};

type RawPromotion = {
  id?: string | number;
  Id?: string | number;
  title?: string;
  name?: string;
  Name?: string;
  activeAt?: string;
  ActiveAt?: string;
  createdAt?: string;
  CreatedAt?: string;
  comments?: unknown;
  saves?: unknown;
  badReviews?: unknown;
};

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function toStringValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return '';
}

function toMetricPair(value: unknown): DashboardMetricPair {
  const raw = value as Partial<DashboardMetricPair> | undefined;

  return {
    before: toNumber(raw?.before),
    after: toNumber(raw?.after),
  };
}

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function getReviewRating(review: RawReview): number {
  return toNumber(review.rating ?? review.Rate ?? review.rate ?? review.Rating ?? review.ratingValue);
}

function getReviewTime(review: RawReview): number | null {
  const value =
    review.createdAt ??
    review.CreatedAt ??
    review.date ??
    review.Date ??
    review.updatedAt ??
    review.UpdatedAt;
  if (!value) {
    return null;
  }

  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

function getCampaignStartTime(rawCampaign: any): number | null {
  const value =
    rawCampaign?.activeAt ??
    rawCampaign?.ActiveAt ??
    rawCampaign?.startDate ??
    rawCampaign?.startAt ??
    rawCampaign?.startedAt ??
    rawCampaign?.promotionStartDate ??
    rawCampaign?.createdAt ??
    rawCampaign?.CreatedAt ??
    rawCampaign?.schedule?.startDate;

  if (!value) {
    return null;
  }

  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

function splitReviewsByPromotion(reviews: RawReview[], rawCampaign: any): DashboardMetricPair {
  const startTime = getCampaignStartTime(rawCampaign);

  if (!startTime) {
    return { before: 0, after: reviews.length };
  }

  return reviews.reduce<DashboardMetricPair>(
    (acc, review) => {
      const reviewTime = getReviewTime(review);
      if (reviewTime !== null && reviewTime < startTime) {
        acc.before += 1;
      } else {
        acc.after += 1;
      }

      return acc;
    },
    { before: 0, after: 0 }
  );
}

function countBadReviews(reviews: RawReview[]): number {
  return getBadReviews(reviews).length;
}

function getBadReviews(reviews: RawReview[]): RawReview[] {
  return reviews.filter((review) => {
    const rating = getReviewRating(review);
    return rating > 0 && rating < 3;
  });
}

function splitBadReviewsByPromotion(reviews: RawReview[], rawCampaign: any): DashboardMetricPair {
  const startTime = getCampaignStartTime(rawCampaign);

  if (!startTime) {
    return { before: 0, after: countBadReviews(reviews) };
  }

  return reviews.reduce<DashboardMetricPair>(
    (acc, review) => {
      const rating = getReviewRating(review);
      if (rating <= 0 || rating >= 3) {
        return acc;
      }

      const reviewTime = getReviewTime(review);
      if (reviewTime !== null && reviewTime < startTime) {
        acc.before += 1;
      } else {
        acc.after += 1;
      }

      return acc;
    },
    { before: 0, after: 0 }
  );
}

function normalizeBadReviewPair(rawCampaign: any, reviews: RawReview[]): DashboardMetricPair {
  const pair = rawCampaign?.badReviews ?? rawCampaign?.badReviewCount;
  if (Array.isArray(pair)) {
    return splitBadReviewsByPromotion(pair, rawCampaign);
  }

  if (pair && typeof pair === 'object') {
    return toMetricPair(pair);
  }

  if (
    rawCampaign?.badReviewsBefore !== undefined ||
    rawCampaign?.badReviewsAfter !== undefined ||
    rawCampaign?.badReviewBefore !== undefined ||
    rawCampaign?.badReviewAfter !== undefined
  ) {
    return {
      before: toNumber(rawCampaign.badReviewsBefore ?? rawCampaign.badReviewBefore),
      after: toNumber(rawCampaign.badReviewsAfter ?? rawCampaign.badReviewAfter),
    };
  }

  return splitBadReviewsByPromotion(reviews, rawCampaign);
}

function buildCampaignsFromPlaces(rawPlaces: any[]): DashboardPromotionImpact[] {
  return rawPlaces.flatMap((place) => {
    const placeId = toStringValue(place.id ?? place.placeId ?? place.Id);
    const placeName = toStringValue(place.name ?? place.placeName ?? place.Name);
    const reviews = toArray<RawReview>(place.reviews ?? place.Reviews);
    const promotions = toArray<RawPromotion>(place.promotions ?? place.Promotions);

    return promotions.map((promotion) => ({
      campaignId: toStringValue(promotion.id ?? promotion.Id),
      campaignName: toStringValue(promotion.title ?? promotion.name ?? promotion.Name),
      placeId,
      placeName,
      comments: promotion.comments ? toMetricPair(promotion.comments) : splitReviewsByPromotion(reviews, promotion),
      saves: promotion.saves ? toMetricPair(promotion.saves) : { before: 0, after: 0 },
      badReviews: normalizeBadReviewPair(promotion, reviews),
    }));
  });
}

function normalizeDashboard(raw: any | null | undefined): OwnerDashboardData {
  if (!raw) {
    return {
      summary: {
        placeId: '',
        placeName: '',
        saves: 0,
        growthPercent: 0,
      },
      campaigns: [],
      places: [],
    };
  }

  const rawPlaces = toArray<any>(raw.places);
  const reviewsByPlaceId = new Map<string, RawReview[]>();

  const places = rawPlaces.map((place) => {
    const id = toStringValue(place.id ?? place.placeId ?? place.Id);
    const reviews = toArray<RawReview>(place.reviews ?? place.Reviews);
    const badReviewItems = getBadReviews(reviews);
    const providedBadReviewItems = toArray<RawReview>(place.badReviews ?? place.badReviewItems);
    reviewsByPlaceId.set(id, reviews);

    return {
      ...place,
      id,
      name: toStringValue(place.name ?? place.placeName ?? place.Name),
      imageUrl: toStringValue(place.imageUrl ?? place.coverImageUrl ?? place.Image ?? place.image),
      averageRating: toNumber(place.averageRating ?? place.Rate),
      ratingCount: toNumber(place.ratingCount ?? place.NumberOfRate),
      comments: toNumber(place.comments),
      saves: toNumber(place.saves),
      badReviews:
        providedBadReviewItems.length > 0
          ? providedBadReviewItems.length
          : toNumber(place.badReviewCount ?? place.badReviewsCount) || badReviewItems.length,
    };
  });

  const rawCampaigns = toArray<any>(raw.campaigns);
  const campaigns = (rawCampaigns.length > 0 ? rawCampaigns : buildCampaignsFromPlaces(rawPlaces)).map((campaign) => {
    const placeId = toStringValue(campaign.placeId ?? campaign.PlaceId);
    const campaignReviews = toArray<RawReview>(campaign.reviews ?? campaign.Reviews);
    const placeReviews = reviewsByPlaceId.get(placeId) ?? [];
    const reviews = campaignReviews.length > 0 ? campaignReviews : placeReviews;

    return {
      ...campaign,
      campaignId: toStringValue(campaign.campaignId ?? campaign.id ?? campaign.Id),
      campaignName: toStringValue(campaign.campaignName ?? campaign.title ?? campaign.name ?? campaign.Name),
      placeId,
      placeName: toStringValue(campaign.placeName ?? campaign.PlaceName),
      comments: toMetricPair(campaign.comments),
      saves: toMetricPair(campaign.saves),
      badReviews: normalizeBadReviewPair(campaign, reviews),
    };
  });

  return {
    ...raw,
    summary: {
      ...raw.summary,
      placeId: toStringValue(raw.summary?.placeId),
      placeName: toStringValue(raw.summary?.placeName),
      saves: toNumber(raw.summary?.saves),
      growthPercent: toNumber(raw.summary?.growthPercent),
    },
    campaigns,
    places,
  };
}

export async function fetchOwnerDashboard(ownerId: number): Promise<OwnerDashboardData> {
  const res = await apiClient.get<ApiOk<OwnerDashboardData>>('/owner/dashboard', {
    params: { ownerId },
  });

  return normalizeDashboard(res.data.data);
}
