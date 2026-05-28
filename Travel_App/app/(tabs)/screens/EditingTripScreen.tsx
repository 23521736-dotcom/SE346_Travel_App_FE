import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  Image,
  ImageBackground,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ItineraryDay, normalizeTripDays, TripData, upsertTripDraft } from '../store/tripDraftStore';
import styles from './EditingTripScreen.style';

type DateInputType = 'start' | 'end';

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

export default function EditingTripScreen({ navigation, route }: any) {
  const incomingTrip = {
    ...defaultTrip,
    ...(route?.params?.tripData as TripData | undefined),
  };
  const [startDate, setStartDate] = useState<Date | null>(parseDate(incomingTrip.startDate));
  const [endDate, setEndDate] = useState<Date | null>(parseDate(incomingTrip.endDate));
  const [activeDateInput, setActiveDateInput] = useState<DateInputType | null>(null);
  const [trip, setTrip] = useState<TripData>(incomingTrip);
  const itineraryData = trip.itineraryData?.length
    ? trip.itineraryData
    : buildEmptyDays(trip.duration, startDate);

  const updateText = (field: 'title' | 'hotel', value: string) => {
    setTrip((current) => ({
      ...current,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (route?.params?.tripData) {
      setTrip(route.params.tripData);
    }
  }, [route?.params?.tripData]);

  const updateNumber = (field: 'duration' | 'budget', value: string) => {
    const nextValue = Number(value.replace(/[^0-9]/g, '')) || 0;

    setTrip((current) => ({
      ...current,
      [field]: nextValue,
      itineraryData:
        field === 'duration' && !current.itineraryData?.some((day) => day.locations.length > 0)
          ? buildEmptyDays(nextValue)
          : current.itineraryData,
    }));
  };

  const closeDatePicker = () => {
    setActiveDateInput(null);
  };

  const handleConfirmDate = (date: Date) => {
    if (activeDateInput === 'start') {
      if (endDate && date > endDate) {
        Alert.alert('Invalid date', 'Start date cannot be after end date.');
        closeDatePicker();
        return;
      }

      setStartDate(date);
      const nextDuration = getTripDayCount(date, endDate);
      setTrip((current) => ({
        ...current,
        startDate: date.toISOString(),
        duration: nextDuration,
        date: endDate ? `${formatDate(date)} - ${formatDate(endDate)}` : formatDate(date),
        itineraryData: updateDayDates(current.itineraryData, nextDuration, date),
      }));
    }

    if (activeDateInput === 'end') {
      if (startDate && date < startDate) {
        Alert.alert('Invalid date', 'End date cannot be before start date.');
        closeDatePicker();
        return;
      }

      setEndDate(date);
      const nextDuration = getTripDayCount(startDate, date);
      setTrip((current) => ({
        ...current,
        endDate: date.toISOString(),
        duration: nextDuration,
        date: startDate ? `${formatDate(startDate)} - ${formatDate(date)}` : formatDate(date),
        itineraryData: updateDayDates(current.itineraryData, nextDuration, startDate),
      }));
    }

    closeDatePicker();
  };

  const deleteLocation = (dayId: string, locationId: string) => {
    setTrip((current) => ({
      ...current,
      itineraryData: itineraryData.map((day) =>
        day.dayId === dayId
          ? {
              ...day,
              locations: day.locations.filter((location) => location.id !== locationId),
            }
          : day
      ),
    }));
  };

  const saveTrip = () => {
    const updatedTrip = normalizeTripDays({
      ...trip,
      itineraryData,
    });

    upsertTripDraft(updatedTrip);
    navigation.navigate({
      name: 'PlanningTrip',
      params: { updatedTrip },
      merge: true,
    });
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
          <TouchableOpacity onPress={saveTrip}>
            <Text style={styles.addText}>Save</Text>
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
            <Text style={styles.heroSubtitle}>Current Trip</Text>
            <Text style={styles.heroTitle}>{trip.title}</Text>
          </View>
        </ImageBackground>

        <View style={styles.section}>
          <Text style={styles.label}>Itinerary Name</Text>
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
              onPress={() => setActiveDateInput('start')}
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
              onPress={() => setActiveDateInput('end')}
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
          <Text style={styles.durationHint}>{trip.duration} Days</Text>

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
          <Text style={styles.sectionTitle}>Detailed schedule</Text>

          {itineraryData.map((day) => (
            <View key={day.dayId} style={styles.dayContainer}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{day.title}</Text>
              </View>

              {day.locations.map((loc) => (
                <View key={loc.id} style={styles.itineraryCard}>
                  <Image source={{ uri: loc.image }} style={styles.itineraryImage} />

                  <View style={styles.itineraryInfo}>
                    <Text style={styles.itineraryTitle}>{loc.name}</Text>
                    <Text style={styles.itineraryRating}>{loc.rating}</Text>

                    <View style={styles.itineraryDetailsRow}>
                      <View>
                        <Text style={styles.detailLabel}>TIME</Text>
                        <Text style={styles.detailValue}>{loc.time}</Text>
                      </View>
                      <View style={{ marginLeft: 20 }}>
                        <Text style={styles.detailLabel}>ESTIMATED BUDGET</Text>
                        <Text style={styles.detailValue}>{loc.cost}</Text>
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
                    tripId: trip.id,
                    tripTitle: trip.title,
                    dayId: day.dayId,
                    dayTitle: day.title,
                    dayDate: day.date,
                  })
                }
              >
                <Feather name="map-pin" size={16} color="#1E88E5" style={{ marginRight: 8 }} />
                <Text style={styles.addLocationText}>Add location for {day.title}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estimated budget</Text>
          <View style={styles.budgetCard}>
            <View style={styles.budgetIconContainer}>
              <MaterialCommunityIcons name="cash" size={24} color="#FFF" />
            </View>
            <View style={styles.budgetInfo}>
              <TextInput
                keyboardType="number-pad"
                value={String(trip.budget)}
                onChangeText={(value) => updateNumber('budget', value)}
                style={styles.budgetAmount}
              />
              <Text style={styles.budgetCurrency}>{trip.currency || 'USD'} / person</Text>
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

      <DateTimePickerModal
        isVisible={Boolean(activeDateInput)}
        mode="date"
        date={
          activeDateInput === 'end'
            ? endDate || startDate || new Date()
            : startDate || new Date()
        }
        minimumDate={activeDateInput === 'end' && startDate ? startDate : undefined}
        onConfirm={handleConfirmDate}
        onCancel={closeDatePicker}
      />
    </SafeAreaView>
  );
}
