import React, { useMemo, useState } from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { getCommonStyles } from '../common/styles';
import { useTheme } from '../context/ThemeContext';
import { ThemeType } from '../common/theme';

interface PicturesContainerProps {
    pictures: string[];
}

const getStyles = (colors: ThemeType) => StyleSheet.create({
  ...getCommonStyles(colors),

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
  },

  fullImage: {
    width: '100%',
    height: '80%',
  },
});

export const PicturesContainer = ({ pictures }: PicturesContainerProps) => {
  const { colors: themeColors } = useTheme();
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleOpenImage = (url: string) => {
    setSelectedImage(url);
    setModalVisible(true);
  };

  if (!pictures || pictures.length === 0) return null;

  return (
    <View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        {pictures.map((picURL, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleOpenImage(picURL)}
            activeOpacity={0.8}
          >
            <View style={[styles.imageFrame, { marginRight: 10, width: 150, height: 100, borderRadius: 10, borderWidth: 1, borderColor: themeColors.border, backgroundColor: themeColors.surfaceMuted }]}>
              <Image
                source={{ uri: picURL }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>×</Text>
          </TouchableOpacity>

          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};