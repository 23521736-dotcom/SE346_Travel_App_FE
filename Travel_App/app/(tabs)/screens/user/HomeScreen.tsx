import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from "../../common/colors";
import styles from './HomeScreen.styles';
import { fetchPlaces, fetchPromotionPlaceIds } from '../../../../lib/api/places';
import { planTrip } from '../../../../lib/api/ai';
import type { PlaceListItem } from '../../../../lib/api/types';
import { getApiErrorMessage } from '../../context/AuthContext';
import { getPlaceCategoryLabel, normalizePlaceCategory, PLACE_CATEGORIES } from '../../../../lib/placeCategories';
import { fetchRecommendations } from '../../../../lib/api/recommendations';
import type { RecommendationPlace } from '../../../../lib/api/recommendations';
import { CachedImage } from '../../../../components/CachedImage';

type Place = PlaceListItem;

const FILTERS = [{ value: 'All', label: 'All' }, ...PLACE_CATEGORIES];

const DealBadge = () => (
    <View style={styles.dealBadge}>
        <Ionicons name="pricetag" size={12} color="#FFFFFF" />
        <Text style={styles.dealBadgeText}>Deal</Text>
    </View>
);

function CustomInput({
    label,
    iconName,
    placeholder,
    value,
    onChangeText,
    keyboardType,
}: {
    label: string;
    iconName: React.ComponentProps<typeof Feather>['name'];
    placeholder: string;
    value: string;
    onChangeText: (value: string) => void;
    keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType'];
}) {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                <Feather name={iconName} size={18} color="#718096" style={styles.icon} />
                <TextInput
                    style={styles.textInput}
                    placeholder={placeholder}
                    placeholderTextColor="#A0AEC0"
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                />
            </View>
        </View>
    );
}

