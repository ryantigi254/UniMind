import { Message } from '../types';

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'https://api.unimind.ai/chat';

export class ChatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatError';
  }
}

export async function generateResponse(messages: Message[]): Promise<Message> {
  try {
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new ChatError(`Server error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: data.message,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error generating response:', error);
    return {
      id: crypto.randomUUID(),
      role: 'systemError',
      content: error instanceof ChatError 
        ? error.message 
        : 'Failed to generate response. Please try again.',
      timestamp: new Date(),
    };
  }
}