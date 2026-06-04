import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../app/(tabs)/common/colors';

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  images: string[];
  onClose: () => void;
}

export default function VideoSlideshowModal({ visible, images, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!visible || isPaused || images.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      fadeOut(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        fadeIn();
      });
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [visible, isPaused, images.length]);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      fadeIn();
    }
  }, [visible]);

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (callback?: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => callback?.());
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleNext = () => {
    fadeOut(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      fadeIn();
    });
  };

  const handlePrev = () => {
    fadeOut(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      fadeIn();
    });
  };

  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onClose();
  };

  if (!visible || images.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Animated.Image
          source={{ uri: images[currentIndex] }}
          style={[styles.image, { opacity: fadeAnim }]}
          resizeMode="contain"
        />
      </Pressable>

      <View style={styles.topBar}>
        <Pressable style={styles.topButton} onPress={handleClose}>
          <Ionicons name="close" size={28} color={colors.white} />
        </Pressable>
        <View style={styles.counterContainer}>
          <Text style={styles.counter}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
        <View style={styles.topButton} />
      </View>

      <View style={styles.bottomBar}>
        <Pressable style={styles.navButton} onPress={handlePrev}>
          <Ionicons name="chevron-back" size={32} color={colors.white} />
        </Pressable>

        <Pressable style={styles.playPauseButton} onPress={togglePause}>
          <Ionicons
            name={isPaused ? 'play' : 'pause'}
            size={36}
            color={colors.white}
          />
        </Pressable>

        <Pressable style={styles.navButton} onPress={handleNext}>
          <Ionicons name="chevron-forward" size={32} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / images.length) * 100}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width,
    height,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 10,
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  counterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  counter: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 52,
    paddingTop: 16,
    paddingHorizontal: 20,
    columnGap: 24,
    zIndex: 10,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  playPauseButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});
