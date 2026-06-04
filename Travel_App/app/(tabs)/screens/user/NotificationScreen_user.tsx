import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  type GestureResponderEvent,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { getApiErrorMessage } from "../../../../lib/api/client";
import {
  acceptNotificationInvite,
  deleteNotification,
  declineNotificationInvite,
  listNotifications,
  markNotificationRead,
  type ApiNotificationItem,
  type NotificationTab,
} from "../../../../lib/api/notification";
import { colors } from "../../common/colors";
import styles from "./NotificationScreen_user.styles";

type NotificationType =
  | "invited"
  | "upcoming"
  | "promotion"
  | "like_comment";

type IconTone = "primary" | "secondary" | "tertiary" | "danger";

type BaseNotificationItem = {
  id: string;
  notificationId?: string;
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

type NotificationItem =
  | InvitedNotification
  | UpcomingNotification
  | PromotionNotification
  | LikeCommentNotification;

type NotificationDisplay = {
  icon: keyof typeof Ionicons.glyphMap;
  iconTone: IconTone;
  titleBeforeHighlight: string;
  highlight?: string;
  titleAfterHighlight?: string;
  description: string;
};

type NotificationRoute = {
  name: string;
  params: Record<string, string | number | undefined>;
};

const SUPPORTED_TYPES: NotificationType[] = [
  "invited",
  "upcoming",
  "promotion",
  "like_comment",
];

function isSupportedNotificationType(type: unknown): type is NotificationType {
  return typeof type === "string" && SUPPORTED_TYPES.includes(type as NotificationType);
}

function mapApiNotification(item: ApiNotificationItem): NotificationItem | null {
  if (!item.id || !isSupportedNotificationType(item.type)) {
    return null;
  }

  const base = {
    id: String(item.id),
    notificationId: item.notificationId ? String(item.notificationId) : undefined,
    type: item.type,
    targetId: item.targetId ? String(item.targetId) : undefined,
    time: item.time ?? "",
    unread: Boolean(item.unread),
  };

  switch (item.type) {
    case "invited":
      return {
        ...base,
        type: "invited",
        username: item.username ?? "Someone",
        itineraryName: item.itineraryName ?? "this trip",
        days: item.days ?? 0,
      };
    case "upcoming":
      return {
        ...base,
        type: "upcoming",
        itineraryName: item.itineraryName ?? "your trip",
        days: item.days ?? 0,
      };
    case "promotion":
      return {
        ...base,
        type: "promotion",
        placeName: item.placeName ?? "this place",
        discount: item.discount ?? 0,
        image: item.image,
      };
    case "like_comment":
      return {
        ...base,
        type: "like_comment",
        placeName: item.placeName ?? "this place",
      };
  }
}

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

function getNotificationRoute(item: NotificationItem): NotificationRoute {
  const targetId = item.targetId;

  switch (item.type) {
    case "invited":
    case "upcoming":
      return {
        name: "PlanningTrip",
        params: {
          tripId: targetId,
          title: item.itineraryName,
        },
      };
    case "promotion":
      return {
        name: "Detail Location",
        params: {
          placeId: targetId,
        },
      };
    case "like_comment":
      return {
        name: "All Reviews",
        params: {
          placeId: targetId,
          placeName: item.placeName,
        },
      };
  }
}

function NotificationCard({
  item,
  onPress,
  onAccept,
  onDecline,
  onDelete,
}: {
  item: NotificationItem;
  onPress: (item: NotificationItem) => void;
  onAccept: (item: NotificationItem) => void;
  onDecline: (item: NotificationItem) => void;
  onDelete: (item: NotificationItem) => void;
}) {
  const display = getNotificationDisplay(item);
  const iconStyle = getIconStyles(display.iconTone);

  const handleAccept = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onAccept(item);
  };

  const handleDecline = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onDecline(item);
  };

  const renderRightActions = () => (
    <View style={styles.swipeAction}>
      <Pressable
        style={styles.deleteAction}
        onPress={(event) => {
          event.stopPropagation();
          onDelete(item);
        }}
      >
        <Ionicons name="trash" size={20} color={colors.white} />
        <Text style={styles.deleteActionText}>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <View
        style={[
          styles.card,
          item.unread ? styles.unreadCard : styles.readCard,
        ]}
      >
        <Pressable
          onPress={() => onPress(item)}
          style={({ pressed }) => [
            styles.cardPressArea,
            pressed && styles.cardPressed,
          ]}
        >
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

            {item.type === "promotion" && item.image ? (
              <Image source={{ uri: item.image }} style={styles.previewImage} />
            ) : null}
          </View>
        </Pressable>

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
      </View>
    </Swipeable>
  );
}

