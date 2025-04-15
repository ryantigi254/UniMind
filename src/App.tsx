import React from 'react';
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
import DisclaimerModal from './components/DisclaimerModal';
import { useStore } from './store';

function App() {
  const { settings, disclaimerStatus } = useStore();

  const isDark =
    settings.theme === 'dark' ||
    (settings.theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className={isDark ? 'dark' : ''}>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/terms" element={<TermsPage />} />
          
          {/* Keep protected routes commented out for now */}
          {/*
          <Route
            path="/*"
            element={
              <AuthGuard>
                {!disclaimerStatus.accepted ? (
                  <DisclaimerModal />
                ) : (
                  <Layout>
                    <Routes>
                      <Route path="/" element={<ChatPage />} />
                      <Route path="/mood" element={<MoodTrackerPage />} />
                      <Route path="/journal" element={<JournalPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/info" element={<InfoPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                )}
              </AuthGuard>
            }
          />
          */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;