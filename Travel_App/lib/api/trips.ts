import type { ApiOk } from './types';
import { apiClient } from './client';

const MY_TRIPS_PATH = '/users/me/trips';
const TRIPS_PATH = '/trips';
const TRIP_SAVE_TIMEOUT_MS = 60000;
const defaultTripImage =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop';

export type ApiTripLocation = {
  id?: string | number;
  Id?: string | number;
  placeId?: string | number;
  name?: string;
  Name?: string;
  location?: string;
  Location?: string;
  region?: string;
  Located?: string;
  category?: string;
  Category?: string;
  description?: string;
  Description?: string;
  rating?: string | number;
  Rate?: string | number;
  image?: string;
  Image?: string;
  time?: string;
  Time?: string;
  cost?: string | number;
  Cost?: string | number;
  price?: string | number | null;
  Price?: string | number | null;
  priceLevel?: string | number | null;
  PriceLevel?: string | number | null;
  estimatedCost?: string | number | null;
  EstimatedCost?: string | number | null;
};

export type ApiTripActivity = {
  id?: string | number;
  placeId?: string | number | null;
  title?: string | null;
  description?: string | null;
  location?: string | null;
  region?: string | null;
  category?: string | null;
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
    location?: string;
    category?: string | null;
    description?: string | null;
    coverImageUrl?: string | null;
    averageRating?: string | number | null;
    priceLevel?: string | number | null;
    price?: string | number | null;
    cost?: string | number | null;
    estimatedCost?: string | number | null;
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
  tripId?: string | number;
  trip_id?: string | number;

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

export type TripDraftLocation = {
  id?: string | number;
  placeId?: string | number | null;
  name?: string;
  title?: string;
  location?: string | null;
  category?: string | null;
  description?: string | null;
  rating?: string | number | null;
  image?: string | null;
  imageUrl?: string | null;
  time?: string | null;
  scheduledTime?: string | null;
  period?: string | null;
  cost?: string | number | null;
  estimatedCost?: string | number | null;
};

export type AddTripDayPlaceBody = {
  placeId: string | number;
  title?: string;
  imageUrl?: string | null;
  period?: string | null;
  scheduledTime?: string | null;
  estimatedCost?: string | number | null;
  rating?: string | number | null;
  sortOrder?: number | null;
};

export type TripDraftDay = {
  dayId?: string | number | null;
  id?: string | number | null;
  title?: string | null;
  date?: string | Date | null;
  locations?: TripDraftLocation[];
};

export type TripDraftPayload = {
  id?: string | number;
  title?: string;
  date?: string;
  destination?: string | null;
  hotel?: string | null;
  hotelPlaceId?: string | null;
  currentHotelName?: string | null;
  currentHotelPlaceId?: string | null;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  image?: string | null;
  coverImageUrl?: string | null;
  budget?: number;
  duration?: number;
  currency?: string;
  members?: {
    id?: string | number;
    userId?: string | number;
    name?: string | null;
    fullName?: string | null;
    username?: string | null;
    avatar?: string | null;
    avatarUrl?: string | null;
  }[];
  itineraryData?: TripDraftDay[];
};

type TripsResponse =
  | ApiTrip[]
  | {
    trips?: ApiTrip[];
    items?: ApiTrip[];
    results?: ApiTrip[];
    rows?: ApiTrip[];
  };

function normalizeTripsResponse(data: TripsResponse | undefined): ApiTrip[] {
  if (Array.isArray(data)) {
    return data;
  }

  return data?.trips ?? data?.items ?? data?.results ?? data?.rows ?? [];
}

export async function fetchMyTrips(): Promise<ApiTrip[]> {
  let res;
  try {
    res = await apiClient.get<ApiOk<TripsResponse> | TripsResponse>(MY_TRIPS_PATH);
  } catch (error: any) {
    if (error?.response?.status !== 404) {
      throw error;
    }
    res = await apiClient.get<ApiOk<TripsResponse> | TripsResponse>(TRIPS_PATH);
  }
  const body = res.data as ApiOk<TripsResponse> | TripsResponse;
  const payload = Array.isArray(body) ? body : 'data' in body ? body.data : body;

  return normalizeTripsResponse(payload);

}

function unwrapTripPayload(payload: ApiOk<ApiTrip> | ApiTrip) {
  return Array.isArray(payload) || !payload || !('data' in payload)
    ? (payload as ApiTrip)
    : payload.data;
}

export function getApiTripId(trip?: ApiTrip | null) {
  const rawId = trip?.id ?? trip?.Id ?? trip?.tripId ?? trip?.trip_id;
  return rawId === null || rawId === undefined || rawId === '' ? undefined : String(rawId);
}

function toIsoDate(value: unknown, fallback?: Date) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === 'string' && value.trim()) {
    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString();
    }
  }

  return fallback?.toISOString();
}

