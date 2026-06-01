import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { formatDate } from '@/lib/service/PromotionShedule';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { colors } from '../common/colors';
import PromotionCard from "../components/PromotionCard";
import PromotionEditor from '../components/PromotionEditor';
import type { PromotionItem } from '../types/promotion';
import { styles } from './AddLocationScreen.style';
import { getApiErrorMessage } from '../../../lib/api/client';
import {
  createOwnerPlace,
  createPromotion,
  deletePromotion,
  fetchOwnerPlace,
  togglePromotion,
  updateOwnerPlace,
  updatePromotion,
} from '../../../lib/api/owner';
import type { OwnerPlace } from '../../../lib/api/owner';
import { uploadPlaceCover } from '../../../lib/api/uploads';
import { DEFAULT_PLACE_CATEGORY, getPlaceCategoryLabel, normalizePlaceCategory, PLACE_CATEGORIES } from '../../../lib/placeCategories';

const AddLocationScreen = ({ navigation, route }: any) => {
  const placeParam = route?.params?.place as OwnerPlace | undefined;
  const placeId = route?.params?.placeId ?? placeParam?.Id;
  const [placeName, setPlaceName] = useState(placeParam?.Name ?? '');
  const [region, setRegion] = useState(placeParam?.Location ?? '');
  const [description, setDescription] = useState('');
  const [activeCategory, setActiveCategory] = useState('DINING');
  const [coverImageUrl, setCoverImageUrl] = useState(placeParam?.Image ?? '');
  const [imageUrls, setImageUrls] = useState<string[]>(placeParam?.Images ?? []);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!placeId) return;

    let isMounted = true;

    const loadPlace = async () => {
      if (placeParam) {
        setPlaceName(placeParam.Name ?? '');
        setRegion(placeParam.Location ?? '');
        setCoverImageUrl(placeParam.Image ?? '');
        setImageUrls(placeParam.Images ?? []);
        setPromotions([]);
      }

      try {
        const detail = await fetchOwnerPlace(placeId);
        if (!isMounted) return;

        setPlaceName(detail.Name ?? '');
        setRegion(detail.Location ?? '');
        setActiveCategory(normalizePlaceCategory(detail.category) ?? DEFAULT_PLACE_CATEGORY);
        setDescription(detail.about ?? '');
        setCoverImageUrl(detail.Image ?? '');
        setImageUrls(detail.Images ?? []);
        setPromotions(detail.promotions ?? []);
      } catch {
        if (!isMounted || !placeParam) return;
        setPlaceName(placeParam.Name ?? '');
        setRegion(placeParam.Location ?? '');
        setCoverImageUrl(placeParam.Image ?? '');
        setImageUrls(placeParam.Images ?? []);
      }
    };

    loadPlace();

    return () => {
      isMounted = false;
    };
  }, [placeId, placeParam]);

  const handleToggle = async (id: string) => {
    const current = promotions.find((promo) => promo.id === id);
    if (!current) return;

    setPromotions(prevPromos =>
      prevPromos.map(promo =>
        promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
      )
    );

    if (!placeId || id.startsWith('temp-')) return;

    try {
      const updated = await togglePromotion(id);
      setPromotions(prevPromos => prevPromos.map(promo => promo.id === id ? updated : promo));
    } catch (err) {
      setPromotions(prevPromos =>
        prevPromos.map(promo => promo.id === id ? current : promo)
      );
      Alert.alert('Loi', getApiErrorMessage(err));
    }
  };

  const handleSave = async (id: string | null, newData: Partial<PromotionItem>) => {
    if (!newData.title || !newData.schedule) return;

    const body = {
      title: newData.title,
      isActive: newData.isActive ?? promotions.find((promo) => promo.id === id)?.isActive ?? true,
      schedule: newData.schedule,
    };

    try {
      if (id) {
        if (placeId && !id.startsWith('temp-')) {
          const updated = await updatePromotion(id, body);
          setPromotions(prev => prev.map(p => p.id === id ? updated : p));
        } else {
          setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...body } : p));
        }
        setEditingId(null);
        return;
      }

      if (placeId) {
        const created = await createPromotion(placeId, { ...body, isActive: true });
        setPromotions(prev => [created, ...prev]);
      } else {
        const newPromo: PromotionItem = {
          id: `temp-${Date.now()}`,
          title: body.title,
          schedule: body.schedule,
          isActive: true,
        };
        setPromotions(prev => [newPromo, ...prev]);
      }
      setIsAdding(false);
    } catch (err) {
      Alert.alert('Loi', getApiErrorMessage(err));
    }
  };

  const handleDelete = (id: string) => {
    const removeLocal = () => {
      setPromotions(prev => prev.filter(item => item.id !== id));
      setEditingId(null);
    };

    if (!placeId || id.startsWith('temp-')) {
      removeLocal();
      return;
    }

    Alert.alert('Delete promotion', 'Are you sure you want to delete this promotion?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePromotion(id);
            removeLocal();
          } catch (err) {
            Alert.alert('Loi', getApiErrorMessage(err));
          }
        },
      },
    ]);
  };

  const handlePickCover = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow photo access to upload a cover image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //allowsEditing: true,
        quality: 0.85,
      });

      if (result.canceled) return;

      setIsUploading(true);
      const publicUrl = await uploadPlaceCover(result.assets[0].uri);
      setCoverImageUrl(publicUrl);
      setImageUrls(prev => Array.from(new Set([publicUrl, ...prev])));
    } catch (err) {
      Alert.alert('Loi', getApiErrorMessage(err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setPlaceName(placeParam?.Name ?? '');
    setRegion(placeParam?.Location ?? '');
    setDescription('');
    setActiveCategory('DINING');
    setCoverImageUrl(placeParam?.Image ?? '');
    setImageUrls(placeParam?.Images ?? []);
    setPromotions([]);
    setEditingId(null);
    setIsAdding(false);
  };

  const handlePublish = async () => {
    const name = placeName.trim();
    const placeRegion = region.trim();
    const about = description.trim();
    const coverUrl = coverImageUrl.trim();

    if (!name || !placeRegion || !activeCategory) {
      Alert.alert('Missing information', 'Please enter place name, region, and category.');
      return;
    }

    if (!coverUrl) {
      Alert.alert('Missing cover image', 'Please upload or enter a cover image URL.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name,
        region: placeRegion,
        category: activeCategory,
        about,
        coverImageUrl: coverUrl,
        imageUrls: Array.from(new Set([coverUrl, ...imageUrls.filter(Boolean)])),
        featureLabel: 'Open Now',
      };

      if (placeId) {
        await updateOwnerPlace(placeId, payload);
      } else {
        await createOwnerPlace({
          ...payload,
          promotions: promotions.map((promo) => ({
            title: promo.title,
            isActive: promo.isActive,
            schedule: promo.schedule,
          })),
        });
      }

      Alert.alert('Success', placeId ? 'Location updated.' : 'Location published.', [
        {
          text: 'OK',
          onPress: () => {
            if (navigation.canGoBack?.()) {
              navigation.goBack();
            } else {
              navigation.popToTop?.();
            }
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Loi', getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack?.()) {
              navigation.goBack();
            } else {
              navigation.popToTop?.();
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Location Details</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.alertContainer}>
          <Ionicons name="warning" size={20} color={colors.warning} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Policy Reminder</Text>
            <Text style={styles.alertText}>
              We have a strict 2-strike policy for verified information. Ensure all details are accurate.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Place Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. The Grand View Hotel"
            placeholderTextColor={colors.textMuted}
            value={placeName}
            onChangeText={setPlaceName}
          />

          <View style={styles.labelRow}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.label, styles.labelInRow]}>Region / City</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="e.g. Kyoto, Japan"
            placeholderTextColor={colors.textMuted}
            value={region}
            onChangeText={setRegion}
          />

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {PLACE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                onPress={() => setActiveCategory(cat.value)}
                style={[styles.chip, activeCategory === cat.value && styles.chipActive]}
              >
                <Text style={[styles.chipText, activeCategory === cat.value && styles.chipTextActive]}>
                  {getPlaceCategoryLabel(cat.value)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell visitors what makes this place special..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <Text style={styles.sectionTitle}>Location & Media</Text>
        <View style={styles.card}>
          {/* <Text style={styles.label}>Pin Location</Text>
          <View style={styles.mapContainer}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCT5oVzTfOwQWzcT6Atu7B0q--_Q46lzBnpoi5Ynl6t-jFeH_G0ddDJ2l3wkMx7ijFvl1pBfPloXeD3wytn487HTubcPPtWVbVWWuQ-2D9jjeeXK0dKYbyaevqcVY7kQUnaehCgek8p8BWfaGgYFfvwLvOEB5QeGLNemG6C-1uF3R7ApCE7cnP24Sdeb1Q34QTWc8DYR62RqIUpy6JVYpaFRVghXmCEopKS14rWn3x7KPZxnFl9mhPa4lCdGMLvf7rM3vlasLaSoo_c' }}
              style={styles.mapImage}
            />
            <TouchableOpacity style={styles.setPinButton}>
              <Ionicons name="location" size={18} color={colors.primary} />
              <Text style={{ color: colors.primary, fontWeight: 'bold', marginLeft: 4 }}>Set Pin</Text>
            </TouchableOpacity>
          </View> */}

          <Text style={styles.label}>Cover Image URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/place.jpg"
            placeholderTextColor={colors.textMuted}
            value={coverImageUrl}
            onChangeText={setCoverImageUrl}
            autoCapitalize="none"
          />

          {coverImageUrl.length > 0 && (
            <Image source={{ uri: coverImageUrl }} style={[styles.mapContainer, { width: '100%' }]} />
          )}

          <TouchableOpacity
            style={[styles.uploadBox, { marginTop: 20 }]}
            onPress={handlePickCover}
            disabled={isUploading}
          >
            <View style={{ backgroundColor: colors.primaryLight, padding: 10, borderRadius: 30, marginBottom: 8 }}>
              {isUploading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="cloud-upload" size={24} color={colors.primary} />
              )}
            </View>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
              {isUploading ? 'Uploading...' : 'Tap to upload cover'}
            </Text>
            <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>Supports JPG, PNG (Max 10MB)</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Current Promotions</Text>
        </View>

        {promotions.map((item) => (
          editingId === item.id ? (
            <PromotionEditor
              key={item.id}
              initialData={item}
              onSave={(data) => void handleSave(item.id, data)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <PromotionCard
              key={item.id}
              item={item}
              onToggle={handleToggle}
              onEdit={() => { setEditingId(item.id); setIsAdding(false); }}
              onDelete={() => handleDelete(item.id)}
            />
          )
        ))}

        {!isAdding && (
          <View style={[styles.uploadBox, { padding: 16, borderStyle: 'dashed' }]}>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>Want to boost visitors?</Text>
            <TouchableOpacity onPress={() => {
              setIsAdding(true);
              setEditingId(null);
            }}>
              <Text style={[styles.linkText, { fontWeight: 'bold' }]}>Create a seasonal offer</Text>
            </TouchableOpacity>
          </View>
        )}

        {isAdding && (
          <View>
            <PromotionEditor
              initialData={{
                title: '',
                schedule: {
                  startDate: formatDate(new Date()),
                  endDate: formatDate(new Date()),
                  days: ['M'],
                  startTime: '8:00 AM',
                  endTime: '5:00 PM',
                  specificTime: false,
                }
              }}
              onSave={(data) => void handleSave(null, data)}
              onCancel={() => setIsAdding(false)}
            />
          </View>
        )}

        
         <TouchableOpacity style={styles.button} onPress={handlePublish} disabled={isSaving || isUploading}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.buttonText}>
                {isSaving ? 'Saving...' : placeId ? 'Save Location' : 'Save & Publish Location '}
              </Text>
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="arrow-forward" size={20} color="white" />
              )}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddLocationScreen;
