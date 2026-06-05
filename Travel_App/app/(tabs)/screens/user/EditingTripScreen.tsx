import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { getApiErrorMessage } from '../../../../lib/api/client';
import {
  addPlaceToTripDay,
  deleteActivityFromDay,
  mapApiTripToDraft,
  removePlaceFromTripDay,
  upsertTripToBackend,
} from '../../../../lib/api/trips';
import { uploadTripCover } from '../../../../lib/api/uploads';
import {
  getSchedulePeriodFromTime,
  getTripDraft,
  ItineraryDay,
  normalizeTripDays,
  removeTripDraft,
  ScheduleLocation,
  subscribeTripDrafts,
  TripData,
  upsertTripDraft,
} from '../../store/tripDraftStore';
import styles from './EditingTripScreen.style';

type DateInputType = 'start' | 'end';
const WebDateInput = 'input' as any;
const LOCAL_TRIP_ID_PREFIX = 'local_trip_';

function isRemoteUrl(value?: string | null) {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim());
}

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
      title: existingDay?.title || `Day ${index + 1}`,
      date: getDayDate(startDate, index + 1),
      locations: existingDay?.locations || [],
    };
  });
}

function getVietnameseDayTitle(title: string, index: number) {
  const dayNumber = title.match(/\d+/)?.[0] ?? String(index + 1);
  return `Day ${dayNumber}`;
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

function getLocationSelectionId(location: ScheduleLocation) {
  return location.placeId || location.id;
}

function isLocalTripId(tripId?: string) {
  return Boolean(tripId?.startsWith(LOCAL_TRIP_ID_PREFIX));
}

function isUnsetTime(value?: string) {
  const normalized = String(value || '').trim().toLowerCase();
  return !normalized || normalized === 'time not set';
}

function parseSingleTimeMinutes(value: string) {
  const match = value.trim().match(/^(\d{1,2})(?::([0-5]\d))?\s*(AM|PM)?$/i);
  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3]?.toUpperCase();

  if (meridiem) {
    if (hour < 1 || hour > 12) {
      return null;
    }

    if (meridiem === 'PM' && hour < 12) {
      hour += 12;
    }

    if (meridiem === 'AM' && hour === 12) {
      hour = 0;
    }
  } else if (hour > 23) {
    return null;
  }

  return hour * 60 + minute;
}

function parseTimeRange(value?: string) {
  if (isUnsetTime(value)) {
    return null;
  }

  const parts = String(value).split(/\s*[-–]\s*/);
  if (parts.length > 2) {
    return null;
  }

  const startMinutes = parseSingleTimeMinutes(parts[0]);
  const endMinutes = parts[1] ? parseSingleTimeMinutes(parts[1]) : undefined;
  if (startMinutes === null || endMinutes === null) {
    return null;
  }

  if (endMinutes !== undefined && endMinutes < startMinutes) {
    return null;
  }

  return { startMinutes, endMinutes };
}

function isValidTimeInput(value?: string) {
  return isUnsetTime(value) || Boolean(parseTimeRange(value));
}

function getInvalidTimeLocationNames(days: ItineraryDay[]) {
  return days
    .flatMap((day) => day.locations)
    .filter((location) => !isValidTimeInput(location.time))
    .map((location) => location.name);
}

function buildAddPlaceBody(location: ScheduleLocation, sortOrder: number) {
  return {
    placeId: getLocationSelectionId(location),
    title: location.name,
    imageUrl: location.image || null,
    period: getSchedulePeriodFromTime(location.time, location.period),
    scheduledTime: location.time === 'Time not set' ? null : location.time,
    estimatedCost: getCostValue(location.cost),
    rating: Number(location.rating) || 0,
    sortOrder,
  };
}

