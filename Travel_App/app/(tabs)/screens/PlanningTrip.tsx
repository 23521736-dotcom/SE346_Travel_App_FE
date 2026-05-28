import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "../common/colors";
import styles from "./PlanningTrip.styles";

const defaultInterestOptions = ["Shopping", "Hiking", "Sightseeing"];
const interestOptions = [
  ...defaultInterestOptions,
  "Food",
  "Museum",
  "Beach",
  "Photography",
  "Nightlife",
  "Adventure",
  "Culture",
  "Relaxation",
];

type TimeSlot = "morning" | "afternoon";
type DateInputType = "start" | "end";

type PlanningTripParams = {
  id?: string;
  title?: string;
  destination?: string;
  date?: string;
  image?: string;
  statusLabel?: string;
  collaboratorLabel?: string;
  memberAvatars?: string[];
  extraCount?: number;
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTripDayCount(startDate: Date | null, endDate: Date | null) {
  if (!startDate || !endDate) {
    return 1;
  }

  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );
  const diffInDays = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  return Math.max(diffInDays + 1, 1);
}

function getDayDate(startDate: Date | null, day: number) {
  if (!startDate) {
    return "Choose start and end date";
  }

  const date = new Date(startDate);
  date.setDate(startDate.getDate() + day - 1);
  return formatDate(date);
}

function SettingButton({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.settingBlock}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Pressable style={styles.settingButton} onPress={onPress}>
        <View style={styles.settingRow}>
          <Ionicons name={icon} size={20} color={colors.primary} />
          <Text numberOfLines={1} style={styles.settingValue}>
            {value}
          </Text>
        </View>
        {/* <Ionicons name="chevron-down" size={16} color={colors.textMuted} /> */}
      </Pressable>
    </View>
  );
}

