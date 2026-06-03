import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { addFavorite, removeFavorite } from '../../../../lib/api/favorites';
import { fetchPlaceDetail, fetchPlacePromotions } from '../../../../lib/api/places';
import type { PlaceDetail } from '../../../../lib/api/types';
import { getScheduleString } from '../../../../lib/service/PromotionShedule';
import type { PromotionItem } from '../../../../lib/types/promotion';
import { colors } from '../../common/colors';
import { RatingStartBar } from '../../components/Rating';
import { PicturesContainer } from '../../components/ReviewPicture';
import styles from './DetailLocationScreen.styles';

const dayLabelMap: Record<string, string> = {
    M: 'Mon',
    T: 'Tue',
    W: 'Wed',
    Th: 'Thu',
    F: 'Fri',
    Sa: 'Sat',
    S: 'Sun',
};

function getPromotionSchedule(promotion: PromotionItem) {
    const schedule = promotion.schedule as Partial<PromotionItem['schedule']> | undefined;
    if (!schedule || !Array.isArray(schedule.days)) {
        return {
            range: 'Schedule is not available yet.',
            days: 'Schedule is not available yet.',
            time: 'Schedule is not available yet.',
            summary: 'Promotion schedule is not available yet.',
        };
    }

    const fullSchedule = {
        startDate: schedule.startDate || '',
        endDate: schedule.endDate || '',
        days: schedule.days,
        startTime: schedule.startTime || '',
        endTime: schedule.endTime || '',
        specificTime: Boolean(schedule.specificTime),
    };

    return {
        range: fullSchedule.startDate && fullSchedule.endDate
            ? `${fullSchedule.startDate} - ${fullSchedule.endDate}`
            : 'No date range',
        days: fullSchedule.days.length > 0
            ? fullSchedule.days.map((day) => dayLabelMap[day] || day).join(', ')
            : 'Every day',
        time: fullSchedule.specificTime
            ? `${fullSchedule.startTime || 'Start time'} - ${fullSchedule.endTime || 'End time'}`
            : 'All day',
        summary: getScheduleString(fullSchedule),
    };
}

function getDestinationLocation(place: PlaceDetail | null) {
    if (!place) {
        return null;
    }

    const anyPlace = place as any;
    const latitude =
        place.latitude ??
        anyPlace.point?.lat ??
        anyPlace.point?.latitude ??
        anyPlace.geometry?.coordinates?.[1] ??
        anyPlace.coords?.[1];
    const longitude =
        place.longitude ??
        anyPlace.point?.lon ??
        anyPlace.point?.lng ??
        anyPlace.point?.longitude ??
        anyPlace.geometry?.coordinates?.[0] ??
        anyPlace.coords?.[0];

    if (latitude == null || longitude == null) {
        return null;
    }

    return {
        latitude,
        longitude,
        name: place.Name || place.name,
        address: place.Location,
    };
}

function getGoogleMapsUrl(place: PlaceDetail | null, destinationLocation: ReturnType<typeof getDestinationLocation>) {
    if (!place) {
        return null;
    }

    const query = [place.Name, place.name, place.Location, destinationLocation?.name, destinationLocation?.address]
        .map((item) => String(item || '').trim())
        .filter(Boolean)
        .filter((item, index, items) => items.indexOf(item) === index)
        .join(', ');

    if (!query) {
        if (destinationLocation) {
            return `https://www.google.com/maps/search/?api=1&query=${destinationLocation.latitude},${destinationLocation.longitude}`;
        }
        return null;
    }

    const encodedQuery = encodeURIComponent(query);
    return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
}

