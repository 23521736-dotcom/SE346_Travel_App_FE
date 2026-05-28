import styles from './DetailLocationScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { RatingStartBar } from '../components/Rating';
import { PicturesContainer } from '../components/ReviewPicture';
import { fetchPlaceDetail } from '../../../lib/api/places';
import { addFavorite, removeFavorite } from '../../../lib/api/favorites';
import type { PlaceDetail } from '../../../lib/api/types';
import { colors } from '../common/colors';

export default function DetailLocationScreen({ navigation, route }: any) {
    const placeId = route.params?.placeId as string | undefined;
    const fallbackPlace = route.params?.placeData as PlaceDetail | undefined;
    const [place, setPlace] = useState<PlaceDetail | null>(fallbackPlace || null);
    const [loading, setLoading] = useState(Boolean(placeId));
    const [isLiked, setIsLiked] = useState(Boolean(fallbackPlace?.isFavorite));

    const loadPlace = useCallback(async () => {
        if (!placeId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await fetchPlaceDetail(placeId);
            setPlace(data);
            setIsLiked(Boolean(data.isFavorite));
        } catch {
            setPlace(fallbackPlace || null);
            setIsLiked(Boolean(fallbackPlace?.isFavorite));
        } finally {
            setLoading(false);
        }
    }, [fallbackPlace, placeId]);

    useEffect(() => {
        loadPlace();
    }, [loadPlace]);

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

    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#FFFFFF', marginVertical: 40 }}>
            <ScrollView style={[styles.container, { margin: 0 }]}>
                <View style={{ margin: 0, position: 'relative' }}>
                    <View style={[styles.imageFrame, { height: 350, borderRadius: 0, borderWidth: 0 }]}>
                        <Image
                            source={{ uri: place.Image }}
                            style={{ width: "100%", height: "100%" }} />
                    </View>
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
