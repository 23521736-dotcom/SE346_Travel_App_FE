import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { DimensionValue } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { getApiErrorMessage } from '@/lib/api/client';
import {
  fetchOwnerDashboard,
  type DashboardPromotionImpact,
  type OwnerDashboardData,
} from '@/lib/api/dashboard';
import { useAuth } from '../../context/AuthContext';
import styles from './DashboardScreen.style';

const emptyDashboard: OwnerDashboardData = {
  summary: {
    placeId: '',
    placeName: '',
    saves: 0,
    growthPercent: 0,
  },
  campaigns: [],
  places: [],
};

function formatCount(value: number): string {
  if (!Number.isFinite(value)) {
    return '0';
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }
  return String(value);
}

function formatGrowth(value: number): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  const sign = safeValue > 0 ? '+' : '';
  return `${sign}${safeValue.toFixed(Math.abs(safeValue) % 1 === 0 ? 0 : 1)}%`;
}

function formatRating(value: number): string {
  return Number.isFinite(value) ? value.toFixed(1) : '0.0';
}

function getBarHeight(value: number, maxValue: number): DimensionValue {
  if (maxValue <= 0) {
    return '8%' as DimensionValue;
  }
  return `${Math.max(8, Math.min(100, (value / maxValue) * 100))}%` as DimensionValue;
}

function getChartMax(campaign: DashboardPromotionImpact | null): number {
  if (!campaign) {
    return 0;
  }

  const highestValue = Math.max(
    campaign.comments.before,
    campaign.comments.after,
    campaign.saves.before,
    campaign.saves.after,
    campaign.badReviews.before,
    campaign.badReviews.after,
    0
  );

  if (highestValue <= 5) {
    return 5;
  }
  if (highestValue <= 10) {
    return 10;
  }
  if (highestValue <= 20) {
    return 20;
  }

  return Math.ceil(highestValue / 10) * 10;
}

