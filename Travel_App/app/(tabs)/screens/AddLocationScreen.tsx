import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { formatDate } from '@/lib/service/PromotionShedule';
import React, { useState } from 'react';
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
import { styles } from './AddLocationScreen.style';
import { createOwnerPlace } from '../../../lib/api/owner';
import { uploadPlaceCover } from '../../../lib/api/uploads';
import type { PromotionItem } from '@/lib/types/promotion';
import { getApiErrorMessage } from '../context/AuthContext';

const DEFAULT_COVER =
  'https://i.pinimg.com/1200x/28/31/da/2831da0f8a4b18fde25867ef90e66207.jpg';

const AddLocationScreen = ({ navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState('Restaurant');
  const [isAdding, setIsAdding] = useState(false);
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('Vietnam');
  const [preview, setPreview] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const handleToggle = (id: string) => {
    setPromotions(prevPromos =>
      prevPromos.map(promo =>
        promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
      )
    );
  };

  const handleSavePromo = (id: string | null, newData: Partial<PromotionItem>) => {
    if (id) {
      setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...newData } : p));
      setEditingId(null);
    } else {
      const newPromo: PromotionItem = {
        id: Date.now().toString(),
        title: newData.title || '',
        isActive: true,
        schedule: newData.schedule!,
      };
      setPromotions([newPromo, ...promotions]);
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    setPromotions(promotions.filter(item => item.id !== id));
  };

  const handleImageChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Loi', 'Can quyen truy cap thu vien anh');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPreview(result.assets[0].uri);
    }
  };

  const handlePublish = async () => {
    if (!placeName.trim()) {
      Alert.alert('Loi', 'Vui long nhap ten dia diem');
      return;
    }
    setSaving(true);
    try {
      let coverImageUrl = DEFAULT_COVER;
      if (preview) {
        try {
          coverImageUrl = await uploadPlaceCover(preview);
        } catch (err) {
          const msg = getApiErrorMessage(err);
          if (msg === 'STORAGE_UNAVAILABLE') {
            Alert.alert(
              'Upload chua san sang',
              'Kiem tra SUPABASE_SERVICE_ROLE_KEY (eyJ...) va chay: npm run storage:verify'
            );
          }
          coverImageUrl = DEFAULT_COVER;
        }
      }
      await createOwnerPlace({
        name: placeName.trim(),
        region: region.trim() || 'Vietnam',
        category: activeCategory,
        about: description.trim(),
        coverImageUrl,
        featureLabel: 'Open Now',
        promotions: promotions.map((p) => ({
          title: p.title,
          isActive: p.isActive,
          schedule: p.schedule,
        })),
      });
      Alert.alert('Thanh cong', 'Da tao dia diem moi', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Loi', getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setPlaceName('');
    setDescription('');
    setRegion('Vietnam');
    setPreview('');
    setPromotions([]);
    setActiveCategory('Restaurant');
  };

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Location</Text>
        <TouchableOpacity onPress={resetForm}>
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

          <Text style={styles.label}>Region / City</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Kyoto, Japan"
            placeholderTextColor={colors.textMuted}
            value={region}
            onChangeText={setRegion}
          />

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {['Restaurant', 'Hotel', 'Attraction', 'Cafe'].map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[styles.chip, activeCategory === cat && styles.chipActive]}
              >
                <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                  {cat === 'Restaurant' && '+ '} {cat}
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
          <TouchableOpacity
            style={[styles.uploadBox, { marginTop: 0 }]}
            onPress={handleImageChange}
          >
            {preview ? (
              <Image source={{ uri: preview }} style={{ width: '100%', height: 120, borderRadius: 8 }} />
            ) : (
              <>
                <View style={{ backgroundColor: colors.primaryLight, padding: 10, borderRadius: 30, marginBottom: 8 }}>
                  <Ionicons name="cloud-upload" size={24} color={colors.primary} />
                </View>
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Tap to upload panorama</Text>
                <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>Supports JPG, PNG (Max 5MB)</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handlePublish} disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.buttonText}>Save & Publish Location </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </View>
            )}
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
              onSave={(data) => handleSavePromo(item.id, data)}
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
            <TouchableOpacity onPress={() => { setIsAdding(true); setEditingId(null); }}>
              <Text style={[styles.linkText, { fontWeight: 'bold' }]}>Create a seasonal offer</Text>
            </TouchableOpacity>
          </View>
        )}

        {isAdding && (
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
            onSave={(data) => handleSavePromo(null, data)}
            onCancel={() => setIsAdding(false)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddLocationScreen;
