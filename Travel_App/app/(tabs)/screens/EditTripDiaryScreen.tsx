import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
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
  View,
} from "react-native";
import { getApiErrorMessage } from "../../../lib/api/client";
import { createTripDiaryEntry, TripDiaryEntry, updateTripDiaryEntry } from "../../../lib/api/diary";
import { uploadDiaryImages, type UploadImageInput } from "../../../lib/api/uploads";
import { colors } from "../common/colors";
import styles from "./EditTripDiaryScreen.styles";

type LocalDiaryImage = UploadImageInput & { id: string };
const WebDateTimeInput = "input" as any;

type EditTripDiaryParams = {
  tripId?: string;
  tripTitle?: string;
  entry?: TripDiaryEntry;
};

function toWebDateTimeValue(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function fromWebDateTimeValue(value: string) {
  if (!value) {
    return new Date().toISOString();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function normalizeInitialImages(imageUrls: string[] = []): LocalDiaryImage[] {
  return imageUrls.map((uri, index) => ({
    id: `remote-${index}-${uri}`,
    uri,
    isRemote: true,
  }));
}

export default function EditTripDiaryScreen({ navigation, route }: any) {
  const params = (route.params || {}) as EditTripDiaryParams;
  const entry = params.entry;
  const tripId = params.tripId ?? entry?.tripId;
  const [title, setTitle] = useState(entry?.title || "");
  const [locationName, setLocationName] = useState(entry?.locationName || "");
  const [occurredAt, setOccurredAt] = useState(entry?.occurredAt || new Date().toISOString());
  const [content, setContent] = useState(entry?.content || "");
  const [selectedImages, setSelectedImages] = useState<LocalDiaryImage[]>(
    normalizeInitialImages(entry?.imageUrls)
  );
  const [isSaving, setIsSaving] = useState(false);

  const screenTitle = entry ? "Update Diary" : "Write Diary";
  const tripTitle = params.tripTitle || entry?.trip?.title || "Trip diary";
  const canSave = useMemo(
    () => Boolean(tripId && title.trim() && content.trim()) && !isSaving,
    [content, isSaving, title, tripId]
  );

  const handlePickImage = async () => {
    if (selectedImages.length >= 12) {
      Alert.alert("Thông báo", "Bạn có thể thêm tối đa 12 ảnh cho một mục nhật ký.");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.85,
    });

    if (!result.canceled) {
      const pickedImages = result.assets.map((asset, index) => ({
        id: `${asset.uri}-${Date.now()}-${index}`,
        uri: asset.uri,
        fileName: asset.fileName,
        mimeType: asset.mimeType,
        file: (asset as any).file,
      }));
      setSelectedImages((prev) => [...prev, ...pickedImages].slice(0, 12));
    }
  };

  const handleRemoveImage = (id: string) => {
    setSelectedImages((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    if (!tripId) {
      Alert.alert("Không thể lưu", "Thiếu thông tin chuyến đi.");
      return;
    }
    if (!title.trim()) {
      Alert.alert("Thiếu tiêu đề", "Vui lòng nhập tiêu đề nhật ký.");
      return;
    }
    if (!content.trim()) {
      Alert.alert("Thiếu nội dung", "Vui lòng nhập nội dung nhật ký.");
      return;
    }

    setIsSaving(true);
    try {
      const imageUrls = await uploadDiaryImages(selectedImages);
      if (entry?.id) {
        await updateTripDiaryEntry(entry.id, {
          title,
          content,
          locationName,
          occurredAt,
          imageUrls,
        });
      } else {
        await createTripDiaryEntry(tripId, {
          title,
          content,
          locationName,
          occurredAt,
          imageUrls,
        });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lưu nhật ký thất bại", getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Pressable
          hitSlop={10}
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
          disabled={isSaving}
        >
          <Ionicons name="chevron-back" size={25} color={colors.textPrimary} />
        </Pressable>

        <Text style={styles.headerTitle}>{screenTitle}</Text>

        <Pressable
          hitSlop={10}
          onPress={handleSave}
          disabled={!canSave}
          style={[styles.saveHeaderButton, !canSave && styles.saveButtonDisabled]}
        >
          {isSaving ? <ActivityIndicator size="small" color={colors.white} /> : null}
          <Text style={styles.saveHeaderText}>{isSaving ? "Saving" : "Save"}</Text>
        </Pressable>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.tripInfoCard}>
          <View style={styles.infoIconWrap}>
            <Ionicons name="journal" size={24} color={colors.primary} />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoLabel}>Linked trip</Text>
            <Text numberOfLines={1} style={styles.placeName}>{tripTitle}</Text>
            <Text style={styles.timeText}>Ảnh và nội dung sẽ được lưu vào chuyến đi này.</Text>
          </View>
        </View>

        <View style={styles.captionCard}>
          <Text style={styles.inputLabel}>Tiêu đề</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ví dụ: Buổi tối ở Shinjuku"
            placeholderTextColor={colors.textMuted}
            style={styles.singleLineInput}
          />

          <Text style={styles.inputLabel}>Địa điểm</Text>
          <TextInput
            value={locationName}
            onChangeText={setLocationName}
            placeholder="Tên nơi bạn ghé thăm"
            placeholderTextColor={colors.textMuted}
            style={styles.singleLineInput}
          />

          <Text style={styles.inputLabel}>Thời gian</Text>
          {Platform.OS === "web" ? (
            <View style={styles.webDateInputWrap}>
              <WebDateTimeInput
                type="datetime-local"
                value={toWebDateTimeValue(occurredAt)}
                onChange={(event: any) => setOccurredAt(fromWebDateTimeValue(event.currentTarget.value))}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: 15,
                  color: "#111827",
                }}
              />
            </View>
          ) : (
            <TextInput
              value={occurredAt}
              onChangeText={setOccurredAt}
              placeholder="2026-08-01T20:30:00.000Z"
              placeholderTextColor={colors.textMuted}
              style={styles.singleLineInput}
            />
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ảnh kỷ niệm</Text>
          <Text style={styles.sectionMeta}>{selectedImages.length}/12</Text>
        </View>

        <View style={styles.photoGrid}>
          <Pressable style={styles.addPhotoTile} onPress={handlePickImage} disabled={isSaving}>
            <Ionicons name="camera-outline" size={30} color={colors.primary} />
            <Text style={styles.addPhotoText}>Thêm ảnh</Text>
          </Pressable>

          {selectedImages.map((item) => (
            <View key={item.id} style={styles.photoTile}>
              <Image source={{ uri: item.uri }} style={styles.photoImage} />
              <Pressable
                hitSlop={8}
                onPress={() => handleRemoveImage(item.id)}
                style={styles.removePhotoButton}
                disabled={isSaving}
              >
                <Ionicons name="close-circle" size={22} color={colors.danger} />
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.captionCard}>
          <View style={styles.captionHeader}>
            <Ionicons name="create-outline" size={20} color={colors.primary} />
            <Text style={styles.captionTitle}>Nội dung</Text>
          </View>
          <TextInput
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            placeholder="Viết cảm nghĩ, câu chuyện, món ăn, thời tiết hoặc khoảnh khắc đáng nhớ..."
            placeholderTextColor={colors.textMuted}
            style={styles.captionInput}
          />
        </View>

        <Pressable
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!canSave}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Ionicons name="checkmark-circle" size={22} color={colors.white} />
          )}
          <Text style={styles.saveButtonText}>{isSaving ? "Đang lưu..." : "Lưu nhật ký"}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
