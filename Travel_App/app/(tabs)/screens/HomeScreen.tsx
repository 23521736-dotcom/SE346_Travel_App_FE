import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { colors } from "../common/colors";
import styles from './HomeScreen.styles';
import { fetchPlaces } from '../../../lib/api/places';
import { planTrip } from '../../../lib/api/ai';
import type { PlaceListItem } from '../../../lib/api/types';
import { getApiErrorMessage } from '../context/AuthContext';
import { getPlaceCategoryLabel, normalizePlaceCategory, PLACE_CATEGORIES } from '../../../lib/placeCategories';

type Place = PlaceListItem;

const FILTERS = [{ value: 'All', label: 'All' }, ...PLACE_CATEGORIES];

const renderPlaceCard = (item: Place, navigation: any) => {
    //  const navigation = useNavigation<any>();
    return (
        <View style={styles.card}>
            <View style={styles.imageFrame}>
                <Image
                    source={{ uri: item.image }}
                    style={{ width: "100%", height: "100%" }} />
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

                <Pressable onPress={() => navigation.navigate("Detail Location", { placeId: item.Id })}>
                    <Text style={{ fontWeight: '600', color: colors.primary }}>
                        Details
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};
export default function HomeScreen({ navigation }: any) {
    const renderPlaceItem = ({ item }: { item: Place }) => renderPlaceCard(item, navigation);
    const [activeCategory, setActiveCategory] = useState('All');
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    const loadPlaces = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchPlaces();
            setPlaces(data);
        } catch {
            setPlaces([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPlaces();
    }, [loadPlaces]);

    const filteredPlaces = places.filter(place => {
        const matchCategory = activeCategory === 'All' ? true : normalizePlaceCategory(place.category) === activeCategory;
        const searchText = searchQuery.toLowerCase();
        const matchSearch = place.Name.toLowerCase().includes(searchText) ||
            place.Located.toLowerCase().includes(searchText);
        return matchCategory && matchSearch;
    });

    const handlePlanWithAi = useCallback(async () => {
        const q = searchQuery.trim() || 'weekend trip';
        setAiLoading(true);
        try {
            const plan = await planTrip(q, 'Near me');
            const body = plan.suggestions
                .map((s, i) => `${i + 1}. ${s.title}\n${s.description}`)
                .join('\n\n');
            Alert.alert('Goi y chuyen di', `${body}\n\n${plan.note}`);
        } catch (err) {
            Alert.alert('Loi', getApiErrorMessage(err));
        } finally {
            setAiLoading(false);
        }
    }, [searchQuery]);

    const listHeader = useMemo(() => (
            <View style={styles.container}>
                <View style={{ flexDirection: 'column', marginBottom: -15}}>
                    <Text style={{ color: colors.textSecondary }}> Location</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="location-sharp" size={18} color={colors.primary} />
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}> Near me</Text>
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
                        <TextInput
                            placeholder="Where to next ?"
                            style={{ flex: 1 }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <Ionicons name="search"
                            size={20}
                            color={colors.textSecondary} />
                    </View>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ columnGap: 10, marginHorizontal: 5, marginBottom : 5}}
                >
                    {FILTERS.map((item) => (
                        <Pressable
                            key={item.value}
                            style={[styles.button, { height: 50, width: 130, paddingHorizontal: 12 },
                            { backgroundColor: activeCategory === item.value ? colors.primary : colors.primaryLight }
                            ]}
                            onPress={() => setActiveCategory(item.value)}>
                            <View style={styles.containerCategoryButton}>
                                <Ionicons
                                    name={
                                        item.value === 'All' ? 'map-outline' :
                                        item.value === 'DINING' ? 'restaurant-outline' :
                                        item.value === 'FESTIVALS' ? 'calendar-outline' :
                                        item.value === 'STAYS' ? 'bed-outline' :
                                        item.value === 'SHOPPING' ? 'bag-outline' :
                                        'camera-outline'
                                    }
                                    size={22}
                                    color="black"
                                />
                                <Text style={[styles.categoryButtonText, { color: 'black', fontSize: 15 }]}>
                                    {item.label}
                                </Text>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
                <View
                    style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                    <Pressable
                        style={{ flex: 1, borderRadius: 8, borderWidth: 2, borderColor: colors.primary, padding: 10 }}
                        onPress={handlePlanWithAi}
                        disabled={aiLoading}>
                        <View style={[styles.containerCategoryButton, { height: 40 }]}>
                            <Image source={require('../../../assets/images/AIPlan-icon.png')}
                                style={{ width: 25, height: 25, marginRight: 2 }}>
                            </Image>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <Text style={[styles.categoryButtonText, { flex: 1, fontSize: 15 }]}>
                                    {aiLoading ? 'Planning...' : 'Plan with AI'}
                                </Text>
                                <Text style={[styles.linkText, { fontSize: 12, color: 'gray' }]}>
                                    Get personalized trip ideas
                                </Text>
                            </View>
                            <Image source={require('../../../assets/images/right-arrow-icon.png')}
                                style={{ width: 25, height: 25, marginRight: 2, tintColor: colors.primary }}>
                            </Image>
                        </View>
                    </Pressable>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <Text style={{ flex: 1, fontWeight: '500', fontSize: 23 }}>
                        Popular this week
                    </Text>
                </View>
            </View>
    ), [activeCategory, aiLoading, handlePlanWithAi, searchQuery]);

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
                    data={filteredPlaces}
                    renderItem={renderPlaceItem}
                    keyExtractor={(item) => item.Id}
                    ListHeaderComponent={listHeader}
                    showsVerticalScrollIndicator={false}
                    refreshing={loading}
                    onRefresh={loadPlaces}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textSecondary }}>
                            Khong co dia diem nao
                        </Text>
                    }
                />
            </View>
        </View >
    )
}