function mergeApiTripIntoDraft(currentTrip: TripData, apiTrip: unknown) {
  return normalizeTripDays({
    ...currentTrip,
    ...mapApiTripToDraft(apiTrip as Parameters<typeof mapApiTripToDraft>[0]),
  } as TripData);
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
  const savedTripBaselineRef = useRef<TripData>(normalizeTripDays(incomingTrip));
  const hasFocusedOnceRef = useRef(false);
  const didSaveTripRef = useRef(false);
  const [isSavingTrip, setIsSavingTrip] = useState(false);
  const [isPickingTripCover, setIsPickingTripCover] = useState(false);
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

  const handlePickTripCover = async () => {
    if (isPickingTripCover || isSavingTrip) {
      return;
    }

    try {
      setIsPickingTripCover(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow photo access to choose a trip cover.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.85,
      });

      if (result.canceled) {
        return;
      }

      setSaveError(null);
      const coverUrl = result.assets[0].uri;
      const nextTrip = normalizeTripDays({
        ...trip,
        image: coverUrl,
        coverImageUrl: coverUrl,
      });

      setTrip(nextTrip);
      if (nextTrip.id) {
        upsertTripDraft(nextTrip);
      }
    } catch (error) {
      const message = getApiErrorMessage(error);
      setSaveError(message);
      Alert.alert('Unable to choose cover', message);
    } finally {
      setIsPickingTripCover(false);
    }
  };

  const updateDayTitle = (dayId: string, value: string) => {
    setTrip((current) => ({
      ...current,
      itineraryData: (current.itineraryData || itineraryData).map((day) =>
        day.dayId === dayId ? { ...day, title: value } : day
      ),
    }));
  };

  const updateLocationTime = (dayId: string, locationId: string, value: string) => {
    setSaveError(null);
    setTrip((current) => {
      const nextTrip = normalizeTripDays({
        ...current,
        itineraryData: (current.itineraryData || itineraryData).map((day) =>
          day.dayId === dayId
            ? {
                ...day,
                locations: day.locations.map((location) =>
                  getLocationSelectionId(location) === locationId
                    ? { ...location, time: value, period: getSchedulePeriodFromTime(value, location.period) }
                    : location
                ),
              }
            : day
        ),
      });

      if (nextTrip.id) {
        upsertTripDraft(nextTrip);
      }

      return nextTrip;
    });
  };

  useEffect(() => {
    if (route?.params?.tripData) {
      const normalizedTrip = normalizeTripDays(route.params.tripData);
      syncTripState(normalizedTrip);
      if (!route?.params?.draftOnly) {
        savedTripBaselineRef.current = normalizedTrip;
      }
    }
  }, [route?.params?.draftOnly, route?.params?.tripData, syncTripState]);

  useFocusEffect(
    useCallback(() => {
      const activeTripId = (route?.params?.tripData as TripData | undefined)?.id ?? trip.id;
      const isFirstFocus = !hasFocusedOnceRef.current;
      hasFocusedOnceRef.current = true;

      if (!activeTripId || (isFirstFocus && route?.params?.tripData && !route?.params?.draftOnly)) {
        return undefined;
      }

      const draft = getTripDraft(activeTripId);
      if (draft) {
        syncTripState(draft);
      }

      return undefined;
    }, [route?.params?.draftOnly, route?.params?.tripData, trip.id, syncTripState])
  );

  useEffect(() => {
    if (!trip.id) {
      return undefined;
    }

    return subscribeTripDrafts((draft) => {
      if (draft.id === trip.id) {
        syncTripState(draft);
      }
    });
  }, [syncTripState, trip.id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (!didSaveTripRef.current) {
        removeTripDraft(trip.id);
      }
    });

    return unsubscribe;
  }, [navigation, trip.id]);

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
        startDate: toWebDateValue(normalizedDate),
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
        endDate: toWebDateValue(normalizedDate),
        duration: nextDuration,
        date: startDate ? `${formatDate(startDate)} - ${formatDate(normalizedDate)}` : formatDate(normalizedDate),
        itineraryData: updateDayDates(current.itineraryData, nextDuration, startDate),
      }));
    }

    closeDatePicker();
  };

  const deleteLocation = (dayId: string, locationId: string) => {
    setTrip((current) => {
      const nextTrip = normalizeTripDays({
        ...current,
        itineraryData: (current.itineraryData || []).map((day) =>
          day.dayId === dayId
            ? {
                ...day,
                locations: day.locations.filter((location) => getLocationSelectionId(location) !== locationId),
              }
            : day
        ),
      });

      if (nextTrip.id) {
        upsertTripDraft(nextTrip);
      }

      return nextTrip;
    });
  };

  const saveTrip = async () => {
    if (isSavingTrip) {
      return;
    }

    const invalidTimeLocationNames = getInvalidTimeLocationNames(itineraryData);
    if (invalidTimeLocationNames.length) {
      const message = `Invalid time: ${invalidTimeLocationNames.join(', ')}. Use HH:mm or HH:mm - HH:mm.`;
      setSaveError(message);
      Alert.alert('Invalid time', message);
      return;
    }

    const updatedTrip = normalizeTripDays({
      ...trip,
      budget: totalEstimatedBudget,
      itineraryData,
    });

    if (!updatedTrip.id) {
      const message = 'Trip chua san sang de luu.';
      setSaveError(message);
      Alert.alert('Unable to save trip', message);
      return;
    }

    setIsSavingTrip(true);
    setSaveError(null);
    try {
      const coverImageUrl = updatedTrip.coverImageUrl || updatedTrip.image;
      const persistedCoverImageUrl =
        coverImageUrl && !isRemoteUrl(coverImageUrl)
          ? await uploadTripCover(coverImageUrl)
          : coverImageUrl;
      const tripWithPersistedCover = normalizeTripDays({
        ...updatedTrip,
        image: persistedCoverImageUrl,
        coverImageUrl: persistedCoverImageUrl,
      });
      const localDraftId = isLocalTripId(updatedTrip.id) ? updatedTrip.id : undefined;
      const backendTripId = localDraftId ? undefined : updatedTrip.id;
      const baselineTrip = normalizeTripDays(savedTripBaselineRef.current);
      const baselineDays = baselineTrip.itineraryData || [];
      const updatedDays = tripWithPersistedCover.itineraryData || [];
      const baselineDayMap = new Map(baselineDays.map((day) => [day.dayId, day]));
      const tripPayloadForMetadata = {
        ...tripWithPersistedCover,
        itineraryData: updatedDays.map((day) => ({
          ...day,
          locations: baselineDayMap.get(day.dayId)?.locations || [],
        })),
      };

      let savedTrip = await upsertTripToBackend(
        tripPayloadForMetadata as Record<string, unknown>,
        backendTripId
      );

      let persistedTrip = mergeApiTripIntoDraft(tripWithPersistedCover, savedTrip);
      syncTripState(persistedTrip);
      const persistedTripId = persistedTrip.id || updatedTrip.id;

      const persistedDays = persistedTrip.itineraryData || [];
      for (const [dayIndex, persistedDay] of persistedDays.entries()) {
        const intendedDay = updatedDays[dayIndex];
        if (!intendedDay) {
          continue;
        }

        const baselineDay = baselineDayMap.get(persistedDay.dayId) ?? baselineDayMap.get(intendedDay.dayId);
        const baselineIds = new Set((baselineDay?.locations || []).map(getLocationSelectionId));
        const currentIds = new Set(intendedDay.locations.map(getLocationSelectionId));

        const locationsToRemove = (baselineDay?.locations || []).filter(
          (location) => !currentIds.has(getLocationSelectionId(location))
        );
        const locationsToAdd = intendedDay.locations.filter(
          (location) => !baselineIds.has(getLocationSelectionId(location))
        );

        for (const location of locationsToRemove) {
          if (location.placeId) {
            savedTrip = await removePlaceFromTripDay(
              String(persistedTripId),
              persistedDay.dayId,
              location.placeId
            );
          } else if (location.id) {
            savedTrip = await deleteActivityFromDay(
              String(persistedTripId),
              persistedDay.dayId,
              String(location.id)
            );
          }
          persistedTrip = mergeApiTripIntoDraft(persistedTrip, savedTrip);
          syncTripState(persistedTrip);
        }

        for (const location of locationsToAdd) {
          savedTrip = await addPlaceToTripDay(
            String(persistedTripId),
            persistedDay.dayId,
            buildAddPlaceBody(location, intendedDay.locations.indexOf(location) + 1)
          );
          persistedTrip = mergeApiTripIntoDraft(persistedTrip, savedTrip);
          syncTripState(persistedTrip);
        }
      }

      if (persistedTrip.id) {
        upsertTripDraft(persistedTrip);
      }
      if (localDraftId) {
        removeTripDraft(localDraftId);
      }
      savedTripBaselineRef.current = persistedTrip;
      didSaveTripRef.current = true;
      if (typeof navigation.popTo === 'function') {
        navigation.popTo('PlanningTrip', { updatedTrip: persistedTrip });
      } else {
        navigation.navigate({
          name: 'PlanningTrip',
          params: { updatedTrip: persistedTrip },
          merge: true,
        });
      }
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
            disabled={isSavingTrip || isPickingTripCover}
            style={[styles.saveButton, (isSavingTrip || isPickingTripCover) && styles.saveButtonDisabled]}
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
              trip.coverImageUrl ||
              trip.image ||
              'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop',
          }}
          style={styles.heroCard}
          imageStyle={{ borderRadius: 16 }}
        >
          <View style={styles.heroOverlay}>
            <TouchableOpacity
              style={[styles.changeCoverButton, isPickingTripCover && styles.changeCoverButtonDisabled]}
              onPress={handlePickTripCover}
              disabled={isPickingTripCover || isSavingTrip}
            >
              {isPickingTripCover ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Feather name="camera" size={16} color="#FFFFFF" />
              )}
              <Text style={styles.changeCoverText}>
                {isPickingTripCover ? 'Choosing...' : 'Change cover'}
              </Text>
            </TouchableOpacity>
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
                <TextInput
                  value={day.title}
                  onChangeText={(value) => updateDayTitle(day.dayId, value)}
                  style={styles.dayTitleInput}
                  editable={!isSavingTrip}
                />
              </View>

              {day.locations.map((loc, locIndex) => {
                return (
                <View key={`editing-location-${day.dayId}-${loc.id}-${locIndex}`} style={styles.itineraryCard}>
                  <Image source={{ uri: loc.image }} style={styles.itineraryImage} />

                  <View style={styles.itineraryInfo}>
                    <View style={styles.itineraryTitleRow}>
                      <Text numberOfLines={1} style={styles.itineraryTitle}>{loc.name}</Text>
                      <View style={styles.itineraryRatingPill}>
                        <Ionicons name="star" size={12} color="#F97316" />
                        <Text style={styles.itineraryRating}>{loc.rating}</Text>
                      </View>
                    </View>
                    <View style={styles.itineraryLocationRow}>
                      <Ionicons name="location-outline" size={13} color="#64748B" />
                      <Text numberOfLines={1} style={styles.itineraryLocation}>
                        {loc.location || 'Location not set'}
                      </Text>
                    </View>

                    <View style={styles.itineraryDetailsRow}>
                      <View style={styles.detailPill}>
                        <Ionicons name="time-outline" size={13} color="#1E88E5" />
                        <TextInput
                          value={loc.time}
                          onChangeText={(value) =>
                            updateLocationTime(day.dayId, getLocationSelectionId(loc), value)
                          }
                          placeholder="Time not set"
                          editable={!isSavingTrip}
                          style={styles.timeInput}
                        />
                      </View>
                      <View style={styles.detailPill}>
                        <Ionicons name="cash-outline" size={13} color="#0F766E" />
                        <Text style={styles.budgetValue}>VND {formatBudget(getCostValue(loc.cost))}</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteLocation(day.dayId, getLocationSelectionId(loc))}
                  >
                    <Feather name="trash-2" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
                );
              })}

              <TouchableOpacity
                style={styles.addLocationBtn}
                onPress={() =>
                  navigation.navigate('AddLocation_user', {
                    tripData: normalizeTripDays({
                      ...trip,
                      itineraryData,
                    }),
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
                  Add place for {getVietnameseDayTitle(day.title, index)}
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
