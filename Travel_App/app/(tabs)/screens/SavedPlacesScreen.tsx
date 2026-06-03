import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { addFavorite, fetchFavorites, removeFavorite } from '../../../lib/api/favorites';
import { fetchPromotionPlaceIds } from '../../../lib/api/places';
import type { PlaceDetail, PlaceListItem } from '../../../lib/api/types';
import { normalizePlaceCategory, PLACE_CATEGORIES } from '../../../lib/placeCategories';
import { colors } from '../common/colors';
import { getApiErrorMessage } from '../context/AuthContext';
import styles from "./SavedPlacesScreen.style";

const FILTERS = [{ value: 'All', label: 'All' }, ...PLACE_CATEGORIES];

function toPlaceDetail(place: PlaceListItem, isFavorite: boolean): PlaceDetail {
    const defaultReviewPictures = [
        place.image,
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
    ];

    return {
        id: place.id,
        name: place.name,
        region: place.region,
        averageRating: place.averageRating,
        ratingCount: place.ratingCount,
        featureLabel: place.featureLabel,
        coverImageUrl: place.coverImageUrl,
        images: place.images,
        Id: place.Id,
        Name: place.Name,
        Location: place.Located,
        latitude: place.latitude ?? null,
        longitude: place.longitude ?? null,
        Rate: place.Rate,
        NumberOfRate: place.NumberOfRate,
        Image: place.image,
        Features: place.Features,
        Category: place.Category,
        about: `${place.Name} is saved in your trip list. This destination is a good candidate for your itinerary with useful details, nearby experiences, and travel notes ready to review.`,
        priceLevel: null,
        Reviews: [
            {
                ava: 'https://randomuser.me/api/portraits/women/44.jpg',
                Name: 'Sarah Chen',
                Date: 'May 20, 2026',
                Content: 'Beautiful place to visit. The atmosphere was memorable and it fits nicely into a flexible travel plan.',
                Rate: Math.min(place.Rate, 5),
                Pictures: defaultReviewPictures,
            },
        ],
        isFavorite,
    };
}

export default function SavedPlaces({ navigation }: any) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [places, setPlaces] = useState<PlaceListItem[]>([]);
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [promotionPlaceIds, setPromotionPlaceIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

    const loadFavorites = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchFavorites();
            setPlaces(data);
            setSavedIds(new Set(data.map((place) => place.Id)));
            setPromotionPlaceIds(await fetchPromotionPlaceIds(data.map((place) => place.Id)));
        } catch (err) {
            Alert.alert('Loi', getApiErrorMessage(err));
            setPlaces([]);
            setSavedIds(new Set());
            setPromotionPlaceIds(new Set());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    const toggleFavorite = async (placeId: string) => {
        if (savingIds.has(placeId)) return;

        const wasSaved = savedIds.has(placeId);
        setSavingIds((current) => new Set(current).add(placeId));
        setSavedIds((current) => {
            const next = new Set(current);
            if (wasSaved) {
                next.delete(placeId);
            } else {
                next.add(placeId);
            }
            return next;
        });

        try {
            if (wasSaved) {
                await removeFavorite(placeId);
            } else {
                await addFavorite(placeId);
            }
        } catch (err) {
            setSavedIds((current) => {
                const next = new Set(current);
                if (wasSaved) {
                    next.add(placeId);
                } else {
                    next.delete(placeId);
                }
                return next;
            });
            Alert.alert('Loi', getApiErrorMessage(err));
        } finally {
            setSavingIds((current) => {
                const next = new Set(current);
                next.delete(placeId);
                return next;
            });
        }
    };

    const filteredPlaces = places.filter(place => {
        const matchCategory = activeFilter === 'All' ? true : normalizePlaceCategory(place.Category) === activeFilter;
        const searchText = searchQuery.toLowerCase();
        const matchSearch = place.Name.toLowerCase().includes(searchText) ||
            place.Located.toLowerCase().includes(searchText);
        return matchCategory && matchSearch;
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerTop}>
                    {/* <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#1e293b" />
                    </TouchableOpacity> */}
                    <Text style={styles.headerTitle}>Saved Places</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search in your saved list..."
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

            <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
                {loading && places.length === 0 ? (
                    <View style={styles.emptyStateContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : filteredPlaces.length > 0 ? (
                    filteredPlaces.map((place) => {
                        const isSaved = savedIds.has(place.Id);

                        return (
                            <TouchableOpacity
                                key={place.Id}
                                activeOpacity={0.86}
                                style={styles.card}
                                onPress={() =>
                                    navigation.navigate('Detail Location', {
                                        placeId: place.Id,
                                        placeData: toPlaceDetail(place, isSaved),
                                    })
                                }
                            >
                                <View style={styles.imageContainer}>
                                    <Image source={{ uri: place.image }} style={styles.cardImage} />
                                    {promotionPlaceIds.has(place.Id) && (
                                        <View style={styles.discountBadge}>
                                            <Ionicons name="pricetag" size={12} color="#ffffff" />
                                            <Text style={styles.discountText}>Deal</Text>
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        style={styles.heartButton}
                                        disabled={savingIds.has(place.Id)}
                                        onPress={() => toggleFavorite(place.Id)}
                                    >
                                        <Ionicons name="heart" size={20} color={isSaved ? "#ef4444" : "#ffffff"} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.cardBody}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle} numberOfLines={1}>{place.Name}</Text>
                                        <View style={styles.ratingBadge}>
                                            <Ionicons name="star" size={12} color="#f97316" />
                                            <Text style={styles.ratingText}>{place.Rate}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.locationRow}>
                                        <View style={styles.locationInfo}>
                                            <Ionicons name="location-outline" size={14} color="#6b7280" />
                                            <Text style={styles.locationText}>{place.Located}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', columnGap: 14, alignItems: 'center' }}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    navigation.navigate('Write Review', {
                                                        placeId: place.Id,
                                                        placeName: place.Name,
                                                    })
                                                }
                                            >
                                                <Text style={styles.detailText}>Review</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    navigation.navigate('Detail Location', {
                                                        placeId: place.Id,
                                                        placeData: toPlaceDetail(place, isSaved),
                                                    })
                                                }
                                            >
                                                <Text style={styles.detailText}>Detail</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <Ionicons name="search-outline" size={48} color="#cbd5e1" />
                        <Text style={styles.emptyStateText}>No places found.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