function ActivityPlaceholder({
  onPress,
  onAddSuggestion,
}: {
  onPress: () => void;
  onAddSuggestion: () => void;
}) {
  return (
    <Pressable style={styles.activityCard} onPress={onPress}>
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
            <Pressable style={styles.splitButton} onPress={onPress}>
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
        {/* <Text style={styles.nearbyLabel}>Nearby</Text> */}
        <Pressable style={styles.addPlaceButton} onPress={onAddSuggestion}>
          <Ionicons name="add-circle-outline" size={13} color={colors.primary} />
          <Text style={styles.addPlaceButtonText}>Add new place</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function PlanningTrip({ navigation, route }: any) {
  const params = (route?.params || {}) as PlanningTripParams;
  const tripTitle = params.title || "New Trip";
  const [destination] = useState(params.destination || "Not selected");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [budget, setBudget] = useState("0");
  const [activeDateInput, setActiveDateInput] = useState<DateInputType | null>(
    null
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    defaultInterestOptions
  );
  const [draftInterests, setDraftInterests] = useState<string[]>(
    defaultInterestOptions
  );
  const [isInterestModalVisible, setInterestModalVisible] = useState(false);
  const [activitiesByDay, setActivitiesByDay] = useState<
    Record<number, Record<TimeSlot, number>>
  >({
    1: { morning: 1, afternoon: 1 },
  });
  const statusLabel = params.statusLabel || "New";
  const memberAvatars = params.memberAvatars || [];
  const memberCount = memberAvatars.length + (params.extraCount || 0);
  const tripDayCount = getTripDayCount(startDate, endDate);
  const tripDays = Array.from({ length: tripDayCount }, (_, index) => index + 1);

  const showInactiveFeature = () => {
    Alert.alert("feature is inactive now");
  };

  const openDatePicker = (inputType: DateInputType) => {
    setActiveDateInput(inputType);
  };

  const closeDatePicker = () => {
    setActiveDateInput(null);
  };

  const handleConfirmDate = (date: Date) => {
    if (activeDateInput === "start") {
      if (endDate && date > endDate) {
        Alert.alert("Invalid date", "Start date cannot be after end date.");
        closeDatePicker();
        return;
      }

      setStartDate(date);
    }

    if (activeDateInput === "end") {
      if (startDate && date < startDate) {
        Alert.alert("Invalid date", "End date cannot be before start date.");
        closeDatePicker();
        return;
      }

      setEndDate(date);
    }

    closeDatePicker();
  };

  const toggleDay = (day: number) => {
    setSelectedDay((current) => (current === day ? null : day));
  };

  const getSlotCount = (day: number, slot: TimeSlot) => {
    return activitiesByDay[day]?.[slot] || 1;
  };

  const addActivityPlaceholder = (day: number, slot: TimeSlot) => {
    setActivitiesByDay((current) => {
      const currentDay = current[day] || { morning: 1, afternoon: 1 };

      return {
        ...current,
        [day]: {
          ...currentDay,
          [slot]: currentDay[slot] + 1,
        },
      };
    });
  };

  const openInterestModal = () => {
    setDraftInterests(selectedInterests);
    setInterestModalVisible(true);
  };

  const toggleDraftInterest = (interest: string) => {
    setDraftInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const saveInterests = () => {
    setSelectedInterests(draftInterests);
    setInterestModalVisible(false);
  };

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
        <Text style={styles.headerTitle}>PlanningTrip</Text>
        <Pressable
          hitSlop={10}
          style={styles.headerSaveButton}
          onPress={showInactiveFeature}
        >
          <Text style={styles.headerSaveText}>Save</Text>
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
            <Pressable style={styles.autoFillButton} onPress={showInactiveFeature}>
              <MaterialCommunityIcons
                name="auto-fix"
                size={15}
                color={colors.success}
              />
              <Text style={styles.autoFillButtonText}>AutoFill</Text>
            </Pressable>
          </View>

          <View style={styles.settingsGrid}>
           <SettingButton
              icon="location-outline"
              label="Destination"
              value={destination}
              onPress={showInactiveFeature}
            />
          </View>

          <View style={styles.settingsGrid}>
            <SettingButton
              icon="calendar-outline"
              label="Start date"
              value={startDate ? formatDate(startDate) : "Choose date"}
              onPress={() => openDatePicker("start")}
            />

             <SettingButton
              icon="calendar-outline"
              label="End date"
              value={endDate ? formatDate(endDate) : "Choose date"}
              onPress={() => openDatePicker("end")}
            />
          </View>

          <Text style={styles.metaLabel}>Interests</Text>
          <View style={styles.chipWrap}>
            {selectedInterests.map((interest) => (
              <Pressable
                key={interest}
                style={styles.interestChip}
                onPress={openInterestModal}
              >
                <Text style={styles.interestChipText}>{interest}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.addPlaceButton} onPress={openInterestModal}>
              <Ionicons name="add" size={14} color={colors.primary} />
            </Pressable>
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
                <Pressable
                  style={[
                    styles.addAvatar,
                    memberCount > 0 && styles.addAvatarWithMembers,
                  ]}
                  onPress={showInactiveFeature}
                >
                  <Ionicons
                    name="person-add-outline"
                    size={16}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>
              <Text style={styles.memberMeta}>
                {params.collaboratorLabel || `${memberCount || 1} member`}
              </Text>
            </View>

            <View style={styles.budgetBlock}>
              <Text style={styles.metaLabel}>Total Estimated Budget</Text>
              <TextInput
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
                placeholder="0"
                style={styles.budgetInput}
              />
            </View>
          </View>
        </View>

        <View style={styles.daysList}>
          {tripDays.map((day) => {
            const isExpanded = selectedDay === day;
            const totalActivityCount =
              getSlotCount(day, "morning") + getSlotCount(day, "afternoon");

            return (
              <View key={day} style={styles.daySection}>
                <Pressable
                  style={isExpanded ? styles.dayHeader : styles.dayPlaceholder}
                  onPress={() => toggleDay(day)}
                >
                  <View
                    style={
                      isExpanded ? styles.dayBadge : styles.dayPlaceholderBadge
                    }
                  >
                    <Text
                      style={
                        isExpanded
                          ? styles.dayBadgeText
                          : styles.dayPlaceholderText
                      }
                    >
                      {String(day).padStart(2, "0")}
                    </Text>
                  </View>
                  <View
                    style={
                      isExpanded
                        ? styles.dayTitleWrap
                        : styles.dayPlaceholderInfo
                    }
                  >
                    <Text
                      style={
                        isExpanded ? styles.dayTitle : styles.dayPlaceholderTitle
                      }
                    >
                      Day {day}: {isExpanded ? tripTitle : "Empty"}
                    </Text>
                    <Text
                      style={
                        isExpanded ? styles.dayDate : styles.dayPlaceholderMeta
                      }
                    >
                      {isExpanded
                        ? `${totalActivityCount} locations - Budget: $0`
                        : getDayDate(startDate, day)}
                    </Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>

                {isExpanded ? (
                  <View style={styles.timelineWrap}>
                    <View style={styles.timelineLine} />

                    {(["morning", "afternoon"] as TimeSlot[]).map((slot) => (
                      <View key={`${day}-${slot}`} style={styles.timeBlock}>
                        <View style={styles.timeHeader}>
                          <View style={styles.timelineDot} />
                          <Text style={styles.timeTitle}>
                            {slot === "morning" ? "Morning" : "Afternoon"}{" "}
                            <Text style={styles.timeText}>
                              - {slot === "morning" ? "09:00 AM" : "01:30 PM"}
                            </Text>
                          </Text>
                        </View>

                        {Array.from({ length: getSlotCount(day, slot) }).map(
                          (_, index) => (
                            <ActivityPlaceholder
                              key={`${day}-${slot}-${index}`}
                              onPress={showInactiveFeature}
                              onAddSuggestion={() =>
                                addActivityPlaceholder(day, slot)
                              }
                            />
                          )
                        )}

                        {/* {slot === "morning" ? (
                          <Pressable
                            style={styles.transitPill}
                            onPress={showInactiveFeature}
                          >
                            <MaterialCommunityIcons
                              name="train"
                              size={16}
                              color="#4F46E5"
                            />
                            <Text style={styles.transitText}>Add transit</Text>
                            <Text style={styles.transitCost}>Est. $0.00</Text>
                          </Pressable>
                        ) : null} */}
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <DateTimePickerModal
        isVisible={Boolean(activeDateInput)}
        mode="date"
        date={
          activeDateInput === "end"
            ? endDate || startDate || new Date()
            : startDate || new Date()
        }
        minimumDate={activeDateInput === "end" && startDate ? startDate : undefined}
        onConfirm={handleConfirmDate}
        onCancel={closeDatePicker}
      />

      <Modal
        transparent
        animationType="fade"
        visible={isInterestModalVisible}
        onRequestClose={() => setInterestModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(15, 23, 42, 0.35)",
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 22,
              padding: 18,
            }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Interests</Text>
              <Pressable onPress={() => setInterestModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.chipWrap}>
              {interestOptions.map((interest) => {
                const isSelected = draftInterests.includes(interest);

                return (
                  <Pressable
                    key={interest}
                    style={[
                      styles.interestChip,
                      !isSelected && {
                        backgroundColor: "#F8FAFC",
                        borderWidth: 1,
                        borderColor: colors.borderLight,
                      },
                    ]}
                    onPress={() => toggleDraftInterest(interest)}
                  >
                    <Text
                      style={[
                        styles.interestChipText,
                        !isSelected && { color: colors.textSecondary },
                      ]}
                    >
                      {interest}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable style={styles.headerSaveButton} onPress={saveInterests}>
              <Text style={styles.headerSaveText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
