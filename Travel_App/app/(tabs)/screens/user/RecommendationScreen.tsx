import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { colors } from '../../common/colors';
import { fetchRecommendations } from '../../../../lib/api/recommendations';
import type { RecommendationPlace, RecommendationsResponse } from '../../../../lib/api/recommendations';
import styles from './RecommendationScreen.styles';

type SectionData = {
  key: keyof RecommendationsResponse;
  title: string;
  icon: string;
};

const SECTIONS: SectionData[] = [
  { key: 'contentBased', title: 'Because you liked...', icon: 'heart-outline' },
  { key: 'serendipity', title: 'Discover something new', icon: 'compass-outline' },
  { key: 'collaborative', title: 'Similar users also liked', icon: 'people-outline' },
  { key: 'tfidfSimilar', title: 'Similar places', icon: 'locate-outline' },
  { key: 'trending', title: 'Trending now', icon: 'trending-up-outline' },
];

export default function RecommendationScreen({ navigation }: any) {
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecommendations = useCallback(async () => {
    try {
      const data = await fetchRecommendations(10);
      setRecommendations(data);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    loadRecommendations();
  }, [loadRecommendations]);

  const navigateToDetail = useCallback(
    (placeId: string) => {
      navigation.navigate('Detail Location', { placeId });
    },
    [navigation]
  );

  const renderPlaceCard = useCallback(
    ({ item }: { item: RecommendationPlace }) => (
      <Pressable style={styles.placeCard} onPress={() => navigateToDetail(item.placeId)}>
        <Image source={{ uri: item.coverImageUrl }} style={styles.placeImage} />
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{item.matchPercentage}%</Text>
        </View>
        <View style={styles.placeInfo}>
          <Text style={styles.placeName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.placeRegion} numberOfLines={1}>{item.region}</Text>
          <Text style={styles.placeExplanation} numberOfLines={2}>{item.explanation}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={styles.ratingText}>{item.averageRating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({item.ratingCount})</Text>
          </View>
        </View>
      </Pressable>
    ),
    [navigateToDetail]
  );

  const renderSection = useCallback(
    (section: SectionData) => {
      if (!recommendations) return null;
      const data: RecommendationPlace[] = (recommendations[section.key] as RecommendationPlace[]) || [];
      if (data.length === 0) return null;

      return (
        <View style={styles.section} key={section.key}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name={section.icon as any} size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
            data={data}
            keyExtractor={(item, index) => `${section.key}-${item.placeId}-${index}`}
            renderItem={renderPlaceCard}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No recommendations yet</Text>
              </View>
            }
          />
        </View>
      );
    },
    [recommendations, renderPlaceCard]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading recommendations for you...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Recommendations for You</Text>
            <Text style={styles.headerSubtitle}>Personalized based on your preferences</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((section) => renderSection(section))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
