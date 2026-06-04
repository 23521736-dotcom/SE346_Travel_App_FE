import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  LayoutAnimation, Platform,
  Pressable, SafeAreaView, ScrollView,
  Text,
  TouchableOpacity,
  UIManager, View
} from 'react-native';
import {
  fetchTripById,
  mapApiTripToDraft,
  deleteTrip,
} from '../../../../lib/api/trips';
import {
  formatTripDate,
  getSchedulePeriodFromTime,
  normalizeTripDays,
  parseTripDate,
  ScheduleLocation,
  TripData,
  removeTripDraft,
  upsertTripDraft,
} from "../../store/tripDraftStore";
import { getApiErrorMessage } from '../../../../lib/api/client';
import styles from "./PlanningTrip.styles";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const defaultTrip: TripData = {
  title: 'New Trip',
  hotel: 'Not selected',
  duration: 1,
  budget: 0,
  currency: 'USD',
  members: [],
};

const fallbackAvatar =
  'https://i.pinimg.com/736x/4e/8b/d5/4e8bd59f0dc8b24bb4392615e7bc3b33.jpg';
const LOCAL_TRIP_ID_PREFIX = 'local_trip_';

function createLocalTripId() {
  return `${LOCAL_TRIP_ID_PREFIX}${Date.now()}`;
}

function getDateRangeText(trip: TripData) {
  const startDate = parseTripDate(trip.startDate);
  const endDate = parseTripDate(trip.endDate);

  if (startDate && endDate) {
    return `${formatTripDate(startDate)} - ${formatTripDate(endDate)}`;
  }

  return trip.date || 'Start date - End date';
}

function getActivityPeriodLabel(period?: string, time?: string) {
  const schedulePeriod = getSchedulePeriodFromTime(time, period);
  if (schedulePeriod) {
    return schedulePeriod;
  }

  const normalizedPeriod = period?.trim().toLowerCase();

  if (normalizedPeriod?.includes('morning') || normalizedPeriod?.includes('sáng')) {
    return 'MORNING';
  }

  if (
    normalizedPeriod?.includes('afternoon') ||
    normalizedPeriod?.includes('noon') ||
    normalizedPeriod?.includes('trưa') ||
    normalizedPeriod?.includes('chiều')
  ) {
    return 'AFTERNOON';
  }

  if (
    normalizedPeriod?.includes('evening') ||
    normalizedPeriod?.includes('night') ||
    normalizedPeriod?.includes('tối')
  ) {
    return 'EVENING';
  }

  const hourMatch = time?.match(/(\d{1,2})(?::\d{2})?\s*(AM|PM)?/i);
  if (!hourMatch) {
    return 'MORNING';
  }

  let hour = Number(hourMatch![1]);
  const meridiem = hourMatch![2]?.toUpperCase();

  if (meridiem === 'PM' && hour < 12) {
    hour += 12;
  }

  if (meridiem === 'AM' && hour === 12) {
    hour = 0;
  }

  if (hour < 12) {
    return 'MORNING';
  }

  if (hour < 18) {
    return 'AFTERNOON';
  }

  return 'EVENING';
}

function getCostValue(cost: string) {
  return Number(cost.replace(/[^0-9.]/g, '')) || 0;
}

function formatBudget(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function isUnsetTime(value?: string) {
  const normalized = String(value || '').trim().toLowerCase();
  return !normalized || normalized === 'time not set';
}

function parseSingleTimeMinutes(value: string) {
  const match = value.trim().match(/^(\d{1,2})(?::([0-5]\d))?\s*(AM|PM)?$/i);
  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3]?.toUpperCase();

  if (meridiem) {
    if (hour < 1 || hour > 12) {
      return null;
    }

    if (meridiem === 'PM' && hour < 12) {
      hour += 12;
    }

    if (meridiem === 'AM' && hour === 12) {
      hour = 0;
    }
  } else if (hour > 23) {
    return null;
  }

  return hour * 60 + minute;
}

function parseTimeRange(value?: string) {
  if (isUnsetTime(value)) {
    return null;
  }

  const parts = String(value).split(/\s*[-–]\s*/);
  if (parts.length > 2) {
    return null;
  }

  const startMinutes = parseSingleTimeMinutes(parts[0]);
  const endMinutes = parts[1] ? parseSingleTimeMinutes(parts[1]) : undefined;
  if (startMinutes === null || endMinutes === null) {
    return null;
  }

  if (endMinutes !== undefined && endMinutes < startMinutes) {
    return null;
  }

  return { startMinutes, endMinutes };
}

