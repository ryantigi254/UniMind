import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../store';
import { Mail, Lock, Loader, X } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { toast } from 'react-hot-toast';
import { User } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptchaModalOpen, setIsCaptchaModalOpen] = useState(false);
  const [isWaitingForSignupCaptcha, setIsWaitingForSignupCaptcha] = useState(false);

  useEffect(() => {
    if (user) {
      if (!isCaptchaModalOpen) {
        navigate('/');
      }
    }
  }, [user, isCaptchaModalOpen, navigate]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        setIsWaitingForSignupCaptcha(true);
        setIsCaptchaModalOpen(true);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            throw new Error('Please verify your email before signing in');
          }
          throw new Error('Invalid login credentials');
        }

        if (data.user) {
          setUser(data.user);
          navigate('/terms');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    try {
      setError(null);
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/terms`
        }
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError('Could not sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setError(null);
    setIsCaptchaModalOpen(true);
  };

  const handleCaptchaVerified = async (token: string | null) => {
    if (!token) {
      setError('CAPTCHA verification failed. Please try again.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isWaitingForSignupCaptcha) {
        console.log("[handleCaptchaVerified] Pre-Signup CAPTCHA token received.");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            captchaToken: token,
            data: { 
              full_name: name,
            },
          }
        });

        setIsWaitingForSignupCaptcha(false);

        if (error) {
          if (error.message.includes('already registered')) {
            throw new Error('Email already registered');
          } else if (error.message.includes('captcha verification process failed')) {
            throw new Error('CAPTCHA verification failed on server. Please try signing up again.');
          } else {
            throw error;
          }
        }

        if (data?.user) {
          toast.success('Signup successful! Please check your email for verification.');
          setEmail('');
          setPassword('');
          setName('');
          setIsCaptchaModalOpen(false);
        }

      } else {
        console.log("[handleCaptchaVerified] Anonymous Sign-In CAPTCHA token:", token);
        const { data, error } = await supabase.auth.signInAnonymously({
          options: {
            captchaToken: token
          }
        });

        if (error) throw error;

        if (data.user) {
          setUser(data.user);
          setIsCaptchaModalOpen(false);
          setIsWaitingForSignupCaptcha(false);
          navigate('/terms');
        }
      }
    } catch (err: any) {
      console.error('Error during/after CAPTCHA:', err);
      setError(err.message || 'Could not complete process after verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Welcome to UniMind</h1>
          <p className="text-gray-400 text-sm sm:text-base">Your mental wellness companion</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-700">
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-xs sm:text-sm text-center">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 rounded-xl transition-colors flex items-center justify-center gap-3 mb-4 sm:mb-6 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
            aria-label="Sign in with Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-4 sm:mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4 sm:space-y-5">
            {isSignUp && (
              <div className="space-y-1">
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 sm:h-12 pl-4 sm:pl-5 pr-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm sm:text-base"
                    placeholder="Enter your full name"
                    required
                    aria-label="Full Name"
                  />
                </div>
              </div>
            )}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 sm:h-12 pl-9 sm:pl-10 pr-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm sm:text-base"
                  placeholder="Enter your email"
                  required
                  aria-label="Email address"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 sm:h-12 pl-9 sm:pl-10 pr-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm sm:text-base"
                  placeholder="Enter your password"
                  required
                  aria-label="Password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 sm:h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Please wait...
                </>
              ) : (
                isSignUp ? 'Sign Up' : 'Sign In'
              )}
            </button>

            <div className="text-center mt-4 sm:mt-6">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs sm:text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>

          <div className="relative mt-4 sm:mt-6 mb-4 sm:mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or</span>
            </div>
          </div>

          <button
            onClick={handleAnonymousSignIn}
            disabled={isLoading}
            className="w-full h-11 sm:h-12 bg-gray-600 hover:bg-gray-500 text-white rounded-xl transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold"
          >
            Continue without Sign Up
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            Note: Your data won't be saved without an account
          </p>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6 sm:mt-8">
          By signing up, you agree to our <Link to="/terms" className="underline hover:text-gray-400">Terms of Service</Link> and <Link to="/privacy" className="underline hover:text-gray-400">Privacy Policy</Link>.
        </p>
      </div>

      {isCaptchaModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 shadow-primary-500/40 relative w-full max-w-sm">
            <button
              onClick={() => {
                setIsCaptchaModalOpen(false);
                setError(null);
                setIsWaitingForSignupCaptcha(false);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
              aria-label="Close CAPTCHA modal"
              disabled={isLoading}
            >
              <X size={20} />
            </button>

            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center">
              {isWaitingForSignupCaptcha ? 'Verify Signup' : 'Quick Security Check'}
            </h2>
            <p className="text-gray-400 text-sm mb-6 text-center">
              {isWaitingForSignupCaptcha
                ? 'Please complete the challenge below to finish signing up.'
                : 'Please complete the challenge below to continue.'}
            </p>

            <div className="flex justify-center mb-4">
              <HCaptcha
                key={isWaitingForSignupCaptcha ? 'signup' : 'anonymous'}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''}
                onVerify={handleCaptchaVerified}
                onError={(err) => {
                  console.error("hCaptcha error:", err);
                  setError(`CAPTCHA error: ${err}. Please try again.`);
                  setIsLoading(false);
                }}
                onExpire={() => {
                  console.log("hCaptcha expired");
                  setError('CAPTCHA challenge expired. Please try again.');
                  setIsLoading(false);
                }}
              />
            </div>

            {isLoading && (
               <div className="flex justify-center items-center mb-4">
                   <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary-500" />
                   <span className="ml-2 text-sm text-gray-400">Verifying...</span>
               </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-xs text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;