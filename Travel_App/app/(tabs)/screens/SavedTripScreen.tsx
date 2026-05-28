import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import styles from "./SavedTripScreen.style";

type Category = 'Festivals' | 'Dining' | 'Attractions';

interface PlaceData {
    id: string;
    title: string;
    location: string;
    rating: number;
    priceLevel: string;
    image: string;
    discount?: string;
    category: Category;
}

const PLACES: PlaceData[] = [
    { id: '1', title: 'Gion District', location: 'Kyoto, Japan', rating: 4.9, priceLevel: '300$', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', discount: '15% GIẢM', category: 'Attractions' },
    { id: '2', title: 'Blue Lagoon Resort', location: 'Bali, Indonesia', rating: 4.8, priceLevel: '308$', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop', category: 'Attractions' },
    { id: '3', title: 'Meiji Jingu Shrine', location: 'Tokyo, Japan', rating: 4.7, priceLevel: '42$', image: 'https://images.unsplash.com/photo-1590559899731-a382839ce695?q=80&w=800&auto=format&fit=crop', category: 'Attractions' },
    { id: '4', title: 'Omakase Sushi Dai', location: 'Tokyo, Japan', rating: 4.9, priceLevel: '234$', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop', category: 'Dining' },
    { id: '5', title: 'Le Jules Verne', location: 'Paris, France', rating: 4.8, priceLevel: '654$', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format&fit=crop', discount: 'Tặng kèm rượu', category: 'Dining' },
];

const FILTERS = ['All', 'Festivals', 'Dining', 'Attractions'];

function toPlaceDetail(place: PlaceData) {
    const defaultReviewPictures = [
        place.image,
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
    ];

    return {
        Id: place.id,
        Name: place.title,
        Location: place.location,
        Rate: place.rating,
        NumberOfRate: 1200,
        Image: place.image,
        Features: place.category,
        about: `${place.title} is saved in your trip list. This destination is a good candidate for your itinerary with useful details, nearby experiences, and travel notes ready to review.`,
        priceLevel: Number(place.priceLevel.replace(/[^0-9]/g, '')) || null,
        Reviews: [
            {
                ava: 'https://randomuser.me/api/portraits/women/44.jpg',
                Name: 'Sarah Chen',
                Date: 'May 20, 2026',
                Content: 'Beautiful place to visit. The atmosphere was memorable and it fits nicely into a flexible travel plan.',
                Rate: Math.min(place.rating, 5),
                Pictures: defaultReviewPictures,
            },
        ],
        isFavorite: true,
    };
}

export default function SavedTrip({ navigation }: any) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Lọc theo cả danh mục và từ khóa tìm kiếm
    const filteredPlaces = PLACES.filter(place => {
        const matchCategory = activeFilter === 'All' ? true : place.category === activeFilter;
        const matchSearch = place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            place.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerTop}>
                    <TouchableOpacity>
                        <Feather name="arrow-left" size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Saved Trip</Text>
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
                            key={filter}
                            onPress={() => setActiveFilter(filter)}
                            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
                        >
                            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
                {filteredPlaces.length > 0 ? (
                    filteredPlaces.map((place) => (
                        <TouchableOpacity
                            key={place.id}
                            activeOpacity={0.86}
                            style={styles.card}
                            onPress={() =>
                                navigation.navigate('Detail Location', {
                                    placeId: place.id,
                                    placeData: toPlaceDetail(place),
                                })
                            }
                        >
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: place.image }} style={styles.cardImage} />
                                {place.discount && (
                                    <View style={styles.discountBadge}>
                                        <Text style={styles.discountText}>{place.discount}</Text>
                                    </View>
                                )}
                                <TouchableOpacity style={styles.heartButton}>
                                    <Ionicons name="heart" size={20} color="#ef4444" />
                                </TouchableOpacity>
                                <View style={styles.priceBadge}>
                                    <Text style={styles.priceText}>{place.priceLevel}</Text>
                                </View>
                            </View>

                            <View style={styles.cardBody}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle} numberOfLines={1}>{place.title}</Text>
                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="star" size={12} color="#f97316" />
                                        <Text style={styles.ratingText}>{place.rating}</Text>
                                    </View>
                                </View>

                                <View style={styles.locationRow}>
                                    <View style={styles.locationInfo}>
                                        <Ionicons name="location-outline" size={14} color="#6b7280" />
                                        <Text style={styles.locationText}>{place.location}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate('Detail Location', {
                                                placeId: place.id,
                                                placeData: toPlaceDetail(place),
                                            })
                                        }
                                    >
                                        <Text style={styles.detailText}>Detail</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
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

