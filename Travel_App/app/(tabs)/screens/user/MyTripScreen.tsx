import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { getApiErrorMessage } from "../../../../lib/api/client";
import { ApiTrip, deleteTrip, fetchMyTrips, leaveTrip, mapApiTripToDraft } from "../../../../lib/api/trips";
import { colors } from "../../common/colors";
import { useAuth } from "../../context/AuthContext";
import {
  Collaborator,
  getTripDraft,
  ItineraryDay,
  normalizeTripDays,
  removeTripDraft,
  subscribeTripDeletes,
  subscribeTripDrafts,
  TripData,
  upsertTripDraft,
} from "../../store/tripDraftStore";
import styles from "./MyTripScreen.styles";

type Trip = {
  id: string;
  ownerId?: string | number;
  title: string;
  date: string;
  startDate?: string;
  endDate?: string;
  image: string;
  coverImageUrl?: string;
  avatars?: string[];
  members?: Collaborator[];
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
  const draft = normalizeTripDays(mapApiTripToDraft(apiTrip) as TripData);
  const id = String(draft.id ?? "");
  const startDate = draft.startDate;
  const endDate = draft.endDate;
  const members = apiTrip.members ?? apiTrip.Members ?? apiTrip.collaborators ?? [];
  const status = apiTrip.status ?? apiTrip.Status;
  const ownerId =
    draft.ownerId ??
    apiTrip.ownerId ??
    apiTrip.OwnerId ??
    apiTrip.owner_id ??
    apiTrip.owner?.id ??
    apiTrip.owner?.userId ??
    draft.createdBy ??
    draft.userId;

  return {
    id,
    ownerId,
    title: draft.title,
    date: formatApiDateRange(startDate, endDate, draft.date),
    startDate,
    endDate,
    image: draft.coverImageUrl || draft.image || defaultTripImage,
    coverImageUrl: draft.coverImageUrl,
    avatars: members
      .map((member) => member.avatar ?? member.avatarUrl)
      .filter((avatar): avatar is string => Boolean(avatar)),
    members: draft.members,
    collaboratorLabel: members.length ? `${members.length} Collab${members.length > 1 ? "s" : ""}` : undefined,
    status: status?.toLowerCase() === "hold" ? "hold" : undefined,
    muted: status?.toLowerCase() === "hold",
    hotel: draft.hotel,
    duration: draft.duration,
    budget: draft.budget,
    currency: draft.currency ?? "USD",
    itineraryData: draft.itineraryData,
  };
}

function toTripData(trip: Trip): TripData {
  const draft = getTripDraft(trip.id);

  if (draft) {
    return draft;
  }

  return normalizeTripDays({
    id: trip.id,
    ownerId: trip.ownerId,
    title: trip.title,
    date: trip.date,
    startDate: trip.startDate,
    endDate: trip.endDate,
    image: trip.image,
    coverImageUrl: trip.coverImageUrl || trip.image,
    hotel: trip.hotel || "Not selected",
    duration: trip.duration || 1,
    budget: getTripTotalBudget(trip.itineraryData),
    currency: trip.currency || "USD",
    members:
      trip.members?.length
        ? trip.members
        : trip.avatars?.map((avatar, index) => ({
        id: `${trip.id}-member-${index}`,
        name: `Member ${index + 1}`,
        avatar,
      })) || [],
    itineraryData: trip.itineraryData,
  });
}

