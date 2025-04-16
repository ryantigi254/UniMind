import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import AuthPage from './pages/AuthPage';
import TermsPage from './pages/TermsPage';
import ChatPage from './pages/ChatPage';
import MoodTrackerPage from './pages/MoodTrackerPage';
import JournalPage from './pages/JournalPage';
import SettingsPage from './pages/SettingsPage';
import InfoPage from './pages/InfoPage';
import CompanionPage from './pages/CompanionPage';
import DisclaimerModal from './components/DisclaimerModal';
import { useStore } from './store';
import { supabase } from './lib/supabase';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

function App() {
  console.log('App component rendering...');
  const { settings, disclaimerStatus, setUser } = useStore((state) => ({
    settings: state.settings,
    disclaimerStatus: state.disclaimerStatus,
    setUser: state.setUser,
  }));
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.log('App useEffect: Initial check for session...');
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('App useEffect: getSession result:', initialSession);
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, currentSession: Session | null) => {
        console.log('App useEffect: onAuthStateChange triggered. Event:', _event, 'New session:', currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    );

    return () => {
      console.log('App useEffect: Cleaning up auth listener.');
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const isDark =
    settings.theme === 'dark' ||
    (settings.theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  console.log('App component: Calculated isDark:', isDark, 'Session state:', session);

  return (
    <div className={isDark ? 'dark' : ''}>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/terms" element={<TermsPage />} />
          
          <Route
            path="/*"
            element={
              session ? (
                !disclaimerStatus.accepted ? (
                  <DisclaimerModal />
                ) : (
                  <Layout>
                    <Routes>
                      <Route path="/" element={<ChatPage />} />
                      <Route path="/mood" element={<MoodTrackerPage />} />
                      <Route path="/journal" element={<JournalPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/info" element={<InfoPage />} />
                      <Route 
                        path="/companion" 
                        element={(() => {
                          console.log('Rendering /companion route element...');
                          return <CompanionPage />;
                        })()}
                      />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                )
              ) : (
                session === null ? <Navigate to="/auth" replace /> : <div>Loading Session...</div>
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;