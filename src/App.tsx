import { useState, useEffect } from 'react'; 
 import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; 
 import AppLayout from './components/AppLayout'; 
 import { Dashboard } from './components/Dashboard'; 
 import Radar from './pages/Radar'; 
 import ScannerPage from './pages/Scanner'; 
 import Telegram from './pages/Telegram'; 
 import Settings from './pages/Settings'; 
 import Saved from './pages/Saved'; 
 import AirdropsPage from './pages/Airdrops'; 
 import JobsPage from './pages/Jobs'; 
 import EscrowPage from './pages/Escrow'; 
 import { DeveloperFeed } from './components/DeveloperFeed'; 
 import { CommunityHub }  from './components/CommunityHub'; 
 import { Onboarding } from './components/Onboarding'; 
 import { Toaster } from 'sonner'; 
 import { ErrorBoundary } from './components/ErrorBoundary'; 
 
 export default function App() { 
   const location = useLocation(); 
   const [hasOnboarded, setHasOnboarded] = useState(() => 
     localStorage.getItem('k9_onboarding_done') === 'true' 
   ); 
 
   useEffect(() => { 
     const v = localStorage.getItem('k9_onboarding_done') === 'true'; 
     if (v !== hasOnboarded) setHasOnboarded(v); 
   }, [location, hasOnboarded]); 
 
   return ( 
     <ErrorBoundary> 
       {!hasOnboarded && ( 
         <Onboarding onComplete={() => { 
           localStorage.setItem('k9_onboarding_done', 'true'); 
           setHasOnboarded(true); 
         }} /> 
       )} 
       <Routes> 
         <Route path="/*" element={ 
           <AppLayout> 
             <Routes> 
               <Route path="/"            element={<Navigate to="/feed" replace />} /> 
               <Route path="/feed"        element={<Dashboard />} /> 
               <Route path="/airdrops"    element={<AirdropsPage />} /> 
               <Route path="/free-money"  element={<AirdropsPage />} /> 
               <Route path="/jobs"        element={<JobsPage />} /> 
               <Route path="/escrow"      element={<EscrowPage />} /> 
               <Route path="/hunt"        element={<Radar />} /> 
               <Route path="/verify"      element={<ScannerPage />} /> 
               <Route path="/saved"       element={<Saved />} /> 
               <Route path="/tech-news"   element={<DeveloperFeed />} /> 
               <Route path="/community"   element={<CommunityHub />} /> 
               <Route path="/alerts"      element={<Telegram />} /> 
               <Route path="/settings"    element={<Settings />} /> 
               <Route path="*"            element={<Navigate to="/feed" replace />} /> 
             </Routes> 
           </AppLayout> 
         } /> 
       </Routes> 
       <Toaster 
         position="top-right" 
         toastOptions={{ 
           style: { 
             background: 'rgba(255,255,255,0.05)', 
             border: '1px solid rgba(255,255,255,0.1)', 
             color: '#ececec', 
             fontSize: 13, 
             fontFamily: "'Inter', -apple-system, sans-serif", 
             borderRadius: 8, 
             backdropFilter: 'blur(12px)', 
           }, 
         }} 
       /> 
     </ErrorBoundary> 
   ); 
 } 
