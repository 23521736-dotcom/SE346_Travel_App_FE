import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatBubble } from './ChatBubble';
import { Message, chatWithGroq } from '@/lib/api/groq';
import { ThemedText } from '../themed-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInRight,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';

interface ChatWindowProps {
  onClose: () => void;
}

const SYSTEM_PROMPT: Message = {
  role: 'system',
  content: `You are a helpful travel assistant for the Travel App.
    Your expertise includes:
    1. Trip planning and suggestions.
    2. Spending and budgeting advice for travelers.
    3. Information about destinations, activities, and local tips.
    Keep your responses concise, friendly, and helpful.
    Use Markdown like bullet points for better readability.
    Always prioritize information relevant to travel and budgeting.`,
};

const CATEGORIES = [
  { id: 'planning', label: 'Planning', icon: 'map-outline' },
  { id: 'budget', label: 'Budget', icon: 'wallet-outline' },
  { id: 'tips', label: 'Local Tips', icon: 'bulb-outline' },
  { id: 'hidden', label: 'Hidden Gems', icon: 'eye-off-outline' },
];

const SUGGESTIONS: Record<string, string[]> = {
  planning: ['Suggest a 3-day itinerary for Hanoi', 'What are the top cities in Japan?', 'Best time to visit Thailand?'],
  budget: ['How to save money in Singapore?', 'Daily budget for Bali?', 'Cheap eats in Seoul'],
  tips: ['Visa requirements for Vietnam?', 'How to use public transport in Tokyo?', 'Safety tips for solo travelers'],
  hidden: ['Secret beaches in Phu Quoc', 'Off-the-beaten-path in Kyoto', 'Local festivals in October'],
};

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('planning');
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets() ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSend = async (text?: string) => {
    const messageContent = text || inputText;
    if (messageContent.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageContent };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatWithGroq([SYSTEM_PROMPT, ...newMessages]);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, isLoading]);

  return (
    <View style={[
      styles.container,
      { paddingBottom: insets.bottom },
      isDark && styles.containerDark
    ]}>
      {/* Premium Header */}
      <View style={[styles.header, isDark && styles.headerDark]}>
        <TouchableOpacity onPress={() => setMessages([])} style={styles.headerAction}>
          <Ionicons name="trash-outline" size={20} color={isDark ? '#AAA' : '#666'} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
           <ThemedText type="defaultSemiBold" style={styles.headerTitle}>Travel Assistant</ThemedText>
           <View style={styles.onlineIndicator} />
        </View>
        <TouchableOpacity onPress={onClose} style={styles.headerAction}>
          <Ionicons name="close" size={24} color={isDark ? '#EEE' : '#333'} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Animated.View entering={FadeInDown.duration(400)}>
            <ChatBubble message={item} />
          </Animated.View>
        )}
        contentContainerStyle={styles.messageList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
               <Ionicons name="sparkles" size={40} color="#007AFF" />
            </View>
            <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>How can I help you today?</ThemedText>
            <ThemedText style={[styles.emptyText, isDark && styles.emptyTextDark]}>
              Ask me about itineraries, budgets, or local secrets!
            </ThemedText>
          </View>
        }
      />

      {/* Smart Suggestions Chips */}
      <View style={styles.suggestionsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipSelected,
                isDark && styles.categoryChipDark
              ]}
            >
              <Ionicons
                name={cat.icon as any}
                size={16}
                color={selectedCategory === cat.id ? '#FFF' : '#007AFF'}
              />
              <ThemedText style={[
                styles.categoryText,
                selectedCategory === cat.id && styles.categoryTextSelected
              ]}>
                {cat.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionList}
        >
          {SUGGESTIONS[selectedCategory].map((suggestion, index) => (
            <Animated.View
              key={suggestion}
              entering={FadeInRight.delay(index * 100)}
              layout={Layout.springify()}
            >
              <TouchableOpacity
                style={[styles.suggestionChip, isDark && styles.suggestionChipDark]}
                onPress={() => handleSend(suggestion)}
              >
                <ThemedText style={styles.suggestionText}>{suggestion}</ThemedText>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <ThemedText style={[styles.loadingText, isDark && styles.loadingTextDark]}>Assistant is thinking...</ThemedText>
        </View>
      )}

      {/* Modern Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={[styles.inputWrapper, isDark && styles.inputWrapperDark]}>
          <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask anything..."
              placeholderTextColor={isDark ? '#666' : '#999'}
              multiline
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              disabled={!inputText.trim() || isLoading}
            >
              <Ionicons name="arrow-up" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerDark: {
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    letterSpacing: -0.3,
  },
  onlineIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759',
    marginLeft: 6,
    marginTop: 2,
  },
  headerAction: {
    padding: 4,
    width: 36,
    alignItems: 'center',
  },
  messageList: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,122,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
    fontSize: 15,
  },
  emptyTextDark: {
    color: '#AAA',
  },
  suggestionsWrapper: {
    paddingVertical: 12,
  },
  categoryList: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  categoryChipDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#2C2C2E',
  },
  categoryChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    marginLeft: 6,
  },
  categoryTextSelected: {
    color: '#FFF',
  },
  suggestionList: {
    paddingHorizontal: 20,
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  suggestionChipDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#2C2C2E',
  },
  suggestionText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#8E8E93',
  },
  loadingTextDark: {
    color: '#8E8E93',
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  inputWrapperDark: {
    backgroundColor: '#121212',
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 6,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 120,
    color: '#1C1C1E',
  },
  inputDark: {
    color: '#FFFFFF',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E5E5',
    opacity: 0.5,
  },
});
