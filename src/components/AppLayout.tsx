import { useState, useEffect } from 'react'; 
import { NavLink, useLocation } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  Zap, DollarSign, Briefcase, Crosshair, ShieldCheck, 
  Bookmark, Bell, Settings as SettingsIcon, Users, 
  Menu, X, ChevronLeft, LogOut, 
} from 'lucide-react'; 
import { useSignalStream } from '../hooks/useSignalStream'; 
import LogoMark from './LogoMark'; 
 
const NAV = [ 
  { path: '/feed',       label: 'Dispatch',    Icon: Zap }, 
  { path: '/airdrops',   label: 'Airdrops',    Icon: DollarSign }, 
  { path: '/jobs',       label: 'Jobs',        Icon: Briefcase }, 
  { path: '/hunt',       label: 'Hunt',        Icon: Crosshair }, 
  { path: '/verify',     label: 'Is It Safe?', Icon: ShieldCheck }, 
  { path: '/saved',      label: 'Saved',       Icon: Bookmark }, 
  { path: '/tech-news',  label: 'Tech News',   Icon: Bell }, 
  { path: '/community',  label: 'Community',   Icon: Users }, 
]; 
 
const W_OPEN   = 240; 
const W_CLOSED = 68; 
 
function logout() { 
  ['k9_onboarding_done','k9_user_phone','k9_settings', 
   'k9_telegram_connected','k9_saved','k9_user_interests', 
   'k9_user_channel'].forEach(k => localStorage.removeItem(k)); 
  window.location.href = '/'; 
} 
 
export default function AppLayout({ children }: { children: React.ReactNode }) { 
  const [pinned, setPinned] = useState(() => localStorage.getItem('k9_sidebar_pinned') === 'true'); 
  const [expanded, setExpanded] = useState(false); 
  const [mobile, setMobile] = useState(false); 
  const dark = true; 
  const { status } = useSignalStream(); 
  const location = useLocation(); 
  
  const isSidebarOpen = pinned || expanded; 
 
  useEffect(() => { 
    document.documentElement.classList.toggle('dark', dark); 
  }, [dark]); 
 
  useEffect(() => { 
    localStorage.setItem('k9_sidebar_pinned', String(pinned));
  }, [pinned]);

  useEffect(() => { setMobile(false); }, [location.pathname]); 
 
  const Sidebar = ({ isMobile = false }: { isMobile?: boolean }) => {
    const show = isMobile || isSidebarOpen;
    const width = isMobile ? W_OPEN : (isSidebarOpen ? W_OPEN : W_CLOSED);

    return (
      <div 
        style={{ 
          width, 
          height: '100vh',
          background: '#171717',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          flexShrink: 0,
          zIndex: 100
        }}
      >
        {/* Header */}
        <div style={{ 
          height: 64, 
          padding: show ? '0 20px' : '0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: show ? 'space-between' : 'center',
          borderBottom: '1px solid rgba(255,255,255,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <LogoMark size={24} />
              <div style={{ 
                position: 'absolute', bottom: -1, right: -1, 
                width: 8, height: 8, borderRadius: '50%',
                background: status === 'live' ? '#00bf72' : '#d4a843',
                border: '2px solid #171717'
              }} />
            </div>
            {show && (
              <span style={{ 
                fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', 
                color: '#ececec', textTransform: 'uppercase', fontFamily: 'monospace' 
              }}>K9</span>
            )}
          </div>
          {show && !isMobile && (
            <button 
              onClick={() => setPinned(!pinned)}
              style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#8a8a8a' }}
            >
              <ChevronLeft size={16} style={{ transform: pinned ? 'none' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
            </button>
          )}
          {isMobile && (
            <button onClick={() => setMobile(false)} style={{ background: 'none', border: 'none', color: '#8a8a8a' }}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {NAV.map(({ path, label, Icon }) => {
            const active = location.pathname === path;
            return (
              <NavLink key={path} to={path} style={{ 
                display: 'flex', alignItems: 'center', gap: 12,
                padding: show ? '10px 12px' : '12px 0',
                justifyContent: show ? 'flex-start' : 'center',
                borderRadius: 8, marginBottom: 4, textDecoration: 'none',
                background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: active ? '#ececec' : '#a0a0a0',
                border: active ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                transition: 'all 0.2s'
              }}>
                <Icon size={18} style={{ opacity: active ? 1 : 0.7, flexShrink: 0 }} />
                {show && <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <NavLink to="/settings" style={{ 
            display: 'flex', alignItems: 'center', gap: 12,
            padding: show ? '10px 12px' : '12px 0',
            justifyContent: show ? 'flex-start' : 'center',
            borderRadius: 8, textDecoration: 'none', color: '#a0a0a0'
          }}>
            <SettingsIcon size={18} style={{ opacity: 0.7 }} />
            {show && <span style={{ fontSize: 13 }}>Settings</span>}
          </NavLink>
          <button onClick={logout} style={{ 
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: show ? '10px 12px' : '12px 0',
            justifyContent: show ? 'flex-start' : 'center',
            borderRadius: 8, background: 'none', border: 'none', color: '#f03a5f',
            cursor: 'pointer', marginTop: 4
          }}>
            <LogOut size={18} style={{ opacity: 0.8 }} />
            {show && <span style={{ fontSize: 13 }}>Sign out</span>}
          </button>
        </div>
      </div>
    );
  };
 
  return ( 
    <div style={{ display: 'flex', height: '100vh', background: '#1a1a1a', color: '#ececec', overflow: 'hidden' }}> 
      {/* Sidebar Wrapper */}
      <div 
        onMouseEnter={() => !pinned && setExpanded(true)}
        onMouseLeave={() => !pinned && setExpanded(false)}
        className="k9-sidebar-desktop"
      >
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobile && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobile(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
            />
            <motion.div 
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }}
            >
              <Sidebar isMobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
 
      {/* Main Content */} 
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}> 
        {/* Mobile Header — only visible on mobile */}
        <div className="k9-mobile-topbar" style={{ 
          height: 56, background: '#171717', borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16
        }}>
          <button onClick={() => setMobile(true)} style={{ background: 'none', border: 'none', color: '#ececec' }}>
            <Menu size={24} />
          </button>
          <LogoMark size={24} />
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.1em', fontFamily: 'monospace' }}>K9</span>
        </div>

        <main className="k9-content" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}> 
          <div style={{ maxWidth: 900, margin: '0 auto', width: '100%', minWidth: 0 }}> 
            {children} 
          </div> 
        </main> 
      </div> 
    </div> 
  ); 
} 
