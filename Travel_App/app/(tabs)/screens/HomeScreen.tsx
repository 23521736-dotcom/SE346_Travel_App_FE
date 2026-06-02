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
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { colors } from "../common/colors";
import styles from './HomeScreen.styles';
import { fetchPlaces, fetchPromotionPlaceIds } from '../../../lib/api/places';
import { planTrip } from '../../../lib/api/ai';
import type { PlaceListItem } from '../../../lib/api/types';
import { getApiErrorMessage } from '../context/AuthContext';
import { getPlaceCategoryLabel, normalizePlaceCategory, PLACE_CATEGORIES } from '../../../lib/placeCategories';

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
                <Image
                    source={{ uri: item.image }}
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
    const [activeCategory, setActiveCategory] = useState('All');
    const [places, setPlaces] = useState<Place[]>([]);
    const [promotionPlaceIds, setPromotionPlaceIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [destination, setDestination] = useState('');
    const [budget, setBudget] = useState('');
    const [duration, setDuration] = useState('');

    const loadPlaces = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchPlaces();
            setPlaces(data);
            setPromotionPlaceIds(await fetchPromotionPlaceIds(data.map((place) => place.Id)));
        } catch {
            setPlaces([]);
            setPromotionPlaceIds(new Set());
        } finally {
            setLoading(false);
        }
    }, []);

    const renderPlaceItem = ({ item }: { item: Place }) => (
        renderPlaceCard(item, navigation, promotionPlaceIds.has(item.Id))
    );

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
            Alert.alert('Goi y chuyen di', `${body}\n\n${plan.note}`);
            alert("Dựa vào 3 thông tin địa điểm, budget, thời gian dùng AI để set 1 trip phù hợp");
            setModalVisible(false);
        } catch (err) {
            Alert.alert('Loi', getApiErrorMessage(err));
        } finally {
            setAiLoading(false);
        }
    }, [budget, destination, duration, searchQuery]);

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
                    <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Where to next ?"
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
                <View
                    style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                    <Pressable
                        style={{ flex: 1, borderRadius: 8, borderWidth: 2, borderColor: colors.primary, padding: 10 }}
                    onPress={() => setModalVisible(true)}
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
    ), [activeCategory, aiLoading, searchQuery]);

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
                                        <Text style={styles.modalTitle}>Add New Destination</Text>
                                    </View>
                                    <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                        <Feather name="x" size={24} color="#4A5568" />
                                    </Pressable>
                                </View>

                                <View style={styles.formContainer}>
                                    <CustomInput
                                        label="Destination"
                                        iconName="search"
                                        placeholder="Where do you want to go?"
                                        value={destination}
                                        onChangeText={setDestination}
                                    />
                                    <CustomInput
                                        label="Estimated Budget"
                                        iconName="dollar-sign"
                                        placeholder="0.00"
                                        keyboardType="numeric"
                                        value={budget}
                                        onChangeText={setBudget}
                                    />
                                    <CustomInput
                                        label="Duration (Days)"
                                        iconName="clock"
                                        placeholder="Days"
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
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </Pressable>

                                    <Pressable style={styles.primaryButton} onPress={handlePlanWithAi} disabled={aiLoading}>
                                        <Text style={styles.primaryButtonText}>
                                            {aiLoading ? 'Planning...' : '✨ Plan with AI'}
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



