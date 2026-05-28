import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { colors } from "../common/colors";
import styles from "./MyTripScreen.styles";

type Trip = {
  id: string;
  title: string;
  date: string;
  image: string;
  avatars?: string[];
  extraCount?: number;
  collaboratorLabel?: string;
  status?: "hold";
  muted?: boolean;
};

const upcomingTrips: Trip[] = [
  {
    id: "london",
    title: "London Getaway",
    date: "Nov 12 - Nov 18",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop",
    avatars: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    ],
    extraCount: 2,
  },
  {
    id: "aspen",
    title: "Skiing in Aspen",
    date: "Dec 20 - Dec 27",
    image:
      "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=600&auto=format&fit=crop",
    avatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    ],
    collaboratorLabel: "1 Collab",
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

      <View style={styles.tripActions}>
        <Pressable hitSlop={8} onPress={onPress}>
          <Ionicons name="share-social-outline" size={21} color={colors.textMuted} />
        </Pressable>
        {trip.status !== "hold" ? (
          <Pressable hitSlop={8} onPress={onPress}>
            <Ionicons name="person-add-outline" size={21} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function MyTripScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState<"Upcoming" | "Past">(
    "Upcoming"
  );
  const trips = activeFilter === "Upcoming" ? upcomingTrips : pastTrips;

  const showInactiveFeature = () => {
    Alert.alert("feature is inactive now");
  };

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
    navigation.navigate("PlanningTrip", {
      id: trip.id,
      title: trip.title,
      date: trip.date,
      image: trip.image,
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
              source={{ uri: featuredDestinationImage }}
              imageStyle={styles.featuredImageRadius}
              style={styles.featuredImage}
            />

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

      <View style={styles.aiBannerWrap}>
        <View style={styles.aiBanner}>
          <View style={styles.aiIconCircle}>
            <MaterialCommunityIcons
              name="auto-fix"
              size={22}
              color={colors.primary}
            />
          </View>
          <View style={styles.aiTextWrap}>
            <Text style={styles.aiTitle}>Planning for Tokyo?</Text>
            <Text style={styles.aiSubtitle}>
              3 unchecked items. Let AI auto-fill?
            </Text>
          </View>
          <Pressable style={styles.reviewButton} onPress={showInactiveFeature}>
            <Text style={styles.reviewButtonText}>Review</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
