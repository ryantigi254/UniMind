---
id: data-flow
title: Data Flow
sidebar_label: Data Flow
description: Detailed explanation of data flow patterns in UniMind
---

# Data Flow

This document explains how data flows through the UniMind application, from user interactions to database storage and back.

## Overview

UniMind follows a unidirectional data flow pattern, where:

1. User interactions trigger actions
2. Actions update the global state
3. State changes cause UI updates
4. Data is persisted to the database when needed

## Data Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │     │    React    │     │   Zustand   │     │  Supabase   │
│ Interaction │────►│ Components  │────►│    Store    │────►│  Database   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           ▲                   │                   │
                           │                   │                   │
                           └───────────────────┴───────────────────┘
                                        Data Flow
```

## Detailed Flow

### 1. User Interaction to Component

When a user interacts with the application (e.g., submits a mood entry):

```jsx
// MoodTrackerPage.tsx
const handleMoodSubmit = async () => {
  if (!selectedMood) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase.from('mood_entries').insert({
      user_id: user.id,
      mood_rating: selectedMood,
      note: note.trim() || null,
    });

    if (error) throw error;

    setSelectedMood(null);
    setNote('');
    await fetchMoodEntries();
  } catch (err) {
    console.error('Error saving mood entry:', err);
    setError('Failed to save mood entry');
  }
};
```

### 2. Component to Store

For more complex state management, the component calls a store action:

```jsx
// Component
import { useStore } from '../store';

const ChatPage = () => {
  const { addMessage, currentChat } = useStore();
  
  const handleSendMessage = (content) => {
    const message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    addMessage(currentChat.id, message);
  };
};
```

### 3. Store Action

The store action updates the state and may interact with the database:

```typescript
// store/index.ts
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
```

### 4. Database Interaction

Database operations are typically handled through Supabase client:

```typescript
// services/moodService.ts
export async function saveMoodEntry(moodRating, note) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase.from('mood_entries').insert({
    user_id: user.id,
    mood_rating: moodRating,
    note: note || null,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}
```

### 5. State Update and UI Refresh

When the store state changes, components that consume that state are automatically re-rendered:

```jsx
// Component using store state
const MoodTrackerPage = () => {
  const { moodEntries } = useStore();
  
  return (
    <div>
      {moodEntries.map(entry => (
        <MoodEntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
};
```

## Persistence Patterns

### Local Storage Persistence

Zustand uses the `persist` middleware to save certain parts of the state to localStorage:

```typescript
export const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      // State and actions...
    }),
    {
      name: 'unimind-storage',
      partialize: (state) => ({
        settings: state.settings,
        disclaimerStatus: state.disclaimerStatus,
        isSidebarCollapsed: state.isSidebarCollapsed,
        chats: state.chats,
      }),
    }
  )
);
```

### Database Persistence

Critical user data is stored in the Supabase PostgreSQL database:

- User authentication data
- Mood entries
- Journal entries (future implementation)

## Data Security

### Row Level Security (RLS)

Supabase uses PostgreSQL's Row Level Security to ensure users can only access their own data:

```sql
-- Example RLS policy for mood_entries table
CREATE POLICY "Users can only access their own mood entries"
ON mood_entries
FOR ALL
USING (auth.uid() = user_id);
```

### Client-Side Security

- JWT tokens are stored securely and refreshed automatically by Supabase
- Sensitive operations validate user authentication before proceeding
- Environment variables are used for API keys and endpoints

## Error Handling

Errors are handled at multiple levels:

1. **Component Level**: UI feedback for user actions
2. **Store Level**: State updates for error conditions
3. **Service Level**: Error throwing and handling for API calls

Example error handling:

```typescript
try {
  const result = await someAsyncOperation();
  // Handle success
} catch (error) {
  // Log error
  console.error('Operation failed:', error);
  
  // Update UI state
  setError('Something went wrong. Please try again.');
  
  // Optionally report to monitoring service
}
```

## Optimistic Updates

For better user experience, some operations use optimistic updates:

1. Update the UI immediately assuming success
2. Perform the actual operation asynchronously
3. Revert the UI change if the operation fails

```typescript
// Example of optimistic update
const addMoodEntry = async (entry) => {
  // Generate temporary ID
  const tempId = `temp-${Date.now()}`;
  
  // Optimistically add to state
  set((state) => ({
    moodEntries: [...state.moodEntries, { ...entry, id: tempId }]
  }));
  
  try {
    // Actual API call
    const { data, error } = await supabase.from('mood_entries').insert(entry);
    
    if (error) throw error;
    
    // Update with real data
    set((state) => ({
      moodEntries: state.moodEntries.map(e => 
        e.id === tempId ? { ...data[0] } : e
      )
    }));
  } catch (error) {
    // Revert on failure
    set((state) => ({
      moodEntries: state.moodEntries.filter(e => e.id !== tempId)
    }));
    console.error('Failed to add mood entry:', error);
  }
};
```

## Next Steps

For more detailed information about specific data flows, refer to:
- [Authentication Setup](../authentication/setup.md) - Authentication data flow
- [Mood Tracking Data Model](../features/mood-tracking/data-model.md) - Mood tracking data structure