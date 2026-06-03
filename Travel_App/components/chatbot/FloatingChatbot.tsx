import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatWindow } from './ChatWindow';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const FAB_SIZE = 60;
const MARGIN = 20;

export function FloatingChatbot() {
  const [isVisible, setIsVisible] = useState(false);

  // Dragging positions
  const translateX = useSharedValue(SCREEN_WIDTH - FAB_SIZE - MARGIN);
  const translateY = useSharedValue(SCREEN_HEIGHT - FAB_SIZE - MARGIN - 100);

  // Context for dragging
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);

  // Animations
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
      scale.value = withTiming(0.9);
    })
    .onUpdate((event) => {
      translateX.value = contextX.value + event.translationX;
      translateY.value = contextY.value + event.translationY;
    })
    .onEnd((event) => {
      scale.value = withSpring(1);

      // Snap to nearest side
      const snapX = translateX.value + event.velocityX * 0.2;
      const targetX = snapX > (SCREEN_WIDTH - FAB_SIZE) / 2
        ? SCREEN_WIDTH - FAB_SIZE - MARGIN
        : MARGIN;

      translateX.value = withSpring(targetX);

      // Keep within vertical bounds
      const minY = MARGIN;
      const maxY = SCREEN_HEIGHT - FAB_SIZE - MARGIN - 80;

      if (translateY.value < minY) {
        translateY.value = withSpring(minY);
      } else if (translateY.value > maxY) {
        translateY.value = withSpring(maxY);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value }
      ],
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
      opacity: withTiming(isVisible ? 0 : 0.4),
    };
  });

  const handleOpen = () => {
    scale.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withSpring(1)
    );
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.fabWrapper, animatedStyle]}>
          <Animated.View style={[styles.pulseCircle, pulseStyle]} />
          <TouchableOpacity
            style={styles.fab}
            onPress={handleOpen}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="sparkles" size={28} color="#FFF" />
              <View style={styles.eyeLeft} />
              <View style={styles.eyeRight} />
              <View style={styles.smile} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.dismissArea}
            onPress={handleClose}
            activeOpacity={1}
          />
          <View style={styles.chatContainer}>
            <ChatWindow onClose={handleClose} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  fabWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: FAB_SIZE,
    height: FAB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: FAB_SIZE + 20,
    height: FAB_SIZE + 20,
    borderRadius: (FAB_SIZE + 20) / 2,
    backgroundColor: 'rgba(0, 122, 255, 0.5)',
  },
  fab: {
    backgroundColor: '#007AFF',
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  eyeLeft: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#FFF',
    borderRadius: 2,
    top: 22,
    left: 18,
  },
  eyeRight: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#FFF',
    borderRadius: 2,
    top: 22,
    right: 18,
  },
  smile: {
    position: 'absolute',
    width: 10,
    height: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    top: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  chatContainer: {
    height: '80%',
    width: '100%',
  },
});
