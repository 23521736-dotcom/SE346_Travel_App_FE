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
import { getApiErrorMessage } from '../../../lib/api/client';
import { fetchFavorites } from '../../../lib/api/favorites';
import type { PlaceListItem } from '../../../lib/api/types';
import { mapApiTripToDraft, upsertTripToBackend } from '../../../lib/api/trips';
import { getPrimaryCategory, matchesPlaceCategory } from '../common/placeCategory';
import {
    normalizeTripDays,
    ScheduleLocation,
    TripData,
    upsertTripDraft,
} from '../store/tripDraftStore';
import styles from './AddLocationScreen_user.style';

type SavedPlaceItem = {
    id: string;
    title: string;
    category: string;
    location: string;
    rating: string;
    reviews: string;
    description: string;
    imageUrl: string;
};

const FILTERS = ['All', 'Festivals', 'Dining', 'Attractions'];
const SAVED_FILTERS = ['All', 'Festivals', 'Dining', 'Attractions'];

function normalizeDayKey(value?: string) {
    return String(value || '').trim().toLowerCase().replace(/^day_/, '');
}

function getLocationSelectionId(location: ScheduleLocation) {
    return location.placeId || location.id;
}

function mapFavoritePlace(place: PlaceListItem): SavedPlaceItem {
    return {
        id: place.Id || place.id,
        title: place.Name || place.name,
        category: getPrimaryCategory(place.Features || place.featureLabel),
        location: place.Located || place.region,
        rating: String(place.Rate ?? place.averageRating ?? 0),
        reviews: `${place.NumberOfRate ?? place.ratingCount ?? 0} reviews`,
        description: `${place.Name || place.name} in ${place.Located || place.region}`,
        imageUrl: place.image || place.coverImageUrl,
    };
}

function getCostValue(cost: string) {
    return Number(cost.replace(/[^0-9.]/g, '')) || 0;
}

function getTripTotalBudget(days = [] as NonNullable<TripData['itineraryData']>) {
    return days.reduce(
        (tripSum, day) =>
            tripSum + day.locations.reduce((daySum, location) => daySum + getCostValue(location.cost), 0),
        0
    );
}

