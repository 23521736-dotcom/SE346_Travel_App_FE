import { apiClient } from './client';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Chat with AI via the backend proxy.
 * The backend handles the Groq API call and keeps the API key secure.
 */
export async function chatWithGroq(messages: Message[]): Promise<string> {
  try {
    // Filter out system messages as the backend has its own system prompt
    const userMessages = messages.filter(m => m.role !== 'system');

    const response = await apiClient.post<{ ok: boolean; data: { content?: string } }>('/ai/chat', {
      messages: userMessages,
    });

    if (response.data.ok && response.data.data?.content) {
      return response.data.data.content;
    }

    throw new Error('Invalid response from server');
  } catch (error) {
    console.error('AI Chat Error:', error);
    throw new Error('Failed to get response from AI assistant');
  }
}
