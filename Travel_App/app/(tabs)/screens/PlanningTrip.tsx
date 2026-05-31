import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Image,
  LayoutAnimation, Platform,
  Pressable, SafeAreaView, ScrollView,
  Text,
  TouchableOpacity,
  UIManager, View
} from 'react-native';
import {
  formatTripDate,
  normalizeTripDays,
  parseTripDate,
  TripData,
  upsertTripDraft,
} from "../store/tripDraftStore";
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

function getDateRangeText(trip: TripData) {
  const startDate = parseTripDate(trip.startDate);
  const endDate = parseTripDate(trip.endDate);

  if (startDate && endDate) {
    return `${formatTripDate(startDate)} - ${formatTripDate(endDate)}`;
  }

  return trip.date || 'Start date - End date';
}

function getActivityPeriodLabel(period?: string, time?: string) {
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

  let hour = Number(hourMatch[1]);
  const meridiem = hourMatch[2]?.toUpperCase();

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

export default function PlanningTrip({ navigation, route }: any) {
  const routeTrip = route?.params?.tripData as TripData | undefined;
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const [trip, setTrip] = useState<TripData>(normalizeTripDays({
    ...defaultTrip,
    ...routeTrip,
    title: routeTrip?.title || route?.params?.title || defaultTrip.title,
  }));

  useEffect(() => {
    if (route?.params?.updatedTrip) {
      const normalizedTrip = normalizeTripDays(route.params.updatedTrip);
      setTrip(normalizedTrip);
      upsertTripDraft(normalizedTrip);
    }
  }, [route?.params?.updatedTrip]);

  useEffect(() => {
    if (routeTrip) {
      setTrip((current) => normalizeTripDays({ ...current, ...routeTrip }));
    }
  }, [routeTrip]);

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

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        {/* Nút trở về */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>

        {/* Tiêu đề ở giữa */}
        <Text style={styles.headerTitle}>Trip Planning</Text>

        {/* View trống để cân bằng không gian, giữ cho text nằm chính giữa */}
        <View style={styles.iconButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>{trip.title}</Text>
            <View style={styles.actionButtons}>
              <Pressable
                onPress={() => {
                  navigation.navigate('EditingTrip', { tripData: trip });
                }}
              >
                <Text style={styles.modifyBtnText}>Modify</Text>
              </Pressable>
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
              const totalCost = day.locations.reduce((sum, location) => {
                const value = getCostValue(location.cost);
                return sum + value;
              }, 0);
              const dayTitle = day.title || `Day ${dayId}`;
              const collapsedTitle = day.locations.length
                ? `${dayTitle}: ${day.locations[0].name}`
                : dayTitle;

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
                        {isExpanded ? dayTitle : collapsedTitle}
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
                      {day.locations.map((loc, locIndex) => {
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
                                  Peaceful place selected for this trip plan.
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