import { apiClient } from './client';
import type { ApiOk } from './types';

export type ApiTripLocation = {
  id?: string | number;
  Id?: string | number;
  placeId?: string | number;
  name?: string;
  Name?: string;
  rating?: string | number;
  Rate?: string | number;
  image?: string;
  Image?: string;
  time?: string;
  Time?: string;
  cost?: string | number;
  Cost?: string | number;
};

export type ApiTripActivity = {
  id?: string | number;
  placeId?: string | number | null;
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  period?: string | null;
  scheduledTime?: string | null;
  estimatedCost?: string | number | null;
  rating?: string | number | null;
  sortOrder?: number | null;
  place?: {
    id?: string | number;
    name?: string;
    region?: string;
    coverImageUrl?: string | null;
    averageRating?: string | number | null;
  } | null;
};

export type ApiTripDay = {
  id?: string | number;
  dayId?: string | number;
  DayId?: string | number;
  dayNumber?: number;
  title?: string;
  Title?: string;
  date?: string;
  Date?: string;
  estimatedBudget?: string | number | null;
  locationCount?: number;
  isExpanded?: boolean;
  activities?: ApiTripActivity[];
  locations?: ApiTripLocation[];
  Locations?: ApiTripLocation[];
};

export type ApiTripMember = {
  id?: string | number;
  userId?: string | number;
  name?: string;
  fullName?: string;
  username?: string;
  avatar?: string;
  avatarUrl?: string;
};

export type ApiTrip = {
  id?: string | number;
  Id?: string | number;
  title?: string;
  Title?: string;
  name?: string;
  Name?: string;
  date?: string;
  Date?: string;
  startDate?: string;
  StartDate?: string;
  start_date?: string;
  endDate?: string;
  EndDate?: string;
  end_date?: string;
  image?: string;
  Image?: string;
  coverImageUrl?: string;
  destination?: string | null;
  currentHotel?: {
    name?: string | null;
    place?: {
      id?: string | number;
      name?: string;
      region?: string;
      coverImageUrl?: string | null;
    } | null;
  };
  hotel?: string;
  Hotel?: string;
  duration?: number;
  Duration?: number;
  durationDays?: number;
  budget?: number;
  Budget?: number;
  totalBudgetPerPerson?: number;
  currency?: string;
  Currency?: string;
  status?: string;
  Status?: string;
  members?: ApiTripMember[];
  Members?: ApiTripMember[];
  collaborators?: ApiTripMember[];
  itineraryData?: ApiTripDay[];
  itinerary?: ApiTripDay[];
  days?: ApiTripDay[];
};

export async function fetchMyTrips(): Promise<ApiTrip[]> {
  const res = await apiClient.get<ApiOk<ApiTrip[]>>('/users/me/trips');
  return res.data.data;
}

export async function fetchTripById(tripId: string): Promise<ApiTrip> {
  try {
    const res = await apiClient.get<ApiOk<ApiTrip>>(`/trips/${encodeURIComponent(tripId)}`);
    return res.data.data;
  } catch (error) {
    const trips = await fetchMyTrips();
    const trip = trips.find((item) => String(item.id ?? item.Id ?? '') === String(tripId));

    if (trip) {
      return trip;
    }

    throw error;
  }
}
