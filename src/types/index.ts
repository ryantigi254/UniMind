// types/index.ts
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'systemError';
  content: string;
  timestamp: Date;
  metadata?: {
    sessionId?: string;
    interactionCount?: number;
    stage?: string;
    apiSource?: string;
  };
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  sessionId?: string; // For therapy system integration
  isTherapySession?: boolean; // Flag to identify therapy chats
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Settings {
  darkMode: boolean;
  notifications: boolean;
  apiEndpoint: string;
  userId?: string;
}

// Store interface to match your existing store structure
export interface StoreState {
  // Sidebar state
  isSidebarCollapsed: boolean;
  toggleSidebarCollapse: () => void;
  
  // Chat state
  chats: Chat[];
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  createNewChat: (title?: string, isTherapySession?: boolean) => Chat;
  renameChat: (chatId: string, newTitle: string) => void;
  deleteChat: (chatId: string) => void;
  
  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

// API related types
export interface TherapySessionInfo {
  sessionId: string;
  stage: 'initial' | 'assessment' | 'treatment';
  interactionCount: number;
  apiSource: string;
}

export interface ChatSession {
  chatId: string;
  therapyInfo?: TherapySessionInfo;
}