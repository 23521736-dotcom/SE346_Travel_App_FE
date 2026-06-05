import React, { useMemo, useState } from 'react';
import {
    Image,
    ImageSourcePropType,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import getStyles from './ProfileScreen.styles';

interface SettingItemProps {
  title: string;
  iconSource: ImageSourcePropType;
  iconBgColor: string;
  iconTintColor?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
}
const DEFAULT_AVATAR =
  'https://th.bing.com/th/id/OIP.iY6OLSZImubhw9Yiwg6OuAHaHa?w=186&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3';
export default function ProfileScreen({ navigation }: any) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const { user } = useAuth();
  const { colors, toggleTheme, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const displayName = user?.fullName || user?.name || 'User';
  const avatar = user?.avatarUrl || DEFAULT_AVATAR;

  const SettingItem = ({
    title,
    iconSource,
    iconBgColor,
    iconTintColor,
    hasSwitch,
    switchValue,
    onSwitchChange,
    onPress,
  }: SettingItemProps) => {
    return (
      <TouchableOpacity
        style={[styles.itemContainer, { backgroundColor: colors.surface }]}
        onPress={onPress}
        disabled={hasSwitch}
      >
        <View style={styles.itemLeft}>
          <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
            <Image
              source={iconSource}
              style={[
                styles.icon,
                { tintColor: iconTintColor || (isDark ? colors.textPrimary : '#177bb3') },
              ]}
            />
          </View>
          <Text style={[styles.itemText, { color: colors.textPrimary }]}>{title}</Text>
        </View>

        {hasSwitch ? (
          <Switch
            trackColor={{ false: isDark ? '#334155' : '#d1d5db', true: colors.primary }}
            thumbColor={'#ffffff'}
            ios_backgroundColor={isDark ? '#334155' : "#d1d5db"}
            onValueChange={onSwitchChange}
            value={switchValue}
          />
        ) : (
          <Text style={[styles.chevron, { color: colors.textSecondary }]}>{'>'}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          <Text style={[styles.userName, { color: colors.textPrimary }]}>
            {displayName}
          </Text>
          {user?.username ? (
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>@{user.username}</Text>
          ) : null}
        </View>
        {/* --- ACCOUNT SETTINGS --- */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>ACCOUNT SETTINGS</Text>
        <SettingItem
          title="Edit Personal Information"
          iconSource={{ uri: 'https://cdn-icons-png.flaticon.com/128/1077/1077063.png' }}
          iconBgColor={isDark ? '#0C4A6E' : "#e5f3fa"}
          onPress={() => navigation.navigate("Edit Profile")}
        />

        <SettingItem
          title="Dark Mode"
          iconSource={{ uri: isDark ? 'https://cdn-icons-png.flaticon.com/128/1829/1829191.png' : 'https://cdn-icons-png.flaticon.com/128/702/702471.png' }}
          iconBgColor={isDark ? '#334155' : '#fef9c3'}
          iconTintColor={isDark ? '#FBBF24' : '#EAB308'}
          hasSwitch={true}
          switchValue={isDark}
          onSwitchChange={toggleTheme}
        />

        {/* --- PREFERENCES --- */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>PREFERENCES</Text>
        <SettingItem
          title="Notifications"
          iconSource={{ uri: 'https://cdn-icons-png.flaticon.com/128/1827/1827370.png' }}
          iconBgColor={isDark ? '#0C4A6E' : "#e5f3fa"}
          hasSwitch={true}
          switchValue={isNotificationsEnabled}
          onSwitchChange={setIsNotificationsEnabled}
        />

        {/* --- SUPPORT & LEGAL --- */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>SUPPORT & LEGAL</Text>
        <SettingItem
          title="Terms of Service"
          iconSource={{ uri: 'https://cdn-icons-png.flaticon.com/128/2912/2912760.png' }}
          iconBgColor={isDark ? '#334155' : "#f1f5f9"}
          onPress={() => navigation.navigate('Terms of Service')}
        />
        <SettingItem
          title="Privacy Policy"
          iconSource={{ uri: 'https://cdn-icons-png.flaticon.com/128/1161/1161388.png' }}
          iconBgColor={isDark ? '#334155' : "#f1f5f9"}
          onPress={() => navigation.navigate('Privacy Policy')}
        />

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Log Out')}
        >
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1828/1828427.png' }}
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
