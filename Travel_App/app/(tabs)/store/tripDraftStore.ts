export type Collaborator = {
  id: string;
  userId?: string | number;
  name: string;
  avatar: string;
};

export type ScheduleLocation = {
  id: string;
  placeId?: string;
  name: string;
  rating: string;
  image: string;
  time: string;
  period?: string;
  cost: string;
};

export type ItineraryDay = {
  dayId: string;
  title: string;
  date: string;
  locations: ScheduleLocation[];
};

export type TripData = {
  id?: string;
  title: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  hotel: string;
  duration: number;
  budget: number;
  currency?: string;
  members: Collaborator[];
  itineraryData?: ItineraryDay[];
};

const tripDrafts: Record<string, TripData> = {};
const listeners = new Set<(trip: TripData) => void>();
const deleteListeners = new Set<(tripId: string) => void>();

export function formatTripDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function parseTripDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getTripDayCount(startDate: Date | null, endDate: Date | null) {
  if (!startDate || !endDate) {
    return 1;
  }

  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const diffInDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return Math.max(diffInDays + 1, 1);
}

export function getTripDayDate(startDate: Date | null, day: number) {
  if (!startDate) {
    return 'Date not set';
  }

  const date = new Date(startDate);
  date.setDate(startDate.getDate() + day - 1);
  return formatTripDate(date);
}

function formatTripDayDate(value?: string) {
  const parsedDate = parseTripDate(value);
  return parsedDate ? formatTripDate(parsedDate) : value || undefined;
}

export function normalizeTripDays(trip: TripData): TripData {
  const startDate = parseTripDate(trip.startDate);
  const endDate = parseTripDate(trip.endDate);
  const duration = startDate && endDate ? getTripDayCount(startDate, endDate) : Math.max(trip.duration, 1);
  const date =
    startDate && endDate
      ? `${formatTripDate(startDate)} - ${formatTripDate(endDate)}`
      : trip.date;

  return {
    ...trip,
    duration,
    date,
    itineraryData: Array.from({ length: duration }, (_, index) => {
      const existingDay = trip.itineraryData?.[index];

      return {
        dayId: existingDay?.dayId || `day_${index + 1}`,
        title: existingDay?.title || `Day ${index + 1}`,
        date: formatTripDayDate(existingDay?.date) || getTripDayDate(startDate, index + 1),
        locations: existingDay?.locations || [],
      };
    }),
  };
}

export function getTripDraft(id?: string) {
  return id ? tripDrafts[id] : undefined;
}

export function upsertTripDraft(trip: TripData) {
  if (!trip.id) {
    return;
  }

  const normalizedTrip = normalizeTripDays(trip);
  tripDrafts[trip.id] = normalizedTrip;
  listeners.forEach((listener) => listener(normalizedTrip));
}

export function removeTripDraft(tripId?: string) {
  if (!tripId) {
    return;
  }

  delete tripDrafts[tripId];
  deleteListeners.forEach((listener) => listener(tripId));
}

export function subscribeTripDrafts(listener: (trip: TripData) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function subscribeTripDeletes(listener: (tripId: string) => void) {
  deleteListeners.add(listener);
  return () => {
    deleteListeners.delete(listener);
  };
}
