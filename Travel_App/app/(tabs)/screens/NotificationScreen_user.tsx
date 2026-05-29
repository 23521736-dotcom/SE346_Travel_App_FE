import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  GestureResponderEvent,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { colors } from "../common/colors";
import styles from "./NotificationScreen.styles";

type NotificationType =
  | "invited"
  | "upcoming"
  | "promotion"
  | "like_comment"
  | "update_diary";

type IconTone = "primary" | "secondary" | "tertiary" | "danger";

type BaseNotificationItem = {
  id: string;
  type: NotificationType;
  targetId?: string;
  time: string;
  unread?: boolean;
};

type InvitedNotification = BaseNotificationItem & {
  type: "invited";
  username: string;
  itineraryName: string;
  days: number;
};

type UpcomingNotification = BaseNotificationItem & {
  type: "upcoming";
  itineraryName: string;
  days: number;
};

type PromotionNotification = BaseNotificationItem & {
  type: "promotion";
  placeName: string;
  discount: number;
  image?: string;
};

type LikeCommentNotification = BaseNotificationItem & {
  type: "like_comment";
  placeName: string;
};

type UpdateDiaryNotification = BaseNotificationItem & {
  type: "update_diary";
  username: string;
  itineraryName: string;
};

type NotificationItem =
  | InvitedNotification
  | UpcomingNotification
  | PromotionNotification
  | LikeCommentNotification
  | UpdateDiaryNotification;

type NotificationDisplay = {
  icon: keyof typeof Ionicons.glyphMap;
  iconTone: IconTone;
  titleBeforeHighlight: string;
  highlight?: string;
  titleAfterHighlight?: string;
  description: string;
};

const notifications: NotificationItem[] = [
  {
    id: "invite-bali",
    type: "invited",
    targetId: "itinerary-bali-2026",
    username: "Alex",
    itineraryName: "Summer in Bali",
    days: 7,
    time: "2m ago",
    unread: true,
  },
  {
    id: "upcoming-da-nang",
    type: "upcoming",
    targetId: "itinerary-da-nang-2026",
    itineraryName: "Da Nang Escape",
    days: 3,
    time: "1h ago",
  },
  {
    id: "promotion-hotel",
    type: "promotion",
    targetId: "place-seaside-hotel",
    placeName: "Seaside Hotel",
    discount: 25,
    time: "3h ago",
    unread: true,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "review-like-hoi-an",
    type: "like_comment",
    targetId: "place-hoi-an-ancient-town",
    placeName: "Hoi An Ancient Town",
    time: "5h ago",
  },
  {
    id: "diary-update-tokyo",
    type: "update_diary",
    targetId: "diary-tokyo-spring",
    username: "Mina",
    itineraryName: "Tokyo Spring Walk",
    time: "1d ago",
    unread: true,
  },
];

function getNotificationDisplay(item: NotificationItem): NotificationDisplay {
  switch (item.type) {
    case "invited":
      return {
        icon: "person-add",
        iconTone: "primary",
        titleBeforeHighlight: `${item.username} invited you to join `,
        highlight: item.itineraryName,
        description: `Join your friends for ${item.days} days of unforgettable memories!`,
      };
    case "upcoming":
      return {
        icon: "time",
        iconTone: "secondary",
        titleBeforeHighlight: `Your travel to ${item.itineraryName} is in `,
        highlight: `${item.days} days`,
        description:
          "Time to double-check your luggage and get ready for the adventure!",
      };
    case "promotion":
      return {
        icon: "pricetag",
        iconTone: "tertiary",
        titleBeforeHighlight: `Great news! Your favorite "${item.placeName}" has a deal! `,
        highlight: `${item.discount}% OFF`,
        description: `Save big on your next booking at ${item.placeName}. Limited time only, book your spot now!`,
      };
    case "like_comment":
      return {
        icon: "heart",
        iconTone: "danger",
        titleBeforeHighlight: "Someone liked your review",
        description: `See what they and others are saying about ${item.placeName}.`,
      };
    case "update_diary":
      return {
        icon: "book",
        iconTone: "primary",
        titleBeforeHighlight: `${item.username} updated the trip diary!`,
        description: `Check out the latest memories added to "${item.itineraryName}".`,
      };
  }
}

function getIconStyles(tone: IconTone) {
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

  if (tone === "danger") {
    return {
      wrap: styles.iconCircleTertiary,
      color: colors.danger,
    };
  }

  return {
    wrap: styles.iconCirclePrimary,
    color: colors.primary,
  };
}

function getNotificationRoute(item: NotificationItem) {
  const id = item.targetId;

  switch (item.type) {
    case "invited":
    case "upcoming":
      return {
        pathname: "/screens/PlanningTrip" as const,
        params: { id },
      };
    case "promotion":
      return {
        pathname: "/screens/DetailLocationScreen" as const,
        params: { id, placeId: id },
      };
    case "like_comment":
      return {
        pathname: "/screens/ViewReviewsScreen" as const,
        params: { id, placeId: id, placeName: item.placeName },
      };
    case "update_diary":
      return {
        pathname: "/screens/TripDiaryScreen" as const,
        params: { id },
      };
  }
}

function NotificationCard({
  item,
  onAccept,
  onDecline,
}: {
  item: NotificationItem;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const router = useRouter();
  const display = getNotificationDisplay(item);
  const iconStyle = getIconStyles(display.iconTone);

  const handleCardPress = () => {
    router.push(getNotificationRoute(item));
  };

  const handleAccept = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onAccept(item.id);
  };

  const handleDecline = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onDecline(item.id);
  };

  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [
        styles.card,
        item.unread ? styles.unreadCard : styles.readCard,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.cardRow}>
        <View style={[styles.iconCircle, iconStyle.wrap]}>
          <Ionicons name={display.icon} size={24} color={iconStyle.color} />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {display.titleBeforeHighlight}
              {display.highlight ? (
                <Text style={styles.highlightText}>{display.highlight}</Text>
              ) : null}
              {display.titleAfterHighlight ?? ""}
            </Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>

          <Text style={styles.descriptionText}>{display.description}</Text>

          {item.type === "invited" ? (
            <View style={styles.actionsRow}>
              <Pressable style={styles.acceptButton} onPress={handleAccept}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </Pressable>
              <Pressable style={styles.declineButton} onPress={handleDecline}>
                <Text style={styles.declineButtonText}>Decline</Text>
              </Pressable>
            </View>
          ) : null}

          {item.type === "promotion" && item.image ? (
            <Image source={{ uri: item.image }} style={styles.previewImage} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export default function NotificationScreenUser() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [items, setItems] = useState(notifications);
  const visibleNotifications =
    activeTab === "unread" ? items.filter((item) => item.unread) : items;

  const handleAccept = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDecline = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

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
          <NotificationCard
            key={item.id}
            item={item}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
