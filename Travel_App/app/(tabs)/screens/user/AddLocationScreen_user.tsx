import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { getApiErrorMessage } from '../../../../lib/api/client';
import { fetchFavorites } from '../../../../lib/api/favorites';
import { fetchPlaces, fetchPromotionPlaceIds } from '../../../../lib/api/places';
import type { PlaceListItem } from '../../../../lib/api/types';
import { getPrimaryCategory, matchesPlaceCategory } from '../../common/placeCategory';
import {
    getSchedulePeriodFromTime,
    normalizeTripDays,
    ScheduleLocation,
    TripData,
    upsertTripDraft,
} from '../../store/tripDraftStore';
import styles from './AddLocationScreen_user.style';
import { getPlaceCategoryLabel, normalizePlaceCategory, PLACE_CATEGORIES } from '../../../../lib/placeCategories';

type SavedPlaceItem = {
    id: string;
    title: string;
    category: string;
    location: string;
    rating: string;
    reviews: string;
    description: string;
    imageUrl: string;
    cost: string;
    hasPromotion?: boolean;
};

// const FILTERS = ['All', 'Festivals', 'Dining', 'Attractions'];
// const SAVED_FILTERS = ['All', 'Festivals', 'Dining', 'Attractions'];

function normalizeDayKey(value?: string) {
    return String(value || '').trim().toLowerCase().replace(/^day_/, '');
}

const DEFAULT_LOCATION_TIME = '10:00';
const CATEGORY_FILTERS = PLACE_CATEGORIES;
type LocationSource = 'All' | 'Saved';

