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
};

export type DashboardPlacePerformance = {
  id: string;
  name: string;
  imageUrl: string;
  averageRating: number;
  ratingCount: number;
  comments: number;
  saves: number;
};

export type OwnerDashboardData = {
  summary: DashboardSummary;
  campaigns: DashboardPromotionImpact[];
  places: DashboardPlacePerformance[];
};

export async function fetchOwnerDashboard(ownerId: number): Promise<OwnerDashboardData> {
  const res = await apiClient.get<ApiOk<OwnerDashboardData>>('/owner/dashboard', {
    params: { ownerId },
  });

  return res.data.data;
}