function getChartTicks(maxValue: number): number[] {
  if (maxValue <= 5) {
    return [5, 3, 1, 0];
  }
  if (maxValue <= 10) {
    return [10, 5, 2, 0];
  }
  if (maxValue <= 20) {
    return [20, 10, 5, 0];
  }

  return [maxValue, Math.round(maxValue * 0.66), Math.round(maxValue * 0.33), 0];
}

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<OwnerDashboardData>(emptyDashboard);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const places = dashboard.places;
  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedPlaceId) ?? places[0] ?? null,
    [places, selectedPlaceId]
  );
  const campaigns = useMemo(() => {
    if (!selectedPlace?.id) {
      return [];
    }

    return dashboard.campaigns.filter((campaign) => campaign.placeId === selectedPlace.id);
  }, [dashboard.campaigns, selectedPlace?.id]);

  const loadDashboard = useCallback(
    async (showRefreshing = false) => {
      if (!user?.id) {
        setDashboard(emptyDashboard);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      try {
        if (showRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);
        const data = await fetchOwnerDashboard(user.id);
        setDashboard(data ?? emptyDashboard);
        setSelectedPlaceId((currentPlaceId) => {
          if (currentPlaceId && data?.places?.some((place) => place.id === currentPlaceId)) {
            return currentPlaceId;
          }
          return data?.places?.[0]?.id ?? null;
        });
      } catch (err) {
        setDashboard(emptyDashboard);
        setSelectedPlaceId(null);
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.id]
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (campaigns.length === 0) {
      setSelectedCampaignId(null);
      return;
    }

    if (!selectedCampaignId || !campaigns.some((campaign) => campaign.campaignId === selectedCampaignId)) {
      setSelectedCampaignId(campaigns[0].campaignId);
    }
  }, [campaigns, selectedCampaignId]);

  const selectedCampaign = useMemo(
    () =>
      campaigns.find((campaign) => campaign.campaignId === selectedCampaignId) ??
      campaigns[0] ??
      null,
    [campaigns, selectedCampaignId]
  );
  const chartMax = useMemo(() => getChartMax(selectedCampaign), [selectedCampaign]);
  const chartTicks = useMemo(() => getChartTicks(chartMax), [chartMax]);
  const renderChartGroup = (
    label: string,
    values: { before: number; after: number }
  ) => (
    <View style={styles.chartGroup}>
      <View style={styles.barsRow}>
        <View style={styles.barSlot}>
          <Text style={styles.barValue}>{formatCount(values.before)}</Text>
          <View
            style={[
              styles.bar,
              styles.beforeBar,
              { height: getBarHeight(values.before, chartMax) },
            ]}
          />
        </View>
        <View style={styles.barSlot}>
          <Text style={styles.barValue}>{formatCount(values.after)}</Text>
          <View
            style={[
              styles.bar,
              styles.afterBar,
              { height: getBarHeight(values.after, chartMax) },
            ]}
          />
        </View>
      </View>
      <Text style={styles.chartLabel}>{label}</Text>
    </View>
  );

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  const openPlaceReviews = (place: OwnerDashboardData['places'][number]) => {
    const params = { placeId: place.id, placeName: place.name };
    const parentNavigation = navigation?.getParent?.();

    if (parentNavigation?.navigate) {
      parentNavigation.navigate('All Reviews', params);
      return;
    }

    navigation?.navigate?.('All Reviews', params);
  };

  const renderReviewSwipeAction = (place: OwnerDashboardData['places'][number]) => (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={() => openPlaceReviews(place)}
      style={styles.swipeAction}
    >
      <Ionicons name="chatbubbles-outline" size={22} color="#ffffff" />
      <Text style={styles.swipeActionText}>View reviews</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.75} onPress={handleBack}>
            <Ionicons name="chevron-back" size={22} color="#006591" />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            Analytics Overview
          </Text>

          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.75}
            onPress={() => loadDashboard(true)}
          >
            <Ionicons name="refresh" size={20} color="#006591" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => loadDashboard(true)} />
          }
        >
          {loading ? (
            <View style={[styles.card, styles.stateCard]}>
              <ActivityIndicator color="#006591" />
              <Text style={styles.stateText}>Loading dashboard...</Text>
            </View>
          ) : null}

          {!loading && error ? (
            <View style={[styles.card, styles.stateCard]}>
              <Ionicons name="alert-circle-outline" size={24} color="#006591" />
              <Text style={styles.stateText}>{error}</Text>
            </View>
          ) : null}

          <View style={[styles.card, styles.statCard]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>
                Saves for {dashboard.summary.placeName || 'your places'}
              </Text>
              <View style={styles.statRow}>
                <Text style={styles.statValue}>{formatCount(dashboard.summary.saves)}</Text>
                <View style={styles.trendPill}>
                  <Ionicons
                    name={dashboard.summary.growthPercent < 0 ? 'trending-down' : 'trending-up'}
                    size={15}
                    color="#006591"
                  />
                  <Text style={styles.trendText}>
                    {formatGrowth(dashboard.summary.growthPercent)}
                  </Text>
                </View>
              </View>
              <Text style={styles.mutedText}>Compared with last month</Text>
            </View>


          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>
                  {selectedPlace?.name || selectedCampaign?.placeName || 'Promotion'} Impact
                </Text>
              </View>

              {campaigns.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.promoSelector}
                >
                  {campaigns.map((campaign) => {
                    const isActive = campaign.campaignId === selectedCampaignId;

                    return (
                      <TouchableOpacity
                        key={campaign.campaignId}
                        activeOpacity={0.78}
                        onPress={() => setSelectedCampaignId(campaign.campaignId)}
                        style={[styles.promoChip, isActive && styles.promoChipActive]}
                      >
                        <Text
                          style={[
                            styles.promoChipText,
                            isActive && styles.promoChipTextActive,
                          ]}
                        >
                          {campaign.campaignName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : null}
            </View>

            {selectedCampaign ? (
              <View style={[styles.card, styles.chartCard]}>
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.beforeDot]} />
                  <Text style={styles.legendText}>Before Promotion</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.afterDot]} />
                  <Text style={styles.legendText}>After Promotion</Text>
                </View>
              </View>

              <View style={styles.chartArea}>
                <View style={styles.yAxis}>
                  {chartTicks.map((tick) => (
                    <Text key={tick} style={styles.yAxisLabel}>
                      {tick}
                    </Text>
                  ))}
                </View>

                <View style={styles.chartGroups}>
                    {renderChartGroup('Comments', selectedCampaign.comments)}
                    {renderChartGroup('Saves', selectedCampaign.saves)}
                    {renderChartGroup('Bad Reviews', selectedCampaign.badReviews)}
                </View>
              </View>
              </View>
            ) : (
              <View style={[styles.card, styles.stateCard]}>
                <Text style={styles.stateText}>No promotion data yet.</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>Place Performance</Text>

            {places.length > 0 ? places.map((place) => {
              const isSelected = place.id === selectedPlace?.id;

              return (
                <Swipeable
                  key={place.id}
                  friction={1.8}
                  rightThreshold={36}
                  overshootRight={false}
                  renderRightActions={() => renderReviewSwipeAction(place)}
                >
                  <View
                    style={[
                      styles.card,
                      styles.placeCard,
                      isSelected && styles.selectedPlaceCard,
                    ]}
                  >
                    {isSelected ? <View style={styles.selectedPlaceAccent} /> : null}
                    <View style={styles.placeTopRow}>
                      {place.imageUrl ? (
                        <Image
                          source={{ uri: place.imageUrl }}
                          style={[styles.placeImage, isSelected && styles.selectedPlaceImage]}
                        />
                      ) : (
                        <View
                          style={[
                            styles.placeImage,
                            styles.placeImageFallback,
                            isSelected && styles.selectedPlaceImage,
                          ]}
                        >
                          <Ionicons name="image-outline" size={24} color="#6e7881" />
                        </View>
                      )}
                      <TouchableOpacity
                        activeOpacity={0.78}
                        onPress={() => setSelectedPlaceId(place.id)}
                        style={styles.placeInfo}
                      >
                        <Text
                          style={[styles.placeTitle, isSelected && styles.selectedPlaceTitle]}
                          numberOfLines={1}
                        >
                          {place.name}
                        </Text>
                        <Text style={styles.placeSubtitle} numberOfLines={1}>
                          {formatRating(place.averageRating)} rating from {formatCount(place.ratingCount)} reviews
                        </Text>
                      </TouchableOpacity>
                      {isSelected ? (
                        <View style={styles.selectedPlaceBadge}>
                          <Ionicons name="checkmark" size={16} color="#006591" />
                        </View>
                      ) : null}
                    </View>

                    <View style={[styles.metricRow, isSelected && styles.selectedMetricRow]}>
                      <TouchableOpacity
                        activeOpacity={0.74}
                        onPress={() => setSelectedPlaceId(place.id)}
                        style={[styles.metricItem, isSelected && styles.selectedMetricItem]}
                      >
                        <Text style={[styles.metricLabel, styles.metricLabelComment]}>Comments</Text>
                        <Text style={[styles.metricValue, styles.metricValueComment]}>
                          {formatCount(place.comments)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.74}
                        onPress={() => setSelectedPlaceId(place.id)}
                        style={[styles.metricItem, isSelected && styles.selectedMetricItem]}
                      >
                        <Text style={[styles.metricLabel, styles.metricLabelSave]}>Saves</Text>
                        <Text style={[styles.metricValue, styles.metricValueSave]}>
                          {formatCount(place.saves)}
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={[
                          styles.metricItem,
                          styles.badReviewMetricItem,
                          isSelected && styles.selectedMetricItem,
                        ]}
                      >
                        <Text style={[styles.metricLabel, styles.metricLabelDanger]}>Bad Reviews</Text>
                        <Text style={[styles.metricValue, styles.metricValueDanger]}>
                          {formatCount(place.badReviews)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Swipeable>
              );
            }) : (
              <View style={[styles.card, styles.stateCard]}>
                <Text style={styles.stateText}>No place performance data yet.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