function getPlaceCost(place: PlaceListItem) {
    const rawCost = place.cost ?? place.Cost ?? place.price ?? place.Price ?? place.priceLevel ?? place.PriceLevel;
    const value = Number(String(rawCost ?? '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(value) ? String(value) : '0';
}

function formatVnd(value: string) {
    const amount = Number(String(value).replace(/[^0-9.]/g, '')) || 0;
    return String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getLocationSelectionId(location: ScheduleLocation) {
    return location.placeId || location.id;
}

function mapFavoritePlace(place: PlaceListItem, promotionPlaceIds: Set<string> = new Set()): SavedPlaceItem {
    const category =
        normalizePlaceCategory(place.category || place.Category) ??
        getPrimaryCategory(place.Features || place.featureLabel);
    const id = place.Id || place.id;

    return {
        id,
        title: place.Name || place.name,
        category,
        location: place.Located || place.region,
        rating: String(place.Rate ?? place.averageRating ?? 0),
        reviews: `${place.NumberOfRate ?? place.ratingCount ?? 0} reviews`,
        description: `${place.Name || place.name} in ${place.Located || place.region}`,
        imageUrl: place.image || place.coverImageUrl,
        cost: getPlaceCost(place),
        hasPromotion: promotionPlaceIds.has(id),
    };
}

export default function AddLocationScreen_user({ navigation, route }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeSearchFilter, setActiveSearchFilter] = useState('All');
    const [locationSource, setLocationSource] = useState<LocationSource>('All');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [allPlaces, setAllPlaces] = useState<SavedPlaceItem[]>([]);
    const [savedPlaces, setSavedPlaces] = useState<SavedPlaceItem[]>([]);
    const [loadingAllPlaces, setLoadingAllPlaces] = useState(true);
    const [loadingSavedPlaces, setLoadingSavedPlaces] = useState(true);
    const [saveError, setSaveError] = useState<string | null>(null);
    const dayTitle = route?.params?.dayTitle;
    const dayId = route?.params?.dayId as string | undefined;
    const routeTrip = (route?.params?.tripData as TripData | undefined) || undefined;
    const isSearchMode = submittedQuery.trim().length > 0;

    const [tripSnapshot, setTripSnapshot] = useState<TripData | undefined>(routeTrip);
    const currentDay = tripSnapshot?.itineraryData?.find(
        (day) => normalizeDayKey(day.dayId) === normalizeDayKey(dayId)
    );

    useEffect(() => {
        setTripSnapshot(routeTrip);
    }, [routeTrip]);

    useEffect(() => {
        setSelectedItems(currentDay?.locations.map(getLocationSelectionId) || []);
    }, [currentDay]);

    const loadAllPlaces = useCallback(async () => {
        setLoadingAllPlaces(true);
        try {
            const data = await fetchPlaces();
            const promotionIds = await fetchPromotionPlaceIds(data.map((place) => place.Id || place.id));
            setAllPlaces(data.map((place) => mapFavoritePlace(place, promotionIds)));
        } catch (error) {
            Alert.alert('Loi', getApiErrorMessage(error));
            setAllPlaces([]);
        } finally {
            setLoadingAllPlaces(false);
        }
    }, []);

    const loadSavedPlaces = useCallback(async () => {
        setLoadingSavedPlaces(true);
        try {
            const data = await fetchFavorites();
            const promotionIds = await fetchPromotionPlaceIds(data.map((place) => place.Id || place.id));
            setSavedPlaces(data.map((place) => mapFavoritePlace(place, promotionIds)));
        } catch (error) {
            Alert.alert('Loi', getApiErrorMessage(error));
            setSavedPlaces([]);
        } finally {
            setLoadingSavedPlaces(false);
        }
    }, []);

    useEffect(() => {
        loadAllPlaces();
        loadSavedPlaces();
    }, [loadAllPlaces, loadSavedPlaces]);

    const visiblePlaces = useMemo(
        () => (locationSource === 'Saved' ? savedPlaces : allPlaces),
        [allPlaces, locationSource, savedPlaces]
    );

    const searchResults = useMemo(() => {
        const normalizedQuery = submittedQuery.trim().toLowerCase();

        return visiblePlaces.filter((item) => {
            const matchesFilter = matchesPlaceCategory(item.category, activeSearchFilter);
            const matchesQuery =
                item.title.toLowerCase().includes(normalizedQuery) ||
                item.location.toLowerCase().includes(normalizedQuery) ||
                item.category.toLowerCase().includes(normalizedQuery) ||
                item.description.toLowerCase().includes(normalizedQuery);

            return matchesFilter && matchesQuery;
        });
    }, [activeSearchFilter, submittedQuery, visiblePlaces]);

    const submitSearch = () => {
        setSubmittedQuery(searchQuery);
    };

    const buildTripLocation = (place: SavedPlaceItem): ScheduleLocation => ({
        id: place.id,
        placeId: place.id,
        name: place.title,
        location: place.location,
        category: place.category,
        description: place.description,
        rating: place.rating,
        image: place.imageUrl,
        time: DEFAULT_LOCATION_TIME,
        period: getSchedulePeriodFromTime(DEFAULT_LOCATION_TIME),
        cost: place.cost,
    });

    const toggleItem = (place: SavedPlaceItem) => {
        if (!tripSnapshot || !dayId) {
            const message = 'Trip chua san sang de cap nhat.';
            setSaveError(message);
            Alert.alert('Loi', message);
            return;
        }

        setSaveError(null);
        const normalizedTrip = normalizeTripDays(tripSnapshot);
        const isSelected = selectedItems.includes(place.id);

        const nextTrip = normalizeTripDays({
            ...normalizedTrip,
            itineraryData: (normalizedTrip.itineraryData || []).map((day) => {
                if (normalizeDayKey(day.dayId) !== normalizeDayKey(dayId)) {
                    return day;
                }

                return {
                    ...day,
                    locations: isSelected
                        ? day.locations.filter((location) => getLocationSelectionId(location) !== place.id)
                        : [...day.locations, buildTripLocation(place)],
                };
            }),
        });

        if (nextTrip.id) {
            upsertTripDraft(nextTrip);
        }

        setTripSnapshot(nextTrip);
        setSelectedItems((current) => (
            isSelected ? current.filter((itemId) => itemId !== place.id) : [...current, place.id]
        ));
    };

    const renderResultCard = ({ item }: { item: SavedPlaceItem }) => {
        const isSelected = selectedItems.includes(item.id);

        return (
            <View style={styles.resultCard}>
                <View style={styles.resultImageContainer}>
                    <Image source={{ uri: item.imageUrl }} style={styles.resultCardImage} />
                    <View style={styles.resultCategoryBadge}>
                        <Text style={styles.resultCategoryBadgeText}>{getPlaceCategoryLabel(item.category)}</Text>
                    </View>
                    {item.hasPromotion && (
                        <View style={styles.resultDealBadge}>
                            <Ionicons name="pricetag" size={12} color="#FFFFFF" />
                            <Text style={styles.resultDealBadgeText}>Deal</Text>
                        </View>
                    )}
                </View>

                <View style={styles.resultCardContent}>
                    <View style={styles.resultCardHeader}>
                        <Text numberOfLines={1} style={styles.resultCardTitle}>{item.title}</Text>
                        <View style={styles.resultRatingPill}>
                            <Ionicons name="star" size={12} color="#D97706" />
                            <Text style={styles.resultRatingText}>{item.rating}</Text>
                        </View>
                    </View>

                    <View style={styles.resultLocationRow}>
                        <Ionicons name="location-outline" size={14} color="#8a95a5" />
                        <Text style={styles.resultLocationText}>{item.location}</Text>
                    </View>

                    <View style={styles.resultLocationRow}>
                        <Ionicons name="cash-outline" size={14} color="#8a95a5" />
                        <Text style={styles.resultLocationText}>VND: {formatVnd(item.cost)}</Text>
                    </View>

                    <Text style={styles.resultDescription} numberOfLines={2}>{item.description}</Text>

                    <View style={styles.resultCardFooter}>
                        <Text style={styles.resultReviewsText}>{item.reviews}</Text>
                        <Pressable
                            style={[styles.resultAddButton, isSelected && styles.resultAddButtonSelected]}
                            onPress={() => toggleItem(item)}
                        >
                            <Feather name={isSelected ? 'check' : 'plus'} size={20} color="#fff" />
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    };

    if (isSearchMode) {
        return (
            <SafeAreaView style={styles.resultContainer}>
                <View style={styles.resultHeaderRow}>
                    <Pressable onPress={() => setSubmittedQuery('')} hitSlop={10}>
                        <Feather name="arrow-left" size={24} color="#1a202c" />
                    </Pressable>
                    <View style={styles.resultSearchBar}>
                        <Feather name="search" size={18} color="#8a95a5" />
                        <TextInput
                            style={[styles.resultSearchInput, { outline: 'none' } as any]}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={submitSearch}
                            placeholder="Search destination"
                            returnKeyType="search"
                        />
                    </View>
                </View>

                <View style={styles.resultFiltersContainer}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={CATEGORY_FILTERS}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => {
                            const isActive = item.value === activeSearchFilter;

                            return (
                                <Pressable
                                    style={[styles.resultFilterPill, isActive && styles.resultFilterPillActive]}
                                    onPress={() => setActiveSearchFilter(item.value)}
                                >
                                    <Text style={[styles.resultFilterText, isActive && styles.resultFilterTextActive]}>{item.label}</Text>
                                </Pressable>
                            );
                        }}
                        contentContainerStyle={styles.resultFilterList}
                    />
                </View>

                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id}
                    renderItem={renderResultCard}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.resultListContainer}
                    ListHeaderComponent={
                        <View style={styles.resultTitleContainer}>
                            <Text style={styles.resultMainTitle}>Explore Tokyo</Text>
                            <Text style={styles.resultSubTitle}>
                                {dayTitle ? `${dayTitle} - ` : ''}
                                Found {searchResults.length} stunning locations for your trip
                            </Text>
                        </View>
                    }
                    ListEmptyComponent={
                        <View style={styles.resultEmptyState}>
                            <Text style={styles.resultEmptyTitle}>No locations found</Text>
                            <Text style={styles.resultEmptyText}>Try another keyword or category.</Text>
                        </View>
                    }
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#003A70" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {dayTitle ? `Add Destination - ${dayTitle}` : 'Add Destination'}
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.searchContainer}>
                    <Pressable onPress={submitSearch} hitSlop={8}>
                        <Feather name="search" size={20} color="#8E9EAB" />
                    </Pressable>
                    <TextInput
                        style={[styles.searchInput, { outline: 'none' } as any]}
                        placeholder="Where do you want to go in Tokyo?"
                        placeholderTextColor="#8E9EAB"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={submitSearch}
                        underlineColorAndroid="transparent"
                        returnKeyType="search"
                    />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                    {CATEGORY_FILTERS.map((filter) => (
                        <TouchableOpacity
                            key={filter.value}
                            style={[styles.filterChip, activeFilter === filter.value && styles.filterChipActive]}
                            onPress={() => setActiveFilter(filter.value)}
                        >
                            <Text style={[styles.filterChipText, activeFilter === filter.value && styles.filterChipTextActive]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.sourceSwitch}>
                    {(['All', 'Saved'] as LocationSource[]).map((source) => {
                        const isActive = locationSource === source;
                        return (
                            <Pressable
                                key={source}
                                style={[styles.sourceSwitchButton, isActive && styles.sourceSwitchButtonActive]}
                                onPress={() => setLocationSource(source)}
                            >
                                <Feather
                                    name={source === 'All' ? 'map-pin' : 'bookmark'}
                                    size={15}
                                    color={isActive ? '#FFFFFF' : '#64748B'}
                                />
                                <Text style={[styles.sourceSwitchText, isActive && styles.sourceSwitchTextActive]}>
                                    {source === 'All' ? 'All' : 'From Saved'}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {saveError ? (
                    <View style={{ marginHorizontal: 12, marginBottom: 10, padding: 10, borderRadius: 8, backgroundColor: '#FEE2E2' }}>
                        <Text style={{ color: '#991B1B', fontWeight: '600' }}>{saveError}</Text>
                    </View>
                ) : null}

                {locationSource === 'All' && loadingAllPlaces || locationSource === 'Saved' && loadingSavedPlaces ? (
                    <View style={{ paddingVertical: 28 }}>
                        <ActivityIndicator size="small" color="#006699" />
                    </View>
                ) : visiblePlaces.filter((place) => matchesPlaceCategory(place.category, activeFilter)).map((place) => {
                    const isSelected = selectedItems.includes(place.id);

                    return (
                        <View key={place.id} style={styles.card}>
                            <View style={styles.cardImageWrap}>
                                <Image source={{ uri: place.imageUrl }} style={styles.cardImg} />
                                {place.hasPromotion && (
                                    <View style={styles.cardDealBadge}>
                                        <Ionicons name="pricetag" size={11} color="#FFFFFF" />
                                    </View>
                                )}
                            </View>
                            <View style={styles.cardInfo}>
                                <Text numberOfLines={1} style={styles.placeName}>{place.title}</Text>
                                <View style={styles.ratingRow}>
                                    <FontAwesome name="star" size={12} color="#D4A373" />
                                    <Text numberOfLines={2} style={styles.ratingText}>
                                        {place.rating} ({place.reviews}) - {place.location}
                                    </Text>
                                </View>
                                <View style={styles.priceRow}>
                                    <Ionicons name="cash-outline" size={13} color="#006699" />
                                    <Text style={styles.priceText}>VND: {formatVnd(place.cost)}</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.addBtn, isSelected && styles.addedBtn]}
                                onPress={() => toggleItem(place)}
                            >
                                <Feather name={isSelected ? 'x' : 'plus'} size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}
