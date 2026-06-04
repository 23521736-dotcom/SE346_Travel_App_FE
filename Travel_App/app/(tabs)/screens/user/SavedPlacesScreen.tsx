import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { addFavorite, fetchFavorites, removeFavorite } from '../../../../lib/api/favorites';
import { fetchPromotionPlaceIds } from '../../../../lib/api/places';
import type { PlaceDetail, PlaceListItem } from '../../../../lib/api/types';
import { normalizePlaceCategory, PLACE_CATEGORIES } from '../../../../lib/placeCategories';
import { colors } from '../../common/colors';
import { useTheme } from '../../context/ThemeContext';
import { getApiErrorMessage } from '../../context/AuthContext';
import styles from "./SavedPlacesScreen.style";
import { CachedImage } from '../../../../components/CachedImage';

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
    const { theme } = useTheme();
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [places, setPlaces] = useState<PlaceListItem[]>([]);
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [promotionPlaceIds, setPromotionPlaceIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
    const PAGE_SIZE = 20;

    const loadFavorites = useCallback(async (offset = 0) => {
        if (offset === 0) {
            setLoading(true);
        }
        try {
            const data = await fetchFavorites(PAGE_SIZE, offset);
            if (offset === 0) {
                setPlaces(data);
                setSavedIds(new Set(data.map((place) => place.Id)));
                setPromotionPlaceIds(await fetchPromotionPlaceIds(data.map((place) => place.Id)));
            } else {
                setPlaces(prev => [...prev, ...data]);
                const newIds = new Set(data.map((place) => place.Id));
                setSavedIds(prev => new Set([...prev, ...newIds]));
                const newPromotionIds = await fetchPromotionPlaceIds(data.map((place) => place.Id));
                setPromotionPlaceIds(prev => new Set([...prev, ...newPromotionIds]));
            }
            setHasMore(data.length === PAGE_SIZE);
        } catch (err) {
            Alert.alert('Loi', getApiErrorMessage(err));
            if (offset === 0) {
                setPlaces([]);
                setSavedIds(new Set());
                setPromotionPlaceIds(new Set());
            }
            setHasMore(false);
        } finally {
            if (offset === 0) {
                setLoading(false);
            }
        }
    }, [PAGE_SIZE]);

    const onRefresh = useCallback(async () => {
        setHasMore(true);
        await loadFavorites(0);
    }, [loadFavorites]);

    const handleLoadMore = useCallback(() => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            loadFavorites(places.length).finally(() => setLoadingMore(false));
        }
    }, [loadingMore, hasMore, places.length, loadFavorites]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const data = await fetchFavorites();
            setPlaces(data);
            setSavedIds(new Set(data.map((place) => place.Id)));
            setPromotionPlaceIds(await fetchPromotionPlaceIds(data.map((place) => place.Id)));
        } catch (err) {
            Alert.alert('Loi', getApiErrorMessage(err));
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    const toggleFavorite = async (placeId: string) => {
        if (savingIds.has(placeId)) return;

        const wasSaved = savedIds.has(placeId);

        // Show confirmation when unfavoriting
        if (wasSaved) {
            Alert.alert(
                "Bỏ lưu",
                "Bạn có chắc muốn bỏ lưu địa điểm này?",
                [
                    { text: "Hủy", style: "cancel" },
                    {
                        text: "Bỏ lưu",
                        style: "destructive",
                        onPress: async () => {
                            setSavingIds((current) => new Set(current).add(placeId));
                            setSavedIds((current) => {
                                const next = new Set(current);
                                next.delete(placeId);
                                return next;
                            });

                            try {
                                await removeFavorite(placeId);
                            } catch (err) {
                                setSavedIds((current) => {
                                    const next = new Set(current);
                                    next.add(placeId);
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
                        }
                    }
                ]
            );
            return;
        }

        setSavingIds((current) => new Set(current).add(placeId));
        setSavedIds((current) => {
            const next = new Set(current);
            next.add(placeId);
            return next;
        });

        try {
            await addFavorite(placeId);
        } catch (err) {
            setSavedIds((current) => {
                const next = new Set(current);
                next.delete(placeId);
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

    const renderPlaceCard = useCallback(({ item }: { item: PlaceListItem }) => {
        const isSaved = savedIds.has(item.Id);
        return (
            <TouchableOpacity
                key={item.Id}
                activeOpacity={0.86}
                style={[styles.card, { backgroundColor: theme.card }]}
                onPress={() =>
                    navigation.navigate('Detail Location', {
                        placeId: item.Id,
                        placeData: toPlaceDetail(item, isSaved),
                    })
                }
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.cardImage} />
                    {promotionPlaceIds.has(item.Id) && (
                        <View style={styles.discountBadge}>
                            <Ionicons name="pricetag" size={12} color="#ffffff" />
                            <Text style={styles.discountText}>Deal</Text>
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.heartButton}
                        disabled={savingIds.has(item.Id)}
                        onPress={() => toggleFavorite(item.Id)}
                    >
                        <Ionicons name="heart" size={20} color={isSaved ? "#ef4444" : "#ffffff"} />
                    </TouchableOpacity>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>{item.Name}</Text>
                        <View style={styles.ratingBadge}>
                            <Ionicons name="star" size={12} color="#f97316" />
                            <Text style={[styles.ratingText, { color: theme.text }]}>{item.Rate}</Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <View style={styles.locationInfo}>
                            <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
                            <Text style={[styles.locationText, { color: theme.textSecondary }]}>{item.Located}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', columnGap: 14, alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('Write Review', {
                                        placeId: item.Id,
                                        placeName: item.Name,
                                    })
                                }
                            >
                                <Text style={[styles.detailText, { color: theme.primary }]}>Review</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('Detail Location', {
                                        placeId: item.Id,
                                        placeData: toPlaceDetail(item, isSaved),
                                    })
                                }
                            >
                                <Text style={[styles.detailText, { color: theme.primary }]}>Detail</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }, [savedIds, promotionPlaceIds, savingIds, navigation, theme]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.headerContainer}>
                <View style={styles.headerTop}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Saved Places</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={theme.textMuted} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { backgroundColor: theme.surface, borderColor: theme.borderLight, color: theme.text }]}
                        placeholder="Search in your saved list..."
                        placeholderTextColor={theme.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity style={styles.clearIcon} onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={theme.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
                    {FILTERS.map((filter) => (
                        <TouchableOpacity
                            key={filter.value}
                            onPress={() => setActiveFilter(filter.value)}
                            style={[styles.filterChip, { backgroundColor: theme.surface, borderColor: theme.border }, activeFilter === filter.value && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                        >
                            <Text style={[styles.filterText, { color: activeFilter === filter.value ? theme.textOnPrimary : theme.text }]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                style={[styles.listContainer, { backgroundColor: theme.background }]}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {loading && places.length === 0 ? (
                    <View style={styles.emptyStateContainer}>
                        <ActivityIndicator size="large" color={theme.primary} />
                    </View>
                ) : filteredPlaces.length > 0 ? (
                    filteredPlaces.map((place) => {
                        const isSaved = savedIds.has(place.Id);

                        return (
                            <TouchableOpacity
                                key={place.Id}
                                activeOpacity={0.86}
                                style={[styles.card, { backgroundColor: theme.card }]}
                                onPress={() =>
                                    navigation.navigate('Detail Location', {
                                        placeId: place.Id,
                                        placeData: toPlaceDetail(place, isSaved),
                                    })
                                }
                            >
                                <View style={styles.imageContainer}>
                                    <CachedImage uri={place.image} style={styles.cardImage} />
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
                                        <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>{place.Name}</Text>
                                        <View style={styles.ratingBadge}>
                                            <Ionicons name="star" size={12} color="#f97316" />
                                            <Text style={[styles.ratingText, { color: theme.text }]}>{place.Rate}</Text>
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
                        <Ionicons name="search-outline" size={48} color={theme.textMuted} />
                        <Text style={[styles.emptyStateText, { color: theme.text }]}>No places found.</Text>
                    </View>
                )}
            </ScrollView>
            <FlatList
                style={[styles.listContainer, { backgroundColor: theme.background }]}
                contentContainerStyle={styles.listContent}
                data={filteredPlaces}
                keyExtractor={(item) => item.Id}
                renderItem={renderPlaceCard}
                refreshControl={<RefreshControl refreshing={loading && places.length === 0} onRefresh={onRefresh} />}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore ? (
                    <ActivityIndicator size="small" color={theme.primary} style={{ margin: 16 }} />
                ) : null}
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.emptyStateContainer}>
                            <ActivityIndicator size="large" color={theme.primary} />
                        </View>
                    ) : (
                        <View style={styles.emptyStateContainer}>
                            <Ionicons name="search-outline" size={48} color={theme.textMuted} />
                            <Text style={[styles.emptyStateText, { color: theme.text }]}>No places found.</Text>
                        </View>
                    )
                }
            />
        </SafeAreaView>
    );
}
