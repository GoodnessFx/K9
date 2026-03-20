import React, { useState, useEffect } from 'react'; 
import { AnimatePresence, motion } from 'motion/react'; 
import { NotificationCenter } from './NotificationCenter'; 
import { Settings } from './Settings'; 
import { 
  Zap, TrendingUp, Shield, Archive, Code, Users, 
  Settings as SettingsIcon, Moon, Sun, Menu, X, 
} from 'lucide-react'; 
 
function K9Mark({ size = 26 }: { size?: number }) { 
  return ( 
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"> 
      <defs> 
        <radialGradient id="km-b" cx="45%" cy="35%" r="60%"> 
          <stop offset="0%" stopColor="#D4A055"/><stop offset="60%" stopColor="#A8732A"/><stop offset="100%" stopColor="#6B4A18"/> 
        </radialGradient> 
        <radialGradient id="km-d" cx="50%" cy="40%" r="55%"> 
          <stop offset="0%" stopColor="#3A2810"/><stop offset="100%" stopColor="#1A1008"/> 
        </radialGradient> 
        <radialGradient id="km-n" cx="35%" cy="30%" r="60%"> 
          <stop offset="0%" stopColor="#5A4A3A"/><stop offset="100%" stopColor="#1A1008"/> 
        </radialGradient> 
        <radialGradient id="km-e" cx="35%" cy="30%" r="70%"> 
          <stop offset="0%" stopColor="#8B5E2A"/><stop offset="70%" stopColor="#3A2010"/><stop offset="100%" stopColor="#0A0605"/> 
        </radialGradient> 
        <radialGradient id="km-c" cx="50%" cy="50%" r="50%"> 
          <stop offset="0%" stopColor="#A78BFA"/><stop offset="100%" stopColor="#6D28D9"/> 
        </radialGradient> 
        <filter id="km-s"> 
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#00000055"/> 
        </filter> 
        <style>{`@keyframes km-np{0%,100%{opacity:.2}50%{opacity:.7}}.km-np{animation:km-np 2s ease-in-out infinite}`}</style> 
      </defs> 
      <g filter="url(#km-s)"> 
        <ellipse cx="26" cy="46" rx="10" ry="8" fill="url(#km-b)"/> 
        <ellipse cx="20" cy="50" rx="14" ry="7" fill="url(#km-b)"/> 
        <ellipse cx="20" cy="48" rx="10" ry="5" fill="url(#km-d)" opacity=".7"/> 
        <ellipse cx="36" cy="30" rx="16" ry="14" fill="url(#km-b)"/> 
        <ellipse cx="34" cy="22" rx="12" ry="8" fill="url(#km-d)" opacity=".85"/> 
        <ellipse cx="42" cy="33" rx="5" ry="4" fill="#D4A055" opacity=".5"/> 
        <ellipse cx="48" cy="36" rx="9" ry="7" fill="url(#km-b)"/> 
        <ellipse cx="49" cy="39" rx="7" ry="4" fill="#C49045"/> 
        <ellipse cx="55" cy="35" rx="4" ry="3" fill="url(#km-n)"/> 
        <ellipse cx="53.5" cy="33.8" rx="1.2" ry=".8" fill="#6A5A4A" opacity=".7"/> 
        <ellipse cx="54" cy="35.5" rx="1" ry=".6" fill="#0A0605"/> 
        <ellipse cx="56.5" cy="35.5" rx="1" ry=".6" fill="#0A0605"/> 
        <circle className="km-np" cx="55" cy="35" r="5" fill="#8B5CF6" opacity=".3"/> 
        <ellipse cx="42" cy="28" rx="4" ry="3.5" fill="url(#km-e)"/> 
        <ellipse cx="40.8" cy="26.8" rx="1.2" ry=".9" fill="white" opacity=".85"/> 
        <path d="M38 24.5C40 23.5 44 23 46 24" stroke="#6B4A18" strokeWidth="1.2" strokeLinecap="round" fill="none"/> 
        <path d="M26 20C25 14 29 10 32 12C30 15 28 18 27 22Z" fill="url(#km-d)"/> 
        <path d="M34 18C33 11 38 7 42 10C39 13 37 17 36 22Z" fill="url(#km-b)"/> 
        <path d="M36 19C35 14 38 10 40 12C38 15 37 18 36.5 21Z" fill="#C8703A" opacity=".6"/> 
        <path d="M24 43Q36 46 46 41" stroke="url(#km-c)" strokeWidth="2.5" strokeLinecap="round" fill="none"/> 
      </g> 
    </svg> 
  ); 
} 
 
const NAV = [ 
  { id: 'dashboard', label: 'Dispatch',    Icon: Zap }, 
  { id: 'radar',     label: 'Hunt',        Icon: TrendingUp }, 
  { id: 'security',  label: 'Is It Safe?', Icon: Shield }, 
  { id: 'vault',     label: 'Saved',       Icon: Archive }, 
  { id: 'dev',       label: 'Tech News',   Icon: Code }, 
  { id: 'community', label: 'Community',   Icon: Users }, 
]; 
 
interface LayoutProps { 
  children: React.ReactNode; 
  activeTab: string; 
  onTabChange: (tab: string) => void; 
} 
 
