import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthPage from '../../pages/AuthPage';
import { mockSupabaseClient, mockSuccessfulSignUp, mockSuccessfulSignIn, resetSupabaseMocks } from '../mocks/supabase';
import { useStore } from '../../store';

// Mock the supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabaseClient,
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock store
const mockSetUser = vi.fn();
vi.mock('../../store', () => ({
  useStore: () => ({
    setUser: mockSetUser,
    user: null,
  }),
}));

describe('AuthPage', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    mockSetUser.mockReset();
  });

  it('renders the auth page with sign in form', () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome to UniMind')).toBeInTheDocument();
    expect(screen.getByText(/Sign in to track your mental wellness journey/i)).toBeInTheDocument();
    expect(screen.getByText('Continue without Sign Up')).toBeInTheDocument();
  });

  it('handles successful anonymous sign in', async () => {
    const mockUser = { id: 'anon-123', email: null, is_anonymous: true };
    mockSupabaseClient.auth.signInAnonymously.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    const continueButton = screen.getByText('Continue without Sign Up');
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInAnonymously).toHaveBeenCalled();
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockNavigate).toHaveBeenCalledWith('/terms');
    });
  });

  it('handles anonymous sign in error', async () => {
    mockSupabaseClient.auth.signInAnonymously.mockRejectedValue(new Error('Failed to create anonymous session'));

    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    const continueButton = screen.getByText('Continue without Sign Up');
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText('Could not start session. Please try again.')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('shows loading state during anonymous sign in', async () => {
    mockSupabaseClient.auth.signInAnonymously.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    const continueButton = screen.getByText('Continue without Sign Up');
    fireEvent.click(continueButton);

    expect(screen.getByText('Starting Session...')).toBeInTheDocument();
    expect(continueButton).toBeDisabled();
  });

  it('handles successful sign up and shows verification message', async () => {
    mockSuccessfulSignUp();

    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    // Fill in the sign up form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please check your email for verification instructions/i)).toBeInTheDocument();
    });
  });

  it('shows error for duplicate email registration', async () => {
    mockSupabaseClient.auth.signUp.mockRejectedValue(new Error('User already registered'));

    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    // Fill in the sign up form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already registered')).toBeInTheDocument();
    });
  });

  it('shows error when unverified user attempts to login', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockRejectedValue(new Error('Email not verified'));

    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    // Fill in the login form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'unverified@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Please verify your email before signing in')).toBeInTheDocument();
    });
  });

  it('navigates to terms page when clicking continue without sign up', () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Continue without Sign Up'));
    expect(mockNavigate).toHaveBeenCalledWith('/terms');
  });
});