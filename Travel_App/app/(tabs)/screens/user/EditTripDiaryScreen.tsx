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
import { getApiErrorMessage } from "../../../../lib/api/client";
import { createTripDiaryEntry, TripDiaryEntry, updateTripDiaryEntry } from "../../../../lib/api/diary";
import { uploadDiaryImages, type UploadImageInput } from "../../../../lib/api/uploads";
import { colors } from "../../common/colors";
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

function formatDiaryDateTime(value?: string) {
  const date = value ? new Date(value) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const day = String(safeDate.getDate()).padStart(2, "0");
  const month = String(safeDate.getMonth() + 1).padStart(2, "0");
  const year = safeDate.getFullYear();
  const hours = String(safeDate.getHours()).padStart(2, "0");
  const minutes = String(safeDate.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function parseDiaryDateTime(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  const [, dayText, monthText, yearText, hourText, minuteText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const hours = Number(hourText);
  const minutes = Number(minuteText);
  const date = new Date(year, month - 1, day, hours, minutes);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hours ||
    date.getMinutes() !== minutes
  ) {
    return null;
  }

  return date.toISOString();
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
  const [occurredAtInput, setOccurredAtInput] = useState(formatDiaryDateTime(entry?.occurredAt));
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
    const occurredAt = parseDiaryDateTime(occurredAtInput);
    if (!occurredAt) {
      Alert.alert("Sai định dạng thời gian", "Vui lòng nhập thời gian theo dạng dd/MM/yyyy HH:mm.");
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

        <View />
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
                value={toWebDateTimeValue(parseDiaryDateTime(occurredAtInput) || new Date().toISOString())}
                onChange={(event: any) => setOccurredAtInput(formatDiaryDateTime(fromWebDateTimeValue(event.currentTarget.value)))}
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
                value={occurredAtInput}
                onChangeText={setOccurredAtInput}
                placeholder="01/08/2026 20:30"
              placeholderTextColor={colors.textMuted}
              style={styles.singleLineInput}
                keyboardType="numbers-and-punctuation"
            />
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ảnh kỷ niệm</Text>
          <Text style={styles.sectionMeta}>{selectedImages.length}/12</Text>
        </View>

        <View style={styles.photoGrid}>
          <Pressable style={styles.addPhotoTile} onPress={handlePickImage} disabled={isSaving}>
            <View style={styles.addPhotoContent}>
              <Ionicons name="camera-outline" size={30} color={colors.primary} />
              <Text style={styles.addPhotoText}>Thêm ảnh</Text>
            </View>
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
