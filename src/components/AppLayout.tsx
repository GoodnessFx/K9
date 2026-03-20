import React, { useState, useEffect } from 'react'; 
import { AnimatePresence, motion } from 'motion/react'; 
import { NotificationCenter } from './NotificationCenter'; 
import { Settings } from './Settings'; 
import { useLocation, useNavigate } from 'react-router-dom';
import LogoMark from './LogoMark';
import { 
  Zap, TrendingUp, Shield, Archive, Code, Users, 
  Settings as SettingsIcon, Moon, Sun, Menu, X, 
} from 'lucide-react'; 
 
const NAV = [ 
  { id: 'dashboard', label: 'Dispatch',    Icon: Zap, path: '/feed' }, 
  { id: 'radar',     label: 'Hunt',        Icon: TrendingUp, path: '/hunt' }, 
  { id: 'security',  label: 'Is It Safe?', Icon: Shield, path: '/verify' }, 
  { id: 'vault',     label: 'Saved',       Icon: Archive, path: '/saved' }, 
  { id: 'dev',       label: 'Tech News',   Icon: Code, path: '/feed' }, 
  { id: 'community', label: 'Community',   Icon: Users, path: '/feed' }, 
]; 
 
export default function AppLayout({ children }: { children: React.ReactNode }) { 
  const [dark, setDark]             = useState(true); 
  const [mobileOpen, setMobile]     = useState(false); 
  const [settingsOpen, setSettings] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate();
 
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
      <div style={{ 
        padding: '18px 16px 14px', 
        display: 'flex', alignItems: 'center', 
        borderBottom: `1px solid ${dark ? '#1C2B3A' : 'rgba(0,0,0,0.06)'}`, 
      }}> 
        <div style={{ position: 'relative', marginRight: 10 }}> 
          <LogoMark size={24} animated color="#ECF1F7" /> 
          <div style={{ 
            position: 'absolute', bottom: -2, right: -2, 
            width: 7, height: 7, borderRadius: '50%', 
            background: '#00BF72', 
            border: `2px solid ${sbBg}`, 
          }} /> 
        </div> 
        <span style={{ 
          fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', 
          color: textMain, fontFamily: 'monospace', textTransform: 'uppercase', 
        }}> 
          K9 
        </span> 
        {mobileOpen && ( 
          <button onClick={() => setMobile(false)} style={{ marginLeft: 'auto', border: 'none', background: 'none', cursor: 'pointer', color: textMut, padding: 4, display: 'flex', alignItems: 'center' }}> 
            <X style={{ width: 16, height: 16 }} /> 
          </button> 
        )} 
      </div> 
 
      {/* Nav */}
      <nav style={{ padding: '4px 8px', flex: 1, overflowY: 'auto' }}> 
        {NAV.map(({ id, label, Icon, path }) => { 
          const active = location.pathname === path; 
          return ( 
            <button 
              key={id} 
              onClick={() => { navigate(path); setMobile(false); }} 
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', marginBottom: 2 }}> 
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e', flexShrink: 0 }} /> 
          <span style={{ fontSize: 11, color: textMut }}>K9 is watching · sniffs every 90s</span> 
        </div> 
        <div style={{ padding: '0 10px 4px' }}> 
          <NotificationCenter /> 
        </div> 
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
    }}> 
      <div className="k9-desk-sidebar"> 
        <Sidebar /> 
      </div> 
 
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
 
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}> 
        <div className="k9-mob-bar" style={{ 
          display: 'none', alignItems: 'center', 
          padding: '11px 14px', gap: 10, flexShrink: 0, 
          borderBottom: `1px solid ${sbBorder}`, background: bg, 
        }}> 
          <button onClick={() => setMobile(true)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: textMain, display: 'flex', alignItems: 'center', padding: 4 }}> 
            <Menu style={{ width: 19, height: 19 }} /> 
          </button> 
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}> 
            <LogoMark size={20} color={textMain} /> 
            <span style={{ 
              fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', 
              fontFamily: 'monospace', textTransform: 'uppercase', 
            }}>K9</span> 
          </div> 
        </div> 
 
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
