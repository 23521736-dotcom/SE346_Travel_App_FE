import React, { useMemo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import getStyles from './LogoutScreen.styles';

export default function LogoutScreen({ navigation }: any) {
  const { logout } = useAuth();
  const { colors: themeColors } = useTheme();
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', marginTop: 0, backgroundColor: themeColors.background }}>
      <View style={{ alignItems: 'center', margin: 10 }}>
        <View style={[styles.imageFrame, { width: 360, height: 300, backgroundColor: themeColors.surfaceMuted, borderColor: themeColors.border }]}>
          <Image
            source={{
              uri: 'https://thumbs.dreamstime.com/b/summer-illustration-person-walking-away-suitcase-road-young-man-carrying-luggage-walks-surrounded-mountains-343547128.jpg',
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </View>

        <View style={[styles.containerChild, { alignItems: 'center', margin: 20 }]}>
          <Text style={styles.titleText}>
            Leaving so soon?
          </Text>
          <Text style={styles.descriptionText}>
            Are you sure you want to log out? Your saved places will be waiting for you when you return.
          </Text>
        </View>

        <View style={[styles.containerChild, { marginBottom: 250 }]}>
          <TouchableOpacity style={[styles.button, { width: 350 }]} onPress={() => navigation.navigate("Main")}>
            <Text style={styles.buttonText}>
              Stay Logged In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonLogOut, { width: 350 }]}
            onPress={logout}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'center', columnGap: 10, alignItems: 'center' }}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/15181/15181112.png' }}
                style={{ width: 24, height: 24, tintColor: themeColors.danger }}
              />
              <Text style={styles.buttonLogOutText}>
                Yes, Log Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
