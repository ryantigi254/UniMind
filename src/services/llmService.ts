// services/llmService.ts
import { Message } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://0.0.0.0:8000';

interface TherapyResponse {
  response: string;
  session_id: string;
  interaction_count: number;
  stage: string;
  api_source: string;
  success: boolean;
  error?: string;
}

interface TherapyStats {
  gemini_api_count: number;
  gemini_api_limit: number;
  gemini_api_remaining: number;
  current_api_source: string;
  session_id: string;
}

class TherapyAPIService {
  private sessionId: string | null = null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async startConversation(userMessage: string): Promise<Message> {
    try {
      const response = await fetch(`${this.baseUrl}/start_conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: userMessage
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TherapyResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to start conversation');
      }

      // Store session ID for future requests
      this.sessionId = data.session_id;

      return {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        metadata: {
          sessionId: data.session_id,
          interactionCount: data.interaction_count,
          stage: data.stage,
          apiSource: data.api_source
        }
      };
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw new Error('Failed to connect to therapy service. Please try again.');
    }
  }

  async continueConversation(userMessage: string): Promise<Message> {
    if (!this.sessionId) {
      throw new Error('No active session. Please start a new conversation.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/continue_conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: this.sessionId,
          user_input: userMessage
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TherapyResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to continue conversation');
      }

      return {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        metadata: {
          sessionId: data.session_id,
          interactionCount: data.interaction_count,
          stage: data.stage,
          apiSource: data.api_source
        }
      };
    } catch (error) {
      console.error('Error continuing conversation:', error);
      throw new Error('Failed to get response from therapy service. Please try again.');
    }
  }

  async getStats(): Promise<TherapyStats> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    try {
      const response = await fetch(`${this.baseUrl}/get_stats/${this.sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  resetSession(): void {
    this.sessionId = null;
  }
}

// Create singleton instance
const therapyAPI = new TherapyAPIService();

// Legacy function for compatibility with existing chat page
export const generateResponse = async (messages: Message[]): Promise<Message> => {
  const latestUserMessage = messages[messages.length - 1];
  
  if (!latestUserMessage || latestUserMessage.role !== 'user') {
    throw new Error('Invalid message format');
  }

  const userContent = latestUserMessage.content;

  // Check if this is the first message (start conversation) or continuation
  const isFirstMessage = messages.length === 1 || !therapyAPI.getSessionId();

  if (isFirstMessage) {
    return await therapyAPI.startConversation(userContent);
  } else {
    return await therapyAPI.continueConversation(userContent);
  }
};

// Export the therapy API service for direct use
export { therapyAPI };
export type { TherapyResponse, TherapyStats };