import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { getApiErrorMessage } from "../../../lib/api/client";
import { ApiTrip, fetchMyTrips } from "../../../lib/api/trips";
import { colors } from "../common/colors";
import {
  getTripDraft,
  ItineraryDay,
  normalizeTripDays,
  subscribeTripDrafts,
  TripData,
  upsertTripDraft,
} from "../store/tripDraftStore";
import styles from "./MyTripScreen.styles";

type Trip = {
  id: string;
  title: string;
  date: string;
  startDate?: string;
  endDate?: string;
  image: string;
  avatars?: string[];
  extraCount?: number;
  collaboratorLabel?: string;
  status?: "hold";
  muted?: boolean;
  hotel?: string;
  duration?: number;
  budget?: number;
  currency?: string;
  itineraryData?: ItineraryDay[];
};

const defaultTripImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop";

function formatApiDateRange(startDate?: string, endDate?: string, fallback?: string) {
  if (fallback) {
    return fallback;
  }

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
    return `${start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;
  }

  return "Choose your travel dates";
}

function formatApiFullDate(value?: string) {
  if (!value) {
    return "Date not set";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toNumber(value: unknown, fallback = 0) {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function formatMoney(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  if (typeof value === "number") {
    return String(value);
  }

  const numericValue = Number(value);
  if (Number.isFinite(numericValue)) {
    return String(numericValue);
  }

  return String(value);
}

function getCostValue(cost: string) {
  return Number(cost.replace(/[^0-9.]/g, '')) || 0;
}

function getTripTotalBudget(days?: ItineraryDay[]) {
  return days?.reduce(
    (tripSum, day) =>
      tripSum + day.locations.reduce((daySum, location) => daySum + getCostValue(location.cost), 0),
    0
  ) ?? 0;
}

function formatVnd(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatActivityTime(period?: string | null, scheduledTime?: string | null) {
  return scheduledTime || period || "Time not set";
}

function isPastTrip(trip: Trip) {
  if (!trip.endDate) {
    return false;
  }

  const endDate = new Date(trip.endDate);
  if (Number.isNaN(endDate.getTime())) {
    return false;
  }

  endDate.setHours(23, 59, 59, 999);
  return endDate.getTime() < Date.now();
}

function mapApiTrip(apiTrip: ApiTrip): Trip {
  const id = String(apiTrip.id ?? apiTrip.Id ?? apiTrip.tripId ?? apiTrip.trip_id ?? "");
  const startDate = apiTrip.startDate ?? apiTrip.StartDate ?? apiTrip.start_date;
  const endDate = apiTrip.endDate ?? apiTrip.EndDate ?? apiTrip.end_date;
  const members = apiTrip.members ?? apiTrip.Members ?? apiTrip.collaborators ?? [];
  const itinerary = apiTrip.itineraryData ?? apiTrip.itinerary ?? apiTrip.days;
  const status = apiTrip.status ?? apiTrip.Status;
  const hotelName = apiTrip.currentHotel?.name ?? apiTrip.hotel ?? apiTrip.Hotel ?? "Not selected";
  const coverImage =
    apiTrip.image ??
    apiTrip.Image ??
    apiTrip.coverImageUrl ??
    apiTrip.currentHotel?.place?.coverImageUrl ??
    defaultTripImage;

  const itineraryData = itinerary?.map((day, index) => ({
    dayId: String(day.dayId ?? day.DayId ?? day.id ?? `day_${day.dayNumber ?? index + 1}`),
    title: day.title ?? day.Title ?? `Day ${day.dayNumber ?? index + 1}`,
    date: formatApiFullDate(day.date ?? day.Date),
    locations: day.activities?.length
      ? day.activities.map((activity, activityIndex) => ({
        id: String(activity.id ?? activity.placeId ?? `${index + 1}-${activityIndex + 1}`),
        name: activity.title ?? activity.place?.name ?? "Selected activity",
        rating: String(activity.rating ?? activity.place?.averageRating ?? "0"),
        image: activity.imageUrl ?? activity.place?.coverImageUrl ?? defaultTripImage,
        time: formatActivityTime(activity.period, activity.scheduledTime),
        period: activity.period ?? undefined,
        cost: formatMoney(activity.estimatedCost),
      }))
      : (day.locations ?? day.Locations ?? []).map((location, locationIndex) => ({
        id: String(location.id ?? location.Id ?? location.placeId ?? `${index + 1}-${locationIndex + 1}`),
        name: location.name ?? location.Name ?? "Selected location",
        rating: String(location.rating ?? location.Rate ?? "0"),
        image: location.image ?? location.Image ?? defaultTripImage,
        time: location.time ?? location.Time ?? "Time not set",
        cost: formatMoney(location.cost ?? location.Cost),
      })),
  }));

  return {
    id,
    title: apiTrip.title ?? apiTrip.Title ?? apiTrip.name ?? apiTrip.Name ?? apiTrip.destination ?? "Untitled Trip",
    date: formatApiDateRange(startDate, endDate, apiTrip.date ?? apiTrip.Date),
    startDate,
    endDate,
    image: coverImage,
    avatars: members
      .map((member) => member.avatar ?? member.avatarUrl)
      .filter((avatar): avatar is string => Boolean(avatar)),
    collaboratorLabel: members.length ? `${members.length} Collab${members.length > 1 ? "s" : ""}` : undefined,
    status: status?.toLowerCase() === "hold" ? "hold" : undefined,
    muted: status?.toLowerCase() === "hold",
    hotel: hotelName,
    duration: toNumber(apiTrip.durationDays ?? apiTrip.duration ?? apiTrip.Duration, 1),
    budget: getTripTotalBudget(itineraryData),
    currency: apiTrip.currency ?? apiTrip.Currency ?? "USD",
    itineraryData,
  };
}

function toTripData(trip: Trip): TripData {
  const draft = getTripDraft(trip.id);

  if (draft) {
    return draft;
  }

  return normalizeTripDays({
    id: trip.id,
    title: trip.title,
    date: trip.date,
    startDate: trip.startDate,
    endDate: trip.endDate,
    image: trip.image,
    hotel: trip.hotel || "Not selected",
    duration: trip.duration || 1,
    budget: getTripTotalBudget(trip.itineraryData),
    currency: trip.currency || "USD",
    members:
      trip.avatars?.map((avatar, index) => ({
        id: `${trip.id}-member-${index}`,
        name: `Member ${index + 1}`,
        avatar,
      })) || [],
    itineraryData: trip.itineraryData,
  });
}

function TripCard({ trip, onPress }: { trip: Trip; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tripCard, trip.muted && styles.tripCardMuted]}
    >
      <ImageBackground
        source={{ uri: trip.image }}
        imageStyle={{ borderRadius: 10 }}
        style={styles.tripImage}
      />

      <View style={styles.tripContent}>
        <View>
          <Text numberOfLines={1} style={styles.tripTitle}>
            {trip.title}
          </Text>
          <Text style={styles.tripDate}>{trip.date}</Text>
        </View>

        {trip.status === "hold" ? (
          <View style={styles.holdBadge}>
            <Text style={styles.holdBadgeText}>On Hold</Text>
          </View>
        ) : (
          <View style={styles.collaboratorRow}>
            {trip.avatars?.map((avatar) => (
              <ImageBackground
                key={avatar}
                source={{ uri: avatar }}
                imageStyle={{ borderRadius: 13 }}
                style={styles.avatar}
              />
            ))}
            {trip.extraCount ? (
              <View style={[styles.avatar, styles.moreAvatar]}>
                <Text style={styles.moreAvatarText}>+{trip.extraCount}</Text>
              </View>
            ) : null}
            {trip.collaboratorLabel ? (
              <Text style={styles.collaboratorText}>
                {trip.collaboratorLabel}
              </Text>
            ) : null}
          </View>
        )}
      </View>

    </Pressable>
  );
}

export default function MyTripScreen({ navigation }: any) {
  const [upcomingTripList, setUpcomingTripList] = useState<Trip[]>([]);
  const [pastTripList, setPastTripList] = useState<Trip[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [openingTripId, setOpeningTripId] = useState<string | null>(null);
  const [tripLoadError, setTripLoadError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"Upcoming" | "Past">(
    "Upcoming"
  );
  const trips = activeFilter === "Upcoming" ? upcomingTripList : pastTripList;
  const featuredTrip = upcomingTripList[0];

  const loadTrips = useCallback(() => {
    let isMounted = true;

    async function fetchTrips() {
      setIsLoadingTrips(true);
      setTripLoadError(null);

      try {
        const apiTrips = await fetchMyTrips();
        if (!isMounted) {
          return;
        }

        const mappedTrips = apiTrips.map(mapApiTrip).filter((trip) => trip.id);
        const upcomingTrips = mappedTrips.filter((trip) => !isPastTrip(trip));
        const pastTrips = mappedTrips.filter(isPastTrip);

        setUpcomingTripList(upcomingTrips);
        setPastTripList(pastTrips);
        if (!upcomingTrips.length && pastTrips.length) {
          setActiveFilter("Past");
        }
      } catch (error) {
        if (isMounted) {
          setTripLoadError(getApiErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoadingTrips(false);
        }
      }
    }

    fetchTrips();

    return () => {
      isMounted = false;
    };
  }, []);

  useFocusEffect(loadTrips);

  useEffect(() => {
    return subscribeTripDrafts((updatedTrip) => {
      const applyTripUpdate = (trip: Trip) =>
        trip.id === updatedTrip.id
          ? {
            ...trip,
            title: updatedTrip.title,
            date: updatedTrip.date || trip.date,
            startDate: updatedTrip.startDate,
            endDate: updatedTrip.endDate,
            image: updatedTrip.image || trip.image,
            hotel: updatedTrip.hotel,
            duration: updatedTrip.duration,
            budget: updatedTrip.budget,
            currency: updatedTrip.currency,
            avatars: updatedTrip.members.map((member) => member.avatar),
            itineraryData: updatedTrip.itineraryData,
          }
          : trip;

      setUpcomingTripList((current) => current.map(applyTripUpdate));
      setPastTripList((current) => current.map(applyTripUpdate));
    });
  }, []);

  const planTrip = () => {
    if (featuredTrip) {
      openTrip(featuredTrip);
    }
  };

  const writeDiaryTrip = () => {
    navigation.navigate("Trip Diary");
  };

  const createEmptyPlanningTrip = () => {
    navigation.navigate("PlanningTrip", {
      mode: "create",
    });
  };

  const openPlanningTrip = (trip: Trip, selectedFilter = activeFilter) => {
    const tripData = toTripData(trip);
    upsertTripDraft(tripData);

    navigation.navigate("PlanningTrip", {
      tripData,
      mode: selectedFilter === "Upcoming" ? "upcoming" : "draft",
      statusLabel: trip.status === "hold" ? "On Hold" : selectedFilter,
      collaboratorLabel: trip.collaboratorLabel,
      memberAvatars: trip.avatars,
      extraCount: trip.extraCount,
    });
  };

  const openTrip = async (trip: Trip) => {
    if (activeFilter === "Past") {
      navigation.navigate("Trip Diary", {
        id: trip.id,
        title: trip.title,
        date: trip.date,
        image: trip.image,
      });
      return;
    }

    setOpeningTripId(trip.id);

    try {
      const apiTrips = await fetchMyTrips();
      const latestTrip = apiTrips.map(mapApiTrip).find((item) => item.id === trip.id) ?? trip;
      openPlanningTrip(latestTrip);
    } catch (error) {
      Alert.alert("Cannot load trip", getApiErrorMessage(error));
    } finally {
      setOpeningTripId(null);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <Pressable
          style={styles.iconButton}
          onPress={createEmptyPlanningTrip}
        >
          <Ionicons name="add" size={28} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {featuredTrip ? (
        <View style={styles.featuredSection}>
          <View style={styles.featuredCard}>
            <ImageBackground
              source={{ uri: featuredTrip.image }}
              imageStyle={styles.featuredImageRadius}
              style={styles.featuredImage}
            >
              <View style={styles.featuredOverlay} />
              <View style={styles.featuredInfo}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>Current Trip</Text>
                </View>
                <Text numberOfLines={1} style={styles.featuredTripTitle}>
                  {featuredTrip.title}
                </Text>
                <View style={styles.featuredMetaRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.white} />
                  <Text numberOfLines={1} style={styles.featuredMetaText}>
                    {featuredTrip.date}
                  </Text>
                </View>
                <View style={styles.featuredMetaRow}>
                  <Ionicons name="bed-outline" size={14} color={colors.white} />
                  <Text numberOfLines={1} style={styles.featuredMetaText}>
                    {featuredTrip.hotel || "Hotel not selected"} - {featuredTrip.duration || 1} days
                  </Text>
                </View>
                <View style={styles.featuredMetaRow}>
                  <Ionicons name="wallet-outline" size={14} color={colors.white} />
                  <Text numberOfLines={1} style={styles.featuredMetaText}>
                    Total budget: VND: {formatVnd(featuredTrip.budget || 0)}
                  </Text>
                </View>
              </View>
            </ImageBackground>

            <View style={styles.featuredActions}>
              <Pressable
                onPress={planTrip}
                style={({ pressed }) => [
                  styles.featuredPrimaryButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.featuredPrimaryButtonText}>Plan Trip</Text>
              </Pressable>

              <Pressable
                onPress={writeDiaryTrip}
                style={({ pressed }) => [
                  styles.featuredSecondaryButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.featuredSecondaryButtonText}>
                  Write Diary Trip
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        ) : null}

        <View style={styles.tabsWrap}>
          {(["Upcoming", "Past"] as const).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                onPress={() => {
                  setActiveFilter(filter);
                }}
                style={[styles.tabButton, isActive && styles.activeTab]}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.tripList}>
          {isLoadingTrips ? (
            <View style={styles.tripState}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.tripStateText}>Loading trips...</Text>
            </View>
          ) : null}
          {tripLoadError ? (
            <Text style={styles.tripErrorText}>{tripLoadError}</Text>
          ) : null}
          {!isLoadingTrips && trips.length === 0 ? (
            <Text style={styles.tripStateText}>No trips yet</Text>
          ) : null}
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onPress={openingTripId ? undefined : () => openTrip(trip)}
            />
          ))}
        </View>
      </ScrollView>


    </View>
  );
}
