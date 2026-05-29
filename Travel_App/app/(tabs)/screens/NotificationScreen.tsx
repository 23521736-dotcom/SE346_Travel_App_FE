import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { colors } from "../common/colors";
import styles from "./NotificationScreen.styles";

type NotificationItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  highlight?: string;
  description: string;
  time: string;
  unread?: boolean;
  image?: string;
  actions?: boolean;
  iconTone?: "primary" | "secondary" | "tertiary";
};

const notifications: NotificationItem[] = [
  {
    id: "trip-invite",
    icon: "person",
    title: "Alex invited you to join",
    highlight: "'Summer in Bali'",
    description: "Join your friends for 10 days of tropical paradise planning.",
    time: "2m ago",
    unread: true,
    actions: true,
    iconTone: "primary",
  },
  {
    id: "flight-update",
    icon: "airplane",
    title: "Your flight to Tokyo is on time",
    description: "Gate A12 - Departure 14:30. Check-in is now open via the app.",
    time: "1h ago",
    iconTone: "secondary",
  },
  {
    id: "ramen-spot",
    icon: "map",
    title: "New top-rated Ramen spot found in Shinjuku!",
    description:
      "Based on your love for spicy miso, Ramen Nagi is a must-try for your trip.",
    time: "3h ago",
    unread: true,
    image:
      "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?q=80&w=900&auto=format&fit=crop",
    iconTone: "tertiary",
  },
  {
    id: "journal-ready",
    icon: "sparkles",
    title: "Your Trip Journal for Tokyo is ready",
    description: "Relive your journey with a generated video of your highlights.",
    time: "5h ago",
    iconTone: "primary",
  },
  {
    id: "review-trip",
    icon: "time",
    title: "Review your trip to Da Nang",
    description:
      "Help other travelers by sharing your thoughts on the Marble Mountains.",
    time: "1d ago",
    iconTone: "secondary",
  },
];

function getIconStyles(tone: NotificationItem["iconTone"]) {
  if (tone === "secondary") {
    return {
      wrap: styles.iconCircleSecondary,
      color: colors.textSecondary,
    };
  }

  if (tone === "tertiary") {
    return {
      wrap: styles.iconCircleTertiary,
      color: "#D97706",
    };
  }

  return {
    wrap: styles.iconCirclePrimary,
    color: colors.primary,
  };
}

function NotificationCard({ item }: { item: NotificationItem }) {
  const iconStyle = getIconStyles(item.iconTone);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        item.unread ? styles.unreadCard : styles.readCard,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.cardRow}>
        <View style={[styles.iconCircle, iconStyle.wrap]}>
          <Ionicons name={item.icon} size={24} color={iconStyle.color} />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {item.title}
              {item.highlight ? (
                <Text style={styles.highlightText}> {item.highlight} trip</Text>
              ) : null}
            </Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>

          <Text style={styles.descriptionText}>{item.description}</Text>

          {item.actions ? (
            <View style={styles.actionsRow}>
              <Pressable style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </Pressable>
              <Pressable style={styles.declineButton}>
                <Text style={styles.declineButtonText}>Decline</Text>
              </Pressable>
            </View>
          ) : null}

          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.previewImage} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export default function NotificationScreen() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const visibleNotifications =
    activeTab === "unread"
      ? notifications.filter((item) => item.unread)
      : notifications;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
            }}
            style={styles.avatar}
          />
          <Text style={styles.headerTitle}>Notification</Text>
        </View>
        <Pressable style={styles.headerIconButton}>
          <Ionicons name="notifications" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.tabsWrap}>
        <Pressable
          onPress={() => setActiveTab("all")}
          style={[styles.tabButton, activeTab === "all" && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText,
            ]}
          >
            All
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("unread")}
          style={[styles.tabButton, activeTab === "unread" && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "unread" && styles.activeTabText,
            ]}
          >
            Unread
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {visibleNotifications.map((item) => (
          <NotificationCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