export default function NotificationScreenUser() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const PAGE_SIZE = 20;

  const fetchNotifications = useCallback(async (offset = 0) => {
    if (offset === 0) {
      setLoading(true);
    }

    setErrorMessage("");

    try {
      const apiItems = await listNotifications({ tab: activeTab, limit: PAGE_SIZE, offset });
      const filteredItems = apiItems.map(mapApiNotification).filter((item): item is NotificationItem => Boolean(item));

      setItems(prev => offset === 0 ? filteredItems : [...prev, ...filteredItems]);
      setHasMore(filteredItems.length === PAGE_SIZE);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setErrorMessage(message);
      console.warn("Failed to load notifications", error);
      if (offset === 0) {
        setItems([]);
      }
      setHasMore(false);
    } finally {
      if (offset === 0) {
        setLoading(false);
      }
    }
  }, [activeTab, PAGE_SIZE]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setErrorMessage("");

    try {
      const apiItems = await listNotifications({ tab: activeTab, limit: PAGE_SIZE, offset: 0 });
      const filteredItems = apiItems.map(mapApiNotification).filter((item): item is NotificationItem => Boolean(item));
      setItems(filteredItems);
      setHasMore(filteredItems.length === PAGE_SIZE);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setErrorMessage(message);
      console.warn("Failed to refresh notifications", error);
    } finally {
      setRefreshing(false);
    }
  }, [activeTab, PAGE_SIZE]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      fetchNotifications(items.length).finally(() => setLoadingMore(false));
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleCardPress = async (item: NotificationItem) => {
    if (item.unread) {
      try {
        await markNotificationRead(item.id);
        setItems((prev) =>
          prev.map((notification) =>
            notification.id === item.id ? { ...notification, unread: false } : notification
          )
        );
      } catch (error) {
        console.warn("Failed to mark notification as read", error);
      }
    }

    const route = getNotificationRoute(item);
    navigation.navigate(route.name, route.params);
  };

  const handleAccept = async (item: NotificationItem) => {
    if (item.type !== "invited") {
      return;
    }

    try {
      await acceptNotificationInvite(item.id);
      setItems((prev) => prev.filter((notification) => notification.id !== item.id));
    } catch (error) {
      console.warn("Failed to accept trip invitation", error);
    }
  };

  const handleDecline = async (item: NotificationItem) => {
    if (item.type !== "invited") {
      return;
    }

    try {
      await declineNotificationInvite(item.id);
      setItems((prev) => prev.filter((notification) => notification.id !== item.id));
    } catch (error) {
      console.warn("Failed to reject trip invitation", error);
    }
  };

  const handleDelete = async (item: NotificationItem) => {
    try {
      await deleteNotification(item.id);
      setItems((prev) => prev.filter((notification) => notification.id !== item.id));
    } catch (error) {
      console.warn("Failed to delete notification", error);
    }
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

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <NotificationCard
            item={item}
            onPress={handleCardPress}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onDelete={handleDelete}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !loading && !errorMessage ? (
            <Text style={styles.emptyText}>No notifications yet.</Text>
          ) : null
        }
        ListHeaderComponent={
          loading || errorMessage ? (
            <View style={styles.statusWrap}>
              {loading ? (
                <>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.statusText}>Loading notifications...</Text>
                </>
              ) : (
                <>
                  <Text style={styles.statusText}>{errorMessage}</Text>
                  <Pressable style={styles.retryButton} onPress={() => fetchNotifications()}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </Pressable>
                </>
              )}
            </View>
          ) : null
        }
        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={colors.primary} style={{ margin: 16 }} /> : null}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}
