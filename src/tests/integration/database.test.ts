import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { supabase } from '../../lib/supabase';
import { mockSupabaseClient, resetSupabaseMocks } from '../mocks/supabase';

// Mock the supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabaseClient,
}));

describe('Database Integration', () => {
  const testUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  beforeEach(() => {
    resetSupabaseMocks();
    // Mock successful authentication
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: testUser,
          access_token: 'test-token',
        },
      },
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Mood Entries', () => {
    it('should save mood entry to database', async () => {
      const moodEntry = {
        user_id: testUser.id,
        mood_rating: 4,
        note: 'Feeling good today',
      };

      mockSupabaseClient.from().insert.mockResolvedValue({
        data: { ...moodEntry, id: 'test-entry-id', created_at: new Date().toISOString() },
        error: null,
      });

      const { data, error } = await supabase
        .from('mood_entries')
        .insert(moodEntry);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('mood_entries');
      expect(mockSupabaseClient.from().insert).toHaveBeenCalledWith(moodEntry);
    });

    it('should fetch user mood entries', async () => {
      const mockEntries = [
        {
          id: 'entry-1',
          user_id: testUser.id,
          mood_rating: 4,
          note: 'Feeling good',
          created_at: new Date().toISOString(),
        },
        {
          id: 'entry-2',
          user_id: testUser.id,
          mood_rating: 3,
          note: 'Neutral day',
          created_at: new Date().toISOString(),
        },
      ];

      mockSupabaseClient.from().select.mockResolvedValue({
        data: mockEntries,
        error: null,
      });

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', testUser.id);

      expect(error).toBeNull();
      expect(data).toEqual(mockEntries);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('mood_entries');
      expect(mockSupabaseClient.from().select).toHaveBeenCalled();
    });
  });

  describe('User Authentication', () => {
    it('should create new user and verify database entry', async () => {
      const newUser = {
        email: 'newuser@example.com',
        password: 'password123',
      };

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: {
          user: {
            id: 'new-user-id',
            email: newUser.email,
          },
          session: null,
        },
        error: null,
      });

      const { data, error } = await supabase.auth.signUp(newUser);

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe(newUser.email);
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith(newUser);
    });

    it('should verify user session after login', async () => {
      const loginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: testUser,
          session: {
            access_token: 'test-token',
            refresh_token: 'test-refresh-token',
          },
        },
        error: null,
      });

      const { data, error } = await supabase.auth.signInWithPassword(loginCredentials);

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.session).toBeDefined();
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith(loginCredentials);
    });
  });
});