import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getApiErrorMessage } from '../../../lib/api/client';
import { mapApiTripToDraft, upsertTripToBackend } from '../../../lib/api/trips';
import { getTripDraft, ItineraryDay, normalizeTripDays, TripData, upsertTripDraft } from '../store/tripDraftStore';
import styles from './EditingTripScreen.style';

type DateInputType = 'start' | 'end';
const WebDateInput = 'input' as any;

const defaultTrip: TripData = {
  title: 'New Trip',
  hotel: 'Not selected',
  duration: 1,
  budget: 0,
  currency: 'USD',
  members: [],
};

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function toStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getTodayDate() {
  return toStartOfDay(new Date());
}

function toWebDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromWebDateValue(value: string) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function parseDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getTripDayCount(startDate: Date | null, endDate: Date | null) {
  if (!startDate || !endDate) {
    return 1;
  }

  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const diffInDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return Math.max(diffInDays + 1, 1);
}

function getDayDate(startDate: Date | null, day: number) {
  if (!startDate) {
    return 'Date not set';
  }

  const date = new Date(startDate);
  date.setDate(startDate.getDate() + day - 1);
  return formatDate(date);
}

function buildEmptyDays(duration: number, startDate: Date | null = null): ItineraryDay[] {
  return Array.from({ length: Math.max(duration, 1) }, (_, index) => ({
    dayId: `day_${index + 1}`,
    title: `Day ${index + 1}`,
    date: getDayDate(startDate, index + 1),
    locations: [],
  }));
}

function updateDayDates(days: ItineraryDay[] | undefined, duration: number, startDate: Date | null) {
  const baseDays = days?.length ? days : buildEmptyDays(duration, startDate);

  return Array.from({ length: Math.max(duration, 1) }, (_, index) => {
    const existingDay = baseDays[index];

    return {
      dayId: existingDay?.dayId || `day_${index + 1}`,
      title: `Day ${index + 1}`,
      date: getDayDate(startDate, index + 1),
      locations: existingDay?.locations || [],
    };
  });
}

function getVietnameseDayTitle(title: string, index: number) {
  const dayNumber = title.match(/\d+/)?.[0] ?? String(index + 1);
  return `Ngày ${dayNumber}`;
}

function getCostValue(cost: string) {
  return Number(cost.replace(/[^0-9.]/g, '')) || 0;
}

function getTripTotalBudget(days: ItineraryDay[]) {
  return days.reduce(
    (tripSum, day) =>
      tripSum + day.locations.reduce((daySum, location) => daySum + getCostValue(location.cost), 0),
    0
  );
}

