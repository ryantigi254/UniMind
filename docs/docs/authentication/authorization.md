---
id: authorization
title: Authorization
sidebar_label: Authorization
description: Access control and permissions in UniMind
---

# Authorization

This document covers how authorization and access control are implemented in UniMind to ensure users can only access their own data.

## Overview

UniMind uses Supabase's Row Level Security (RLS) policies to enforce authorization rules at the database level. This ensures that users can only access and modify their own data, regardless of how the application is accessed.

## Row Level Security (RLS)

Row Level Security is a PostgreSQL feature that restricts which rows can be returned by normal queries or modified by insert, update, and delete commands. Supabase makes it easy to implement RLS policies.

### Enabling RLS

RLS must be enabled for each table:

```sql
-- Enable RLS on the mood_entries table
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
```

### RLS Policies

RLS policies define the conditions under which operations are allowed:

```sql
-- Allow users to select only their own mood entries
CREATE POLICY "Users can view their own mood entries"
ON mood_entries
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert only their own mood entries
CREATE POLICY "Users can insert their own mood entries"
ON mood_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own mood entries
CREATE POLICY "Users can update their own mood entries"
ON mood_entries
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete only their own mood entries
CREATE POLICY "Users can delete their own mood entries"
ON mood_entries
FOR DELETE
USING (auth.uid() = user_id);
```

## Database Schema with RLS

Here's an example of how the mood entries table is created with RLS:

```sql
-- Create the mood_entries table
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_rating SMALLINT NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 5),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create an index for faster queries
CREATE INDEX idx_mood_entries_user_created_at ON mood_entries(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own mood entries"
ON mood_entries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood entries"
ON mood_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood entries"
ON mood_entries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries"
ON mood_entries FOR DELETE
USING (auth.uid() = user_id);
```

## Client-Side Authorization

While RLS provides server-side security, the client application also implements authorization checks:

### Auth Guard Component

The `AuthGuard` component ensures that only authenticated users can access protected routes:

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

### Protected Routes

Routes that require authentication are wrapped with the `AuthGuard` component:

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import AuthPage from './pages/AuthPage';
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
```

## Role-Based Access Control (Future Enhancement)

For future versions of UniMind, role-based access control could be implemented:

```sql
-- Create a roles enum
CREATE TYPE user_role AS ENUM ('user', 'premium', 'admin');

-- Add a role column to the profiles table
ALTER TABLE profiles ADD COLUMN role user_role NOT NULL DEFAULT 'user';

-- Create RLS policies based on roles
CREATE POLICY "Admins can view all mood entries"
ON mood_entries FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

## Testing Authorization

Authorization can be tested using both unit tests and end-to-end tests:

```typescript
// src/tests/auth/Authorization.test.tsx
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { mockSupabaseClient } from '../mocks/supabase';
import AuthGuard from '../../components/AuthGuard';

// Mock the supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabaseClient,
}));

describe('Authorization', () => {
  beforeEach(() => {
    // Setup mocks...
  });

  it('redirects to auth page when not authenticated', async () => {
    // Mock no session
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    const navigate = vi.fn();
    
    // Mock useNavigate
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => navigate,
      };
    });
    
    render(
      <BrowserRouter>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/auth');
    });
  });

  it('allows access when authenticated', async () => {
    // Mock valid session
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-user-id', email: 'test@example.com' },
          access_token: 'test-token',
        },
      },
      error: null,
    });
    
    render(
      <BrowserRouter>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});
```

## Security Best Practices

1. **Defense in Depth**: Implement security at multiple levels (database, API, client)
2. **Least Privilege**: Grant only the permissions needed for each operation
3. **Validate User Input**: Always validate and sanitize user input
4. **Secure API Endpoints**: Ensure all API endpoints check authentication
5. **Audit Logging**: Log security-relevant events for auditing
6. **Regular Testing**: Conduct security testing regularly

## Next Steps

For more detailed information about authentication and security, refer to:
- [Authentication Setup](./setup.md) - Authentication implementation details
- [Data Flow](../architecture/data-flow.md) - How data flows through the application