export default function DetailLocationScreen({ navigation, route }: any) {
    const placeId = route.params?.placeId as string | undefined;
    const fallbackPlace = route.params?.placeData as PlaceDetail | undefined;
    const [place, setPlace] = useState<PlaceDetail | null>(fallbackPlace || null);
    const [promotions, setPromotions] = useState<PromotionItem[]>([]);
    const [loading, setLoading] = useState(Boolean(placeId));
    const [isLiked, setIsLiked] = useState(Boolean(fallbackPlace?.isFavorite));
    const [imageIndex, setImageIndex] = useState(0);

    const loadPlace = useCallback(async () => {
        if (!placeId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const [data, promotionData] = await Promise.all([
                fetchPlaceDetail(placeId),
                fetchPlacePromotions(placeId).catch(() => []),
            ]);
            setPlace(data);
            setPromotions(promotionData);
            setIsLiked(Boolean(data.isFavorite));
        } catch {
            setPlace(fallbackPlace || null);
            setPromotions([]);
            setIsLiked(Boolean(fallbackPlace?.isFavorite));
        } finally {
            setLoading(false);
        }
    }, [fallbackPlace, placeId]);

    useEffect(() => {
        loadPlace();
    }, [loadPlace]);

    const destinationLocation = getDestinationLocation(place);
    const googleMapsUrl = getGoogleMapsUrl(place, destinationLocation);

    useEffect(() => {
        setImageIndex(0);
    }, [place?.Id]);

    const toggleFavorite = async () => {
        if (!placeId) return;
        try {
            if (isLiked) {
                await removeFavorite(placeId);
                setIsLiked(false);
            } else {
                await addFavorite(placeId);
                setIsLiked(true);
            }
        } catch {
            // ignore
        }
    };

    // const openWriteReview = () => {
    //     navigation.navigate('Write Review', {
    //         placeId: place?.Id ?? placeId,
    //         placeName: place?.Name,
    //     });
    // };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!place) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Khong tim thay dia diem</Text>
                <Pressable onPress={() => navigation.goBack()}>
                    <Text style={{ color: colors.primary, marginTop: 10 }}>Quay lai</Text>
                </Pressable>
            </View>
        );
    }

    const firstReview = place.Reviews[0];
    const apiImages = Array.isArray((place as any).Images) ? (place as any).Images.filter(Boolean) : [];
    const normalizedImages = Array.isArray(place.images) ? place.images.filter(Boolean) : [];
    const placeImages = apiImages.length > 0
        ? apiImages
        : normalizedImages.length > 0
            ? normalizedImages
            : [(place as any).image || place.Image].filter(Boolean);
    const currentImage = placeImages[imageIndex] || placeImages[0];
    const hasMultipleImages = placeImages.length > 1;
    const showPreviousImage = () => {
        if (!hasMultipleImages) return;
        setImageIndex(prev => (prev === 0 ? placeImages.length - 1 : prev - 1));
    };
    const showNextImage = () => {
        if (!hasMultipleImages) return;
        setImageIndex(prev => (prev + 1) % placeImages.length);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#FFFFFF', marginVertical: 40 }}>
            <ScrollView style={[styles.container, { margin: 0 }]}>
                <View style={{ margin: 0, position: 'relative' }}>
                    <View style={[styles.imageFrame, { height: 350, borderRadius: 0, borderWidth: 0 }]}>
                        {currentImage ? (
                            <Image
                                source={{ uri: currentImage }}
                                style={{ width: "100%", height: "100%" }} />
                        ) : (
                            <View style={{ width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E7EB' }}>
                                <Ionicons name="image-outline" size={42} color="#9CA3AF" />
                            </View>
                        )}
                    </View>
                    {hasMultipleImages && (
                        <>
                            <Pressable
                                style={{
                                    position: 'absolute',
                                    left: 15,
                                    top: 155,
                                    zIndex: 1,
                                    backgroundColor: 'rgba(0,0,0,0.35)',
                                    borderRadius: 22,
                                    width: 44,
                                    height: 44,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onPress={showPreviousImage}>
                                <Ionicons name="chevron-back" size={26} color="white" />
                            </Pressable>
                            <Pressable
                                style={{
                                    position: 'absolute',
                                    right: 15,
                                    top: 155,
                                    zIndex: 1,
                                    backgroundColor: 'rgba(0,0,0,0.35)',
                                    borderRadius: 22,
                                    width: 44,
                                    height: 44,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onPress={showNextImage}>
                                <Ionicons name="chevron-forward" size={26} color="white" />
                            </Pressable>
                        </>
                    )}
                    <Pressable style={styles.roundButton}
                        onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={25}
                            color="white" />
                    </Pressable>
                    <Pressable style={[styles.roundButton, {
                        position: 'absolute',
                        right: 15,
                        top: 15,
                        zIndex: 1,
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: 20,
                        padding: 5
                    }]}
                        onPress={toggleFavorite}>
                        <Ionicons name="heart"
                            size={24}
                            color={isLiked ? "red" : "white"} />
                    </Pressable>
                </View>

                {/* <View style={{ flexDirection: 'row', columnGap: 10, marginHorizontal: 15, marginTop: 12 }}>
                    <Pressable
                        onPress={openWriteReview}
                        style={({ pressed }) => [
                            {
                                flex: 1,
                                backgroundColor: '#00B4D8',
                                paddingVertical: 12,
                                borderRadius: 12,
                                alignItems: 'center',
                                opacity: pressed ? 0.85 : 1,
                            },
                        ]}
                    >
                        <Text style={{ color: '#fff', fontWeight: '700' }}>Write Review</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => navigation.navigate("All Reviews", {
                            placeId: place?.Id ?? placeId,
                            placeName: place?.Name,
                        })}
                        style={({ pressed }) => [
                            {
                                flex: 1,
                                backgroundColor: '#E0F2FE',
                                paddingVertical: 12,
                                borderRadius: 12,
                                alignItems: 'center',
                                opacity: pressed ? 0.85 : 1,
                            },
                        ]}
                    >
                        <Text style={{ color: '#00B4D8', fontWeight: '700' }}>See Reviews</Text>
                    </Pressable>
                </View> */}

                <View style={{ borderRadius: 20, backgroundColor: '#FFFFFF', marginTop: -20 }}>
                    <View style={{ flexDirection: 'column', margin: 15 }}>
                        <Text style={{ fontSize: 25, fontWeight: '700', marginTop: 10 }}>
                            {place.Name}
                        </Text>
                        <View style={{ flexDirection: 'row', columnGap: 7 }}>
                            <Ionicons name="location-sharp" size={18} color="#00B4D8" />
                            <Text style={{ color: '#353232da', fontWeight: '600' }}>
                                {place.Location}
                            </Text>
                        </View>

                        {googleMapsUrl && (
                            <Pressable
                                onPress={() => {
                                    Linking.openURL(googleMapsUrl).catch((error) => {
                                        console.error('Failed to open Google Maps', error);
                                    });
                                }}
                                style={({ pressed }) => ({
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: pressed ? '#0A9AC0' : '#00B4D8',
                                    paddingVertical: 14,
                                    borderRadius: 12,
                                    gap: 8,
                                    marginTop: 12,
                                })}
                            >
                                <Ionicons name="navigate" size={20} color="white" />
                                <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
                                    Mở Google Maps
                                </Text>
                            </Pressable>
                        )}

                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ borderRadius: 15 }}>
                            <View style={[styles.detailCard, { marginLeft: 3 }]}>
                                <View style={{ borderRadius: 20, backgroundColor: "#FEF9C3", margin: 15, padding: 10 }}>
                                    <Ionicons name="star" size={18} color="#EAB308" />
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', marginRight: 15 }}>
                                    <View style={{ flexDirection: 'row', columnGap: 5, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: '700', fontSize: 18 }}>
                                            {place.Rate}
                                        </Text>
                                        <Text style={{ fontWeight: '400', color: '#6B7280' }}>
                                            ({place.NumberOfRate})
                                        </Text>
                                    </View>
                                    <Text style={{ fontWeight: '600', color: '#6B7280' }}>
                                        RATINGS
                                    </Text>
                                </View>
                            </View>

                            {place.priceLevel != null && (
                                <View style={styles.detailCard}>
                                    <View style={{ borderRadius: 20, backgroundColor: "#DCFCE7", margin: 15, padding: 10 }}>
                                        <Ionicons name="logo-usd" size={18} color="#22C55E" />
                                    </View>
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', marginRight: 15 }}>
                                        <Text style={{ fontWeight: '700', fontSize: 18 }}>
                                            {place.priceLevel}
                                        </Text>
                                        <Text style={{ fontWeight: '600', color: '#6B7280' }}>
                                            PRICE LEVEL
                                        </Text>
                                    </View>
                                </View>
                            )}

                            <View style={styles.detailCard}>
                                <View style={{ borderRadius: 20, backgroundColor: "#E0F2FE", margin: 15, padding: 10 }}>
                                    <Ionicons name="people" size={18} color="#0EA5E9" />
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', marginRight: 15 }}>
                                    <Text style={{ fontWeight: '700', fontSize: 18 }}>
                                        {place.Features}
                                    </Text>
                                    <Text style={{ fontWeight: '600', color: '#6B7280' }}>
                                        FEATURE
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>

                        {promotions.length > 0 && (
                            <View style={styles.promotionsSection}>
                                <Text style={styles.sectionTitle}>
                                    Promotions
                                </Text>
                                {promotions.map((promotion) => (
                                    <View key={promotion.id} style={styles.promotionCard}>
                                        {(() => {
                                            const schedule = getPromotionSchedule(promotion);

                                            return (
                                                <>
                                                    <View style={styles.promotionHeader}>
                                                        <View style={styles.promotionIcon}>
                                                            <Ionicons name="pricetag" size={18} color="#00B4D8" />
                                                        </View>
                                                        <View style={styles.promotionContent}>
                                                            <Text style={styles.promotionTitle}>
                                                                {promotion.title}
                                                            </Text>
                                                            <View style={styles.promotionBadge}>
                                                                <Text style={styles.promotionBadgeText}>
                                                                    {promotion.isActive ? 'Active' : 'Inactive'}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View style={styles.promotionInfoList}>
                                                        <View style={styles.promotionInfoRow}>
                                                            <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
                                                            <Text style={styles.promotionInfoText}>{schedule.range}</Text>
                                                        </View>
                                                        <View style={styles.promotionInfoRow}>
                                                            <Ionicons name="repeat-outline" size={16} color={colors.textMuted} />
                                                            <Text style={styles.promotionInfoText}>{schedule.days}</Text>
                                                        </View>
                                                        <View style={styles.promotionInfoRow}>
                                                            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
                                                            <Text style={styles.promotionInfoText}>{schedule.time}</Text>
                                                        </View>
                                                        <Text style={styles.promotionSchedule}>
                                                            {schedule.summary}
                                                        </Text>
                                                    </View>
                                                </>
                                            );
                                        })()}
                                    </View>
                                ))}
                            </View>
                        )}

                        <Text style={{ fontSize: 25, fontWeight: '700', marginTop: 10 }}>
                            About
                        </Text>
                        <Text style={{ marginTop: 10, color: '#353232da', fontWeight: '600', textAlign: 'justify' }}>
                            {place.about || 'No description available.'}
                        </Text>
                    </View>

                    {firstReview && (
                        <View style={{ flexDirection: 'column', margin: 15 }}>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ fontSize: 25, fontWeight: '700', flex: 1 }}>
                                    Reviews
                                </Text>

                                <Text style={{ color: '#00B4D8', fontWeight: '600' }}
                                    onPress={() => navigation.navigate("All Reviews", {
                                      placeId: place.Id,
                                      placeName: place.Name,
                                    })}>
                                    See All
                                </Text>
                            </View>

                            <PicturesContainer pictures={firstReview.Pictures} />

                            <View style={[styles.detailCard, { flexDirection: 'column', margin: 0, marginTop: 30, padding: 10, rowGap: 10 }]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[styles.imageFrame, { width: 60, height: 60, borderRadius: 30, borderWidth: 0 }]}>
                                        <Image
                                            source={{ uri: firstReview.ava }}
                                            style={{ width: "100%", height: "100%" }}
                                            resizeMode="cover" />
                                    </View>
                                    <View style={{ flexDirection: 'column', marginHorizontal: 10, justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 20, fontWeight: '700' }}>
                                            {firstReview.Name}
                                        </Text>
                                        <Text style={{ color: '#353232da', fontWeight: '600' }}>
                                            {firstReview.Date}
                                        </Text>
                                    </View>
                                </View>
                                <RatingStartBar ratingValue={firstReview.Rate} size={20} />
                                <Text style={{ marginLeft: 5 }}>
                                    {firstReview.Content}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
