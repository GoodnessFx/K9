import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { NotificationCenter } from './NotificationCenter';
import { Settings } from './Settings';
import { 
  Search, 
  Settings as SettingsIcon, 
  Moon, 
  Sun,
  Menu,
  X,
  Zap,
  Shield,
  TrendingUp,
  Code,
  Users,
  Archive
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Feed', icon: TrendingUp },
  { id: 'radar', label: 'Radar', icon: Zap },
  { id: 'security', label: 'Scanner', icon: Shield },
  { id: 'vault', label: 'Vault', icon: Archive },
  { id: 'dev', label: 'Dev Feed', icon: Code },
  { id: 'community', label: 'Community', icon: Users }
];

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <motion.nav 
        className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tracedog
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">
                AI Alpha Hunter
              </Badge>
            </motion.div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tokens, projects, or alpha..."
                className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <NotificationCenter />
            
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.nav>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside 
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-200 ease-in-out`}
          initial={false}
        >
          <div className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.id === 'radar' && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    LIVE
                  </Badge>
                )}
              </motion.button>
            ))}
          </div>

          {/* AI Status */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-3 bg-accent rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">AI Hunter Active</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Scanning 15 sources for alpha signals...
              </p>
            </div>
          </div>
        </motion.aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Settings Modal */}
      <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}