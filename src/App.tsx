import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Radar from './pages/Radar';
import ScannerPage from './pages/Scanner';
import Telegram from './pages/Telegram';
import Settings from './pages/Settings';
import Saved from './pages/Saved';
import Onboarding from './pages/Onboarding';
import { Toaster } from 'sonner';
import { useSignalStream } from './hooks/useSignalStream';

export default function App() {
  useSignalStream();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('onboarding_complete');
  });

  useEffect(() => {
    if (!showOnboarding) {
      localStorage.setItem('onboarding_complete', 'true');
    }
  }, [showOnboarding]);

  return (
    <AppLayout>
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
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
    </AppLayout>
  );
}