function addDays(date: Date, daysToAdd: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  return nextDate;
}

function toNumber(value: unknown, fallback = 0) {
  const numberValue = typeof value === 'number' ? value : Number(String(value ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function optionalString(value: unknown) {
  if (typeof value === 'string') {
    return value.trim() || undefined;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
}

function optionalNullableString(value: unknown) {
  return optionalString(value) ?? null;
}

function getTimeStartHour(value: unknown) {
  const rawTime = String(value ?? '').split(/\s*[-–]\s*/)[0].trim();
  const match = rawTime.match(/^(\d{1,2})(?::([0-5]\d))?\s*(AM|PM)?$/i);
  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem) {
    if (hour < 1 || hour > 12) {
      return null;
    }

    if (meridiem === 'PM' && hour < 12) {
      hour += 12;
    }

    if (meridiem === 'AM' && hour === 12) {
      hour = 0;
    }
  } else if (hour > 23) {
    return null;
  }

  return hour;
}

function normalizePeriod(value: unknown, time?: unknown) {
  const hour = getTimeStartHour(time);
  if (hour !== null) {
    if (hour < 12) {
      return 'MORNING';
    }

    if (hour < 18) {
      return 'AFTERNOON';
    }

    return 'EVENING';
  }

  const normalized = typeof value === 'string' ? value.trim().toUpperCase() : '';
  if (normalized === 'MORNING' || normalized === 'AFTERNOON' || normalized === 'EVENING' || normalized === 'NIGHT') {
    return normalized === 'NIGHT' ? 'EVENING' : normalized;
  }

  if (normalized.includes('AFTERNOON') || normalized.includes('NOON')) {
    return 'AFTERNOON';
  }

  if (normalized.includes('EVENING') || normalized.includes('NIGHT')) {
    return 'EVENING';
  }

  return 'MORNING';
}

function isBackendId(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 && !/^day_\d+$/i.test(value);
}

function buildTripWritePayload(body: TripDraftPayload | Record<string, unknown>) {
  const trip = body as TripDraftPayload;
  const now = new Date();
  const startDate = new Date(toIsoDate(trip.startDate, now) ?? now.toISOString());
  const endDate = new Date(toIsoDate(trip.endDate, startDate) ?? startDate.toISOString());
  const itineraryData = Array.isArray(trip.itineraryData) ? trip.itineraryData : [];
  const coverImageUrl = optionalNullableString(trip.coverImageUrl ?? trip.image);

  return {
    title: String(trip.title || 'New Trip').trim(),
    destination: trip.destination ?? null,
    hotel: optionalNullableString(trip.hotel ?? trip.currentHotelName),
    hotelPlaceId: optionalNullableString(trip.hotelPlaceId ?? trip.currentHotelPlaceId),
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    image: coverImageUrl,
    coverImageUrl,
    budget: toNumber(trip.budget),
    currency: trip.currency || 'VND',
    members: (trip.members || [])
      .map((member) => ({
        userId: member.userId,
        name: optionalString(member.name ?? member.fullName ?? member.username),
        avatarUrl: optionalString(member.avatarUrl ?? member.avatar),
      }))
      .filter((member) => member.userId !== undefined || Boolean(member.name)),
    itineraryData: itineraryData.map((day, dayIndex) => ({
      dayId: isBackendId(day.dayId) ? String(day.dayId) : undefined,
      title: day.title || `Day ${dayIndex + 1}`,
      date: toIsoDate(day.date, addDays(startDate, dayIndex)),
      locations: (day.locations || []).map((location, locationIndex) => ({
        id: location.placeId && location.id !== location.placeId && isBackendId(location.id)
          ? String(location.id)
          : undefined,
        placeId: optionalString(location.placeId),
        title: location.title || location.name || 'Selected location',
        imageUrl: optionalNullableString(location.imageUrl ?? location.image),
        period: normalizePeriod(location.period, location.scheduledTime ?? location.time),
        scheduledTime: location.scheduledTime ?? location.time ?? null,
        estimatedCost: toNumber(location.estimatedCost ?? location.cost),
        rating: toNumber(location.rating, 0),
        sortOrder: locationIndex + 1,
      })),
    })),
  };
}

function createTimeoutSignal(timeoutMs: number) {
  if (typeof AbortController === 'undefined') {
    return {};
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}

function formatDisplayDate(value?: string | Date | null) {
  if (!value) {
    return 'Date not set';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatActivityTime(period?: string | null, scheduledTime?: string | null) {
  return scheduledTime || period || 'Time not set';
}

function getTripDateRange(startDate?: string, endDate?: string, fallback?: string) {
  if (fallback) {
    return fallback;
  }

  if (startDate && endDate) {
    return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
  }

  return undefined;
}

export function mapApiTripToDraft(apiTrip: ApiTrip): TripDraftPayload {
  const id = getApiTripId(apiTrip);
  const startDate = apiTrip.startDate ?? apiTrip.StartDate ?? apiTrip.start_date;
  const endDate = apiTrip.endDate ?? apiTrip.EndDate ?? apiTrip.end_date;
  const members = apiTrip.members ?? apiTrip.Members ?? apiTrip.collaborators ?? [];
  const itinerary = apiTrip.itineraryData ?? apiTrip.itinerary ?? apiTrip.days ?? [];
  const image =
    apiTrip.image ??
    apiTrip.Image ??
    apiTrip.coverImageUrl ??
    apiTrip.currentHotel?.place?.coverImageUrl ??
    defaultTripImage;

  return {
    id,
    title: apiTrip.title ?? apiTrip.Title ?? apiTrip.name ?? apiTrip.Name ?? apiTrip.destination ?? 'Untitled Trip',
    date: getTripDateRange(startDate, endDate, apiTrip.date ?? apiTrip.Date),
    startDate,
    endDate,
    image,
    coverImageUrl: apiTrip.coverImageUrl ?? image,
    hotel: apiTrip.currentHotel?.name ?? apiTrip.hotel ?? apiTrip.Hotel ?? 'Not selected',
    duration: apiTrip.durationDays ?? apiTrip.duration ?? apiTrip.Duration ?? 1,
    budget: apiTrip.budget ?? apiTrip.Budget ?? apiTrip.totalBudgetPerPerson ?? 0,
    currency: apiTrip.currency ?? apiTrip.Currency ?? 'VND',
    members: members.map((member) => ({
      id: String(member.id ?? member.userId ?? member.name ?? member.username ?? ''),
      userId: member.userId,
      name: member.name ?? member.fullName ?? member.username ?? 'Member',
      avatar: member.avatar ?? member.avatarUrl ?? '',
    })),
    itineraryData: itinerary.map((day, dayIndex) => ({
      dayId: String(day.dayId ?? day.DayId ?? day.id ?? `day_${dayIndex + 1}`),
      title: day.title ?? day.Title ?? `Day ${day.dayNumber ?? dayIndex + 1}`,
      date: formatDisplayDate(day.date ?? day.Date),
      locations: (day.activities?.length ? day.activities : day.locations ?? day.Locations ?? []).map(
        (activity: ApiTripActivity | ApiTripLocation, activityIndex: number) => {
          const activityData = activity as ApiTripActivity;
          const locationData = activity as ApiTripLocation;

          return {
            id: String(activityData.id ?? locationData.id ?? locationData.Id ?? `${dayIndex + 1}-${activityIndex + 1}`),
            placeId: activityData.placeId ? String(activityData.placeId) : locationData.placeId ? String(locationData.placeId) : undefined,
            name: activityData.title ?? activityData.place?.name ?? locationData.name ?? locationData.Name ?? 'Selected location',
            location:
              activityData.location ??
              activityData.region ??
              activityData.place?.location ??
              activityData.place?.region ??
              locationData.location ??
              locationData.Location ??
              locationData.region ??
              locationData.Located ??
              'Location not set',
            category:
              activityData.category ??
              activityData.place?.category ??
              locationData.category ??
              locationData.Category ??
              undefined,
            description:
              activityData.description ??
              activityData.place?.description ??
              locationData.description ??
              locationData.Description ??
              undefined,
            rating: String(activityData.rating ?? activityData.place?.averageRating ?? locationData.rating ?? locationData.Rate ?? '0'),
            image:
              activityData.imageUrl ??
              activityData.place?.coverImageUrl ??
              locationData.image ??
              locationData.Image ??
              defaultTripImage,
            time: formatActivityTime(activityData.period, activityData.scheduledTime ?? locationData.time ?? locationData.Time),
            period: normalizePeriod(activityData.period, activityData.scheduledTime ?? locationData.time ?? locationData.Time),
            cost: String(
              activityData.estimatedCost ??
              activityData.place?.estimatedCost ??
              activityData.place?.cost ??
              activityData.place?.price ??
              activityData.place?.priceLevel ??
              locationData.estimatedCost ??
              locationData.EstimatedCost ??
              locationData.cost ??
              locationData.Cost ??
              locationData.price ??
              locationData.Price ??
              locationData.priceLevel ??
              locationData.PriceLevel ??
              0
            ),
          };
        }
      ),
    })),
  };
}

export async function createTrip(body: Record<string, unknown>): Promise<ApiTrip> {
  const timeout = createTimeoutSignal(TRIP_SAVE_TIMEOUT_MS);
  try {
    const res = await apiClient.post<ApiOk<ApiTrip> | ApiTrip>(
      TRIPS_PATH,
      buildTripWritePayload(body),
      { signal: timeout.signal, timeout: TRIP_SAVE_TIMEOUT_MS }
    );
    return unwrapTripPayload(res.data as ApiOk<ApiTrip> | ApiTrip);
  } finally {
    timeout.clear?.();
  }
}

export async function updateTrip(tripId: string, body: Record<string, unknown>): Promise<ApiTrip> {
  const timeout = createTimeoutSignal(TRIP_SAVE_TIMEOUT_MS);
  try {
    const res = await apiClient.put<ApiOk<ApiTrip> | ApiTrip>(
      `${TRIPS_PATH}/${tripId}`,
      buildTripWritePayload(body),
      { signal: timeout.signal, timeout: TRIP_SAVE_TIMEOUT_MS }
    );
    return unwrapTripPayload(res.data as ApiOk<ApiTrip> | ApiTrip);
  } finally {
    timeout.clear?.();
  }
}

export async function deleteTrip(tripId: string): Promise<void> {
  await apiClient.delete<ApiOk<{ ok?: boolean }> | { ok?: boolean }>(`${TRIPS_PATH}/${tripId}`);
}

export async function addPlaceToTripDay(
  tripId: string,
  dayId: string,
  body: AddTripDayPlaceBody
): Promise<ApiTrip> {
  const res = await apiClient.post<ApiOk<ApiTrip> | ApiTrip>(
    `${TRIPS_PATH}/${tripId}/days/${dayId}/places`,
    body
  );
  return unwrapTripPayload(res.data as ApiOk<ApiTrip> | ApiTrip);
}

export async function removePlaceFromTripDay(
  tripId: string,
  dayId: string,
  placeId: string
): Promise<ApiTrip> {
  const res = await apiClient.delete<ApiOk<ApiTrip> | ApiTrip>(
    `${TRIPS_PATH}/${tripId}/days/${dayId}/places/${placeId}`
  );
  return unwrapTripPayload(res.data as ApiOk<ApiTrip> | ApiTrip);
}

export async function upsertTripToBackend(
  body: Record<string, unknown>,
  tripId?: string
): Promise<ApiTrip> {
  if (tripId) {
    return updateTrip(tripId, body);
  }

  return createTrip(body);
}
