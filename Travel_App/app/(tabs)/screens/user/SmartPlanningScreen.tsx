import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getApiErrorMessage } from '../../../../lib/api/client';
import { fetchFavorites } from '../../../../lib/api/favorites';
import {
  optimizeItinerary,
  OptimizationResult,
  OptimizeItineraryRequest,
} from '../../../../lib/api/itineraryOptimizer';
import { fetchPlaces } from '../../../../lib/api/places';
import type { PlaceListItem } from '../../../../lib/api/types';
import { createTrip, mapApiTripToDraft } from '../../../../lib/api/trips';
import { upsertTripDraft } from '../../store/tripDraftStore';
import { getPlaceCategoryLabel, normalizePlaceCategory, PLACE_CATEGORIES } from '../../../../lib/placeCategories';
import { useTheme } from '../../context/ThemeContext';
import getStyles from './SmartPlanningScreen.styles';

type DateInputType = 'start' | 'end';
const WebDateInput = 'input' as any;

type PlaceItem = {
  id: string;
  title: string;
  category: string;
  location: string;
  rating: string;
  imageUrl: string;
  cost: string;
};

function getPlaceCost(place: PlaceListItem) {
  const rawCost = place.cost ?? place.Cost ?? place.price ?? place.Price ?? place.priceLevel ?? place.PriceLevel;
  const value = Number(String(rawCost ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(value) ? String(value) : '0';
}

function mapPlaceToItem(place: PlaceListItem): PlaceItem {
  const category = normalizePlaceCategory(place.category || place.Category) ?? 'ATTRACTIONS';
  const id = place.Id || place.id;
  return {
    id,
    title: place.Name || place.name,
    category,
    location: place.Located || place.region,
    rating: String(place.Rate ?? place.averageRating ?? 0),
    imageUrl: place.image || place.coverImageUrl,
    cost: getPlaceCost(place),
  };
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

function formatVnd(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}p`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${mins}p`;
}

function formatTime(time: string) {
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return time;
  }
  let hour = Number(match[1]);
  const minute = match[2];
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${period}`;
}

export default function SmartPlanningScreen() {
  const { colors: themeColors } = useTheme();
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);

  const navigation = useNavigation();

  // Step management
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  // Form state - Step 1
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dailyStartTime, setDailyStartTime] = useState('08:00');
  const [dailyEndTime, setDailyEndTime] = useState('22:00');
  const [budget, setBudget] = useState('');

  // Date picker state
  const [activeDateInput, setActiveDateInput] = useState<DateInputType | null>(null);
  const [webPickerDate, setWebPickerDate] = useState<Date>(new Date());

  // Places state - Step 2
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [favoritePlaces, setFavoritePlaces] = useState<PlaceItem[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());
  const [preferenceWeights, setPreferenceWeights] = useState({
    ATTRACTIONS: 0.5,
    DINING: 0.5,
    FESTIVALS: 0.5,
    SHOPPING: 0.5,
  });

  // Result state - Step 3
  const [optimizedResult, setOptimizedResult] = useState<OptimizationResult | null>(null);

  // Load places
  useEffect(() => {
    async function loadPlaces() {
      setLoadingPlaces(true);
      try {
        const [placesData, favoritesData] = await Promise.all([
          fetchPlaces(),
          fetchFavorites(),
        ]);
        setPlaces(placesData.map(mapPlaceToItem));
        setFavoritePlaces(favoritesData.map(mapPlaceToItem));
      } catch (error) {
        Alert.alert('Lỗi', getApiErrorMessage(error));
      } finally {
        setLoadingPlaces(false);
      }
    }
    loadPlaces();
  }, []);

  // Filtered places
  const visiblePlaces = useMemo(() => {
    const source = filter === 'favorites' ? favoritePlaces : places;
    return source.filter((place) => {
      if (!categoryFilter) {
        return true;
      }
      return place.category === categoryFilter;
    });
  }, [filter, categoryFilter, places, favoritePlaces]);

  const selectedCount = selectedPlaces.size;

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
    setWebPickerDate(type === 'end' ? endDate || startDate || new Date() : startDate || new Date());
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
        Alert.alert('Ngày không hợp lệ', 'Ngày bắt đầu không thể là ngày trong quá khứ.');
        closeDatePicker();
        return;
      }

      if (endDate && normalizedDate > toStartOfDay(endDate)) {
        Alert.alert('Ngày không hợp lệ', 'Ngày bắt đầu không thể sau ngày kết thúc.');
        closeDatePicker();
        return;
      }

      setStartDate(normalizedDate);
    } else if (activeDateInput === 'end') {
      const minimumEndDate = getMinimumSelectableDate('end');
      if (normalizedDate < minimumEndDate) {
        Alert.alert('Ngày không hợp lệ', 'Ngày kết thúc không thể trước ngày bắt đầu.');
        closeDatePicker();
        return;
      }

      setEndDate(normalizedDate);
    }

    closeDatePicker();
  };

  const togglePlaceSelection = (placeId: string) => {
    setSelectedPlaces((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) {
        next.delete(placeId);
      } else {
        next.add(placeId);
      }
      return next;
    });
  };

  const handleContinueToStep2 = () => {
    if (!title.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên chuyến đi.');
      return;
    }
    if (!destination.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập điểm đến.');
      return;
    }
    if (!startDate) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn ngày bắt đầu.');
      return;
    }
    if (!endDate) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn ngày kết thúc.');
      return;
    }
    setStep(2);
  };

  const handleOptimize = async () => {
    if (selectedPlaces.size === 0) {
      Alert.alert('Thiếu địa điểm', 'Vui lòng chọn ít nhất một địa điểm để tối ưu hóa.');
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn ngày bắt đầu và ngày kết thúc.');
      return;
    }

    setOptimizing(true);
    try {
      const request: OptimizeItineraryRequest = {
        placeIds: Array.from(selectedPlaces),
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dailyStartTime,
        dailyEndTime,
        maxBudget: budget ? Number(budget.replace(/[^0-9.]/g, '')) : undefined,
        preferenceWeights,
      };

      const result = await optimizeItinerary(request);
      setOptimizedResult(result);
      setStep(3);
    } catch (error) {
      Alert.alert('Lỗi tối ưu hóa', getApiErrorMessage(error));
    } finally {
      setOptimizing(false);
    }
  };

  const handleApplyAndCreateTrip = async () => {
    if (!optimizedResult || !startDate || !endDate) {
      return;
    }

    setLoading(true);
    try {
      // Convert optimized result to trip format
      const tripPayload = {
        title: title.trim(),
        destination: destination.trim(),
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        budget: budget ? Number(budget.replace(/[^0-9.]/g, '')) : 0,
        currency: 'VND',
        hotel: 'Not selected',
        duration: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        members: [],
        itineraryData: optimizedResult.days.map((day) => ({
          dayId: `day_${day.dayNumber}`,
          title: `Ngày ${day.dayNumber}`,
          date: day.date,
          locations: day.activities.map((activity) => ({
            placeId: activity.placeId,
            title: activity.title,
            time: activity.scheduledTime,
            period: activity.period,
            cost: String(activity.estimatedCost),
            rating: 0,
            imageUrl: null,
          })),
        })),
      };

      // Create trip using createTrip (it internally normalizes the payload)
      const savedTrip = await createTrip(tripPayload);
      const tripDraft = mapApiTripToDraft(savedTrip);

      // Save locally
      upsertTripDraft(tripDraft as any);

      // Navigate to PlanningTrip screen
      (navigation as any).navigate('PlanningTrip', {
        tripId: tripDraft.id,
      });
    } catch (error) {
      Alert.alert('Lỗi tạo chuyến đi', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEdit = () => {
    setStep(2);
  };

  const renderStep1 = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Thông tin chuyến đi</Text>

      <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginBottom: 4 }}>Tên chuyến đi</Text>
      <TextInput
        style={styles.input}
        placeholder="VD: Khám phá Đà Lạt 3 ngày"
        placeholderTextColor={themeColors.textMuted}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginBottom: 4 }}>Điểm đến</Text>
      <TextInput
        style={styles.input}
        placeholder="VD: Đà Lạt, Lâm Đồng"
        placeholderTextColor={themeColors.textMuted}
        value={destination}
        onChangeText={setDestination}
      />

      <View style={styles.dateTimeRow}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginBottom: 4 }}>Ngày bắt đầu</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => openDatePicker('start')}
          >
            <Text style={{ color: startDate ? themeColors.textPrimary : themeColors.textMuted }}>
              {startDate ? formatDate(startDate) : 'YYYY-MM-DD'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginBottom: 4 }}>Ngày kết thúc</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => openDatePicker('end')}
          >
            <Text style={{ color: endDate ? themeColors.textPrimary : themeColors.textMuted }}>
              {endDate ? formatDate(endDate) : 'YYYY-MM-DD'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.dateTimeRow}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginBottom: 4 }}>Giờ bắt đầu/ngày</Text>
          <TextInput
            style={styles.input}
            placeholder="08:00"
            placeholderTextColor={themeColors.textMuted}
            value={dailyStartTime}
            onChangeText={setDailyStartTime}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginBottom: 4 }}>Giờ kết thúc/ngày</Text>
          <TextInput
            style={styles.input}
            placeholder="22:00"
            placeholderTextColor={themeColors.textMuted}
            value={dailyEndTime}
            onChangeText={setDailyEndTime}
          />
        </View>
      </View>

      <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginBottom: 4 }}>Ngân sách (VNĐ)</Text>
      <TextInput
        style={styles.input}
        placeholder="VD: 5000000"
        placeholderTextColor={themeColors.textMuted}
        value={budget}
        onChangeText={setBudget}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleContinueToStep2}
      >
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View>
      {/* Filter toggle */}
      <View style={styles.sectionCard}>
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <TouchableOpacity
            style={[styles.primaryButton, { flex: 1, marginRight: 8, padding: 10, backgroundColor: filter === 'all' ? themeColors.primary : themeColors.surfaceMuted }]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.buttonText, { color: filter === 'all' ? themeColors.white : themeColors.textSecondary }]}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, { flex: 1, marginLeft: 8, padding: 10, backgroundColor: filter === 'favorites' ? themeColors.primary : themeColors.surfaceMuted }]}
            onPress={() => setFilter('favorites')}
          >
            <Text style={[styles.buttonText, { color: filter === 'favorites' ? themeColors.white : themeColors.textSecondary }]}>Yêu thích</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 14, fontWeight: '600', color: themeColors.primary, marginTop: 4 }}>
          Đã chọn {selectedCount} địa điểm
        </Text>

        {/* Category filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
          <TouchableOpacity
            style={[styles.primaryButton, { marginRight: 8, padding: 8, paddingHorizontal: 16, backgroundColor: !categoryFilter ? themeColors.primary : themeColors.surfaceMuted }]}
            onPress={() => setCategoryFilter('')}
          >
            <Text style={[styles.buttonText, { fontSize: 13, color: !categoryFilter ? themeColors.white : themeColors.textSecondary }]}>Tất cả</Text>
          </TouchableOpacity>
          {PLACE_CATEGORIES.filter((cat) => cat.value !== 'STAYS').map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[styles.primaryButton, { marginRight: 8, padding: 8, paddingHorizontal: 16, backgroundColor: categoryFilter === cat.value ? themeColors.primary : themeColors.surfaceMuted }]}
              onPress={() => setCategoryFilter(cat.value)}
            >
              <Text style={[styles.buttonText, { fontSize: 13, color: categoryFilter === cat.value ? themeColors.white : themeColors.textSecondary }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Preference weights */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Trọng số ưu tiên</Text>
        {[
          { key: 'ATTRACTIONS', label: 'Điểm tham quan' },
          { key: 'DINING', label: 'Ẩm thực' },
          { key: 'FESTIVALS', label: 'Lễ hội' },
          { key: 'SHOPPING', label: 'Mua sắm' },
        ].map((item) => (
          <View key={item.key} style={styles.preferenceWeightRow}>
            <Text style={{ flex: 1, color: themeColors.textPrimary }}>{item.label}</Text>
            <TextInput
              style={styles.weightInput}
              value={String(preferenceWeights[item.key as keyof typeof preferenceWeights])}
              onChangeText={(text) => {
                const value = parseFloat(text);
                if (!isNaN(value) && value >= 0 && value <= 1) {
                  setPreferenceWeights((prev) => ({ ...prev, [item.key]: value }));
                }
              }}
              keyboardType="decimal-pad"
            />
          </View>
        ))}
      </View>

      {/* Places list */}
      {loadingPlaces ? (
        <View style={{ paddingVertical: 28, alignItems: 'center' }}>
          <ActivityIndicator size="small" color={themeColors.primary} />
        </View>
      ) : (
        <View style={styles.sectionCard}>
          {visiblePlaces.length === 0 ? (
            <Text style={{ textAlign: 'center', color: themeColors.textSecondary, padding: 20 }}>
              Không có địa điểm nào
            </Text>
          ) : (
            visiblePlaces.map((place) => {
              const isSelected = selectedPlaces.has(place.id);
              return (
                <TouchableOpacity
                  key={place.id}
                  style={[styles.placeItem, isSelected && styles.placeItemSelected]}
                  onPress={() => togglePlaceSelection(place.id)}
                >
                  <Image source={{ uri: place.imageUrl }} style={styles.placeImage} />
                  <View style={styles.placeInfo}>
                    <Text style={styles.placeName}>{place.title}</Text>
                    <Text style={styles.placeCategory}>{getPlaceCategoryLabel(place.category)}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <Ionicons name="star" size={12} color={themeColors.warning} />
                      <Text style={styles.placeRating}>{place.rating}</Text>
                    </View>
                  </View>
                  <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                    {isSelected && <Ionicons name="checkmark" size={16} color={themeColors.white} />}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}

      <TouchableOpacity
        style={[styles.primaryButton, optimizing && { opacity: 0.6 }]}
        onPress={handleOptimize}
        disabled={optimizing || selectedPlaces.size === 0}
      >
        {optimizing ? (
          <ActivityIndicator size="small" color={themeColors.white} />
        ) : (
          <Text style={styles.buttonText}>Tối ưu hóa</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => {
    if (!optimizedResult) {
      return null;
    }

    const { days, summary } = optimizedResult;

    return (
      <View>
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.totalPlaces}</Text>
            <Text style={styles.summaryLabel}>Địa điểm</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{formatDuration(summary.totalDuration)}</Text>
            <Text style={styles.summaryLabel}>Tổng thời gian</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{(summary.totalTravelDistance).toFixed(1)}km</Text>
            <Text style={styles.summaryLabel}>Quãng đường</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{formatVnd(summary.totalEstimatedCost)}</Text>
            <Text style={styles.summaryLabel}>Tổng chi phí</Text>
          </View>
        </View>

        {/* Warning for unassigned places */}
        {summary.unassignedPlaces.length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: themeColors.warningSoft }]}>
            <Text style={{ color: themeColors.warning, fontWeight: '600', marginBottom: 4 }}>
              Cảnh báo
            </Text>
            <Text style={{ color: themeColors.textSecondary, fontSize: 12 }}>
              {summary.unassignedPlaces.length} địa điểm không được phân công: {summary.unassignedPlaces.join(', ')}
            </Text>
          </View>
        )}

        {/* Day-by-day timeline */}
        {days.map((day, dayIndex) => (
          <View key={day.dayNumber} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>Ngày {day.dayNumber}</Text>
              <Text style={{ fontSize: 12, color: themeColors.textSecondary }}>{day.date}</Text>
            </View>

            <View style={styles.dayStats}>
              <View style={styles.dayStatItem}>
                <Ionicons name="time-outline" size={14} color={themeColors.textSecondary} />
                <Text style={styles.dayStatText}>{formatDuration(day.totalDuration)}</Text>
              </View>
              <View style={styles.dayStatItem}>
                <Ionicons name="cash-outline" size={14} color={themeColors.textSecondary} />
                <Text style={styles.dayStatText}>{formatVnd(day.totalEstimatedCost)} VNĐ</Text>
              </View>
              <View style={styles.dayStatItem}>
                <Ionicons name="navigate-outline" size={14} color={themeColors.textSecondary} />
                <Text style={styles.dayStatText}>{(day.totalTravelDistance).toFixed(1)}km</Text>
              </View>
            </View>

            {day.activities.map((activity, activityIndex) => (
              <View key={activityIndex}>
                <View style={styles.activityItem}>
                  <View style={{ marginRight: 8 }}>
                    <View style={styles.timelineDot} />
                    {activityIndex < day.activities.length - 1 && <View style={[styles.timelineLine, { backgroundColor: themeColors.border }]} />}
                  </View>
                  <View style={{ width: 55 }}>
                    <Text style={styles.activityTime}>{formatTime(activity.scheduledTime)}</Text>
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <View style={styles.activityMeta}>
                      <Text style={styles.activityMetaText}>
                        {formatDuration(activity.estimatedDuration)}
                      </Text>
                      <Text style={styles.activityMetaText}>•</Text>
                      <Text style={styles.activityMetaText}>{formatVnd(activity.estimatedCost)} VNĐ</Text>
                    </View>
                    {activity.travelFromPrevious > 0 && (
                      <Text style={styles.travelInfo}>
                        Di chuyển: {formatDuration(activity.travelFromPrevious)} • {(activity.travelDistance).toFixed(1)}km
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}

        {/* Action buttons */}
        <TouchableOpacity
          style={[styles.primaryButton, styles.applyButton, loading && { opacity: 0.6 }]}
          onPress={handleApplyAndCreateTrip}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={themeColors.white} />
          ) : (
            <Text style={styles.buttonText}>Áp dụng & Tạo chuyến đi</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: themeColors.surfaceMuted, marginTop: 8 }]}
          onPress={handleBackToEdit}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: themeColors.textPrimary }]}>Quay lại chỉnh sửa</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
      <View style={[styles.stepDot, step >= 2 && (step === 2 ? styles.stepDotActive : styles.stepDotCompleted)]} />
      <View style={[styles.stepDot, step >= 3 && (step === 3 ? styles.stepDotActive : styles.stepDotCompleted)]} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: themeColors.textPrimary }}>
          Lập kế hoạch thông minh
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
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
              backgroundColor: themeColors.overlay,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 16,
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 420,
                backgroundColor: themeColors.surface,
                borderRadius: 20,
                padding: 16,
                shadowColor: '#000',
                shadowOpacity: 0.18,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 10 },
                elevation: 8,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: themeColors.primary, marginBottom: 12 }}>
                {activeDateInput === 'start' ? 'Chọn ngày bắt đầu' : 'Chọn ngày kết thúc'}
              </Text>

              <View
                style={{
                  backgroundColor: themeColors.surfaceMuted,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: themeColors.border,
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
                    color: themeColors.textPrimary,
                    minHeight: 34,
                  }}
                />
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <TouchableOpacity onPress={closeDatePicker} style={{ paddingVertical: 10, paddingHorizontal: 14 }}>
                  <Text style={{ color: themeColors.textSecondary, fontWeight: '600' }}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleConfirmDate(webPickerDate)}
                  style={{
                    marginLeft: 12,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 10,
                    backgroundColor: themeColors.primary,
                  }}
                >
                  <Text style={{ color: themeColors.white, fontWeight: '700' }}>Áp dụng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        <DateTimePickerModal
          isVisible={Boolean(activeDateInput)}
          mode="date"
          date={webPickerDate}
          minimumDate={getMinimumSelectableDate(activeDateInput)}
          onConfirm={handleConfirmDate}
          onCancel={closeDatePicker}
        />
      )}
    </SafeAreaView>
  );
}
