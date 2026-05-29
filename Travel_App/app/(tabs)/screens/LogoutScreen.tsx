import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../common/colors';
import { useAuth } from '../context/AuthContext';
import styles from './LogoutScreen.styles';

export default function LogoutScreen({ navigation }: any) {
  const { logout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: 'center', marginTop: 40, backgroundColor: '#FFFFFF' }}>
      <View style={{ alignItems: 'center', margin: 10 }}>
        <View style={[styles.imageFrame, { width: 360, height: 300 }]}>
          <Image
            source={{
              uri: 'https://thumbs.dreamstime.com/b/summer-illustration-person-walking-away-suitcase-road-young-man-carrying-luggage-walks-surrounded-mountains-343547128.jpg',
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </View>

        <View style={[styles.containerChild, { alignItems: 'center', margin: 20 }]}>
          <Text style={{ fontSize: 35, fontWeight: 'bold' }}>
            Leaving so soon?
          </Text>
          <Text style={{ color: 'grey', fontSize: 17 }}>
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
            style={[styles.button, { backgroundColor: colors.dangerSoft, marginTop: 10, width: 350 }]}
            onPress={logout}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'center', columnGap: 5, alignItems: 'center' }}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/15181/15181112.png' }}
                style={{ width: 30, height: 20, marginTop: 3 }}
              />
              <Text style={[styles.buttonText, { color: colors.danger, fontWeight: 'bold' }]}>
                Yes, Log Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
