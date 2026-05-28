import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { colors } from "../common/colors";
import styles from "./TripDiaryScreen.styles";

type DiaryStop = {
  id: string;
  title: string;
  time: string;
  quote: string;
  images: string[];
  extraCount?: number;
  active?: boolean;
};

const heroImage =
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop";

const diaryStops: DiaryStop[] = [
  {
    id: "meiji",
    title: "Đền Meiji Jingu",
    time: "24 Th10, 2024 • 09:00 AM",
    active: true,
    extraCount: 12,
    images: [
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=600&auto=format&fit=crop",
    ],
    quote:
      "Không gian thật yên tĩnh dù nằm giữa lòng Tokyo nhộn nhịp. Cảm giác bình yên đến lạ kỳ khi bước dưới những hàng cây cổ thụ.",
  },
  {
    id: "takeshita",
    title: "Phố Takeshita",
    time: "24 Th10, 2024 • 01:30 PM",
    images: [
      "https://images.unsplash.com/photo-1554797589-7241bb691973?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
    ],
    quote:
      "Thử món bánh Crepe nổi tiếng và ngắm nhìn đủ mọi phong cách thời trang độc lạ. Tokyo thật năng động!",
  },
];

function TimelineCard({ stop, onEdit }: { stop: DiaryStop; onEdit: (stop: DiaryStop) => void }) {
  const isTwoColumn = stop.images.length === 2;

  return (
    <View style={styles.timelineCard}>
      <View style={[styles.timelineDot, !stop.active && styles.timelineDotMuted]} />

      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.placeName,
              !stop.active && styles.placeNameMuted,
            ]}
          >
            {stop.title}
          </Text>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={16} color="#3E4850" />
            <Text style={styles.timeText}>{stop.time}</Text>
          </View>
        </View>

        <Pressable hitSlop={8} style={styles.iconButton} onPress={() => onEdit(stop)}>
          <Ionicons name="create-outline" size={20} color="#6E7881" />
        </Pressable>
      </View>

      <View style={isTwoColumn ? styles.galleryTwo : styles.galleryThree}>
        {stop.images.map((image, index) => {
          const isMoreTile = Boolean(stop.extraCount && index === 2);

          if (isMoreTile) {
            return (
              <Pressable key={image} style={styles.moreImageWrap}>
                <Image source={{ uri: image }} style={styles.moreImage} />
                <View style={styles.moreOverlay}>
                  <Text style={styles.moreText}>+{stop.extraCount}</Text>
                </View>
              </Pressable>
            );
          }

          return (
            <Image
              key={image}
              source={{ uri: image }}
              style={isTwoColumn ? styles.galleryImageLarge : styles.galleryImageSmall}
            />
          );
        })}
      </View>

      <View style={[styles.quoteBox, !stop.active && styles.quoteBoxMuted]}>
        <Text style={styles.quoteText}>{`"${stop.quote}"`}</Text>
      </View>
    </View>
  );
}

export default function TripDiaryScreen({ navigation }: any) {
  const handleEditStop = (stop: DiaryStop) => {
    navigation.navigate("Edit Trip Diary", {
      placeName: stop.title,
      time: stop.time,
      images: stop.images,
      caption: stop.quote,
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.primaryDark} />
          </Pressable>
          <Text style={styles.title}>Nhật ký hành trình</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable hitSlop={8} style={styles.iconButton}>
            <Ionicons name="share-social-outline" size={21} color={colors.primaryDark} />
          </Pressable>
          <Pressable hitSlop={8} style={styles.iconButton}>
            <Ionicons name="ellipsis-vertical" size={21} color={colors.primaryDark} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <Image source={{ uri: heroImage }} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <Pressable style={styles.playButton}>
              <Ionicons name="play" size={34} color={colors.white} />
            </Pressable>
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>Kỷ niệm Tokyo 2024</Text>
            <Text style={styles.heroSubtitle}>
              Dựng phim từ 45 khoảnh khắc đẹp nhất
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Hành trình ghé thăm</Text>
          <View style={styles.timelineWrap}>
            <View style={styles.timelineLine} />
            <View style={styles.timelineLineActive} />
            {diaryStops.map((stop) => (
              <TimelineCard key={stop.id} stop={stop} onEdit={handleEditStop} />
            ))}
          </View>
        </View>

        <View style={styles.ctaWrap}>
          <Pressable style={styles.ctaButton}>
            <MaterialCommunityIcons name="movie-open-play" size={22} color={colors.white} />
            <Text style={styles.ctaText}>Tạo video kỷ niệm</Text>
          </Pressable>
          <Text style={styles.helperText}>
            Sử dụng AI để tự động tạo một đoạn phim ngắn từ những bức ảnh và video tâm đắc nhất của bạn.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