function getTimeSortValue(location: ScheduleLocation) {
  const parsedTime = parseTimeRange(location.time);
  return parsedTime?.startMinutes ?? Number.MAX_SAFE_INTEGER;
}

function sortLocationsByTime(locations: ScheduleLocation[]) {
  return [...locations].sort((left, right) => getTimeSortValue(left) - getTimeSortValue(right));
}

function sortTripForPlanning(trip: TripData) {
  const normalizedTrip = normalizeTripDays(trip);

  return {
    ...normalizedTrip,
    itineraryData: normalizedTrip.itineraryData?.map((day) => ({
      ...day,
      locations: sortLocationsByTime(day.locations),
    })),
  };
}

export default function PlanningTrip({ navigation, route }: any) {
  const routeTrip = route?.params?.tripData as TripData | undefined;
  const routeTripId = route?.params?.tripId ? String(route.params.tripId) : undefined;
  const localTripIdRef = useRef<string>(routeTrip?.id || createLocalTripId());
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const [isDeletingTrip, setIsDeletingTrip] = useState(false);
  const [isLoadingRouteTrip, setIsLoadingRouteTrip] = useState(Boolean(routeTripId && !routeTrip));
  const [trip, setTrip] = useState<TripData>(sortTripForPlanning({
    ...defaultTrip,
    ...routeTrip,
    title: routeTrip?.title || route?.params?.title || defaultTrip.title,
  }));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialTripRef = useRef<TripData>(sortTripForPlanning({
    ...defaultTrip,
    ...routeTrip,
    title: routeTrip?.title || route?.params?.title || defaultTrip.title,
  }));

  useEffect(() => {
    if (!routeTripId || routeTrip) {
      return;
    }

    let isMounted = true;
    const tripId = routeTripId;
    setIsLoadingRouteTrip(true);

    async function loadTripFromRoute() {
      try {
        const apiTrip = await fetchTripById(tripId);
        if (!isMounted) {
          return;
        }

        const apiDraft = mapApiTripToDraft(apiTrip);
        const draft = sortTripForPlanning({
          ...apiDraft,
          id: apiDraft.id === undefined ? undefined : String(apiDraft.id),
        } as TripData);
        setTrip(draft);
        initialTripRef.current = draft;
        setHasUnsavedChanges(false);
        upsertTripDraft(draft);
      } catch (error) {
        if (isMounted) {
          Alert.alert('Cannot load trip', getApiErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoadingRouteTrip(false);
        }
      }
    }

    loadTripFromRoute();

    return () => {
      isMounted = false;
    };
  }, [routeTrip, routeTripId]);

  useEffect(() => {
    if (route?.params?.updatedTrip) {
      const normalizedTrip = sortTripForPlanning(route.params.updatedTrip);
      setTrip(normalizedTrip);
      initialTripRef.current = normalizedTrip;
      setHasUnsavedChanges(false);
      upsertTripDraft(normalizedTrip);
    }
  }, [route?.params?.updatedTrip]);

  useEffect(() => {
    if (routeTrip) {
      setTrip((current) => sortTripForPlanning({ ...current, ...routeTrip }));
    }
  }, [routeTrip]);

  // Track unsaved changes
  useEffect(() => {
    // Simple check: compare stringified versions
    const currentTripStr = JSON.stringify(trip);
    const initialTripStr = JSON.stringify(initialTripRef.current);
    setHasUnsavedChanges(currentTripStr !== initialTripStr);
  }, [trip]);

  // Hàm xử lý khi bấm vào Header của từng ngày
  const toggleExpand = (dayId: number) => {
    // Kích hoạt hiệu ứng mượt
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setExpandedDays(prev => {
      if (prev.includes(dayId)) {
        return prev.filter(id => id !== dayId);
      }
      return [...prev, dayId];
    });
  };

  const handleGoBack = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        "Discard changes?",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.goBack()
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const daysData = Array.from({ length: Math.max(trip.duration, 1) }, (_, index) => ({
    id: index + 1,
    dayNumber: String(index + 1).padStart(2, '0'),
    title: trip.itineraryData?.[index]?.title || `Day ${index + 1}`,
    subtitle: trip.itineraryData?.[index]?.date || 'Date not set',
  }));
  const hasDetailedSchedule = Boolean(
    trip.itineraryData?.some((day) => day.locations.length > 0)
  );
  const totalEstimatedBudget = trip.itineraryData?.reduce(
    (tripSum, day) =>
      tripSum + day.locations.reduce((daySum, location) => daySum + getCostValue(location.cost), 0),
    0
  ) ?? 0;

  const openEditTrip = () => {
    if (isDeletingTrip) {
      return;
    }

    const editableTrip = normalizeTripDays({
      ...trip,
      id: trip.id || localTripIdRef.current,
    });

    navigation.navigate('EditingTrip', {
      tripData: editableTrip,
      mode: trip.id ? route?.params?.mode : 'create',
    });
  };

  const deleteCurrentTrip = async () => {
    if (!trip.id || isDeletingTrip) {
      return;
    }

    setIsDeletingTrip(true);
    try {
      await deleteTrip(trip.id);
      removeTripDraft(trip.id);
      navigation.navigate('Main', { screen: 'My Trip' });
    } catch (error) {
      Alert.alert('Cannot delete trip', getApiErrorMessage(error));
    } finally {
      setIsDeletingTrip(false);
    }
  };

  const confirmDeleteTrip = () => {
    if (!trip.id) {
      Alert.alert('Cannot delete trip', 'This trip has not been saved yet.');
      return;
    }

    Alert.alert(
      'Delete trip',
      `Delete "${trip.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void deleteCurrentTrip();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        {/* Nút trở về */}
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.iconButton}
        >
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Trip Planning</Text>
        <View />


      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {isLoadingRouteTrip ? (
          <ActivityIndicator size="small" color="#0EB4D3" />
        ) : null}

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>{trip.title}</Text>
            <View style={styles.actionButtons}>
              <Pressable
                onPress={openEditTrip}
                disabled={isDeletingTrip || isLoadingRouteTrip}
                style={({ pressed }) => [
                  styles.actionPill,
                  pressed && styles.buttonPressed,
                  (isDeletingTrip || isLoadingRouteTrip) && styles.actionButtonDisabled,
                ]}
              >
                <Feather name="edit-2" size={14} color="#0EB4D3" />
                <Text style={styles.modifyBtnText}>Modify</Text>
              </Pressable>
              {/* <Pressable
                onPress={confirmDeleteTrip}
                disabled={isDeletingTrip || isLoadingRouteTrip}
                style={({ pressed }) => [
                  styles.actionPillDanger,
                  pressed && styles.buttonPressed,
                  (isDeletingTrip || isLoadingRouteTrip) && styles.actionButtonDisabled,
                ]}
              >
                {isDeletingTrip ? (
                  <ActivityIndicator size="small" color="#E53935" />
                ) : (
                  <Feather name="trash-2" size={14} color="#E53935" />
                )}
                <Text style={styles.deleteTripText}>
                  {isDeletingTrip ? 'Deleting' : 'Delete'}
                </Text>
              </Pressable> */}
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.label}>Current Hotel</Text>
              <View style={styles.iconRow}>
                <Ionicons name="bed" size={16} color="#0EB4D3" />
                <Text style={styles.infoValue}>{trip.hotel}</Text>
              </View>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.label}>Duration</Text>
              <View style={styles.iconRow}>
                <Feather name="calendar" size={16} color="#0EB4D3" />
                <Text style={styles.infoValue}>{trip.duration} Days</Text>
              </View>
              <Text style={styles.dateRangeText}>{getDateRangeText(trip)}</Text>
            </View>
          </View>
          <View style={styles.bottomSettingsRow}>
            <View>
              <Text style={styles.label}>Group Members</Text>
              <View style={styles.avatarGroup}>
                {trip.members.length ? (
                  <>
                    {trip.members.slice(0, 3).map((member, index) => (
                      <Image
                        key={member.id}
                        source={{ uri: member.avatar || fallbackAvatar }}
                        style={[
                          styles.avatar,
                          index > 0 && styles.avatarOverlap,
                          { zIndex: 3 - index },
                        ]}
                      />
                    ))}
                    {trip.members.length > 3 ? (
                      <View style={[styles.avatarMore, styles.avatarOverlap]}>
                        <Text style={styles.avatarMoreText}>+{trip.members.length - 3}</Text>
                      </View>
                    ) : null}
                  </>
                ) : (
                  <>
                    <TouchableOpacity style={styles.avatarPlus}>
                      <Feather name="plus" size={16} color="#718096" />
                    </TouchableOpacity>
                    <Text style={styles.emptyMembersText}>No members yet</Text>
                  </>
                )}
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.label}>Total Estimated Budget</Text>
              <Text style={styles.budgetAmount}>VND: {formatBudget(totalEstimatedBudget)}</Text>
            </View>
          </View>
        </View>

        {hasDetailedSchedule ? (
          <View>
            {trip.itineraryData?.map((day, index) => {
              const dayId = index + 1;
              const isExpanded = expandedDays.includes(dayId);
              const sortedLocations = sortLocationsByTime(day.locations);
              const totalCost = day.locations.reduce((sum, location) => {
                const value = getCostValue(location.cost);
                return sum + value;
              }, 0);
              const dayTitle = day.title || `Day ${dayId}`;

              return (
                <View key={day.dayId} style={styles.timelineDay}>
                  <Pressable
                    onPress={() => toggleExpand(dayId)}
                    style={isExpanded ? styles.dayHeaderExpanded : styles.dayHeaderCollapsed}
                  >
                    <View style={isExpanded ? styles.dayBadgeExpanded : styles.dayBadgeCollapsed}>
                      <Text style={isExpanded ? styles.dayBadgeTextExpanded : styles.dayBadgeTextCollapsed}>
                        {String(dayId).padStart(2, '0')}
                      </Text>
                    </View>

                    <View style={styles.dayTitleCol}>
                      <Text style={isExpanded ? styles.dayTitleExpanded : styles.dayTitleCollapsed}>
                        {dayTitle}
                      </Text>
                      <Text style={styles.daySubtitle}>
                        {day.date} - {day.locations.length} Locations - VND: {formatBudget(totalCost)}
                      </Text>
                    </View>

                    <Feather
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#a0aec0"
                    />
                  </Pressable>

                  {isExpanded ? (
                    <View style={styles.timelineWrap}>
                      <View style={styles.timelineLine} />
                      {sortedLocations.map((loc) => {
                        const periodLabel = getActivityPeriodLabel(loc.period, loc.time);

                        return (
                          <View key={loc.id} style={styles.timelineItem}>
                            <View style={styles.timeHeader}>
                              <View style={styles.timelineDot} />
                              <Text style={styles.timeTitle}>
                                {periodLabel}{' '}
                                <Text style={styles.timeText}>- {loc.time.split(' - ')[0]}</Text>
                              </Text>
                            </View>

                            <View style={styles.timelineCard}>
                              <Image source={{ uri: loc.image }} style={styles.timelineImage} />

                              <View style={styles.timelineInfo}>
                                <View style={styles.timelineTitleRow}>
                                  <Text numberOfLines={1} style={styles.timelineTitle}>
                                    {loc.name}
                                  </Text>
                                  <View style={styles.ratingPill}>
                                    <Ionicons name="star" size={9} color="#F97316" />
                                    <Text style={styles.ratingText}>{loc.rating.split(' ')[0]}</Text>
                                  </View>
                                </View>
                                <Text numberOfLines={2} style={styles.timelineDescription}>
                                  {loc.location || loc.description || 'Location not set'}
                                </Text>
                                <View style={styles.estimatePill}>
                                  <Text style={styles.estimateText}>VND: {formatBudget(getCostValue(loc.cost))}</Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : (
          <View>
            {daysData.map((day) => {
              const isExpanded = expandedDays.includes(day.id);

              return (
                <View key={day.id}>
                  <Pressable
                    onPress={() => toggleExpand(day.id)}
                    style={styles.dayHeader}
                  >
                    <View style={styles.dayBadge}>
                      <Text style={styles.dayBadgeText}>
                        {day.dayNumber}
                      </Text>
                    </View>

                    <View style={styles.dayTitleCol}>
                      <Text style={styles.dayTitle}>
                        {day.title}
                      </Text>
                      <Text style={styles.daySubtitle}>{day.subtitle}</Text>
                    </View>

                    <Feather
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#a0aec0"
                    />
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