function formatBudget(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function EditingTripScreen({ navigation, route }: any) {
  const incomingTrip = {
    ...defaultTrip,
    ...(route?.params?.tripData as TripData | undefined),
  };
  const [startDate, setStartDate] = useState<Date | null>(parseDate(incomingTrip.startDate));
  const [endDate, setEndDate] = useState<Date | null>(parseDate(incomingTrip.endDate));
  const [activeDateInput, setActiveDateInput] = useState<DateInputType | null>(null);
  const [webPickerDate, setWebPickerDate] = useState<Date>(parseDate(incomingTrip.startDate) ?? new Date());
  const [trip, setTrip] = useState<TripData>(incomingTrip);
  const [isSavingTrip, setIsSavingTrip] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const itineraryData = trip.itineraryData?.length
    ? trip.itineraryData
    : buildEmptyDays(trip.duration, startDate);
  const totalEstimatedBudget = getTripTotalBudget(itineraryData);

  const syncTripState = useCallback((nextTrip: TripData | undefined) => {
    if (!nextTrip) {
      return;
    }

    setTrip(nextTrip);
    setStartDate(parseDate(nextTrip.startDate));
    setEndDate(parseDate(nextTrip.endDate));
  }, []);

  const updateText = (field: 'title' | 'hotel', value: string) => {
    setTrip((current) => ({
      ...current,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (route?.params?.tripData) {
      syncTripState(route.params.tripData);
    }
  }, [route?.params?.tripData, syncTripState]);

  useFocusEffect(
    useCallback(() => {
      const activeTripId = (route?.params?.tripData as TripData | undefined)?.id ?? trip.id;

      if (!activeTripId) {
        return undefined;
      }

      const draft = getTripDraft(activeTripId);
      if (draft) {
        syncTripState(draft);
      }

      return undefined;
    }, [route?.params?.tripData, trip.id, syncTripState])
  );

  useEffect(() => {
    if (!activeDateInput) {
      return;
    }

    setWebPickerDate(
      activeDateInput === 'end'
        ? endDate || startDate || new Date()
        : startDate || new Date()
    );
  }, [activeDateInput, endDate, startDate]);

  const getMinimumSelectableDate = useCallback((inputType: DateInputType | null) => {
    const today = getTodayDate();

    if (inputType === 'start') {
      return today;
    }

    if (inputType === 'end') {
      if (!startDate) {
        return today;
      }

      const normalizedStartDate = toStartOfDay(startDate);
      return normalizedStartDate > today ? normalizedStartDate : today;
    }

    return today;
  }, [startDate]);

  const openDatePicker = (type: DateInputType) => {
    setWebPickerDate(
      type === 'end'
        ? endDate || startDate || new Date()
        : startDate || new Date()
    );
    setActiveDateInput(type);
  };

  const closeDatePicker = () => {
    setActiveDateInput(null);
  };

  const handleConfirmDate = (date: Date) => {
    const normalizedDate = toStartOfDay(date);
    const today = getTodayDate();

    if (activeDateInput === 'start') {
      if (normalizedDate < today) {
        Alert.alert('Invalid date', 'Start date cannot be before today.');
        closeDatePicker();
        return;
      }

      if (endDate && normalizedDate > toStartOfDay(endDate)) {
        Alert.alert('Invalid date', 'Start date cannot be after end date.');
        closeDatePicker();
        return;
      }

      setStartDate(normalizedDate);
      const nextDuration = getTripDayCount(normalizedDate, endDate);
      setTrip((current) => ({
        ...current,
        startDate: normalizedDate.toISOString(),
        duration: nextDuration,
        date: endDate ? `${formatDate(normalizedDate)} - ${formatDate(endDate)}` : formatDate(normalizedDate),
        itineraryData: updateDayDates(current.itineraryData, nextDuration, normalizedDate),
      }));
    }

    if (activeDateInput === 'end') {
      const minimumEndDate = getMinimumSelectableDate('end');
      if (normalizedDate < minimumEndDate) {
        Alert.alert('Invalid date', 'End date cannot be before start date.');
        closeDatePicker();
        return;
      }

      setEndDate(normalizedDate);
      const nextDuration = getTripDayCount(startDate, normalizedDate);
      setTrip((current) => ({
        ...current,
        endDate: normalizedDate.toISOString(),
        duration: nextDuration,
        date: startDate ? `${formatDate(startDate)} - ${formatDate(normalizedDate)}` : formatDate(normalizedDate),
        itineraryData: updateDayDates(current.itineraryData, nextDuration, startDate),
      }));
    }

    closeDatePicker();
  };

  const deleteLocation = (dayId: string, locationId: string) => {
    setTrip((current) => ({
      ...current,
      itineraryData: (current.itineraryData || []).map((day) =>
        day.dayId === dayId
          ? {
              ...day,
              locations: day.locations.filter((location) => location.id !== locationId),
            }
          : day
      ),
    }));
  };

  const saveTrip = async () => {
    if (isSavingTrip) {
      return;
    }

    const updatedTrip = normalizeTripDays({
      ...trip,
      budget: totalEstimatedBudget,
      itineraryData,
    });

    setIsSavingTrip(true);
    setSaveError(null);
    try {
      const savedTrip = await upsertTripToBackend(
        updatedTrip as Record<string, unknown>,
        updatedTrip.id
      );
      const persistedTrip = normalizeTripDays({
        ...updatedTrip,
        ...mapApiTripToDraft(savedTrip),
      } as TripData);

      if (persistedTrip.id) {
        upsertTripDraft(persistedTrip);
      }
      navigation.navigate({
        name: 'PlanningTrip',
        params: { updatedTrip: persistedTrip },
        merge: true,
      });
    } catch (error) {
      const message = getApiErrorMessage(error);
      setSaveError(message);
      console.error('Save trip failed', error);
      Alert.alert('Unable to save trip', message);
    } finally {
      setIsSavingTrip(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <Feather name="chevron-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editing Itinerary</Text>
          <TouchableOpacity
            onPress={saveTrip}
            disabled={isSavingTrip}
            style={[styles.saveButton, isSavingTrip && styles.saveButtonDisabled]}
          >
            {isSavingTrip ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : null}
            <Text style={styles.saveButtonText}>
              {isSavingTrip ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ImageBackground
          source={{
            uri:
              trip.image ||
              'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop',
          }}
          style={styles.heroCard}
          imageStyle={{ borderRadius: 16 }}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{trip.title}</Text>
          </View>
        </ImageBackground>

        <View style={styles.section}>
          <Text style={styles.label}>Itinerary Name</Text>
          {saveError ? (
            <View style={{ marginBottom: 10, padding: 10, borderRadius: 8, backgroundColor: '#FEE2E2' }}>
              <Text style={{ color: '#991B1B', fontWeight: '600' }}>{saveError}</Text>
            </View>
          ) : null}
          <View style={styles.inputBox}>
            <TextInput
              value={trip.title}
              onChangeText={(value) => updateText('title', value)}
              style={styles.inputText}
            />
          </View>

          <Text style={styles.label}>Time</Text>
          <View style={styles.datePickerRow}>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => openDatePicker('start')}
            >
              <Feather name="calendar" size={18} color="#1E88E5" style={styles.inputIcon} />
              <View>
                <Text style={styles.datePickerLabel}>Start date</Text>
                <Text style={styles.inputText}>
                  {startDate ? formatDate(startDate) : 'Choose date'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => openDatePicker('end')}
            >
              <Feather name="calendar" size={18} color="#1E88E5" style={styles.inputIcon} />
              <View>
                <Text style={styles.datePickerLabel}>End date</Text>
                <Text style={styles.inputText}>
                  {endDate ? formatDate(endDate) : 'Choose date'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Hotel</Text>
          <View style={styles.inputBox}>
            <Ionicons name="bed-outline" size={18} color="#1E88E5" style={styles.inputIcon} />
            <TextInput
              value={trip.hotel}
              onChangeText={(value) => updateText('hotel', value)}
              style={styles.inputText}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.scheduleTitleRow}>
            <Text style={styles.sectionTitle}>Detail Schedule</Text>
            <Text style={styles.durationHint}>{trip.duration} Days</Text>
          </View>

          {itineraryData.map((day, index) => (
            <View key={day.dayId} style={styles.dayContainer}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{day.title}</Text>
              </View>

              {day.locations.map((loc) => (
                <View key={loc.id} style={styles.itineraryCard}>
                  <Image source={{ uri: loc.image }} style={styles.itineraryImage} />

                  <View style={styles.itineraryInfo}>
                    <Text style={styles.itineraryTitle}>{loc.name}</Text>
                    <View style={styles.itineraryRatingRow}>
                      <Ionicons name="star" size={12} color="#F97316" />
                      <Text style={styles.itineraryRating}>{loc.rating}</Text>
                    </View>

                    <View style={styles.itineraryDetailsRow}>
                      <View>
                        <Text style={styles.detailLabel}>TIME</Text>
                        <Text style={styles.detailValue}>{loc.time}</Text>
                      </View>
                      <View style={{ marginLeft: 20 }}>
                        <Text style={styles.detailLabel}>ESTIMATED BUDGET</Text>
                        <Text style={styles.detailValue}>VND: {formatBudget(getCostValue(loc.cost))}</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteLocation(day.dayId, loc.id)}
                  >
                    <Feather name="trash-2" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addLocationBtn}
                onPress={() =>
                  navigation.navigate('AddLocation_user', {
                    tripData: trip,
                    tripId: trip.id,
                    tripTitle: trip.title,
                    dayId: day.dayId,
                    dayTitle: day.title,
                    dayDate: day.date,
                  })
                }
                disabled={isSavingTrip}
              >
                <View style={styles.addLocationIconWrap}>
                  <Feather name="map-pin" size={15} color="#1E88E5" />
                </View>
                <Text style={styles.addLocationText}>
                  Thêm địa điểm cho {getVietnameseDayTitle(day.title, index)}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Total estimated budget</Text>
          <View style={styles.budgetCard}>
            <View style={styles.budgetIconContainer}>
              <MaterialCommunityIcons name="cash" size={24} color="#FFF" />
            </View>
            <View style={styles.budgetInfo}>
              <Text style={styles.budgetAmount}>VND: {formatBudget(totalEstimatedBudget)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Collaborators</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {trip.members.length < 10 ? `0${trip.members.length}` : trip.members.length}
            </Text>
          </View>
        </View>

        <View style={styles.membersRow}>
          <View style={styles.avatarsContainer}>
            {trip.members.slice(0, 3).map((collab, index) => (
              <Image
                key={collab.id}
                source={{ uri: collab.avatar }}
                style={[
                  styles.avatar,
                  index > 0 && styles.avatarOverlap,
                  { zIndex: 10 - index },
                ]}
              />
            ))}

            {trip.members.length > 3 && (
              <View
                style={[
                  styles.avatar,
                  styles.avatarOverlap,
                  styles.extraCountContainer,
                  { zIndex: 7 },
                ]}
              >
                <Text style={styles.extraCountText}>+{trip.members.length - 3}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.addMemberContainer}
            onPress={() =>
              navigation.navigate('AddCollaborators', {
                tripData: trip,
              })
            }
            disabled={isSavingTrip}
          >
            <View style={styles.addMemberIconBtn}>
              <Feather name="user-plus" size={16} color="#1E88E5" />
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.addMemberTitle}>Add member</Text>
              <Text style={styles.addMemberSub}>Invite friends to join</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {Platform.OS === 'web' ? (
        <Modal
          transparent
          animationType="fade"
          visible={Boolean(activeDateInput)}
          onRequestClose={closeDatePicker}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 16,
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 420,
                backgroundColor: '#FFF',
                borderRadius: 20,
                padding: 16,
                shadowColor: '#000',
                shadowOpacity: 0.18,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 10 },
                elevation: 8,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E88E5', marginBottom: 12 }}>
                {activeDateInput === 'start' ? 'Choose start date' : 'Choose end date'}
              </Text>

              <View
                style={{
                  backgroundColor: '#F4F7FB',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#D8E2F0',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              >
                <WebDateInput
                  type="date"
                  value={toWebDateValue(webPickerDate)}
                  min={toWebDateValue(getMinimumSelectableDate(activeDateInput))}
                  onChange={(event: any) => {
                    const nextDate = fromWebDateValue(event?.target?.value || '');
                    if (nextDate) {
                      setWebPickerDate(nextDate);
                    }
                  }}
                  style={{
                    width: '100%',
                    fontSize: 16,
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: '#1f2937',
                    minHeight: 34,
                  }}
                />
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <TouchableOpacity onPress={closeDatePicker} style={{ paddingVertical: 10, paddingHorizontal: 14 }}>
                  <Text style={{ color: '#666', fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleConfirmDate(webPickerDate)}
                  style={{
                    marginLeft: 12,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 10,
                    backgroundColor: '#1E88E5',
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: '700' }}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        <DateTimePickerModal
          isVisible={Boolean(activeDateInput)}
          mode="date"
          date={
            activeDateInput === 'end'
              ? endDate || startDate || new Date()
              : startDate || new Date()
          }
          minimumDate={getMinimumSelectableDate(activeDateInput)}
          onConfirm={handleConfirmDate}
          onCancel={closeDatePicker}
        />
      )}
    </SafeAreaView>
  );
}
