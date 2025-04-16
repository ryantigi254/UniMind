import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Chat, Message, MoodEntry, JournalEntry, UserSettings, DisclaimerStatus } from '../types';
import { User, Session } from '@supabase/supabase-js';

interface State {
  user: User | null;
  session: Session | null;
  chats: Chat[];
  currentChat: Chat | null;
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  settings: UserSettings;
  disclaimerStatus: DisclaimerStatus;
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  isLoading: boolean;
  error: string | null;
}

interface Actions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setCurrentChat: (chat: Chat | null) => void;
  addChat: (chat: Chat) => void;
  renameChat: (chatId: string, newTitle: string) => void;
  deleteChat: (chatId: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  addMoodEntry: (entry: MoodEntry) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setDisclaimerAccepted: (accepted: boolean) => void;
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  setError: (error: string | null) => void;
  clearAllData: () => void;
}

const initialSettings: UserSettings = {
  theme: 'system',
  chatbotTone: 'friendly',
  memoryEnabled: true,
  accessibility: {
    fontSize: 'normal',
    highContrast: false,
  },
};

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      chats: [],
      currentChat: null,
      moodEntries: [],
      journalEntries: [],
      settings: initialSettings,
      disclaimerStatus: { accepted: false },
      isSidebarOpen: true,
      isSidebarCollapsed: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      
      setCurrentChat: (chat) => set({ currentChat: chat }),
      
      addChat: (chat) =>
        set((state) => ({
          chats: [chat, ...state.chats],
          currentChat: chat,
        })),

      renameChat: (chatId, newTitle) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, title: newTitle }
              : chat
          ),
          currentChat: state.currentChat?.id === chatId
            ? { ...state.currentChat, title: newTitle }
            : state.currentChat,
        })),

      deleteChat: (chatId) =>
        set((state) => {
          const newChats = state.chats.filter((chat) => chat.id !== chatId);
          return {
            chats: newChats,
            currentChat: state.currentChat?.id === chatId
              ? newChats[0] || null
              : state.currentChat,
          };
        }),

      addMessage: (chatId, message) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { 
                  ...chat, 
                  messages: [...chat.messages, message],
                  updatedAt: new Date(),
                }
              : chat
          ),
          currentChat: state.currentChat?.id === chatId
            ? {
                ...state.currentChat,
                messages: [...state.currentChat.messages, message],
                updatedAt: new Date(),
              }
            : state.currentChat,
        })),

      addMoodEntry: (entry) =>
        set((state) => ({
          moodEntries: [...state.moodEntries, entry],
        })),

      addJournalEntry: (entry) =>
        set((state) => ({
          journalEntries: [...state.journalEntries, entry],
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      setDisclaimerAccepted: (accepted) =>
        set((state) => ({
          disclaimerStatus: {
            accepted,
            acceptedAt: accepted ? new Date() : undefined,
          },
        })),

      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      toggleSidebarCollapse: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      setError: (error) => set({ error }),

      clearAllData: () =>
        set({
          chats: [],
          moodEntries: [],
          journalEntries: [],
          currentChat: null,
        }),
    }),
    {
      name: 'unimind-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        disclaimerStatus: state.disclaimerStatus,
        isSidebarCollapsed: state.isSidebarCollapsed,
        chats: state.chats,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);