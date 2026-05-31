import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  ImageSourcePropType,
} from 'react-native';
import styles from './ProfileScreen.styles';
import { useAuth } from '../context/AuthContext';

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
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const { user } = useAuth();
  const displayName = user?.fullName || user?.name || 'User';
  const avatar = user?.avatarUrl || DEFAULT_AVATAR;
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
      <View style={styles.content}>
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
        <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
        <SettingItem
          title="Edit Personal Information"
          iconSource={{ uri: 'https://cdn-icons-png.flaticon.com/128/1077/1077063.png' }}
          iconBgColor="#e5f3fa"
          onPress={() => navigation.navigate("Edit Profile")}
        />

        {/* --- PREFERENCES --- */}
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <SettingItem
          title="Notifications"
          iconSource={{ uri: 'https://cdn-icons-png.flaticon.com/128/1827/1827370.png' }}
          iconBgColor="#e5f3fa"
          hasSwitch={true}
        />

        {/* --- SUPPORT & LEGAL --- */}
        <Text style={styles.sectionTitle}>SUPPORT & LEGAL</Text>
        <SettingItem
          title="Terms of Service"
          iconSource={{ uri: 'https://cdn-icons-png.flaticon.com/128/2912/2912760.png' }}
          iconBgColor="#f1f5f9"
          onPress={() => navigation.navigate('Terms of Service')}
        />
        <SettingItem
          title="Privacy Policy"
          iconSource={{ uri: 'https://cdn-icons-png.flaticon.com/128/1161/1161388.png' }}
          iconBgColor="#f1f5f9"
          onPress={() => navigation.navigate('Privacy Policy')}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Log Out')}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1828/1828427.png' }}
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
