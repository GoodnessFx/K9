import { useState, useEffect } from 'react'; 
import { NavLink, useLocation } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  Zap, DollarSign, Briefcase, Crosshair, 
  ShieldCheck, Bookmark, Bell, Settings as SettingsIcon, 
  Menu, X, Sun, Moon, 
} from 'lucide-react'; 
import { useSignalStream } from '../hooks/useSignalStream'; 
import LogoMark from './LogoMark'; 
 
const NAV = [ 
  { path: '/feed',       label: 'Dispatch',    icon: Zap }, 
  { path: '/free-money', label: 'Free Money',  icon: DollarSign }, 
  { path: '/jobs',       label: 'Jobs',        icon: Briefcase }, 
  { path: '/hunt',       label: 'Hunt',        icon: Crosshair }, 
  { path: '/verify',     label: 'Is It Safe?', icon: ShieldCheck }, 
  { path: '/saved',      label: 'Saved',       icon: Bookmark }, 
]; 
 
export default function AppLayout({ children }: { children: React.ReactNode }) { 
  const [mobileOpen, setMobileOpen] = useState(false); 
  const [dark, setDark] = useState(true); 
  const { status } = useSignalStream(); 
  const location = useLocation(); 
 
  useEffect(() => { 
    document.documentElement.classList.toggle('dark', dark); 
  }, [dark]); 
 
  useEffect(() => { 
    setMobileOpen(false); 
  }, [location.pathname]); 
 
  const sbBg     = '#0C1119'; 
  const sbBorder = '1px solid #1C2B3A'; 
  const bg       = '#070A0F'; 
 
  const Sidebar = ({ onClose }: { onClose?: () => void }) => ( 
    <div style={{ 
      width: 220, minWidth: 220, height: '100vh', 
      background: sbBg, 
      borderRight: sbBorder, 
      display: 'flex', flexDirection: 'column', 
      overflow: 'hidden', flexShrink: 0, 
    }}> 
      {/* Logo */} 
      <div style={{ 
        padding: '18px 16px 12px', 
        display: 'flex', alignItems: 'center', 
        justifyContent: 'space-between', 
        borderBottom: '1px solid #1C2B3A', 
      }}> 
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}> 
          <div style={{ position: 'relative' }}> 
            <LogoMark size={28} animated /> 
            <div style={{ 
              position: 'absolute', bottom: -1, right: -1, 
              width: 8, height: 8, borderRadius: '50%', 
              background: status === 'live' ? '#00BF72' : '#D4A843', 
              border: `2px solid ${sbBg}`, 
            }} /> 
          </div> 
          <span style={{ 
            fontSize: 15, fontWeight: 600, 
            letterSpacing: '0.06em', color: '#ECF1F7', 
            fontFamily: 'monospace', 
          }}> 
            K9 
          </span> 
        </div> 
        {onClose && ( 
          <button onClick={onClose} style={{ 
            border: 'none', background: 'none', cursor: 'pointer', 
            color: '#435E75', display: 'flex', alignItems: 'center', padding: 4, 
          }}> 
            <X style={{ width: 16, height: 16 }} /> 
          </button> 
        )} 
      </div> 
 
      {/* Nav items */} 
      <nav style={{ flex: 1, padding: '8px', overflowY: 'auto' }}> 
        {NAV.map(({ path, label, icon: Icon }) => { 
          const active = location.pathname === path; 
          return ( 
            <NavLink 
              key={path} 
              to={path} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: 10, 
                padding: '8px 10px', borderRadius: 7, marginBottom: 2, 
                textDecoration: 'none', fontSize: 13, 
                fontWeight: active ? 500 : 400, 
                background: active ? '#111C27' : 'transparent', 
                color: active ? '#ECF1F7' : '#87A0B8', 
                transition: 'background 0.1s, color 0.1s', 
                border: active ? '1px solid #1C2B3A' : '1px solid transparent', 
              }} 
              onMouseEnter={e => { 
                if (!active) { 
                  (e.currentTarget as HTMLElement).style.background = '#111C27'; 
                  (e.currentTarget as HTMLElement).style.color = '#ECF1F7'; 
                } 
              }} 
              onMouseLeave={e => { 
                if (!active) { 
                  (e.currentTarget as HTMLElement).style.background = 'transparent'; 
                  (e.currentTarget as HTMLElement).style.color = '#87A0B8'; 
                } 
              }} 
            > 
              <Icon style={{ width: 15, height: 15, flexShrink: 0, opacity: active ? 1 : 0.6 }} /> 
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}> 
                {label} 
              </span> 
              {active && ( 
                <div style={{ 
                  marginLeft: 'auto', width: 5, height: 5, 
                  borderRadius: '50%', background: '#3B82F6', flexShrink: 0, 
                }} /> 
              )} 
            </NavLink> 
          ); 
        })} 
      </nav> 
 
      {/* Bottom section */} 
      <div style={{ padding: '8px', borderTop: '1px solid #1C2B3A' }}> 
        {/* Live status indicator */} 
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 8, 
          padding: '6px 10px', marginBottom: 4, 
        }}> 
          <div style={{ 
            width: 5, height: 5, borderRadius: '50%', flexShrink: 0, 
            background: status === 'live' ? '#00BF72' : '#D4A843', 
            boxShadow: status === 'live' ? '0 0 5px #00BF72' : 'none', 
          }} /> 
          <span style={{ fontSize: 11, color: '#435E75' }}> 
            K9 is watching · sniffs every 90s 
          </span> 
        </div> 
 
        {/* Alerts link */} 
        <NavLink 
          to="/alerts" 
          style={{ 
            display: 'flex', alignItems: 'center', gap: 10, 
            padding: '8px 10px', borderRadius: 7, marginBottom: 2, 
            textDecoration: 'none', fontSize: 13, color: '#87A0B8', 
            transition: 'background 0.1s, color 0.1s', 
            border: '1px solid transparent', 
          }} 
          onMouseEnter={e => { 
            (e.currentTarget as HTMLElement).style.background = '#111C27'; 
            (e.currentTarget as HTMLElement).style.color = '#ECF1F7'; 
          }} 
          onMouseLeave={e => { 
            (e.currentTarget as HTMLElement).style.background = 'transparent'; 
            (e.currentTarget as HTMLElement).style.color = '#87A0B8'; 
          }} 
        > 
          <Bell style={{ width: 15, height: 15, opacity: 0.6 }} /> 
          <span>Alerts</span> 
        </NavLink> 
 
        {/* Settings + dark mode toggle */} 
        <NavLink 
          to="/settings" 
          style={{ 
            display: 'flex', alignItems: 'center', gap: 10, 
            padding: '8px 10px', borderRadius: 7, 
            textDecoration: 'none', fontSize: 13, color: '#87A0B8', 
            transition: 'background 0.1s, color 0.1s', 
            border: '1px solid transparent', 
          }} 
          onMouseEnter={e => { 
            (e.currentTarget as HTMLElement).style.background = '#111C27'; 
            (e.currentTarget as HTMLElement).style.color = '#ECF1F7'; 
          }} 
          onMouseLeave={e => { 
            (e.currentTarget as HTMLElement).style.background = 'transparent'; 
            (e.currentTarget as HTMLElement).style.color = '#87A0B8'; 
          }} 
        > 
          <SettingsIcon style={{ width: 15, height: 15, opacity: 0.6 }} /> 
          <span>Settings</span> 
          <button 
            onClick={e => { e.preventDefault(); e.stopPropagation(); setDark(d => !d); }} 
            style={{ 
              marginLeft: 'auto', border: 'none', background: 'none', 
              cursor: 'pointer', color: '#435E75', 
              display: 'flex', alignItems: 'center', padding: 2, 
            }} 
          > 
            {dark ? <Sun style={{ width: 13, height: 13 }} /> : <Moon style={{ width: 13, height: 13 }} />} 
          </button> 
        </NavLink> 
      </div> 
    </div> 
  ); 
 
  return ( 
    <div style={{ 
      display: 'flex', height: '100vh', overflow: 'hidden', 
      background: bg, color: '#ECF1F7', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', 
      WebkitFontSmoothing: 'antialiased', 
    }}> 
 
      {/* Desktop sidebar — always visible on screens 768px and wider */} 
      <div className="k9-sidebar-desktop"> 
        <Sidebar /> 
      </div> 
 
      {/* Mobile sidebar — slides in from left as overlay */} 
      <AnimatePresence> 
        {mobileOpen && ( 
          <> 
            <motion.div 
              key="overlay" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setMobileOpen(false)} 
              style={{ 
                position: 'fixed', inset: 0, 
                background: 'rgba(7,10,15,0.85)', 
                zIndex: 60, 
              }} 
            /> 
            <motion.div 
              key="sidebar" 
              initial={{ x: -240 }} 
              animate={{ x: 0 }} 
              exit={{ x: -240 }} 
              transition={{ type: 'spring', stiffness: 300, damping: 30 }} 
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 70 }} 
            > 
              <Sidebar onClose={() => setMobileOpen(false)} /> 
            </motion.div> 
          </> 
        )} 
      </AnimatePresence> 
 
      {/* Right side — top bar (mobile only) + page content */} 
      <div style={{ 
        flex: 1, display: 'flex', flexDirection: 'column', 
        overflow: 'hidden', minWidth: 0, 
      }}> 
 
        {/* Mobile top bar — hidden on desktop, shown on mobile */} 
        <div 
          className="k9-topbar-mobile" 
          style={{ 
            display: 'none', alignItems: 'center', gap: 12, 
            padding: '10px 16px', flexShrink: 0, 
            borderBottom: '1px solid #1C2B3A', 
            background: '#0C1119', 
          }} 
        > 
          <button 
            onClick={() => setMobileOpen(true)} 
            style={{ 
              border: 'none', background: 'none', cursor: 'pointer', 
              color: '#ECF1F7', display: 'flex', alignItems: 'center', padding: 4, 
            }} 
          > 
            <Menu style={{ width: 20, height: 20 }} /> 
          </button> 
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}> 
            <LogoMark size={24} animated /> 
            <span style={{ 
              fontSize: 14, fontWeight: 600, 
              letterSpacing: '0.06em', fontFamily: 'monospace', 
            }}> 
              K9 
            </span> 
          </div> 
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}> 
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: 6, 
              padding: '4px 8px', borderRadius: 5, 
              background: '#111C27', border: '1px solid #1C2B3A', 
            }}> 
              <div style={{ 
                width: 5, height: 5, borderRadius: '50%', 
                background: status === 'live' ? '#00BF72' : '#D4A843', 
              }} /> 
              <span style={{ 
                fontSize: 9, fontFamily: 'monospace', 
                color: '#87A0B8', letterSpacing: '0.1em', 
              }}> 
                {(status || 'OFFLINE').toUpperCase()} 
              </span> 
            </div> 
          </div> 
        </div> 
 
        {/* Page content */} 
        <main 
          className="k9-main-content" 
          style={{ flex: 1, overflowY: 'auto', padding: '32px 48px' }} 
        > 
          <div style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}> 
            {children} 
          </div> 
        </main> 
      </div> 
    </div> 
  ); 
} 
