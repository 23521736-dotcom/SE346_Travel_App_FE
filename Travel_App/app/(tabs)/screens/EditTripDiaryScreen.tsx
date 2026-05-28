import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
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
import { colors } from "../common/colors";
import styles from "./EditTripDiaryScreen.styles";

type EditTripDiaryParams = {
  placeName?: string;
  time?: string;
  images?: string[];
  caption?: string;
};

export default function EditTripDiaryScreen({ navigation, route }: any) {
  const params = (route.params || {}) as EditTripDiaryParams;
  const [caption, setCaption] = useState(params.caption || "");
  const [selectedImages, setSelectedImages] = useState<string[]>(params.images || []);

  const placeName = params.placeName || "Dia diem trong hanh trinh";
  const time = params.time || "Thoi gian tu lich trinh";

  const handlePickImage = async () => {
    if (selectedImages.length >= 6) {
      Alert.alert("Thong bao", "Ban co the them toi da 6 anh cho moi diem den.");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Loi", "Can quyen truy cap thu vien anh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.85,
    });

    if (!result.canceled) {
      const pickedUris = result.assets.map((asset) => asset.uri);
      setSelectedImages((prev) => [...prev, ...pickedUris].slice(0, 6));
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSave = () => {
    Alert.alert("Da luu", "Anh va caption da duoc cap nhat cho nhat ky.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
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
        >
          <Ionicons name="chevron-back" size={25} color={colors.textPrimary} />
        </Pressable>

        <Text style={styles.headerTitle}>Edit Trip Diary</Text>

        <Pressable hitSlop={10} onPress={handleSave} style={styles.saveHeaderButton}>
          <Text style={styles.saveHeaderText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.tripInfoCard}>
          <View style={styles.infoIconWrap}>
            <Ionicons name="location" size={24} color={colors.primary} />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoLabel}>Dia diem</Text>
            <Text style={styles.placeName}>{placeName}</Text>
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.timeText}>{time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Anh ky niem</Text>
          <Text style={styles.sectionMeta}>{selectedImages.length}/6</Text>
        </View>

        <View style={styles.photoGrid}>
          <Pressable style={styles.addPhotoTile} onPress={handlePickImage}>
            <Ionicons name="camera-outline" size={30} color={colors.primary} />
            <Text style={styles.addPhotoText}>Them anh</Text>
          </Pressable>

          {selectedImages.map((uri, index) => (
            <View key={`${uri}-${index}`} style={styles.photoTile}>
              <Image source={{ uri }} style={styles.photoImage} />
              <Pressable
                hitSlop={8}
                onPress={() => handleRemoveImage(index)}
                style={styles.removePhotoButton}
              >
                <Ionicons name="close-circle" size={22} color={colors.danger} />
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.captionCard}>
          <View style={styles.captionHeader}>
            <Ionicons name="create-outline" size={20} color={colors.primary} />
            <Text style={styles.captionTitle}>Caption</Text>
          </View>
          <TextInput
            value={caption}
            onChangeText={setCaption}
            multiline
            textAlignVertical="top"
            placeholder="Viet cam nghi cua ban ve diem den nay..."
            placeholderTextColor={colors.textMuted}
            style={styles.captionInput}
          />
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={22} color={colors.white} />
          <Text style={styles.saveButtonText}>Luu nhat ky</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
