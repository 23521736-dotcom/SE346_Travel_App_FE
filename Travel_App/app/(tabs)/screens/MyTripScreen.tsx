import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
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

const londonSchedule: ItineraryDay[] = [
  {
    dayId: "day_1",
    title: "Day 1",
    date: "Nov 12, 2026",
    locations: [
      {
        id: "loc_1",
        name: "Tower Bridge",
        rating: "4.8 (12k)",
        image:
          "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=200&auto=format&fit=crop",
        time: "09:00 - 11:00",
        cost: "$0.00",
      },
      {
        id: "loc_2",
        name: "Borough Market",
        rating: "4.7 (8.1k)",
        image:
          "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=200&auto=format&fit=crop",
        time: "12:00 - 13:30",
        cost: "$25.00",
      },
    ],
  },
  {
    dayId: "day_2",
    title: "Day 2",
    date: "Nov 13, 2026",
    locations: [],
  },
];

const upcomingTrips: Trip[] = [
  {
    id: "london",
    title: "London Getaway",
    date: "Nov 12 - Nov 18",
    startDate: "2026-11-12T00:00:00.000Z",
    endDate: "2026-11-18T00:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop",
    avatars: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    ],
    extraCount: 2,
    hotel: "The Hoxton Shoreditch",
    duration: 7,
    budget: 320,
    currency: "USD",
    itineraryData: londonSchedule,
  },
  {
    id: "aspen",
    title: "Skiing in Aspen",
    date: "Dec 20 - Dec 27",
    startDate: "2026-12-20T00:00:00.000Z",
    endDate: "2026-12-27T00:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=600&auto=format&fit=crop",
    avatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    ],
    collaboratorLabel: "1 Collab",
    hotel: "Not selected",
    duration: 8,
    budget: 0,
  },
  {
    id: "san-francisco",
    title: "San Francisco",
    date: "Pending Confirmation",
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=600&auto=format&fit=crop",
    status: "hold",
    muted: true,
  },
];

const pastTrips: Trip[] = [
  {
    id: "paris",
    title: "Paris Weekend",
    date: "Sep 2 - Sep 5",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
    collaboratorLabel: "2 Collabs",
  },
  {
    id: "seoul",
    title: "Seoul Food Crawl",
    date: "Aug 14 - Aug 19",
    image:
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=600&auto=format&fit=crop",
    collaboratorLabel: "Solo trip",
  },
];

const featuredDestinationImage =
  "https://lh3.googleusercontent.com/aida/ADBb0ugQ1ljWdJ1EbrE2Vg0NumH0OfcHQuQRv_sweAYc29gRXn_BnYrbdFQkdfftHnMigzy1NefxWhkJEs-JFf-_p-IjR1v0sKsTyNUbXRir1O4zmzsvuMl-Ag0M5Wuglyf8x_E8fTgX82P9V7rZmxDMfsU4qMlZfY7Sbz6naaZWAC2AnZQv3CJ4Abgfedx6usBG6TJnqYgb21a9tbOVq_BAHwl8MHci25XoPLk9X0LImB36nIhKpcR14nx8Sg";

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
    budget: trip.budget || 0,
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
  const [upcomingTripList, setUpcomingTripList] = useState(upcomingTrips);
  const [pastTripList, setPastTripList] = useState(pastTrips);
  const [activeFilter, setActiveFilter] = useState<"Upcoming" | "Past">(
    "Upcoming"
  );
  const trips = activeFilter === "Upcoming" ? upcomingTripList : pastTripList;
  const featuredTrip = upcomingTripList[0];

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
    navigation.navigate("PlanningTrip", {
      mode: "create",
      title: "Featured Destination",
      image: featuredDestinationImage,
    });
  };

  const writeDiaryTrip = () => {
    navigation.navigate("Trip Diary");
  };

  const createEmptyPlanningTrip = () => {
    navigation.navigate("PlanningTrip", {
      mode: "create",
    });
  };

  const openPlanningTrip = (trip: Trip) => {
    const tripData = toTripData(trip);
    upsertTripDraft(tripData);

    navigation.navigate("PlanningTrip", {
      tripData,
      mode: activeFilter === "Upcoming" ? "upcoming" : "draft",
      statusLabel: trip.status === "hold" ? "On Hold" : activeFilter,
      collaboratorLabel: trip.collaboratorLabel,
      memberAvatars: trip.avatars,
      extraCount: trip.extraCount,
    });
  };

  const openTrip = (trip: Trip) => {
    if (activeFilter === "Past") {
      navigation.navigate("Trip Diary", {
        id: trip.id,
        title: trip.title,
        date: trip.date,
        image: trip.image,
      });
      return;
    }

    openPlanningTrip(trip);
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
        <View style={styles.featuredSection}>
          <View style={styles.featuredCard}>
            <ImageBackground
              source={{ uri: featuredTrip?.image || featuredDestinationImage }}
              imageStyle={styles.featuredImageRadius}
              style={styles.featuredImage}
            >
              <View style={styles.featuredOverlay} />
              <View style={styles.featuredInfo}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>Current Trip</Text>
                </View>
                <Text numberOfLines={1} style={styles.featuredTripTitle}>
                  {featuredTrip?.title || "Featured Destination"}
                </Text>
                <View style={styles.featuredMetaRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.white} />
                  <Text numberOfLines={1} style={styles.featuredMetaText}>
                    {featuredTrip?.date || "Choose your travel dates"}
                  </Text>
                </View>
                <View style={styles.featuredMetaRow}>
                  <Ionicons name="bed-outline" size={14} color={colors.white} />
                  <Text numberOfLines={1} style={styles.featuredMetaText}>
                    {featuredTrip?.hotel || "Hotel not selected"} - {featuredTrip?.duration || 1} days
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
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onPress={() => openTrip(trip)}
            />
          ))}
        </View>
      </ScrollView>


    </View>
  );
}
