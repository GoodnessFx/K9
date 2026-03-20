import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { Dashboard } from './components/Dashboard';
import Radar from './pages/Radar';
import ScannerPage from './pages/Scanner';
import Telegram from './pages/Telegram';
import Settings from './pages/Settings';
import Saved from './pages/Saved';
import { Onboarding } from './components/Onboarding';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const location = useLocation();
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem('k9_onboarding_done') === 'true';
  });

  useEffect(() => {
    const onboarded = localStorage.getItem('k9_onboarding_done') === 'true';
    if (onboarded !== hasOnboarded) {
      setHasOnboarded(onboarded);
    }
  }, [location, hasOnboarded]);

  const completeOnboarding = () => {
    localStorage.setItem('k9_onboarding_done', 'true');
    setHasOnboarded(true);
  };

  return (
    <ErrorBoundary>
      {!hasOnboarded && <Onboarding onComplete={completeOnboarding} />}
      <Routes>
        <Route
          path="/*"
          element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/feed" replace />} />
                <Route path="/feed" element={<Dashboard />} />
                <Route path="/hunt" element={<Radar />} />
                <Route path="/verify" element={<ScannerPage />} />
                <Route path="/free-money" element={<Dashboard />} />
                <Route path="/jobs" element={<Dashboard />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/alerts" element={<Telegram />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/feed" replace />} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
      <Toaster 
        theme="dark" 
        richColors 
        position="top-right"
        toastOptions={{
          className: 'glass-card border-border/10 font-sans',
          style: {
            background: 'rgba(15, 23, 33, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            color: '#fff',
          },
        }}
      />
    </ErrorBoundary>
  );
}
