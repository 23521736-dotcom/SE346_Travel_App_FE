import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
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
import styles from './AddLocationScreen_user.style';
import { getPlaceCategoryLabel, PLACE_CATEGORIES } from '../../../lib/placeCategories';

interface LocationItem {
    id: string;
    title: string;
    category: string;
    location: string;
    rating: string;
    reviews: string;
    description: string;
    imageUrl: string;
}

const SEARCH_DATA: LocationItem[] = [
    {
        id: '1',
        title: 'Senso-ji Temple',
        category: 'ATTRACTIONS',
        location: 'Asakusa',
        rating: '4.8',
        reviews: '12.4k reviews',
        description: "Tokyo's oldest temple, dedicated to the goddess Kannon. A vibrant cultural hub with shops and street food.",
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: '2',
        title: 'Tokyo Skytree',
        category: 'ATTRACTIONS',
        location: 'Sumida',
        rating: '4.7',
        reviews: '15k reviews',
        description: 'A broadcasting and observation tower offering spectacular views of the city skyline.',
        imageUrl: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: '3',
        title: 'Sumida River Fireworks',
        category: 'FESTIVALS',
        location: 'Sumida River',
        rating: '4.9',
        reviews: '5k reviews',
        description: 'An annual fireworks festival featuring thousands of stunning fireworks lighting up the sky.',
        imageUrl: 'https://images.unsplash.com/photo-1533228876829-65c94e7b5025?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: '4',
        title: 'Sanja Matsuri',
        category: 'FESTIVALS',
        location: 'Asakusa',
        rating: '4.8',
        reviews: '8.2k reviews',
        description: 'One of the three great Shinto festivals in Tokyo, known for energetic parades and mikoshi.',
        imageUrl: 'https://images.unsplash.com/photo-1626244199920-5690b240cc91?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: '5',
        title: 'Tsukiji Outer Market',
        category: 'DINING',
        location: 'Chuo',
        rating: '4.7',
        reviews: '20k reviews',
        description: 'A vibrant market offering the freshest seafood, sushi, and traditional Japanese snacks.',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: '6',
        title: 'Ichiran Ramen',
        category: 'DINING',
        location: 'Shibuya',
        rating: '4.9',
        reviews: '30k reviews',
        description: 'Famous for tonkotsu ramen and unique solo dining booths for full flavor focus.',
        imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: '7',
        title: 'Hotel The Celestine Tokyo Shiba',
        category: 'STAYS',
        location: 'Minato',
        rating: '4.6',
        reviews: '7.4k reviews',
        description: 'A calm city stay with easy access to Tokyo Tower, gardens, and central transit.',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: '8',
        title: 'Nakamise Shopping Street',
        category: 'SHOPPING',
        location: 'Asakusa',
        rating: '4.5',
        reviews: '18k reviews',
        description: 'A classic shopping street for souvenirs, snacks, crafts, and festival-style browsing.',
        imageUrl: 'https://images.unsplash.com/photo-1554797589-7241bb691973?q=80&w=1000&auto=format&fit=crop',
    },
];