const renderPlaceCard = (item: Place, navigation: any, hasPromotion: boolean) => {
    //  const navigation = useNavigation<any>();
    return (
        <View style={styles.card}>
            <View style={styles.imageFrame}>
                <CachedImage
                    uri={item.image}
                    style={{ width: "100%", height: "100%" }} />
                {hasPromotion && <DealBadge />}
            </View>
            <View style={styles.contentContainer}>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text style={{ fontSize: 22, fontWeight: '600' }}>
                        {item.Name}
                    </Text>
                    <Text style={{ color: colors.textSecondary }}>
                        {item.Located}
                    </Text>
                </View>
                <View style={styles.ratingBadge}>
                    <Text>
                        ⭐
                    </Text>
                    <Text style={{ fontWeight: '700' }}>
                        {item.Rate}
                    </Text>
                    <Text style={{ fontWeight: '400', color: colors.textMuted }}>
                        ({item.NumberOfRate})
                    </Text>
                </View>
            </View>
            <View style={styles.TagContainer} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ borderWidth: 1, borderColor: '#BFF0DB', backgroundColor: '#e5f6ef', padding: 5, borderRadius: 10 }}>
                    <Text style={{ color: '#00875A', fontWeight: '600' }}>
                        {getPlaceCategoryLabel(item.category)}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', columnGap: 14, alignItems: 'center' }}>
                    <Pressable onPress={() => navigation.navigate("Write Review", { placeId: item.Id, placeName: item.Name })}>
                        <Text style={styles.placeActionText}>
                            Review
                        </Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Detail Location", { placeId: item.Id })}>
                        <Text style={styles.placeActionText}>
                            Detail
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};
export default function HomeScreen({ navigation }: any) {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState('All');
    const [places, setPlaces] = useState<Place[]>([]);
    const [promotionPlaceIds, setPromotionPlaceIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [destination, setDestination] = useState('');
    const [budget, setBudget] = useState('');
    const [duration, setDuration] = useState('');
    const [recommendations, setRecommendations] = useState<RecommendationPlace[]>([]);
    const PAGE_SIZE = 20;

    // Advanced filters
    const [minRating, setMinRating] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const loadPlaces = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchPlaces({
                category: activeCategory !== 'All' ? activeCategory : undefined,
                search: debouncedSearch || undefined,
                minRating,
                maxPrice,
            });
            setPlaces(data);
            setPromotionPlaceIds(await fetchPromotionPlaceIds(data.map((place) => place.Id)));
        } catch {
            setPlaces([]);
            setPromotionPlaceIds(new Set());
        } finally {
            setLoading(false);
        }
    }, [activeCategory, debouncedSearch, minRating, maxPrice]);
    const loadPlaces = useCallback(async (offset = 0) => {
        if (offset === 0) {
            setLoading(true);
        }
        try {
            const data = await fetchPlaces({
                category: activeCategory !== 'All' ? activeCategory : undefined,
                search: debouncedSearch || undefined,
                limit: PAGE_SIZE,
                offset,
            });
            if (offset === 0) {
                setPlaces(data);
                setPromotionPlaceIds(await fetchPromotionPlaceIds(data.map((place) => place.Id)));
                setHasMore(data.length === PAGE_SIZE);
            } else {
                setPlaces(prev => [...prev, ...data]);
                const newPromotionIds = await fetchPromotionPlaceIds(data.map((place) => place.Id));
                setPromotionPlaceIds(prev => new Set([...prev, ...newPromotionIds]));
                setHasMore(data.length === PAGE_SIZE);
            }
        } catch {
            if (offset === 0) {
                setPlaces([]);
                setPromotionPlaceIds(new Set());
            }
            setHasMore(false);
        } finally {
            if (offset === 0) {
                setLoading(false);
            }
        }
    }, [activeCategory, debouncedSearch, PAGE_SIZE]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setHasMore(true);
        await loadPlaces(0);
        setRefreshing(false);
    }, [loadPlaces]);

    const handleLoadMore = useCallback(() => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            loadPlaces(places.length).finally(() => setLoadingMore(false));
        }
    }, [loadingMore, hasMore, places.length, loadPlaces]);

    const renderPlaceItem = useCallback(({ item }: { item: Place }) => (
        renderPlaceCard(item, navigation, promotionPlaceIds.has(item.Id))
    ), [navigation, promotionPlaceIds]);

    useEffect(() => {
        loadPlaces();
    }, [loadPlaces]);

    // Load personalized recommendations
    useEffect(() => {
        const loadRecs = async () => {
            try {
                const data = await fetchRecommendations(5);
                const topPicks = [...data.contentBased.slice(0, 2), ...data.tfidfSimilar.slice(0, 1), ...data.serendipity.slice(0, 2)];
                setRecommendations(topPicks);
            } catch {
                // silent fail — recommendations are optional
            }
        };
        loadRecs();
    }, []);


    const handlePlanWithAi = useCallback(async () => {
        const destinationText = destination.trim() || searchQuery.trim() || 'weekend trip';
        const q = [
            destinationText,
            budget.trim() ? `budget ${budget.trim()}` : '',
            duration.trim() ? `${duration.trim()} days` : '',
        ].filter(Boolean).join(', ');
        setAiLoading(true);
        try {
            const plan = await planTrip(q, 'Near me');
            const body = plan.suggestions
                .map((s, i) => `${i + 1}. ${s.title}\n${s.description}`)
                .join('\n\n');
            Alert.alert(t('home.tripSuggestion'), `${body}\n\n${plan.note}`);
            alert(t('home.aiTripAlert'));
            setModalVisible(false);
        } catch (err) {
            Alert.alert(t('home.error'), getApiErrorMessage(err));
        } finally {
            setAiLoading(false);
        }
    }, [budget, destination, duration, searchQuery]);

    const listHeader = useMemo(() => (
            <View style={styles.container}>
                <View style={{ flexDirection: 'column', marginBottom: -15}}>
                    <Text style={{ color: colors.textSecondary }}> {t('home.location')}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="location-sharp" size={18} color={colors.primary} />
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}> {t('home.nearMe')}</Text>
                        <Pressable
                            onPress={() => alert('pressed down')}>
                            <Ionicons
                                name="chevron-down"
                                size={20}
                                color={colors.primary}
                                style={{ marginLeft: 2 }}
                            />
                        </Pressable>
                    </View>
                    <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
                        <TextInput
                            placeholder={t('home.searchPlaceholder')}
                        placeholderTextColor="#9ca3af"
                        style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity style={styles.clearIcon} onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    )}
                    </View>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                style={styles.filtersScroll}
                contentContainerStyle={styles.filtersContent}
                >
                    {FILTERS.map((item) => (
                        <Pressable
                            key={item.value}
                            style={[
                                styles.filterChip,
                                activeCategory === item.value && styles.filterChipActive,
                            ]}
                            onPress={() => setActiveCategory(item.value)}>
                            <View style={styles.containerCategoryButton}>
                                <Text style={styles.filterText}>
                                    {item.label}
                                </Text>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Rating and Price Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersScroll}
                    contentContainerStyle={styles.filtersContent}
                >
                    <Pressable
                        style={[styles.filterChip, minRating === undefined && styles.filterChipActive]}
                        onPress={() => setMinRating(undefined)}>
                        <View style={styles.containerCategoryButton}>
                            <Text style={styles.filterText}>{t('home.allRatings')}</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        style={[styles.filterChip, minRating === 4 && styles.filterChipActive]}
                        onPress={() => setMinRating(minRating === 4 ? undefined : 4)}>
                        <View style={styles.containerCategoryButton}>
                            <Text style={styles.filterText}>4+ ⭐</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        style={[styles.filterChip, minRating === 3 && styles.filterChipActive]}
                        onPress={() => setMinRating(minRating === 3 ? undefined : 3)}>
                        <View style={styles.containerCategoryButton}>
                            <Text style={styles.filterText}>3+ ⭐</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        style={[styles.filterChip, maxPrice === 1 && styles.filterChipActive]}
                        onPress={() => setMaxPrice(maxPrice === 1 ? undefined : 1)}>
                        <View style={styles.containerCategoryButton}>
                            <Text style={styles.filterText}>{t('home.budget')}</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        style={[styles.filterChip, maxPrice === 2 && styles.filterChipActive]}
                        onPress={() => setMaxPrice(maxPrice === 2 ? undefined : 2)}>
                        <View style={styles.containerCategoryButton}>
                            <Text style={styles.filterText}>{t('home.moderate')}</Text>
                        </View>
                    </Pressable>
                </ScrollView>

                <View
                    style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                    <Pressable
                        style={{ flex: 1, borderRadius: 8, borderWidth: 2, borderColor: colors.primary, padding: 10 }}
                    onPress={() => setModalVisible(true)}
                        disabled={aiLoading}>
                        <View style={[styles.containerCategoryButton, { height: 40 }]}>
                            <Image source={require('../../../../assets/images/AIPlan-icon.png')}
                                style={{ width: 25, height: 25, marginRight: 2 }}>
                            </Image>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <Text style={[styles.categoryButtonText, { flex: 1, fontSize: 15 }]}>
                                    {aiLoading ? t('home.planning') : t('home.planWithAI')}
                                </Text>
                                <Text style={[styles.linkText, { fontSize: 12, color: 'gray' }]}>
                                    {t('home.getPersonalizedIdeas')}
                                </Text>
                            </View>
                            <Image source={require('../../../../assets/images/right-arrow-icon.png')}
                                style={{ width: 25, height: 25, marginRight: 2, tintColor: colors.primary }}>
                            </Image>
                        </View>
                    </Pressable>
                </View>
                {/* Personalized Recommendations Section */}
                {recommendations.length > 0 && (
                    <View style={{ marginTop: 8, marginBottom: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 8 }}>
                            <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                {t('home.popularThisWeek')}
                            </Text>
                            <Pressable onPress={() => navigation.navigate('Recommendations')}>
                                <Text style={{ color: colors.primary, fontWeight: '500', fontSize: 13 }}>{t('common.seeAll')}</Text>
                            </Pressable>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
                            {recommendations.map((rec) => (
                                <Pressable
                                    key={rec.placeId}
                                    style={{ width: 160, marginRight: 12, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 }}
                                    onPress={() => navigation.navigate('Detail Location', { placeId: rec.placeId })}
                                >
                                    <CachedImage uri={rec.coverImageUrl} style={{ width: '100%', height: 100 }} />
                                    <View style={{ position: 'absolute', top: 6, right: 6, backgroundColor: colors.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 }}>
                                        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{rec.matchPercentage}%</Text>
                                    </View>
                                    <View style={{ padding: 8 }}>
                                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textPrimary }} numberOfLines={1}>{rec.name}</Text>
                                        <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }} numberOfLines={1}>{rec.explanation}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                            <Ionicons name="star" size={12} color="#FFB800" />
                                            <Text style={{ fontSize: 11, marginLeft: 2, color: colors.textSecondary }}>{rec.averageRating.toFixed(1)}</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <Text style={{ flex: 1, fontWeight: '500', fontSize: 23 }}>
                        {t('home.popularThisWeek')}
                    </Text>
                </View>
            </View>
    ), [activeCategory, aiLoading, searchQuery, recommendations]);

    if (loading && places.length === 0) {
        return (
            <View style={[styles.background, { justifyContent: 'center', alignItems: 'center', marginTop: 35 }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.background, { justifyContent: 'center', marginTop: 35 }]}>
            <View style={styles.container}>
                <FlatList
                    data={places}
                    renderItem={renderPlaceItem}
                    keyExtractor={(item) => item.Id}
                    ListHeaderComponent={listHeader}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loadingMore ? (
                        <ActivityIndicator size="small" color={colors.primary} style={{ margin: 16 }} />
                    ) : null}
                    ListEmptyComponent={
                        !loading ? (
                            <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textSecondary }}>
                                {t('home.noPlaces')}
                            </Text>
                        ) : null
                    }
                />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={styles.overlay}
                    onPress={() => setModalVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.bottomSheetContainer}
                        >
                            <View style={styles.bottomSheet}>
                                <View style={styles.modalHeader}>
                                    <View style={styles.headerTitleRow}>
                                        <Feather name="map-pin" size={20} color="#0EB4D3" />
                                        <Text style={styles.modalTitle}>{t('home.addNewDestination')}</Text>
                                    </View>
                                    <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                        <Feather name="x" size={24} color="#4A5568" />
                                    </Pressable>
                                </View>

                                <View style={styles.formContainer}>
                                    <CustomInput
                                        label={t('home.destination')}
                                        iconName="search"
                                        placeholder={t('home.destinationPlaceholder')}
                                        value={destination}
                                        onChangeText={setDestination}
                                    />
                                    <CustomInput
                                        label={t('home.estimatedBudget')}
                                        iconName="dollar-sign"
                                        placeholder={t('home.budgetPlaceholder')}
                                        keyboardType="numeric"
                                        value={budget}
                                        onChangeText={setBudget}
                                    />
                                    <CustomInput
                                        label={t('home.durationDays')}
                                        iconName="clock"
                                        placeholder={t('home.daysPlaceholder')}
                                        keyboardType="numeric"
                                        value={duration}
                                        onChangeText={setDuration}
                                    />
                                </View>

                                <View style={styles.actionContainer}>
                                    <Pressable
                                        style={styles.cancelButton}
                                        onPress={() => {
                                            setDestination('');
                                            setBudget('');
                                            setDuration('');
                                        }}
                                    >
                                        <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                                    </Pressable>

                                    <Pressable style={styles.primaryButton} onPress={handlePlanWithAi} disabled={aiLoading}>
                                        <Text style={styles.primaryButtonText}>
                                            {aiLoading ? t('home.planning') : `✨ ${t('home.planWithAI')}`}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </Pressable>
            </Modal>
        </View >
    )
}



