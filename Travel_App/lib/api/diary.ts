import { apiClient } from './client';
import type { ApiOk } from './types';

export type DiaryImage = {
  id: string;
  url: string;
  sortOrder: number;
};

export type TripDiaryEntry = {
  id: string;
  tripId: string;
  title: string;
  content: string;
  locationName?: string | null;
  occurredAt: string;
  createdAt?: string;
  updatedAt?: string;
  imageUrls: string[];
  images?: DiaryImage[];
  trip?: {
    id: string;
    title: string;
    startDate?: string;
    endDate?: string;
    coverImageUrl?: string | null;
  };
};

export type TripDiaryInput = {
  title: string;
  content: string;
  locationName?: string | null;
  occurredAt: string | Date;
  imageUrls?: string[];
};

function normalizeDiaryEntry(raw: any): TripDiaryEntry {
  const images = Array.isArray(raw?.images) ? raw.images : [];
  const imageUrls = Array.isArray(raw?.imageUrls)
    ? raw.imageUrls
    : images.map((image: any) => image.url).filter(Boolean);

  return {
    id: String(raw.id),
    tripId: String(raw.tripId),
    title: raw.title || 'Untitled memory',
    content: raw.content || '',
    locationName: raw.locationName ?? null,
    occurredAt: raw.occurredAt,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    imageUrls,
    images,
    trip: raw.trip,
  };
}

function toOccurredAt(value: string | Date) {
  return value instanceof Date ? value.toISOString() : value;
}

function buildDiaryPayload(input: TripDiaryInput) {
  return {
    title: input.title.trim(),
    content: input.content.trim(),
    locationName: input.locationName?.trim() || null,
    occurredAt: toOccurredAt(input.occurredAt),
    imageUrls: input.imageUrls ?? [],
  };
}

function buildDiaryUpdatePayload(input: Partial<TripDiaryInput>) {
  return {
    ...(input.title !== undefined ? { title: input.title.trim() } : {}),
    ...(input.content !== undefined ? { content: input.content.trim() } : {}),
    ...(input.locationName !== undefined ? { locationName: input.locationName?.trim() || null } : {}),
    ...(input.occurredAt !== undefined ? { occurredAt: toOccurredAt(input.occurredAt) } : {}),
    ...(input.imageUrls !== undefined ? { imageUrls: input.imageUrls } : {}),
  };
}

export async function fetchTripDiary(tripId: string): Promise<TripDiaryEntry[]> {
  const res = await apiClient.get<ApiOk<TripDiaryEntry[]>>(`/trips/${tripId}/diary`);
  return res.data.data.map(normalizeDiaryEntry);
}

export async function createTripDiaryEntry(
  tripId: string,
  input: TripDiaryInput
): Promise<TripDiaryEntry> {
  const res = await apiClient.post<ApiOk<TripDiaryEntry>>(
    `/trips/${tripId}/diary`,
    buildDiaryPayload(input)
  );
  return normalizeDiaryEntry(res.data.data);
}

export async function updateTripDiaryEntry(
  entryId: string,
  input: Partial<TripDiaryInput>
): Promise<TripDiaryEntry> {
  const res = await apiClient.patch<ApiOk<TripDiaryEntry>>(
    `/trip-diaries/${entryId}`,
    buildDiaryUpdatePayload(input)
  );
  return normalizeDiaryEntry(res.data.data);
}

export async function deleteTripDiaryEntry(entryId: string): Promise<void> {
  await apiClient.delete(`/trip-diaries/${entryId}`);
}
