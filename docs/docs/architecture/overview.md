---
id: overview
title: Architecture Overview
sidebar_label: Overview
description: High-level architecture of the UniMind application
---

# Architecture Overview

UniMind follows a modern frontend architecture with a focus on performance, maintainability, and user experience. This document provides a high-level overview of the system architecture.

## System Architecture

The application follows a client-side architecture with backend services provided by Supabase:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Application                      │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │    React    │    │   Zustand   │    │  React Router   │  │
│  │  Components │◄───│    Store    │◄───│                 │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
│          ▲                 ▲                   ▲            │
│          │                 │                   │            │
│          ▼                 ▼                   ▼            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │   Services  │    │    Utils    │    │     Hooks       │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
│          ▲                                                  │
└──────────┼──────────────────────────────────────────────────┘
           │
┌──────────┼──────────────────────────────────────────────────┐
│          ▼                                                  │
│  ┌─────────────────────────┐    ┌─────────────────────────┐ │
│  │                         │    │                         │ │
│  │    Supabase Auth        │    │    Supabase Database    │ │
│  │                         │    │                         │ │
│  └─────────────────────────┘    └─────────────────────────┘ │
│                                                             │
│                       Supabase Backend                       │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### Frontend

- **React**: Core UI library for building the user interface
- **TypeScript**: Provides type safety and better developer experience
- **Zustand**: Lightweight state management solution
- **React Router**: Handles client-side routing
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for UI interactions
- **Recharts**: Charting library for data visualization

### Backend (Supabase)

- **Supabase Auth**: Handles user authentication and session management
- **Supabase Database**: PostgreSQL database for storing user data
- **Row Level Security (RLS)**: Enforces data access policies at the database level

## Data Flow

1. **User Authentication**:
   - User signs up or logs in through the Auth UI
   - Supabase Auth handles authentication and returns a session
   - The session is stored in the Zustand store and local storage

2. **Data Operations**:
   - Components trigger actions in the Zustand store
   - Store actions call Supabase services to perform CRUD operations
   - Database operations are secured by Row Level Security policies
   - Results are stored in the Zustand store and reflected in the UI

3. **Real-time Updates**:
   - Supabase subscriptions can be used for real-time updates
   - Updates trigger store actions to update the UI

## Directory Structure

The application follows a feature-based directory structure:

```
src/
├── components/       # Reusable UI components
│   ├── Layout/       # Layout components
│   ├── Auth/         # Authentication components
│   ├── MoodTracker/  # Mood tracking components
│   └── ...
├── pages/            # Page components for routing
├── store/            # Zustand store and slices
├── services/         # API and service functions
├── lib/              # Utility functions and helpers
├── types/            # TypeScript type definitions
└── tests/            # Test files
```

## Security Considerations

- **Authentication**: Handled by Supabase Auth with JWT tokens
- **Data Access**: Controlled by Row Level Security policies in Supabase
- **Environment Variables**: Sensitive information stored in environment variables
- **CORS**: Configured to allow only specific origins

## Performance Optimizations

- **Code Splitting**: Implemented via React Router for route-based code splitting
- **Lazy Loading**: Components and routes are lazy-loaded when needed
- **Memoization**: React.memo and useMemo for expensive computations
- **Virtualization**: Used for long lists to improve rendering performance

## Next Steps

For more detailed information about specific parts of the architecture, refer to:

- [Tech Stack](./tech-stack.md) - Detailed information about technologies used
- [Data Flow](./data-flow.md) - In-depth explanation of data flow patterns
- [Authentication Setup](../authentication/setup.md) - Authentication implementation details