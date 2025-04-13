---
id: setup
title: Authentication Setup
sidebar_label: Setup
description: Setting up authentication with Supabase in UniMind
---

# Authentication Setup

UniMind uses Supabase Authentication for user management. This document explains how authentication is set up and implemented in the application.

## Overview

Supabase Auth provides a complete authentication system with multiple providers. UniMind uses email/password authentication with the following features:

- User registration and login
- Session management
- Protected routes
- User profile management

## Supabase Setup

### Project Configuration

1. Create a Supabase project in the [Supabase Dashboard](https://app.supabase.com)
2. Enable Email Auth provider in Authentication settings
3. Configure email templates for verification (optional)
4. Set up Row Level Security (RLS) policies for database tables

### Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

:::caution
Never commit your `.env` file to version control. Make sure it's included in your `.gitignore` file.
:::

## Supabase Client Initialization

The Supabase client is initialized in a dedicated file:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

## Database Types

TypeScript types for the database schema are defined in a separate file:

```typescript
// src/lib/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      mood_entries: {
        Row: {
          id: string
          user_id: string
          mood_rating: number
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood_rating: number
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood_rating?: number
          note?: string | null
          created_at?: string
        }
      }
      // Other tables...
    }
  }
}
```

## Authentication Components

### Auth Page

The main authentication page uses Supabase Auth UI components:

```tsx
// src/pages/AuthPage.tsx
import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../store';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to UniMind</h1>
          <p className="text-gray-400">Sign in to track your mental wellness journey</p>
        </div>

        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#FF007A',
                    brandAccent: '#CC0062',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
                label: 'auth-label',
              },
            }}
            providers={[]}
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
```

### Auth Guard

A higher-order component that protects routes requiring authentication:

```tsx
// src/components/AuthGuard.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../store';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { setUser } = useStore();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, setUser]);

  return <>{children}</>;
};

export default AuthGuard;
```

## Route Protection

Protected routes are wrapped with the AuthGuard component:

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
// Other imports...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        
        <Route
          path="/*"
          element={
            <AuthGuard>
              <Layout>
                <Routes>
                  <Route path="/" element={<ChatPage />} />
                  <Route path="/mood" element={<MoodTrackerPage />} />
                  {/* Other routes... */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
```

## User State Management

User state is managed in the Zustand store:

```typescript
// src/store/index.ts (partial)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';

interface State {
  user: User | null;
  // Other state...
}

interface Actions {
  setUser: (user: User | null) => void;
  // Other actions...
}

export const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      user: null,
      // Other state...

      setUser: (user) => set({ user }),
      // Other actions...
    }),
    {
      name: 'unimind-storage',
      partialize: (state) => ({
        // Don't persist sensitive user data to localStorage
        settings: state.settings,
        disclaimerStatus: state.disclaimerStatus,
        isSidebarCollapsed: state.isSidebarCollapsed,
        chats: state.chats,
      }),
    }
  )
);
```

## Testing Authentication

Authentication is tested using both unit tests and end-to-end tests:

```typescript
// src/tests/auth/AuthPage.test.tsx
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthPage from '../../pages/AuthPage';
import { mockSupabaseClient, mockSuccessfulSignUp, mockSuccessfulSignIn } from '../mocks/supabase';

// Mock the supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabaseClient,
}));

describe('AuthPage', () => {
  beforeEach(() => {
    // Setup mocks...
  });

  it('handles successful sign up', async () => {
    mockSuccessfulSignUp();
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );
    
    // Test sign up flow...
  });

  it('handles successful sign in', async () => {
    mockSuccessfulSignIn();
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );
    
    // Test sign in flow...
  });
});
```

## Security Considerations

- **JWT Tokens**: Supabase uses JWT tokens for authentication, which are stored securely
- **HTTPS**: All communication with Supabase is over HTTPS
- **Row Level Security**: Database access is restricted by RLS policies
- **Session Expiry**: Sessions expire after a configurable period
- **Password Policies**: Enforce strong passwords (configurable in Supabase)

## Next Steps

For more detailed information about authentication, refer to:
- [User Management](./user-management.md) - User profile and account management
- [Authorization](./authorization.md) - Access control and permissions