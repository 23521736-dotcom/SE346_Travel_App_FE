import { apiClient, getApiErrorMessage } from './client';

export type OptimizedActivity = {
  placeId: string;
  title: string;
  scheduledTime: string; // "HH:MM"
  period: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  estimatedCost: number;
  estimatedDuration: number; // minutes
  travelFromPrevious: number; // minutes
  travelDistance: number; // km
  sortOrder: number;
};

export type OptimizedDay = {
  dayNumber: number;
  date: string;
  activities: OptimizedActivity[];
  totalEstimatedCost: number;
  totalDuration: number;
  totalTravelDistance: number;
};

export type OptimizationSummary = {
  totalPlaces: number;
  totalEstimatedCost: number;
  totalDuration: number;
  averageDailyDuration: number;
  totalTravelDistance: number;
  unassignedPlaces: string[];
};

export type OptimizationResult = {
  days: OptimizedDay[];
  summary: OptimizationSummary;
};

export type OptimizeItineraryRequest = {
  placeIds: string[];
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  dailyStartTime?: string; // HH:MM, default "08:00"
  dailyEndTime?: string; // HH:MM, default "22:00"
  maxBudget?: number;
  preferenceWeights?: Record<string, number>;
};

export async function optimizeItinerary(request: OptimizeItineraryRequest): Promise<OptimizationResult> {
  try {
    const res = await apiClient.post<{ ok: boolean; data: OptimizationResult }>('/itinerary/optimize', request);
    return res.data.data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }
}

export async function getPlaceDuration(placeId: string): Promise<number> {
  try {
    const res = await apiClient.get<{ ok: boolean; data: { duration: number } }>(
      '/itinerary/durations/' + placeId
    );
    return res.data.data.duration;
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }
}
