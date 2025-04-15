import { createClient } from '@supabase/supabase-js';
import { vi } from 'vitest';

// Mock Supabase client
export const mockSupabaseClient = {
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signInAnonymously: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
  },
  from: vi.fn(() => ({
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  })),
};

// Helper to reset all mocks between tests
export const resetSupabaseMocks = () => {
  Object.values(mockSupabaseClient.auth).forEach(mock => {
    if (typeof mock === 'function') {
      mock.mockReset();
    }
  });
};

// Mock successful sign up response
export const mockSuccessfulSignUp = () => {
  mockSupabaseClient.auth.signUp.mockResolvedValue({
    data: {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      },
      session: {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
      },
    },
    error: null,
  });
};

// Mock successful sign in response
export const mockSuccessfulSignIn = () => {
  mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
    data: {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      },
      session: {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
      },
    },
    error: null,
  });
};

// Mock successful anonymous sign in response
export const mockSuccessfulAnonymousSignIn = () => {
  mockSupabaseClient.auth.signInAnonymously.mockResolvedValue({
    data: {
      user: {
        id: 'anon-user-id',
        email: null,
        is_anonymous: true,
      },
      session: {
        access_token: 'anon-access-token',
        refresh_token: 'anon-refresh-token',
      },
    },
    error: null,
  });
};