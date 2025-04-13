---
id: user-management
title: User Management
sidebar_label: User Management
description: Managing user accounts and profiles in UniMind
---

# User Management

This document covers how user accounts and profiles are managed in UniMind.

## User Data Structure

User data in UniMind consists of two main components:

1. **Authentication Data**: Managed by Supabase Auth
2. **Profile Data**: Stored in the database

### Authentication Data

The core user data is managed by Supabase Auth and includes:

- User ID (UUID)
- Email address
- Hashed password
- Email verification status
- Created at timestamp

### User Profile

Additional user profile information can be stored in a `profiles` table:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);
```

## User Registration

User registration is handled by Supabase Auth UI or custom forms:

### Using Supabase Auth UI

```tsx
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

const SignUpPage = () => {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={[]}
      view="sign_up"
    />
  );
};
```

### Using Custom Forms

```tsx
const handleSignUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Handle successful sign up
  } catch (error) {
    // Handle error
  }
};
```

## User Authentication

Similar to registration, authentication can be handled by Supabase Auth UI or custom forms:

### Using Supabase Auth UI

```tsx
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

const SignInPage = () => {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={[]}
      view="sign_in"
    />
  );
};
```

### Using Custom Forms

```tsx
const handleSignIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Handle successful sign in
  } catch (error) {
    // Handle error
  }
};
```

## Session Management

Supabase handles session management automatically. The session is stored in localStorage and refreshed when needed.

```tsx
// Check current session
const checkSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Listen for auth changes
const subscribeToAuthChanges = () => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      // Handle auth state change
    }
  );
  
  return subscription;
};
```

## User Profile Management

### Creating a Profile

When a user signs up, you can create a profile record:

```typescript
// Create a profile when a user signs up
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session) {
    const { user } = session;
    
    // Check if profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    // Create profile if it doesn't exist
    if (!profile) {
      await supabase.from('profiles').insert({
        id: user.id,
        display_name: user.email?.split('@')[0] || 'User',
      });
    }
  }
});
```

### Updating a Profile

Users can update their profile information:

```typescript
const updateProfile = async (profileData) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', user.id);
  
  if (error) throw error;
  
  return data;
};
```

## Password Management

### Password Reset

Supabase provides password reset functionality:

```typescript
const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) throw error;
};
```

### Changing Password

Users can change their password when logged in:

```typescript
const changePassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) throw error;
};
```

## Account Deletion

To delete a user account:

```typescript
const deleteAccount = async () => {
  // This requires admin privileges or a custom API endpoint
  // For security reasons, account deletion is typically handled by a backend function
  
  // Example using a custom API endpoint
  const { error } = await fetch('/api/delete-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
    },
  });
  
  if (error) throw error;
  
  // Sign out after account deletion
  await supabase.auth.signOut();
};
```

## Testing User Management

User management functionality can be tested using Vitest and Testing Library:

```typescript
// src/tests/auth/UserManagement.test.tsx
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { mockSupabaseClient } from '../mocks/supabase';
import ProfilePage from '../../pages/ProfilePage';

// Mock the supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabaseClient,
}));

describe('User Profile Management', () => {
  beforeEach(() => {
    // Setup mocks...
  });

  it('displays user profile information', async () => {
    // Test profile display...
  });

  it('allows updating profile information', async () => {
    // Test profile update...
  });
});
```

## Security Considerations

- **Password Security**: Passwords are hashed and stored securely by Supabase
- **Email Verification**: Optional email verification can be enabled
- **Session Management**: Sessions are managed securely with JWT tokens
- **Data Access**: Row Level Security ensures users can only access their own data

## Next Steps

For more detailed information about authentication and authorization, refer to:
- [Authentication Setup](./setup.md) - Authentication implementation details
- [Authorization](./authorization.md) - Access control and permissions