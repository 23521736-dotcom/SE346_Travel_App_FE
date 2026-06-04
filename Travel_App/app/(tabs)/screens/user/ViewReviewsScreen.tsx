import { Ionicons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../common/colors';
import { calculateRatingStats, RatingBar, ratingBarStyles, RatingStartBar } from '../../components/Rating';
import { PicturesContainer } from '../../components/ReviewPicture';
import styles from './ViewReviewsScreen.styles';
import { fetchPlaceDetail } from '../../../../lib/api/places';
import { deleteReview, fetchPlaceReviews, toggleReviewLike } from '../../../../lib/api/reviews';
import type { ReviewListItem } from '../../../../lib/api/types';
import { getApiErrorMessage, useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

function ReviewItem({
  item,
  canManage,
  onLikeToggle,
  onEdit,
  onDelete,
}: {
  item: ReviewListItem;
  canManage: boolean;
  onLikeToggle: (id: string) => void;
  onEdit: (review: ReviewListItem) => void;
  onDelete: (review: ReviewListItem) => void;
}) {
  const handlePress = () => {
    onLikeToggle(item.id);
  };

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewAuthorRow}>
          <View style={[styles.avatarBorder, { width: 50, height: 50, overflow: 'hidden', borderRadius: 25 }]}>
            <Image source={{ uri: item.avatar }} style={{ height: '100%', width: '100%' }} resizeMode='cover' />
          </View>
          <View style={styles.reviewAuthorInfo}>
            <Text style={styles.reviewUserName} numberOfLines={1}>{item.username}</Text>
            <View style={{ alignItems: 'flex-start', marginLeft: 0 }}>
              <RatingStartBar ratingValue={item.Rate} size={20} />
            </View>
          </View>
        </View>
        <Text style={styles.reviewDate} numberOfLines={2}>{item.date}</Text>
      </View>

      <View style={{ marginVertical: 10 }}>
        <Text style={styles.reviewContent}>{item.content}</Text>
      </View>

      <PicturesContainer pictures={item.images} />

      <View style={styles.reviewActionRow}>
        <TouchableHighlight underlayColor="transparent" onPress={handlePress}>
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
            <Fontisto name="like" size={20} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>{item.likes}</Text>
          </View>
        </TouchableHighlight>

        {canManage ? (
          <>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}
              onPress={() => onEdit(item)}
            >
              <Ionicons name="create-outline" size={20} color={colors.primary} />
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}
              onPress={() => onDelete(item)}
            >
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
              <Text style={{ color: colors.danger, fontSize: 16, fontWeight: '600' }}>Delete</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </View>
  );
}

export default function ViewReviewsScreen({ navigation, route }: any) {
  const { user } = useAuth();
  const placeId = route.params?.placeId as string | undefined;
  const placeName = route.params?.placeName as string | undefined;
  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [placeRate, setPlaceRate] = useState(0);
  const [placeCount, setPlaceCount] = useState(0);
  const [coverImage, setCoverImage] = useState(
    'https://i.pinimg.com/1200x/6f/54/22/6f542272eef1c2846c752192ff2cd542.jpg'
  );
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  const loadData = useCallback(async (offset = 0) => {
    if (!placeId) return;

    if (offset === 0) {
      setLoading(true);
    }

    try {
      const [place, list] = await Promise.all([
        fetchPlaceDetail(placeId),
        fetchPlaceReviews(placeId, PAGE_SIZE, offset),
      ]);

      if (offset === 0) {
        setPlaceRate(place.Rate);
        setPlaceCount(place.NumberOfRate);
        setCoverImage(place.Image);
      }

      setReviews(prev => offset === 0 ? list : [...prev, ...list]);
      setHasMore(list.length === PAGE_SIZE);
    } catch {
      if (offset === 0) {
        setReviews([]);
      }
      setHasMore(false);
    } finally {
      if (offset === 0) {
        setLoading(false);
      }
    }
  }, [placeId, PAGE_SIZE]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      loadData(reviews.length).finally(() => setLoadingMore(false));
    }
  };

  const handleLikeToggle = async (reviewId: string) => {
    try {
      const result = await toggleReviewLike(reviewId);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, likes: result.likes } : r))
      );
    } catch (err) {
      Alert.alert('Loi', getApiErrorMessage(err));
    }
  };

  const canManageReview = (review: ReviewListItem) => {
    if (!user) return false;

    const ownerId = review.userId ?? review.authorId ?? review.UserId;
    if (ownerId !== undefined && ownerId !== null) {
      return String(ownerId) === String(user.id);
    }

    const ownerName = review.username?.trim().toLowerCase();
    const currentNames = [user.username, user.fullName, user.name]
      .filter(Boolean)
      .map((name) => String(name).trim().toLowerCase());

    return Boolean(ownerName && currentNames.includes(ownerName));
  };

  const handleOpenEdit = (review: ReviewListItem) => {
    navigation.navigate('Write Review', { placeId, placeName, review });
  };

  const handleDeleteReview = (review: ReviewListItem) => {
    Alert.alert('Xoa danh gia', 'Ban co chac muon xoa danh gia nay?', [
      { text: 'Huy', style: 'cancel' },
      {
        text: 'Xoa',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReview(review.id);
            await loadData();
          } catch (err) {
            Alert.alert('Loi', getApiErrorMessage(err));
          }
        },
      },
    ]);
  };

  const ratingStats = calculateRatingStats(reviews);

  if (!placeId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Thieu thong tin dia diem</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <ReviewItem
            item={item}
            canManage={canManageReview(item)}
            onLikeToggle={handleLikeToggle}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteReview}
          />
        )}
        keyExtractor={(item, index) => `review-${item.id}-${index}`}
        ListHeaderComponent={
          <View>
            <View style={{ alignItems: 'center' }}>
              <ImageBackground
                source={{ uri: coverImage }}
                style={[styles.imageFrame, { width: '100%', height: 450 }]}
                resizeMode="cover"
              >
                <View style={[styles.overlay, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                  <Pressable
                    style={[styles.roundButton, {
                      position: 'absolute', left: 15, top: 15, zIndex: 1,
                      backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20, padding: 5
                    }]}
                    onPress={() => navigation.goBack()}
                  >
                    <Ionicons name="chevron-back" size={25} color="white" />
                  </Pressable>

                  <Text style={{ color: colors.primary, fontSize: 60, fontWeight: 'bold' }}>
                    {placeRate}
                  </Text>
                  <RatingStartBar ratingValue={placeRate} size={30} />
                  <Text style={{ color: "#fff", fontSize: 16, marginTop: 10, letterSpacing: 1 }}>
                    {placeCount} VERIFIED REVIEWS
                  </Text>

                  <View style={ratingBarStyles.mainContainer}>
                    {ratingStats.map((stat) => (
                      <RatingBar key={stat.stars} stars={stat.stars} percentage={stat.percentage} />
                    ))}
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 0 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={colors.primary} style={{ margin: 16 }} /> : null}
        ListEmptyComponent={!loading ? (
          <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textSecondary }}>
            Chua co danh gia nao. Hay la nguoi dau tien!
          </Text>
        ) : null}
      />

      <View style={styles.bottomActionContainer}>
        <TouchableOpacity
          style={styles.writeReviewButton}
          onPress={() => navigation.navigate('Write Review', { placeId, placeName })}
        >
          <Text style={styles.writeReviewButtonText}>Write your review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
