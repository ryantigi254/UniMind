// store/index.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chat, Message, Settings, StoreState } from '../types';
import { therapyAPI } from '../services/llmService';

interface StoreStateWithActions extends StoreState {
  // Chat management
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  loadChats: () => void;
  saveChats: () => void;
}

export const useStore = create<StoreStateWithActions>()(
  persist(
    (set, get) => ({
      // Sidebar state
      isSidebarCollapsed: false,
      toggleSidebarCollapse: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      // Chat state
      chats: [],
      currentChat: null,

      // Settings
      settings: {
        darkMode: true,
        notifications: true,
        apiEndpoint: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      },

      // Actions
      setCurrentChat: (chat: Chat | null) => {
        set({ currentChat: chat });
        
        // Reset therapy session if switching to a different chat
        if (!chat || !chat.sessionId) {
          therapyAPI.resetSession();
        }
      },

      createNewChat: (title?: string, isTherapySession: boolean = true) => {
        const newChat: Chat = {
          id: crypto.randomUUID(),
          title: title || 'New Conversation',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isTherapySession,
        };

        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChat: newChat,
        }));

        // Reset therapy session for new chat
        therapyAPI.resetSession();

        return newChat;
      },

      addMessage: (chatId: string, message: Message) => {
        set((state) => {
          const updatedChats = state.chats.map((chat) => {
            if (chat.id === chatId) {
              const updatedMessages = [...chat.messages, message];
              
              // Update chat title if it's the first user message
              let updatedTitle = chat.title;
              if (updatedMessages.length === 1 && message.role === 'user') {
                updatedTitle = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
              }

              // Update session ID if available in message metadata
              let updatedSessionId = chat.sessionId;
              if (message.metadata?.sessionId) {
                updatedSessionId = message.metadata.sessionId;
              }

              const updatedChat = {
                ...chat,
                title: updatedTitle,
                messages: updatedMessages,
                updatedAt: new Date(),
                sessionId: updatedSessionId,
              };

              // Update current chat if it's the same one
              if (state.currentChat?.id === chatId) {
                set({ currentChat: updatedChat });
              }

              return updatedChat;
            }
            return chat;
          });

          return { chats: updatedChats };
        });
      },

      addChat: (chat: Chat) => {
        set((state) => ({
          chats: [chat, ...state.chats],
        }));
      },

      updateChat: (chatId: string, updates: Partial<Chat>) => {
        set((state) => {
          const updatedChats = state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, ...updates, updatedAt: new Date() } : chat
          );

          // Update current chat if it's the same one
          const updatedCurrentChat = state.currentChat?.id === chatId
            ? { ...state.currentChat, ...updates, updatedAt: new Date() }
            : state.currentChat;

          return {
            chats: updatedChats,
            currentChat: updatedCurrentChat,
          };
        });
      },

      renameChat: (chatId: string, newTitle: string) => {
        get().updateChat(chatId, { title: newTitle });
      },

      deleteChat: (chatId: string) => {
        set((state) => {
          const updatedChats = state.chats.filter((chat) => chat.id !== chatId);
          
          // Reset current chat if the deleted chat was current
          const updatedCurrentChat = state.currentChat?.id === chatId ? null : state.currentChat;
          
          // Reset therapy session if deleting current chat
          if (state.currentChat?.id === chatId) {
            therapyAPI.resetSession();
          }

          return {
            chats: updatedChats,
            currentChat: updatedCurrentChat,
          };
        });
      },

      updateSettings: (newSettings: Partial<Settings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      loadChats: () => {
        // This is handled by the persist middleware
        console.log('Chats loaded from localStorage');
      },

      saveChats: () => {
        // This is handled by the persist middleware
        console.log('Chats saved to localStorage');
      },
    }),
    {
      name: 'unimind-store',
      partialize: (state) => ({
        chats: state.chats,
        currentChat: state.currentChat,
        settings: state.settings,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
);