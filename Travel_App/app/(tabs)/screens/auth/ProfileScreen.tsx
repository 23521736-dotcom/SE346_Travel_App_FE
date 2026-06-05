import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ImageSourcePropType,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
  getPriceInputValue,
  loadPricePreferences,
  savePricePreferences,
} from '../../../../lib/pricePreferences';
import styles from './ProfileScreen.styles';

interface SettingItemProps {
  title: string;
  iconSource: ImageSourcePropType;
  iconBgColor: string;
  hasSwitch?: boolean;
  onPress?: () => void;
}
const DEFAULT_AVATAR =
  'https://th.bing.com/th/id/OIP.iY6OLSZImubhw9Yiwg6OuAHaHa?w=186&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3';
export default function ProfileScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [budgetPrice, setBudgetPrice] = useState('');
  const [moderatePrice, setModeratePrice] = useState('');
  const [isSavingPricePreferences, setIsSavingPricePreferences] = useState(false);
  const { user } = useAuth();
  const displayName = user?.fullName || user?.name || 'User';
  const avatar = user?.avatarUrl || DEFAULT_AVATAR;

  useEffect(() => {
    let isMounted = true;

    const loadSavedPricePreferences = async () => {
      const preferences = await loadPricePreferences();
      if (!isMounted) return;

      setBudgetPrice(getPriceInputValue(preferences.budget));
      setModeratePrice(getPriceInputValue(preferences.moderate));
    };

    loadSavedPricePreferences();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSavePricePreferences = async () => {
    const budget = Number(budgetPrice);
    const moderate = Number(moderatePrice);

    if (
      !Number.isFinite(budget) ||
      !Number.isFinite(moderate) ||
      budget <= 0 ||
      moderate <= 0 ||
      moderate < budget
    ) {
      Alert.alert(t('common.error'), t('profile.invalidPricePreference'));
      return;
    }

    setIsSavingPricePreferences(true);
    try {
      const saved = await savePricePreferences({ budget, moderate });
      setBudgetPrice(getPriceInputValue(saved.budget));
      setModeratePrice(getPriceInputValue(saved.moderate));
      Alert.alert(t('common.confirm'), t('profile.pricePreferenceSaved'));
    } catch {
      Alert.alert(t('common.error'), t('common.error'));
    } finally {
      setIsSavingPricePreferences(false);
    }
  };

  const SettingItem = ({
    title,
    iconSource,
    iconBgColor,
    hasSwitch,
    onPress,
  }: SettingItemProps) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={onPress}
        disabled={hasSwitch}
      >
        <View style={styles.itemLeft}>
          <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
            <Image
              source={iconSource}
              style={[
                styles.icon,
                { tintColor: iconBgColor === '#e5f3fa' ? '#177bb3' : '#64748b' },
              ]}
            />
          </View>
          <Text style={styles.itemText}>{title}</Text>
        </View>

        {hasSwitch ? (
          <Switch
            trackColor={{ false: '#d1d5db', true: '#177bb3' }}
            thumbColor={'#ffffff'}
            ios_backgroundColor="#d1d5db"
            onValueChange={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
            value={isNotificationsEnabled}
          />
        ) : (
          <Text style={styles.chevron}>{'>'}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: avatar }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>
            {displayName}
          </Text>
          {user?.username ? (
            <Text style={styles.userEmail}>@{user.username}</Text>
          ) : null}
        </View>
        {/* --- ACCOUNT SETTINGS --- */}
        <Text style={styles.sectionTitle}>{t('profile.accountSettings')}</Text>
        <SettingItem
          title={t('profile.editPersonalInformation')}
          iconSource={{ uri: 'https://cdn-icons-png.flaticon.com/128/1077/1077063.png' }}
          iconBgColor="#e5f3fa"
          onPress={() => navigation.navigate("Edit Profile")}
        />

        {/* --- PREFERENCES --- */}
        <Text style={styles.sectionTitle}>{t('profile.preferences')}</Text>
        <View style={styles.pricePreferenceCard}>
          <Text style={styles.pricePreferenceTitle}>{t('profile.pricePreferenceTitle')}</Text>
          <Text style={styles.pricePreferenceHint}>{t('profile.pricePreferenceHint')}</Text>

          <View style={styles.priceInputContainer}>
            <Text style={styles.priceInputLabel}>{t('profile.budgetMaxPrice')}</Text>
            <TextInput
              style={styles.priceInput}
              value={budgetPrice}
              onChangeText={(value) => setBudgetPrice(getPriceInputValue(value))}
              placeholder="150000"
              keyboardType="number-pad"
              returnKeyType="done"
            />
          </View>

          <View style={styles.priceInputContainer}>
            <Text style={styles.priceInputLabel}>{t('profile.moderateMaxPrice')}</Text>
            <TextInput
              style={styles.priceInput}
              value={moderatePrice}
              onChangeText={(value) => setModeratePrice(getPriceInputValue(value))}
              placeholder="500000"
              keyboardType="number-pad"
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.savePricePreferenceButton,
              isSavingPricePreferences && styles.savePricePreferenceButtonDisabled,
            ]}
            onPress={handleSavePricePreferences}
            disabled={isSavingPricePreferences}
          >
            <Text style={styles.savePricePreferenceText}>
              {isSavingPricePreferences ? t('common.loading') : t('profile.savePricePreferences')}
            </Text>
          </TouchableOpacity>
        </View>
        <SettingItem
          title={t('profile.notifications')}
          iconSource={{ uri: 'https://cdn-icons-png.flaticon.com/128/1827/1827370.png' }}
          iconBgColor="#e5f3fa"
          hasSwitch={true}
        />

        {/* --- SUPPORT & LEGAL --- */}
        <Text style={styles.sectionTitle}>{t('profile.supportLegal')}</Text>
        <SettingItem
          title={t('profile.terms')}
          iconSource={{ uri: 'https://cdn-icons-png.flaticon.com/128/2912/2912760.png' }}
          iconBgColor="#f1f5f9"
          onPress={() => navigation.navigate('Terms of Service')}
        />
        <SettingItem
          title={t('profile.privacy')}
          iconSource={{ uri: 'https://cdn-icons-png.flaticon.com/128/1161/1161388.png' }}
          iconBgColor="#f1f5f9"
          onPress={() => navigation.navigate('Privacy Policy')}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Log Out')}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1828/1828427.png' }}
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
