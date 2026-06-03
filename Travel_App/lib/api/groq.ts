import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const groqClient = axios.create({
  baseURL: GROQ_API_URL,
  headers: {
    'Authorization': `Bearer ${GROQ_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function chatWithGroq(messages: Message[]): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API Key is not configured');
  }

  try {
    const response = await axios.post<GroqChatResponse>(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile', // Or another Groq supported model
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Data:', error.response?.data);
    }
    throw new Error('Failed to get response from Groq AI');
  }
}
