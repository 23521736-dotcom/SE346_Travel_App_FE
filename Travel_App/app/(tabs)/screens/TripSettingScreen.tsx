import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ImageBackground, Pressable, ScrollView, Text, View } from "react-native";
import { colors } from "../common/colors";
import styles from "./TripSettingScreen.styles";

const interestOptions = ["Shopping", "Hiking", "Sightseeing"];

type TripSettingParams = {
  id?: string;
  mode?: "draft" | "upcoming";
  title?: string;
  destination?: string;
  date?: string;
  image?: string;
  statusLabel?: string;
  collaboratorLabel?: string;
  memberAvatars?: string[];
  extraCount?: number;
};

function EmptySetting({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.settingBlock}>
      <Text style={styles.metaLabel}>{label}</Text>
      <View style={styles.settingRow}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <Text numberOfLines={1} style={styles.settingValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function ActivityPlaceholder() {
  return (
    <View style={styles.activityCard}>
      <View style={styles.activityContent}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={26} color={colors.textMuted} />
        </View>

        <View style={styles.activityInfo}>
          <View style={styles.activityTitleRow}>
            <Text style={styles.activityTitle}>No activity yet</Text>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={11} color="#EA580C" />
              <Text style={styles.ratingText}>--</Text>
            </View>
          </View>
          <Text style={styles.activityDescription}>
            Add places, notes, and estimated costs for this time block.
          </Text>
          <View style={styles.costRow}>
            <View style={styles.freePill}>
              <Text style={styles.freePillText}>EST: $0.00</Text>
            </View>
            <Pressable style={styles.splitButton}>
              <MaterialCommunityIcons
                name="account-cash-outline"
                size={13}
                color={colors.white}
              />
              <Text style={styles.splitButtonText}>SPLIT</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.nearbyRow}>
        <Text style={styles.nearbyLabel}>Nearby:</Text>
        <View style={styles.nearbyChip}>
          <Ionicons name="add-circle-outline" size={13} color={colors.primary} />
          <Text style={styles.nearbyText}>Add suggestion</Text>
        </View>
      </View>
    </View>
  );
}

export default function TripSettingScreen({ navigation, route }: any) {
  const params = (route?.params || {}) as TripSettingParams;
  const tripTitle = params.title || "New Trip";
  const destination = params.destination || "Not selected";
  const duration = params.date || "Choose days";
  const statusLabel = params.statusLabel || "New";
  const memberAvatars = params.memberAvatars || [];
  const memberCount = memberAvatars.length + (params.extraCount || 0);
  const budget = params.mode === "upcoming" ? "$1,250.00" : "$0.00";

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          hitSlop={10}
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="chevron-back" size={25} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>TripSetting</Text>
        <Pressable hitSlop={10} style={styles.headerButton}>
          <Ionicons
            name="ellipsis-horizontal"
            size={24}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleWrap}>
              <Text numberOfLines={1} style={styles.cardTitle}>
                {tripTitle}
              </Text>
              <View style={styles.statusRow}>
                <Text style={styles.statusText}>{statusLabel}</Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <Pressable style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
              <Pressable>
                <Text style={styles.modifyText}>Modify</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.settingsGrid}>
            <EmptySetting
              icon="location-outline"
              label="Destination"
              value={destination}
            />
            <EmptySetting
              icon="calendar-outline"
              label="Duration"
              value={duration}
            />
          </View>

          <Text style={styles.metaLabel}>Interests</Text>
          <View style={styles.chipWrap}>
            {interestOptions.map((interest) => (
              <View key={interest} style={styles.interestChip}>
                <Text style={styles.interestChipText}>{interest}</Text>
              </View>
            ))}
          </View>

          <View style={styles.summaryDivider}>
            <View>
              <Text style={styles.metaLabel}>Group Members</Text>
              <View style={styles.avatarRow}>
                {memberAvatars.map((avatar) => (
                  <ImageBackground
                    key={avatar}
                    source={{ uri: avatar }}
                    imageStyle={{ borderRadius: 17 }}
                    style={styles.memberAvatar}
                  />
                ))}
                {params.extraCount ? (
                  <View style={styles.memberCountAvatar}>
                    <Text style={styles.memberCountText}>+{params.extraCount}</Text>
                  </View>
                ) : null}
                <View style={[styles.addAvatar, memberCount > 0 && styles.addAvatarWithMembers]}>
                  <Ionicons name="person-add-outline" size={16} color={colors.textMuted} />
                </View>
              </View>
              <Text style={styles.memberMeta}>
                {params.collaboratorLabel || `${memberCount || 1} member`}
              </Text>
            </View>

            <View style={styles.budgetBlock}>
              <Text style={styles.metaLabel}>Total Estimated Budget</Text>
              <Text style={styles.budgetText}>
                {budget} <Text style={styles.budgetSuffix}>/ person</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.dayHeader}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>01</Text>
          </View>
          <View style={styles.dayTitleWrap}>
            <Text style={styles.dayTitle}>Day 1: {tripTitle}</Text>
            <Text style={styles.dayDate}>{duration}</Text>
          </View>
          <Pressable hitSlop={8}>
            <Ionicons name="chevron-up" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.timelineWrap}>
          <View style={styles.timelineLine} />

          <View style={styles.timeBlock}>
            <View style={styles.timeHeader}>
              <View style={styles.timelineDot} />
              <Text style={styles.timeTitle}>
                Morning <Text style={styles.timeText}>- 09:00 AM</Text>
              </Text>
            </View>
            <ActivityPlaceholder />

            <View style={styles.transitPill}>
              <MaterialCommunityIcons
                name="train"
                size={16}
                color="#4F46E5"
              />
              <Text style={styles.transitText}>Add transit</Text>
              <Text style={styles.transitCost}>Est. $0.00</Text>
            </View>
          </View>

          <View style={styles.timeBlock}>
            <View style={styles.timeHeader}>
              <View style={styles.timelineDot} />
              <Text style={styles.timeTitle}>
                Afternoon <Text style={styles.timeText}>- 01:30 PM</Text>
              </Text>
            </View>
            <ActivityPlaceholder />
          </View>
        </View>

        <View style={styles.otherDays}>
          {[2, 3].map((day) => (
            <Pressable key={day} style={styles.dayPlaceholder}>
              <View style={styles.dayPlaceholderBadge}>
                <Text style={styles.dayPlaceholderText}>
                  {String(day).padStart(2, "0")}
                </Text>
              </View>
              <View style={styles.dayPlaceholderInfo}>
                <Text style={styles.dayPlaceholderTitle}>Day {day}: Empty</Text>
                <Text style={styles.dayPlaceholderMeta}>
                  No locations - Budget: $0
                </Text>
              </View>
              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