function TripCard({
  trip,
  onPress,
  onDelete,
  isDeleting,
}: {
  trip: Trip;
  onPress?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isDeleting}
      style={({ pressed }) => [
        styles.tripCard,
        trip.muted && styles.tripCardMuted,
        pressed && styles.tripCardPressed,
        isDeleting && styles.tripCardDeleting,
      ]}
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

      {onDelete ? (
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          disabled={isDeleting}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${trip.title}`}
          style={({ pressed }) => [
            styles.deleteTripButton,
            pressed && styles.buttonPressed,
            isDeleting && styles.deleteTripButtonDisabled,
          ]}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color={colors.danger} />
          ) : (
            <Ionicons name="trash-bin-outline" size={17} color={colors.danger} />
          )}
        </Pressable>
      ) : null}

    </Pressable>
  );
}

export default function MyTripScreen({ navigation }: any) {
  const { user } = useAuth();
  const [upcomingTripList, setUpcomingTripList] = useState<Trip[]>([]);
  const [pastTripList, setPastTripList] = useState<Trip[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openingTripId, setOpeningTripId] = useState<string | null>(null);
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);
  const [tripLoadError, setTripLoadError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"Upcoming" | "Past">(
    "Upcoming"
  );
  const trips = activeFilter === "Upcoming" ? upcomingTripList : pastTripList;
  const featuredTrip = upcomingTripList[0];
  const currentUserId = user?.id;

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
  }, [currentUserId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTripLoadError(null);

    try {
      const apiTrips = await fetchMyTrips();

      console.log(
        "[MyTripScreen] refresh trips ownerId",
        apiTrips.map((trip) => ({
          id: trip.id ?? trip.Id ?? trip.tripId ?? trip.trip_id,
          title: trip.title ?? trip.Title ?? trip.name ?? trip.Name,
          ownerId: trip.ownerId,
          OwnerId: trip.OwnerId,
          owner_id: trip.owner_id,
          owner: trip.owner,
        }))
      );

      const mappedTrips = apiTrips.map(mapApiTrip).filter((trip) => trip.id);

      const upcomingTrips = mappedTrips.filter((trip) => !isPastTrip(trip));
      const pastTrips = mappedTrips.filter(isPastTrip);

      setUpcomingTripList(upcomingTrips);
      setPastTripList(pastTrips);
      if (!upcomingTrips.length && pastTrips.length) {
        setActiveFilter("Past");
      }
    } catch (error) {
      setTripLoadError(getApiErrorMessage(error));
    } finally {
      setRefreshing(false);
    }
  }, [currentUserId]);

  useFocusEffect(loadTrips);

  useEffect(() => {
    const unsubscribeDrafts = subscribeTripDrafts((updatedTrip) => {
      const applyTripUpdate = (trip: Trip) =>
        trip.id === updatedTrip.id
          ? {
            ...trip,
            title: updatedTrip.title,
            date: updatedTrip.date || trip.date,
            startDate: updatedTrip.startDate,
            endDate: updatedTrip.endDate,
            image: updatedTrip.coverImageUrl || updatedTrip.image || trip.image,
            coverImageUrl: updatedTrip.coverImageUrl || updatedTrip.image || trip.coverImageUrl,
            hotel: updatedTrip.hotel,
            duration: updatedTrip.duration,
            budget: updatedTrip.budget,
            currency: updatedTrip.currency,
            avatars: updatedTrip.members.map((member) => member.avatar),
            members: updatedTrip.members,
            itineraryData: updatedTrip.itineraryData,
          }
          : trip;

      setUpcomingTripList((current) => current.map(applyTripUpdate));
      setPastTripList((current) => current.map(applyTripUpdate));
    });

    const unsubscribeDeletes = subscribeTripDeletes((tripId) => {
      setUpcomingTripList((current) => current.filter((trip) => trip.id !== tripId));
      setPastTripList((current) => current.filter((trip) => trip.id !== tripId));
    });

    return () => {
      unsubscribeDrafts();
      unsubscribeDeletes();
    };
  }, []);

  const planTrip = () => {
    if (featuredTrip) {
      openTrip(featuredTrip);
    }
  };

  const writeDiaryTrip = () => {
    if (!featuredTrip) {
      Alert.alert("No trip selected", "Open a trip before writing a diary.");
      return;
    }

    navigation.navigate("Trip Diary", {
      id: featuredTrip.id,
      title: featuredTrip.title,
      date: featuredTrip.date,
      image: featuredTrip.image,
    });
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

  const deleteTripFromList = async (trip: Trip) => {
    if (!trip.id || deletingTripId) {
      return;
    }

    const isOwner = currentUserId !== undefined && String(trip.ownerId) === String(currentUserId);

    setDeletingTripId(trip.id);
    try {
      if (isOwner) {
        await deleteTrip(trip.id);
      } else {
        if (currentUserId === undefined) {
          throw new Error("Cannot identify the current user.");
        }

        await leaveTrip(trip.id, currentUserId);
      }

      removeTripDraft(trip.id);
      setUpcomingTripList((current) => current.filter((item) => item.id !== trip.id));
      setPastTripList((current) => current.filter((item) => item.id !== trip.id));
    } catch (error) {
      Alert.alert(isOwner ? "Cannot delete trip" : "Cannot leave trip", getApiErrorMessage(error));
    } finally {
      setDeletingTripId(null);
    }
  };

  const confirmDeleteTrip = (trip: Trip) => {
    const isOwner = currentUserId !== undefined && String(trip.ownerId) === String(currentUserId);

    Alert.alert(
      isOwner ? "Delete trip" : "Leave trip",
      isOwner
        ? `Delete "${trip.title}"? This cannot be undone.`
        : `Leave "${trip.title}"? You can join again only if you are invited back.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: isOwner ? "Delete" : "Leave",
          style: "destructive",
          onPress: () => {
            void deleteTripFromList(trip);
          },
        },
      ]
    );
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Pressable
          onPress={() => navigation.navigate('SmartPlanning' as never)}
          style={({ pressed }) => [
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
              borderRadius: 12,
              marginTop: 12,
              backgroundColor: colors.primary,
            },
            pressed && { opacity: 0.8 }
          ]}
        >
          <Ionicons name="bulb-outline" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
            Lập lịch thông minh
          </Text>
        </Pressable>

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
              onPress={openingTripId || deletingTripId ? undefined : () => openTrip(trip)}
              onDelete={() => confirmDeleteTrip(trip)}
              isDeleting={deletingTripId === trip.id}
            />
          ))}
        </View>
      </ScrollView>


    </View>
  );
}
