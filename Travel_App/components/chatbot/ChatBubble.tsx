import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { ThemedText } from '../themed-text';
import { Message } from '@/lib/api/groq';
import { Ionicons } from '@expo/vector-icons';

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      {!isUser && (
        <View style={[styles.avatar, isDark && styles.avatarDark]}>
          <Ionicons name="sparkles" size={14} color="#FFF" />
        </View>
      )}
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : [styles.assistantBubble, isDark && styles.assistantBubbleDark]
      ]}>
        <ThemedText style={[
          styles.text,
          isUser ? styles.userText : [styles.assistantText, isDark && styles.assistantTextDark]
        ]}>
          {message.content}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarDark: {
    backgroundColor: '#0A84FF',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  assistantBubbleDark: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  assistantText: {
    color: '#1C1C1E',
  },
  assistantTextDark: {
    color: '#FFFFFF',
  },
});
