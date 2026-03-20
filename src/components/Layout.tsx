import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { NotificationCenter } from './NotificationCenter';
import { Settings } from './Settings';
import { K9LogoMark } from './K9Dog';
import { 
  Settings as SettingsIcon, 
  Zap,
  Shield,
  Users,
  Terminal,
  Crosshair,
  Bookmark
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [ 
  { id: 'dashboard', label: 'Dispatch',  icon: Zap }, 
  { id: 'radar',     label: 'Hunt',      icon: Crosshair }, 
  { id: 'security',  label: 'Verify',    icon: Shield }, 
  { id: 'vault',     label: 'Saved',     icon: Bookmark }, 
  { id: 'dev',       label: 'Dev Intel', icon: Terminal }, 
  { id: 'community', label: 'Community', icon: Users }, 
]; 

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 639px)');

  return (
    <div className="min-h-screen bg-bg-base text-t1 selection:bg-intel/30">
      {/* Settings Modal */}
      <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* Top Navigation */}
      <motion.nav 
        className="sticky top-0 z-50 border-b border-line-1 bg-bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-bg-surface/60"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <motion.div 
            className="flex items-center gap-2.5 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => onTabChange('dashboard')}
          >
            <div className="flex items-center gap-2"> 
              <K9LogoMark size={28} animated={true} glowColor="#8B5CF6" /> 
              <span className="font-bold text-xl tracking-tight">K9</span> 
            </div> 
          </motion.div>

          <div className="flex items-center gap-4">
            <NotificationCenter />
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-bg-elevated"
              onClick={() => setSettingsOpen(true)}
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.nav>

      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="w-64 border-r border-line-1 h-[calc(100vh-64px)] sticky top-16 p-4 flex flex-col justify-between bg-bg-surface/50">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                    activeTab === item.id 
                      ? "bg-intel text-white shadow-lg shadow-intel/20" 
                      : "text-t2 hover:bg-bg-elevated hover:text-t1"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    activeTab === item.id ? "text-white" : "text-t3 group-hover:text-intel"
                  )} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="p-3 bg-accent rounded-lg"> 
              <div className="flex items-center gap-2 mb-1"> 
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" /> 
                <span className="text-sm font-medium">Live</span> 
              </div> 
              <p className="text-xs text-muted-foreground"> 
                Scanning 8 sources · Updates every 90s 
              </p> 
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 page-container min-h-[calc(100vh-64px)]",
          isMobile ? "mobile" : "desktop"
        )}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="bottom-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                "bottom-nav-item",
                activeTab === item.id && "active"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}