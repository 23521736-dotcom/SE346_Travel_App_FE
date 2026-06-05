import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createReview, updateReview } from '../../../../lib/api/reviews';
import type { ReviewListItem } from '../../../../lib/api/types';
import { uploadReviewImages, type UploadImageInput } from '../../../../lib/api/uploads';
import { RatingStartBar } from '../../components/Rating';
import { getApiErrorMessage } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import getStyles from './WriteReviewScreen.styles';

const ratingLabels = ['Very bad', 'Bad', 'Okay', 'Good', 'Excellent'];

type LocalReviewImage = UploadImageInput;

const normalizeInitialImages = (imageUrls: string[] = []): LocalReviewImage[] => {
  return imageUrls.map((uri) => ({
    uri,
    isRemote: /^https?:\/\//i.test(uri),
  }));
};

export default function WriteReviewScreen({ navigation, route }: any) {
  const { colors: themeColors } = useTheme();
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);

  const placeId = route.params?.placeId as string | undefined;
  const placeName = route.params?.placeName as string | undefined;
  const editingReview = route.params?.review as ReviewListItem | undefined;
  const isEditing = Boolean(editingReview?.id);
  const [rating, setRating] = useState(editingReview?.Rate ?? 0);
  const [reviewText, setReviewText] = useState(editingReview?.content ?? '');
  const [pendingImages, setPendingImages] = useState<LocalReviewImage[]>(normalizeInitialImages(editingReview?.images));
  const [submitting, setSubmitting] = useState(false);

  const handlePickImage = async () => {
    if (pendingImages.length >= 10) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Loi', 'Can quyen truy cap thu vien anh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPendingImages((prev) => [
        ...prev,
        {
          uri: asset.uri,
          fileName: asset.fileName,
          mimeType: asset.mimeType,
        },
      ].slice(0, 10));
    }
  };

  const handleSubmitReview = async () => {
    if (!placeId) {
      Alert.alert('Loi', 'Thieu thong tin dia diem');
      return;
    }

    if (rating === 0) {
      Alert.alert('Loi', 'Vui long chon so sao');
      return;
    }

    if (!reviewText.trim()) {
      Alert.alert('Loi', 'Vui long nhap noi dung danh gia');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrls: string[] = [];
      try {
        imageUrls = await uploadReviewImages(pendingImages);
      } catch (err) {
        const msg = getApiErrorMessage(err);
        if (msg === 'STORAGE_UNAVAILABLE') {
          Alert.alert(
            'Upload chua san sang',
            'Can service_role key (eyJ...) trong .env BE. Chay: npm run storage:verify'
          );
          return;
        }
        throw err;
      }

      if (isEditing && editingReview) {
        await updateReview(editingReview.id, {
          rating,
          content: reviewText.trim(),
          imageUrls,
        });
      } else {
        await createReview(placeId, {
          rating,
          content: reviewText.trim(),
          imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        });
      }

      Alert.alert('Thanh cong', isEditing ? 'Da cap nhat danh gia cua ban' : 'Da gui danh gia cua ban', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Loi', getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={themeColors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Review' : 'Write Review'}</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {placeName ? <Text style={styles.placeName}>{placeName}</Text> : null}

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Your rating</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity key={value} onPress={() => setRating(value)} activeOpacity={0.7}>
                <Ionicons
                  name={value <= rating ? 'star' : 'star-outline'}
                  size={42}
                  color={themeColors.warning}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingLabel}>
            {rating > 0 ? ratingLabels[rating - 1] : 'Tap to rate'}
          </Text>
          {rating > 0 ? <RatingStartBar ratingValue={rating} size={18} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comment</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Share your experience about this place..."
            placeholderTextColor={themeColors.textMuted}
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.photoHeader}>
            <Text style={styles.sectionTitle}>Add photos</Text>
            <Text style={styles.photoCount}>{pendingImages.length}/10</Text>
          </View>

          <View style={styles.photoGrid}>
            <TouchableOpacity
              style={[styles.addPhotoButton, pendingImages.length >= 10 && styles.disabledPhotoButton]}
              onPress={handlePickImage}
              disabled={pendingImages.length >= 10}
            >
              <Ionicons name="camera-outline" size={26} color={themeColors.primary} />
              <Text style={styles.addPhotoText}>Upload</Text>
            </TouchableOpacity>

            {pendingImages.map((item, idx) => (
              <View key={`${item.uri}-${idx}`} style={styles.photoItem}>
                <Image source={{ uri: item.uri }} style={styles.photoImage} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => setPendingImages((prev) => prev.filter((_, i) => i !== idx))}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          disabled={submitting}
          onPress={handleSubmitReview}
        >
          {submitting ? (
            <ActivityIndicator color={themeColors.white} />
          ) : (
            <>
              <Text style={styles.submitButtonText}>{isEditing ? 'Save Review' : 'Submit Review'}</Text>
              <Ionicons name={isEditing ? 'checkmark' : 'send'} size={18} color={themeColors.white} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
