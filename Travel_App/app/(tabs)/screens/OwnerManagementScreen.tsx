import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getApiErrorMessage, useAuth } from '../context/AuthContext';
import { fetchOwnerPlaces } from '../../../lib/api/owner';
import type { OwnerPlace, OwnerPlaceDetail } from '../../../lib/api/owner';
import { getPlaceCategoryLabel, normalizePlaceCategory, PLACE_CATEGORIES } from '../../../lib/placeCategories';
import styles from './OwnerManagementScreen.styles';

const FILTERS = [{ value: 'All', label: 'All' }, ...PLACE_CATEGORIES];

function getPlaceCategory(place: OwnerPlace | OwnerPlaceDetail) {
  return normalizePlaceCategory(place.category || place.Category || place.Features);
}

function getPlaceRate(place: OwnerPlace | OwnerPlaceDetail) {
  return typeof place.Rate === 'number' ? place.Rate : 0;
}

export default function OwnerManagementScreen({ navigation }: any) {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<OwnerPlace[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlaces = useCallback(async () => {
    if (!user?.id) {
      setPlaces([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchOwnerPlaces(user.id);
      setPlaces(data);
    } catch (err) {
      Alert.alert('Loi', getApiErrorMessage(err));
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadPlaces();
    }, [loadPlaces])
  );

  const filteredPlaces = useMemo(() => {
    const searchText = searchQuery.trim().toLowerCase();

    return places.filter((place) => {
      const category = getPlaceCategory(place);
      const matchCategory =
        activeFilter === 'All' || category === normalizePlaceCategory(activeFilter);
      const matchSearch =
        place.Name.toLowerCase().includes(searchText) ||
        place.Location.toLowerCase().includes(searchText);

      return matchCategory && matchSearch;
    });
  }, [activeFilter, places, searchQuery]);

  const renderPlace = ({ item }: { item: OwnerPlace }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.86}
        style={styles.card}
        onPress={() =>
          navigation.navigate('Add Location', {
            place: item,
            placeId: item.Id,
          })
        }
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.Image }} style={styles.cardImage} />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{getPlaceCategoryLabel(getPlaceCategory(item))}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.Name}
            </Text>

            <View style={styles.locationRow}>
              <View style={styles.locationInfo}>
                <Ionicons name="location-outline" size={14} color="#6b7280" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {item.Location}
                </Text>
              </View>
            </View> 
          </View>

          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#f97316" />
            <Text style={styles.ratingText}>{getPlaceRate(item).toFixed(1)}</Text>
          </View>

        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Places Management</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Add Location')}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your places..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearIcon} onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              onPress={() => setActiveFilter(filter.value)}
              style={[styles.filterChip, activeFilter === filter.value && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, activeFilter === filter.value && styles.filterTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredPlaces}
        renderItem={renderPlace}
        keyExtractor={(item) => item.Id}
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadPlaces}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0f6c82" />
            ) : (
              <>
                <Ionicons name="business-outline" size={48} color="#cbd5e1" />
                <Text style={styles.emptyStateText}>No places found.</Text>
              </>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
