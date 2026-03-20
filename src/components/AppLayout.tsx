import { 
  Search, 
  Menu, 
  Bell, 
  Settings as SettingsIcon,
  Zap,
  Crosshair,
  ShieldCheck,
  Bookmark,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSignalStream } from '../hooks/useSignalStream';
import LogoMark from './LogoMark';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SIDEBAR_WIDTH_COLLAPSED = 64;
const SIDEBAR_WIDTH_EXPANDED = 224;

const NAV_ITEMS = [
  { path: '/feed', label: 'On the Hunt', icon: Zap },
  { path: '/free-money', label: 'Free Money', icon: DollarSign },
  { path: '/jobs', label: 'Jobs', icon: Briefcase },
  { path: '/hunt', label: 'Analysis', icon: Crosshair },
  { path: '/verify', label: 'Verify', icon: ShieldCheck },
  { path: '/saved', label: 'Saved', icon: Bookmark },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const location = useLocation();
  const { status } = useSignalStream();

  const toggleSidebarMobile = () => setIsSidebarMobileOpen(!isSidebarMobileOpen);

  const currentPageTitle = NAV_ITEMS.find(item => item.path === location.pathname)?.label || 'Overview';

  return (
    <div className="flex min-h-screen bg-bg-base text-t1 font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <motion.aside 
        className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 bg-bg-surface border-r border-line-1 overflow-hidden"
        initial={false}
        animate={{ width: isSidebarExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED }}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <SidebarContent isExpanded={isSidebarExpanded} />
      </motion.aside>

      {/* Sidebar - Mobile Drawer */}
      <AnimatePresence>
        {isSidebarMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarMobileOpen(false)}
              className="fixed inset-0 bg-bg-overlay z-[60] backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-full max-w-[280px] bg-bg-surface z-[70] border-r border-line-2"
            >
              <SidebarContent isExpanded={true} onNavClick={() => setIsSidebarMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div 
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
        style={{ paddingLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (isSidebarExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED) : 0 }}
      >
        {/* Topbar Header */}
        <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 lg:px-8 bg-bg-base/80 backdrop-blur-md border-b border-line-1 relative overflow-hidden">
          {/* Scan Beam Animation */}
          {status === 'live' && (
            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-intel/40 animate-scan-beam" />
          )}
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebarMobile}
              className="lg:hidden p-2 text-t2 hover:text-t1 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-display font-medium tracking-tight uppercase">
              {currentPageTitle}
            </h1>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-t3 group-focus-within:text-line-3 transition-colors" />
              <input 
                placeholder="Search signals, tokens, protocols..."
                className="w-full bg-bg-inset border border-line-1 rounded-md pl-10 pr-4 py-2 text-sm outline-none focus:border-line-3 transition-all placeholder:text-t3"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-bg-inset border border-line-1">
              <div className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                status === 'live' ? "bg-safe animate-pulse" : status === 'polling' ? "bg-medium" : "bg-critical"
              )} />
              <span className="text-[10px] font-mono font-medium uppercase tracking-[0.12em] text-t2">
                {status?.toUpperCase() || 'OFFLINE'}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-3">
               <ChannelBadge type="WA" active={true} />
               <ChannelBadge type="TG" active={true} />
            </div>

            <Link to="/alerts" className="relative p-2 text-t2 hover:text-t1 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-critical rounded-full border border-bg-base" />
            </Link>
            
            <Link to="/settings" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-full bg-bg-elevated border border-line-1 flex items-center justify-center group-hover:border-line-3 transition-colors overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=k9" alt="Profile" className="w-full h-full" />
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function ChannelBadge({ type, active }: { type: string, active: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 text-[10px] font-mono font-medium tracking-[0.12em]",
      active ? "text-t2" : "text-t3"
    )}>
      {type}
      <div className={cn("h-1 w-1 rounded-full", active ? "bg-safe" : "bg-t3")} />
    </div>
  );
}

function SidebarContent({ isExpanded, onNavClick }: { isExpanded: boolean, onNavClick?: () => void }) {
  const { status } = useSignalStream();
  const isLive = status === 'live';

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-10 flex items-center gap-4 px-1">
        <div className="relative">
          <LogoMark size={isExpanded ? 40 : 32} animated={true} />
          <div className={cn(
            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-bg-surface transition-colors",
            isLive ? "bg-safe animate-pulse" : status === 'polling' ? "bg-medium" : "bg-critical"
          )} />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-lg font-mono font-medium tracking-[0.12em] text-t1"
            >
              K9
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.path} item={item} isExpanded={isExpanded} onClick={onNavClick} />
        ))}
      </div>

      <div className="pt-4 border-t border-line-1 space-y-1">
        <SidebarNavItem 
          item={{ path: '/alerts', label: 'Alerts', icon: Bell }} 
          isExpanded={isExpanded} 
          onClick={onNavClick}
          badge={3}
        />
        <SidebarNavItem 
          item={{ path: '/settings', label: 'Settings', icon: SettingsIcon }} 
          isExpanded={isExpanded} 
          onClick={onNavClick}
        />
      </div>
    </div>
  );
}

function SidebarNavItem({ item, isExpanded, onClick, badge }: { item: any, isExpanded: boolean, onClick?: () => void, badge?: number }) {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <NavLink 
      to={item.path} 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-120 group relative",
        isActive 
          ? "bg-bg-elevated text-line-3" 
          : "text-t2 hover:bg-bg-inset hover:text-t1"
      )}
    >
      <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex-1 flex items-center justify-between overflow-hidden whitespace-nowrap text-[13px] font-medium"
          >
            <span>{item.label}</span>
            {badge && (
              <span className="bg-critical text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono min-w-[18px] text-center">
                {badge}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {!isExpanded && badge && (
        <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-critical rounded-full border border-bg-surface" />
      )}
    </NavLink>
  );
}