const SAVED_DESTINATIONS = [
    { id: '1', name: 'Gion Matsuri', rating: '4.9', reviews: '15k', address: 'Kyoto', category: 'FESTIVALS', image: 'https://images.unsplash.com/photo-1574236170882-b6ab7bfdc7b1?auto=format&fit=crop&w=200&q=80' },
    { id: '2', name: 'Nebuta Matsuri', rating: '4.8', reviews: '8k', address: 'Aomori', category: 'FESTIVALS', image: 'https://images.unsplash.com/photo-1698205244501-c81729b8ccf6?auto=format&fit=crop&w=200&q=80' },
    { id: '3', name: 'Ichiran Ramen', rating: '4.7', reviews: '40k', address: 'Osaka', category: 'DINING', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80' },
    { id: '4', name: 'Sukiyabashi Jiro', rating: '4.9', reviews: '12k', address: 'Tokyo', category: 'DINING', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=200&q=80' },
    { id: '5', name: 'Shibuya Crossing', rating: '4.8', reviews: '24k', address: 'Tokyo', category: 'ATTRACTIONS', image: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&w=200&q=80' },
    { id: '6', name: 'Ghibli Museum', rating: '4.9', reviews: '12k', address: 'Tokyo', category: 'ATTRACTIONS', image: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?auto=format&fit=crop&w=200&q=80' },
    { id: '7', name: 'Hotel The Celestine Tokyo Shiba', rating: '4.6', reviews: '7k', address: 'Tokyo', category: 'STAYS', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80' },
    { id: '8', name: 'Nakamise Shopping Street', rating: '4.5', reviews: '18k', address: 'Tokyo', category: 'SHOPPING', image: 'https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=200&q=80' },
];

const FILTERS = [{ value: 'All Sights', label: 'All Sights' }, ...PLACE_CATEGORIES];
const SAVED_FILTERS = PLACE_CATEGORIES;

export default function AddLocationScreen_user({ navigation, route }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('FESTIVALS');
    const [activeSearchFilter, setActiveSearchFilter] = useState('All Sights');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const dayTitle = route?.params?.dayTitle;
    const isSearchMode = submittedQuery.trim().length > 0;

    const searchResults = useMemo(() => {
        const normalizedQuery = submittedQuery.trim().toLowerCase();

        return SEARCH_DATA.filter((item) => {
            const matchesFilter = activeSearchFilter === 'All Sights' || item.category === activeSearchFilter;
            const matchesQuery =
                item.title.toLowerCase().includes(normalizedQuery) ||
                item.location.toLowerCase().includes(normalizedQuery) ||
                item.category.toLowerCase().includes(normalizedQuery) ||
                item.description.toLowerCase().includes(normalizedQuery);

            return matchesFilter && matchesQuery;
        });
    }, [activeSearchFilter, submittedQuery]);

    const submitSearch = () => {
        setSubmittedQuery(searchQuery);
    };

    const toggleItem = (id: string) => {
        setSelectedItems((current) =>
            current.includes(id)
                ? current.filter((itemId) => itemId !== id)
                : [...current, id]
        );
    };

    const renderResultCard = ({ item }: { item: LocationItem }) => {
        const isSelected = selectedItems.includes(item.id);

        return (
            <View style={styles.resultCard}>
                <View style={styles.resultImageContainer}>
                    <Image source={{ uri: item.imageUrl }} style={styles.resultCardImage} />
                    <View style={styles.resultCategoryBadge}>
                        <Text style={styles.resultCategoryBadgeText}>{getPlaceCategoryLabel(item.category)}</Text>
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
                    <View />
                </View>

                <View style={styles.resultFiltersContainer}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={FILTERS}
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
                    <View />
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
                    {SAVED_FILTERS.map((filter) => (
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

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionHeaderLeft}>
                        <Feather name="bookmark" size={18} color="#003A70" />
                        <Text style={styles.sectionTitle}>From Saved</Text>
                    </View>
                </View>

                {SAVED_DESTINATIONS.filter((place) => place.category === activeFilter).map((place) => {
                    const isSelected = selectedItems.includes(`saved-${place.id}`);

                    return (
                        <View key={place.id} style={styles.card}>
                            <Image source={{ uri: place.image }} style={styles.cardImg} />
                            <View style={styles.cardInfo}>
                                <Text style={styles.placeName}>{place.name}</Text>
                                <View style={styles.ratingRow}>
                                    <FontAwesome name="star" size={12} color="#D4A373" />
                                    <Text style={styles.ratingText}>
                                        {place.rating} ({place.reviews}) - {place.address}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.addBtn, isSelected && styles.addedBtn]}
                                onPress={() => toggleItem(`saved-${place.id}`)}
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
