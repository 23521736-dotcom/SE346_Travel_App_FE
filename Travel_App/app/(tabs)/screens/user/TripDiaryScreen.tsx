import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { getApiErrorMessage } from "../../../../lib/api/client";
import { deleteTripDiaryEntry, fetchTripDiary, TripDiaryEntry } from "../../../../lib/api/diary";
import { colors } from "../../common/colors";
import styles from "./TripDiaryScreen.styles";
import VideoSlideshowModal from "../../../../components/VideoSlideshowModal";

const fallbackHeroImage =
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop";

function formatDiaryDate(value?: string) {
  if (!value) {
    return "Time not set";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function TimelineCard({
  entry,
  onEdit,
  onDelete,
  isDeleting,
}: {
  entry: TripDiaryEntry;
  onEdit: (entry: TripDiaryEntry) => void;
  onDelete: (entry: TripDiaryEntry) => void;
  isDeleting?: boolean;
}) {
  const visibleImages = entry.imageUrls.slice(0, 3);
  const extraCount = Math.max(entry.imageUrls.length - visibleImages.length, 0);
  const isTwoColumn = visibleImages.length === 2;

  return (
    <ScrollView style={[styles.timelineCard, isDeleting && styles.timelineCardDeleting]}>
      <View style={styles.timelineDot} />

      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.placeName}>
            {entry.title}
          </Text>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={16} color="#3E4850" />
            <Text style={styles.timeText}>{formatDiaryDate(entry.occurredAt)}</Text>
          </View>
          {entry.locationName ? (
            <View style={styles.timeRow}>
              <Ionicons name="location-outline" size={16} color="#3E4850" />
              <Text style={styles.timeText}>{entry.locationName}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.cardActions}>
          <Pressable
            hitSlop={8}
            style={styles.iconButton}
            onPress={() => onEdit(entry)}
            disabled={isDeleting}
          >
            <Ionicons name="create-outline" size={20} color="#6E7881" />
          </Pressable>
          <Pressable
            hitSlop={8}
            style={styles.iconButtonDanger}
            onPress={() => onDelete(entry)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color={colors.danger} />
            ) : (
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            )}
          </Pressable>
        </View>
      </View>

      {visibleImages.length ? (
        <View style={isTwoColumn ? styles.galleryTwo : styles.galleryThree}>
          {visibleImages.map((image, index) => {
            const isMoreTile = extraCount > 0 && index === visibleImages.length - 1;

            if (isMoreTile) {
              return (
                <Pressable key={`${image}-${index}`} style={styles.moreImageWrap}>
                  <Image source={{ uri: image }} style={styles.moreImage} />
                  <View style={styles.moreOverlay}>
                    <Text style={styles.moreText}>+{extraCount}</Text>
                  </View>
                </Pressable>
              );
            }

            return (
              <Image
                key={`${image}-${index}`}
                source={{ uri: image }}
                style={isTwoColumn ? styles.galleryImageLarge : styles.galleryImageSmall}
              />
            );
          })}
        </View>
      ) : null}

      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>{entry.content}</Text>
      </View>
    </ScrollView>
  );
}

export default function TripDiaryScreen({ navigation, route }: any) {
  const tripId = route?.params?.id ?? route?.params?.tripId;
  const tripTitle = route?.params?.title ?? route?.params?.tripTitle ?? "Trip diary";
  const tripDate = route?.params?.date;
  const heroImage = route?.params?.image || fallbackHeroImage;
  const [entries, setEntries] = useState<TripDiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSlideshow, setShowSlideshow] = useState(false);

  const heroSubtitle = useMemo(() => {
    if (!entries.length) {
      return tripDate || "Start writing memories for this trip";
    }
    return `${entries.length} ${entries.length === 1 ? "memory" : "memories"} saved${tripDate ? ` - ${tripDate}` : ""}`;
  }, [entries.length, tripDate]);

  const allImages = useMemo(() => {
    return entries.flatMap((entry) => entry.imageUrls);
  }, [entries]);

  const loadDiary = useCallback(() => {
    let isMounted = true;

    async function load() {
      if (!tripId) {
        setErrorMessage("Missing trip information for diary.");
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await fetchTripDiary(String(tripId));
        if (isMounted) {
          setEntries(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getApiErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [tripId]);

  useFocusEffect(loadDiary);

  const openEditor = (entry?: TripDiaryEntry) => {
    if (deletingEntryId) {
      return;
    }

    if (!tripId) {
      Alert.alert("Cannot write diary", "Missing trip information.");
      return;
    }

    navigation.navigate("Edit Trip Diary", {
      tripId: String(tripId),
      tripTitle,
      entry,
    });
  };

  const deleteEntry = async (entry: TripDiaryEntry) => {
    if (deletingEntryId) {
      return;
    }

    setDeletingEntryId(entry.id);
    try {
      await deleteTripDiaryEntry(entry.id);
      setEntries((current) => current.filter((item) => item.id !== entry.id));
    } catch (error) {
      if ((error as any)?.response?.status === 404) {
        setEntries((current) => current.filter((item) => item.id !== entry.id));
        return;
      }

      Alert.alert("Cannot delete diary", getApiErrorMessage(error));
    } finally {
      setDeletingEntryId(null);
    }
  };

  const confirmDeleteEntry = (entry: TripDiaryEntry) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(`Delete "${entry.title}"? This cannot be undone.`);
      if (confirmed) {
        void deleteEntry(entry);
      }
      return;
    }

    Alert.alert("Delete memory", `Delete "${entry.title}"? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void deleteEntry(entry);
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.primaryDark} />
          </Pressable>
          <Text style={styles.title}>Trip Diary</Text>
        </View>

        {/* <View style={styles.headerActions}>
          <Pressable hitSlop={8} style={styles.primaryIconButton} onPress={() => openEditor()}>
            <Ionicons name="add" size={23} color={colors.white} />
          </Pressable>
        </View> */}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <Image source={{ uri: heroImage }} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <Pressable style={styles.playButton} onPress={() => setShowSlideshow(true)}>
              <Ionicons name="play" size={30} color={colors.white} />
            </Pressable>
          </View>
          <View style={styles.heroTextWrap}>
            <Text numberOfLines={1} style={styles.heroTitle}>{tripTitle}</Text>
            <Text numberOfLines={2} style={styles.heroSubtitle}>{heroSubtitle}</Text>
          </View>
        </View>

        <View>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Saved Memories</Text>
            <Pressable style={styles.addEntryButton} onPress={() => openEditor()}>
              <Ionicons name="add" size={18} color={colors.white} />
              <Text style={styles.addEntryText}>Write Diary</Text>
            </Pressable>
          </View>

          {isLoading ? (
            <View style={styles.stateBox}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.stateText}>Loading diary...</Text>
            </View>
          ) : null}

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {!isLoading && !entries.length && !errorMessage ? (
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons name="notebook-plus-outline" size={42} color={colors.primary} />
              <Text style={styles.emptyTitle}>No diary entries yet</Text>
              <Text style={styles.emptyText}>Save the feelings, photos, and memorable moments from this trip.</Text>
              <Pressable style={styles.emptyButton} onPress={() => openEditor()}>
                <Text style={styles.emptyButtonText}>Write First Entry</Text>
              </Pressable>
            </View>
          ) : null}

          {entries.length ? (
            <View style={styles.timelineWrap}>
              <View style={styles.timelineLine} />
              <View style={[styles.timelineLineActive, { height: Math.max(112, entries.length * 132) }]} />
              {entries.map((entry) => (
                <TimelineCard
                  key={entry.id}
                  entry={entry}
                  onEdit={openEditor}
                  onDelete={confirmDeleteEntry}
                  isDeleting={deletingEntryId === entry.id}
                />
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.ctaWrap}>
          <Pressable style={styles.ctaButton} onPress={() => setShowSlideshow(true)}>
            <MaterialCommunityIcons name="movie-open-play" size={22} color={colors.white} />
            <Text style={styles.ctaText}>Create Memory Video</Text>
          </Pressable>
          <Text style={styles.helperText}>
            Create a short movie from your favorite photos and videos.
          </Text>
        </View>
      </ScrollView>

      <VideoSlideshowModal
        visible={showSlideshow}
        images={allImages}
        onClose={() => setShowSlideshow(false)}
      />
    </View>
  );
}