export function Layout({ children, activeTab, onTabChange }: LayoutProps) { 
  const [dark, setDark]           = useState(true); 
  const [mobileOpen, setMobile]   = useState(false); 
  const [settingsOpen, setSettings] = useState(false); 
 
  useEffect(() => { 
    document.documentElement.classList.toggle('dark', dark); 
  }, [dark]); 
 
  useEffect(() => { 
    const fn = () => { if (window.innerWidth >= 768) setMobile(false); }; 
    window.addEventListener('resize', fn); 
    return () => window.removeEventListener('resize', fn); 
  }, []); 
 
  const bg       = dark ? '#1c1c1c' : '#F7F7F5'; 
  const sbBg     = dark ? '#171717' : '#F0EFE9'; 
  const sbBorder = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; 
  const textMain = dark ? '#ececec' : '#1a1a1a'; 
  const textMut  = dark ? '#8a8a8a' : '#666'; 
  const hoverBg  = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)'; 
  const activeBg = dark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.06)'; 
 
  const Sidebar = () => ( 
    <div style={{ 
      width: 220, minWidth: 220, height: '100vh', 
      background: sbBg, 
      borderRight: `1px solid ${sbBorder}`, 
      display: 'flex', flexDirection: 'column', 
      overflow: 'hidden', flexShrink: 0, 
    }}> 
 
      {/* Logo */} 
      <div style={{ padding: '18px 14px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}> 
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}> 
          <K9Mark size={26} /> 
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.3px', color: textMain }}>K9</span> 
        </div> 
        {mobileOpen && ( 
          <button onClick={() => setMobile(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: textMut, padding: 4, display: 'flex', alignItems: 'center' }}> 
            <X style={{ width: 16, height: 16 }} /> 
          </button> 
        )} 
      </div> 
 
      {/* Nav */} 
      <nav style={{ padding: '4px 8px', flex: 1, overflowY: 'auto' }}> 
        {NAV.map(({ id, label, Icon }) => { 
          const active = activeTab === id; 
          return ( 
            <button 
              key={id} 
              onClick={() => { onTabChange(id); setMobile(false); }} 
              style={{ 
                width: '100%', display: 'flex', alignItems: 'center', gap: 9, 
                padding: '7px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', 
                textAlign: 'left', marginBottom: 1, fontSize: 13, 
                fontWeight: active ? 500 : 400, 
                background: active ? activeBg : 'transparent', 
                color: active ? textMain : textMut, 
                transition: 'background 0.1s, color 0.1s', 
              }} 
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; (e.currentTarget as HTMLButtonElement).style.color = textMain; } }} 
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = textMut; } }} 
            > 
              <Icon style={{ width: 15, height: 15, flexShrink: 0, opacity: active ? 1 : 0.65 }} /> 
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span> 
            </button> 
          ); 
        })} 
      </nav> 
 
      {/* Bottom */} 
      <div style={{ padding: '10px 8px', borderTop: `1px solid ${sbBorder}` }}> 
        {/* Live dot */} 
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', marginBottom: 2 }}> 
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e', flexShrink: 0 }} /> 
          <span style={{ fontSize: 11, color: textMut }}>K9 is watching · sniffs every 90s</span> 
        </div> 
 
        {/* Notifications */} 
        <div style={{ padding: '0 10px 6px' }}> 
          <NotificationCenter /> 
        </div> 
 
        {/* Settings + dark toggle */} 
        <button 
          onClick={() => setSettings(true)} 
          style={{ 
            width: '100%', display: 'flex', alignItems: 'center', gap: 9, 
            padding: '7px 10px', borderRadius: 6, border: 'none', 
            background: 'transparent', cursor: 'pointer', 
            color: textMut, fontSize: 13, transition: 'background 0.1s', 
          }} 
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }} 
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }} 
        > 
          <SettingsIcon style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.65 }} /> 
          <span>Settings</span> 
          <button 
            onClick={e => { e.stopPropagation(); setDark(d => !d); }} 
            style={{ marginLeft: 'auto', border: 'none', background: 'none', cursor: 'pointer', color: textMut, display: 'flex', alignItems: 'center', padding: 2 }} 
            title={dark ? 'Switch to light' : 'Switch to dark'} 
          > 
            {dark ? <Sun style={{ width: 13, height: 13 }} /> : <Moon style={{ width: 13, height: 13 }} />} 
          </button> 
        </button> 
      </div> 
    </div> 
  ); 
 
  return ( 
    <div style={{ 
      display: 'flex', height: '100vh', overflow: 'hidden', 
      background: bg, color: textMain, 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', 
      WebkitFontSmoothing: 'antialiased' as any, 
    }}> 
 
      {/* Desktop sidebar */} 
      <div className="k9-desk-sidebar"> 
        <Sidebar /> 
      </div> 
 
      {/* Mobile sidebar */} 
      <AnimatePresence> 
        {mobileOpen && ( 
          <> 
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setMobile(false)} 
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} 
            /> 
            <motion.div key="sb" initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} 
              transition={{ type: 'spring', stiffness: 320, damping: 32 }} 
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50 }} 
            > 
              <Sidebar /> 
            </motion.div> 
          </> 
        )} 
      </AnimatePresence> 
 
      {/* Right side */} 
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}> 
 
        {/* Mobile top bar */} 
        <div className="k9-mob-bar" style={{ 
          display: 'none', alignItems: 'center', 
          padding: '11px 14px', gap: 10, flexShrink: 0, 
          borderBottom: `1px solid ${sbBorder}`, 
          background: bg, 
        }}> 
          <button onClick={() => setMobile(true)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: textMain, display: 'flex', alignItems: 'center', padding: 4 }}> 
            <Menu style={{ width: 19, height: 19 }} /> 
          </button> 
          <K9Mark size={22} /> 
          <span style={{ fontSize: 15, fontWeight: 700 }}>K9</span> 
        </div> 
 
        {/* Content */} 
        <main className="k9-content" style={{ flex: 1, overflowY: 'auto', padding: '28px 40px' }}> 
          <div style={{ maxWidth: 820, margin: '0 auto', width: '100%' }}> 
            {children} 
          </div> 
        </main> 
      </div> 
 
      <Settings open={settingsOpen} onOpenChange={setSettings} /> 
    </div> 
  ); 
} 
