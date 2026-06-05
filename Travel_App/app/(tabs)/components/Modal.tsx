import React, { ReactNode, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemeType } from '../common/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const SimpleModal = ({ visible, onClose, title, children }: Props) => {
  const { colors: themeColors } = useTheme();
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={styles.modalBox}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.content}>
          {children}
        </View>

        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={{ color: themeColors.primary, fontWeight: '700' }}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (colors: ThemeType) => StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  modalBox: {
    width: '80%',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  content: {
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});

export default SimpleModal;
