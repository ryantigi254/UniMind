export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'systemError';
  content: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MoodEntry {
  id: string;
  mood: number;
  note?: string;
  timestamp: Date;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  chatbotTone: 'friendly' | 'professional' | 'comforting' | 'casual';
  memoryEnabled: boolean;
  accessibility: {
    fontSize: 'normal' | 'large' | 'larger';
    highContrast: boolean;
  };
}

export interface DisclaimerStatus {
  accepted: boolean;
  acceptedAt?: Date;
}