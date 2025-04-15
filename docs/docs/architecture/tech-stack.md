---
id: tech-stack
title: Technology Stack
sidebar_label: Tech Stack
description: Detailed overview of the technologies used in UniMind
---

# Technology Stack

UniMind is built using a modern JavaScript/TypeScript stack with a focus on performance, developer experience, and maintainability. This document provides details about the technologies used in the application.

## Frontend Technologies

### Core

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.3.1 | UI library for building component-based interfaces |
| TypeScript | ^5.5.3 | Static typing for JavaScript to improve developer experience |
| Vite | ^5.4.2 | Build tool and development server |

### State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| Zustand | ^4.5.2 | Lightweight state management library |

### Routing

| Technology | Version | Purpose |
|------------|---------|---------|
| React Router | ^6.22.3 | Client-side routing library |

### Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | ^3.4.1 | Utility-first CSS framework |
| PostCSS | ^8.4.35 | CSS transformation tool |
| Autoprefixer | ^10.4.18 | Automatically adds vendor prefixes to CSS |

### UI Components & Visualization

| Technology | Version | Purpose |
|------------|---------|---------|
| Framer Motion | ^11.0.8 | Animation library |
| Lucide React | ^0.344.0 | Icon library |
| Recharts | ^2.12.2 | Charting library for data visualization |
| React Quill | ^2.0.0 | Rich text editor for journaling |
| React Markdown | ^9.0.1 | Markdown rendering |

## Backend Technologies

### Authentication & Database

| Technology | Version | Purpose |
|------------|---------|---------|
| Supabase | ^2.39.7 | Backend-as-a-Service for auth and database |
| @supabase/auth-ui-react | ^0.4.7 | Pre-built auth UI components |
| @supabase/auth-ui-shared | ^0.1.8 | Shared utilities for auth UI |

### Date & Time

| Technology | Version | Purpose |
|------------|---------|---------|
| date-fns | ^3.3.1 | Date utility library |

## Development & Testing

### Testing

| Technology | Version | Purpose |
|------------|---------|---------|
| Vitest | ^1.6.1 | Unit and integration testing framework |
| @testing-library/react | ^14.3.1 | Testing utilities for React |
| @testing-library/jest-dom | ^6.6.3 | DOM testing utilities |
| @testing-library/user-event | ^14.6.1 | User event simulation for testing |
| Playwright | ^1.51.1 | End-to-end testing framework |
| MSW | ^2.7.3 | API mocking for tests |

### Linting & Formatting

| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | ^9.9.1 | JavaScript and TypeScript linter |
| typescript-eslint | ^8.3.0 | TypeScript ESLint plugin |

### Documentation

| Technology | Version | Purpose |
|------------|---------|---------|
| Docusaurus | ^3.1.1 | Documentation site generator |

## Environment Setup

### Development Environment

- Node.js >= 18.0
- npm or yarn for package management
- Modern web browser with developer tools

### Production Environment

- Static hosting service (Netlify, Vercel, GitHub Pages, etc.)
- Supabase project for backend services

## Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite configuration |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.js` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS configuration |
| `eslint.config.js` | ESLint configuration |
| `vitest.config.ts` | Vitest configuration |
| `playwright.config.ts` | Playwright configuration |

## Dependencies Management

Dependencies are managed through npm and defined in `package.json`. The project uses semantic versioning to ensure compatibility between packages.

## Recommended Development Tools

- Visual Studio Code with extensions:
  - ESLint
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin
  - Playwright Test for VSCode
- React Developer Tools browser extension
- Supabase CLI for local development

## Version Control

The project uses Git for version control with the following branch strategy:
- `main`: Production-ready code
- `develop`: Integration branch for feature development
- Feature branches: For individual feature development

## Next Steps

For more detailed information about specific parts of the tech stack, refer to:
- [Data Flow](./data-flow.md) - How data flows through the application
- [Authentication Setup](../authentication/setup.md) - Authentication implementation details