export default function AddLocationScreen_user({ navigation, route }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeSearchFilter, setActiveSearchFilter] = useState('All');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [savedPlaces, setSavedPlaces] = useState<SavedPlaceItem[]>([]);
    const [loadingSavedPlaces, setLoadingSavedPlaces] = useState(true);
    const [savingSelection, setSavingSelection] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const dayTitle = route?.params?.dayTitle;
    const dayId = route?.params?.dayId as string | undefined;
    const routeTrip = (route?.params?.tripData as TripData | undefined) || undefined;
    const tripId = route?.params?.tripId as string | undefined || routeTrip?.id;
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

    const loadSavedPlaces = useCallback(async () => {
        setLoadingSavedPlaces(true);
        try {
            const data = await fetchFavorites();
            setSavedPlaces(data.map(mapFavoritePlace));
        } catch (error) {
            Alert.alert('Loi', getApiErrorMessage(error));
            setSavedPlaces([]);
        } finally {
            setLoadingSavedPlaces(false);
        }
    }, []);

    useEffect(() => {
        loadSavedPlaces();
    }, [loadSavedPlaces]);

    const searchResults = useMemo(() => {
        const normalizedQuery = submittedQuery.trim().toLowerCase();

        return savedPlaces.filter((item) => {
            const matchesFilter = matchesPlaceCategory(item.category, activeSearchFilter);
            const matchesQuery =
                item.title.toLowerCase().includes(normalizedQuery) ||
                item.location.toLowerCase().includes(normalizedQuery) ||
                item.category.toLowerCase().includes(normalizedQuery) ||
                item.description.toLowerCase().includes(normalizedQuery);

            return matchesFilter && matchesQuery;
        });
    }, [activeSearchFilter, savedPlaces, submittedQuery]);

    const submitSearch = () => {
        setSubmittedQuery(searchQuery);
    };

    const buildTripLocation = (place: SavedPlaceItem): ScheduleLocation => ({
        id: place.id,
        placeId: place.id,
        name: place.title,
        rating: place.rating,
        image: place.imageUrl,
        time: 'Time not set',
        cost: '0',
    });

    const saveSelectedLocations = async () => {
        if (savingSelection) {
            return;
        }

        if (!tripSnapshot || !dayId) {
            const message = 'Trip chua san sang de cap nhat.';
            setSaveError(message);
            Alert.alert('Loi', message);
            return;
        }

        setSavingSelection(true);
        setSaveError(null);
        try {
            const normalizedTrip = normalizeTripDays(tripSnapshot);
            const activeDay = normalizedTrip.itineraryData?.find(
                (day) => normalizeDayKey(day.dayId) === normalizeDayKey(dayId)
            );
            const currentLocations = activeDay?.locations || [];
            const existingLocationMap = new Map(
                currentLocations.map((location) => [getLocationSelectionId(location), location])
            );

            const selectedLocations = selectedItems
                .map((locationId) => {
                    const existingLocation = existingLocationMap.get(locationId);
                    if (existingLocation) {
                        return existingLocation;
                    }

                    const selectedPlace = savedPlaces.find((place) => place.id === locationId);
                    if (!selectedPlace) {
                        return null;
                    }

                    return buildTripLocation(selectedPlace);
                })
                .filter((location): location is ScheduleLocation => Boolean(location));

            // Keep locations that were already in the trip but not tied to saved-place IDs.
            const untouchedLocations = currentLocations.filter(
                (location) => !savedPlaces.some((place) => place.id === getLocationSelectionId(location))
            );

            const nextItineraryData = (normalizedTrip.itineraryData || []).map((day) => {
                if (normalizeDayKey(day.dayId) !== normalizeDayKey(dayId)) {
                    return day;
                }

                return {
                    ...day,
                    locations: [...untouchedLocations, ...selectedLocations],
                };
            });

            const updatedTrip = normalizeTripDays({
                ...normalizedTrip,
                itineraryData: nextItineraryData,
            });
            updatedTrip.budget = getTripTotalBudget(updatedTrip.itineraryData);

            const savedTrip = await upsertTripToBackend(
                updatedTrip as Record<string, unknown>,
                String(tripId || updatedTrip.id || '') || undefined
            );

            const persistedTrip = normalizeTripDays({
                ...updatedTrip,
                ...mapApiTripToDraft(savedTrip),
            } as TripData);

            if (persistedTrip.id) {
                upsertTripDraft(persistedTrip);
            }

            setTripSnapshot(persistedTrip);
            navigation.navigate({
                name: 'EditingTrip',
                params: { tripData: persistedTrip },
                merge: true,
            });
        } catch (error) {
            const message = getApiErrorMessage(error);
            setSaveError(message);
            console.error('Save trip locations failed', error);
            Alert.alert('Loi luu trip', message);
        } finally {
            setSavingSelection(false);
        }
    };

    const toggleItem = (id: string) => {
        setSelectedItems((current) =>
            current.includes(id)
                ? current.filter((itemId) => itemId !== id)
                : [...current, id]
        );
    };

    const renderResultCard = ({ item }: { item: SavedPlaceItem }) => {
        const isSelected = selectedItems.includes(item.id);

        return (
            <View style={styles.resultCard}>
                <View style={styles.resultImageContainer}>
                    <Image source={{ uri: item.imageUrl }} style={styles.resultCardImage} />
                    <View style={styles.resultCategoryBadge}>
                        <Text style={styles.resultCategoryBadgeText}>{item.category}</Text>
                    </View>
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

                    <Text style={styles.resultDescription} numberOfLines={2}>{item.description}</Text>

                    <View style={styles.resultCardFooter}>
                        <Text style={styles.resultReviewsText}>{item.reviews}</Text>
                        <Pressable
                            style={[styles.resultAddButton, isSelected && styles.resultAddButtonSelected]}
                            onPress={() => toggleItem(item.id)}
                            disabled={savingSelection}
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
                            editable={!savingSelection}
                        />
                    </View>
                    <TouchableOpacity onPress={saveSelectedLocations} disabled={savingSelection}>
                        <Text style={{ color: '#005f73', fontWeight: '700', opacity: savingSelection ? 0.5 : 1 }}>
                            {savingSelection ? 'Saving...' : 'Save'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.resultFiltersContainer}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={FILTERS}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => {
                            const isActive = item === activeSearchFilter;

                            return (
                                <Pressable
                                    style={[styles.resultFilterPill, isActive && styles.resultFilterPillActive]}
                                    onPress={() => setActiveSearchFilter(item)}
                                    disabled={savingSelection}
                                >
                                    <Text style={[styles.resultFilterText, isActive && styles.resultFilterTextActive]}>{item}</Text>
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
                    <TouchableOpacity onPress={() => navigation.goBack()} disabled={savingSelection}>
                        <Feather name="arrow-left" size={24} color="#003A70" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {dayTitle ? `Add Destination - ${dayTitle}` : 'Add Destination'}
                    </Text>
                    <TouchableOpacity onPress={saveSelectedLocations} disabled={savingSelection}>
                        <Text style={{ color: '#006699', fontWeight: '700', opacity: savingSelection ? 0.5 : 1 }}>
                            {savingSelection ? 'Saving...' : 'Save'}
                        </Text>
                    </TouchableOpacity>
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
                        editable={!savingSelection}
                    />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                    {SAVED_FILTERS.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
                            onPress={() => setActiveFilter(filter)}
                            disabled={savingSelection}
                        >
                            <Text style={[styles.filterChipText, activeFilter === filter && styles.filterChipTextActive]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionHeaderLeft}>
                        <Feather name="bookmark" size={18} color="#003A70" />
                        <Text style={styles.sectionTitle}>From Saved</Text>
                    </View>
                </View>

                {saveError ? (
                    <View style={{ marginHorizontal: 12, marginBottom: 10, padding: 10, borderRadius: 8, backgroundColor: '#FEE2E2' }}>
                        <Text style={{ color: '#991B1B', fontWeight: '600' }}>{saveError}</Text>
                    </View>
                ) : null}

                {loadingSavedPlaces ? (
                    <View style={{ paddingVertical: 28 }}>
                        <ActivityIndicator size="small" color="#006699" />
                    </View>
                ) : savedPlaces.filter((place) => matchesPlaceCategory(place.category, activeFilter)).map((place) => {
                    const isSelected = selectedItems.includes(place.id);

                    return (
                        <View key={place.id} style={styles.card}>
                            <Image source={{ uri: place.imageUrl }} style={styles.cardImg} />
                            <View style={styles.cardInfo}>
                                <Text style={styles.placeName}>{place.title}</Text>
                                <View style={styles.ratingRow}>
                                    <FontAwesome name="star" size={12} color="#D4A373" />
                                    <Text style={styles.ratingText}>
                                        {place.rating} ({place.reviews}) - {place.location}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.addBtn, isSelected && styles.addedBtn]}
                                onPress={() => toggleItem(place.id)}
                                disabled={savingSelection}
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
