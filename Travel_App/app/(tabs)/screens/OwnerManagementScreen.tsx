import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { colors } from "../common/colors";
import PromotionEditor from '../components/PromotionEditor';
import styles from './OwnerManagementScreen.styles';
import { useAuth } from '../context/AuthContext';
import {
  createPromotion,
  fetchOwnerPlaces,
  fetchPlacePromotions,
} from '../../../lib/api/owner';
import type { OwnerPlace } from '../../../lib/api/owner';
import type { PromotionItem } from '@/lib/types/promotion';
import { getApiErrorMessage } from '../context/AuthContext';

const renderPlace = (item: OwnerPlace, onEdit: (item: OwnerPlace) => void) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.Image }} style={styles.cardImage} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.placeName} numberOfLines={1}>{item.Name}</Text>
        <Text style={styles.locationText} numberOfLines={1}>{item.Location}</Text>
        <View style={[styles.buttonRow, { justifyContent: 'flex-end' }]}>
          <TouchableOpacity style={styles.btnEdit} onPress={() => onEdit(item)}>
            <Ionicons name="pencil" size={14} color="#212121" />
            <Text style={styles.btnEditText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function OwnerManagementScreen({ navigation }: any) {
  const { user } = useAuth();
  const flatListRef = React.useRef<FlatList>(null);
  const [places, setPlaces] = useState<OwnerPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<OwnerPlace | null>(null);
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [showEditor, setShowEditor] = useState(false);

  const loadPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchOwnerPlaces();
      setPlaces(data);
      if (data.length > 0) {
        setSelectedPlace((prev) => prev ?? data[0]);
      } else {
        setSelectedPlace(null);
      }
    } catch {
      setPlaces([]);
      setSelectedPlace(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPromotions = useCallback(async (placeId: string) => {
    try {
      const data = await fetchPlacePromotions(placeId);
      setPromotions(data);
    } catch {
      setPromotions([]);
    }
  }, []);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  useEffect(() => {
    if (selectedPlace) {
      loadPromotions(selectedPlace.Id);
    }
  }, [selectedPlace, loadPromotions]);

  const handleEditPress = (item: OwnerPlace) => {
    setSelectedPlace(item);
    setShowEditor(true);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleSave = async (data: { title: string; schedule: PromotionItem['schedule'] }) => {
    if (!selectedPlace) return;
    try {
      await createPromotion(selectedPlace.Id, {
        title: data.title,
        isActive: true,
        schedule: data.schedule,
      });
      await loadPromotions(selectedPlace.Id);
      setShowEditor(false);
    } catch (err) {
      Alert.alert('Loi', getApiErrorMessage(err));
    }
  };

  const HeaderComponent = () => {
    if (!selectedPlace) {
      return (
        <View style={{ padding: 20 }}>
          <Text>Chua co dia diem. Hay them dia diem moi.</Text>
        </View>
      );
    }
    return (
      <View>
        <View style={{ flexDirection: 'row', margin: 10, marginBottom: 0, alignItems: 'center', justifyContent: "space-between" }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.roundButton}>
              <Ionicons name="storefront" size={35} color={colors.primary} />
            </View>
            <View style={{ flexDirection: 'column', margin: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Dashboard</Text>
              <Text style={[styles.linkText, { color: "#90a4ae" }]}>
                Welcome back, {user?.name || 'Owner'}
              </Text>
            </View>
          </View>
          <View style={{ paddingRight: 10 }}>
            <Ionicons name="notifications" size={30} color="black" />
          </View>
        </View>
        <View style={{ marginHorizontal: 15 }}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Add Location")}>
            <Text style={styles.buttonText}>+ Add New Place</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: 10, backgroundColor: '#fff', borderRadius: 10, marginVertical: 15, padding: 5 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 10 }}>Your Locations</Text>
          <View style={{ margin: 0, marginBottom: 20, position: 'relative' }}>
            <View style={[styles.imageFrame, { height: 180, borderRadius: 10, borderWidth: 0 }]}>
              <Image
                source={{ uri: selectedPlace.Image }}
                style={{ width: "100%", height: "100%" }}
                blurRadius={1}
              />
            </View>
            <Text style={{
              position: 'absolute', left: 15, bottom: 30, zIndex: 1,
              color: 'white', fontWeight: 'bold', fontSize: 20, padding: 5
            }}>
              {selectedPlace.Name}
            </Text>
            <Text style={{
              position: 'absolute', left: 15, bottom: 8, zIndex: 1,
              color: '#e2e8f0', fontWeight: '500', fontSize: 15, padding: 5
            }}>
              {selectedPlace.Location}
            </Text>
          </View>
          {promotions.length > 0 && (
            <Text style={{ marginBottom: 8, color: colors.textSecondary }}>
              {promotions.length} promotion(s)
            </Text>
          )}
          {showEditor ? (
            <PromotionEditor
              initialData={{ title: '', schedule: { startDate: '', endDate: '', days: ['M'], startTime: '8:00 AM', endTime: '5:00 PM', specificTime: false } }}
              onSave={handleSave}
              onCancel={() => setShowEditor(false)}
            />
          ) : (
            <TouchableOpacity onPress={() => setShowEditor(true)}>
              <Text style={{ color: colors.primary, fontWeight: 'bold', marginBottom: 10 }}>
                + Add promotion for this place
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', marginTop: 30 }}>
      <FlatList
        ref={flatListRef}
        data={places}
        renderItem={({ item }) => renderPlace(item, handleEditPress)}
        keyExtractor={(item) => item.Id}
        ListHeaderComponent={HeaderComponent}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadPlaces}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ marginBottom: 10 }}>Chua co dia diem nao</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Add Location")}>
              <Text style={styles.buttonText}>+ Add New Place</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
