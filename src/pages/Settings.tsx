import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { 
  User, 
  Key, 
  Bell, 
  CreditCard, 
  Eye, 
  EyeOff, 
  Zap,
  ChevronRight,
  LogOut,
  Shield,
  Send,
  MessageSquare,
  ExternalLink,
  Settings as SettingsIcon,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { api } from '../api';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Unified Notification Status
  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ['notificationStatus'],
    queryFn: api.getNotificationStatus,
    refetchInterval: 30000,
  });

  const apiKey = 'sk-ant-03-v8A9B10C11D12E13F14G15H16I17J18K19L20M21N22O23P24Q25R26S27T28U29V30W31X32Y33Z34A35B36C37D38E39F40G41H42I43J44K45L46M47N48O49P50Q51R52S53T54U55V56W57X58Y59Z60A61B62C63D64E65F66G67H68I69J70K71L72M73N74O75P76Q77R78S79T80U81V82W83X84Y85Z';

  const handleLogout = async () => {
    if (!confirm('Log out of K9?')) return;
    
    // Clear all local state
    localStorage.clear();
    sessionStorage.clear();
    queryClient.clear();
    
    // Call backend logout
    try { 
      await api.logout(); 
    } catch (e) {
      console.warn('Logout API failed, continuing with local cleanup');
    }
    
    // Redirect and refresh
    navigate('/');
    window.location.reload();
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: 'Alert Preferences', icon: Bell },
    { id: 'security', label: 'Security Keys', icon: Key },
    { id: 'preview', label: 'Notification Preview', icon: Eye },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
  ];

  return (
    <div className="space-y-12 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Page Header */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-border-active/10 border border-border-active/20">
            <SettingsIcon className="h-5 w-5 text-border-active" />
          </div>
          <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-text-2">System Config</span>
        </div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-text-1 uppercase">Settings</h2>
        <p className="text-text-2 max-w-xl text-sm leading-relaxed">
          Manage your profile, security keys, and alert delivery preferences to ensure you never miss an opportunity.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Navigation Tabs - Desktop */}
        <div className="hidden lg:flex flex-col gap-2">
           {tabs.map((tab) => (
             <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg font-sans font-medium text-sm transition-all border",
                activeTab === tab.id 
                  ? "bg-bg-elevated text-text-1 border-border-mid shadow-sm" 
                  : "text-text-2 border-transparent hover:text-text-1 hover:bg-bg-subtle"
              )}
             >
               <div className="flex items-center gap-3">
                 <tab.icon className="h-4 w-4" />
                 {tab.label}
               </div>
               <ChevronRight className={cn(
                 "h-4 w-4 transition-transform",
                 activeTab === tab.id ? "text-text-1 translate-x-0.5" : "text-text-3 opacity-50"
               )} />
             </button>
           ))}

           <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-4 rounded-lg font-sans font-medium text-sm text-s-critical hover:bg-s-critical/10 transition-all mt-10"
           >
             <LogOut className="h-4 w-4" />
             Terminate Session
           </button>
        </div>

        {/* Content Panels */}
        <div className="lg:col-span-2 space-y-10">
           {activeTab === 'profile' && <ProfileTab />}
           {activeTab === 'notifications' && <NotificationsTab status={status} onRefresh={refetchStatus} />}
           {activeTab === 'security' && <SecurityTab showApiKey={showApiKey} setShowApiKey={setShowApiKey} apiKey={apiKey} />}
           {activeTab === 'preview' && <PreviewTab />}
           {activeTab === 'billing' && <BillingTab />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <Card className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-3 border-b border-border-dim pb-6">
        <User className="h-6 w-6 text-text-1" />
        <h3 className="text-xl font-sans font-medium text-text-1">My Profile</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
         <div className="flex flex-col items-center justify-center p-6 bg-bg-surface border border-dashed border-border-dim rounded-xl">
            <div className="h-24 w-24 rounded-full bg-bg-elevated border-2 border-border-mid flex items-center justify-center mb-4 relative group cursor-pointer overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=k9" alt="Avatar" className="w-full h-full" />
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-white">Change</span>
               </div>
            </div>
            <span className="text-[10px] font-mono text-text-3 uppercase tracking-widest">Master ID: K9-001</span>
         </div>

         <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-mono font-medium uppercase tracking-widest text-text-3">Username</label>
               <input defaultValue="K9_USER" className="w-full bg-bg-surface border border-border-dim rounded px-4 py-2.5 text-sm font-sans focus:border-border-active outline-none transition-colors" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-mono font-medium uppercase tracking-widest text-text-3">Email Address</label>
               <input defaultValue="user@k9.app" className="w-full bg-bg-surface border border-border-dim rounded px-4 py-2.5 text-sm font-sans focus:border-border-active outline-none transition-colors" />
            </div>
            <button className="w-full py-2.5 bg-border-active text-text-4 rounded font-sans font-medium text-sm hover:opacity-90 transition-opacity">Update Profile</button>
         </div>
      </div>
    </Card>
  );
}

function NotificationsTab({ status, onRefresh }: { status: any, onRefresh: () => void }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card className="p-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-border-dim pb-6">
          <Bell className="h-6 w-6 text-text-1" />
          <h3 className="text-xl font-sans font-medium text-text-1 uppercase">Alert Preferences</h3>
        </div>
        <p className="text-sm text-text-2 font-sans">Connect WhatsApp or Telegram to receive opportunities the moment K9 finds them.</p>

        <div className="space-y-6">
          <WhatsAppCard status={status?.whatsapp} onRefresh={onRefresh} />
          <TelegramCard status={status?.telegram} onRefresh={onRefresh} />
        </div>
      </Card>
    </div>
  );
}

function WhatsAppCard({ status, onRefresh }: { status: any, onRefresh: () => void }) {
  const [instanceId, setInstanceId] = useState('');
  const [token, setToken] = useState('');
  const [phone, setPhone] = useState('08072027335');

  const connectMutation = useMutation({
    mutationFn: api.connectWA,
    onSuccess: (data) => {
      if (data.connected) {
        toast.success('WhatsApp Connected!');
        onRefresh();
      } else {
        toast.error('Connection failed', { description: data.error });
      }
    },
    onError: (e: any) => toast.error('Error', { description: e.message })
  });

  const testMutation = useMutation({
    mutationFn: api.testWA,
    onSuccess: (data) => {
      if (data.sent) toast.success('Test message sent!');
      else toast.error('Failed to send test message');
    }
  });

  return (
    <div className="bg-bg-surface border border-line-1 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-intel/10 rounded-lg text-intel">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-t1 uppercase">WhatsApp</h4>
            <span className={cn(
              "text-[9px] font-mono font-bold uppercase tracking-widest",
              status?.connected ? "text-safe" : "text-critical"
            )}>
              {status?.connected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>
        {status?.connected && (
          <span className="text-xs font-mono text-t2">+{status.phone || '08072027335'}</span>
        )}
      </div>

      {status?.connected ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-t3">
            <span>Messages today</span>
            <span>{status.messagesUsed || 0} / 1,500</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => testMutation.mutate()}
              className="flex-1 py-2 bg-bg-elevated border border-line-1 rounded text-xs font-sans font-medium text-t1 hover:bg-bg-subtle transition-all flex items-center justify-center gap-2"
            >
              <Send className="h-3.5 w-3.5" />
              Test Message
            </button>
            <button className="p-2 bg-critical/10 border border-critical/20 text-critical rounded hover:bg-critical/20 transition-all">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 pt-4 border-t border-line-1">
          <div className="space-y-4 text-xs text-t2 bg-bg-base p-4 rounded-lg">
            <p className="font-bold text-t1 uppercase">Setup Guide:</p>
            <ol className="list-decimal list-inside space-y-1 opacity-80">
              <li>Create account at greenapi.com</li>
              <li>Scan QR with your WhatsApp app</li>
              <li>Paste Instance ID and Token below</li>
            </ol>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-medium uppercase tracking-widest text-t3">Instance ID</label>
              <input value={instanceId} onChange={e => setInstanceId(e.target.value)} placeholder="e.g. 1101234567" className="w-full bg-bg-base border border-line-1 rounded px-3 py-2 text-sm font-mono text-t1 outline-none focus:border-intel transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-medium uppercase tracking-widest text-t3">API Token</label>
              <input type="password" value={token} onChange={e => setToken(e.target.value)} placeholder="your_token_here" className="w-full bg-bg-base border border-line-1 rounded px-3 py-2 text-sm font-mono text-t1 outline-none focus:border-intel transition-all" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-medium uppercase tracking-widest text-t3">Phone Number</label>
            <input 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="234..." 
              inputMode="tel"
              className="w-full bg-bg-base border border-line-1 rounded px-3 py-2 text-sm font-mono text-t1 outline-none focus:border-intel transition-all" 
            />
          </div>
          <button 
            onClick={() => connectMutation.mutate({ instanceId, token, phoneNumber: phone })}
            disabled={connectMutation.isPending || !instanceId || !token || !phone}
            className="w-full py-2.5 bg-intel text-white rounded font-sans font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
          >
            {connectMutation.isPending ? 'Connecting...' : 'Connect WhatsApp'}
          </button>
        </div>
      )}
    </div>
  );
}

function TelegramCard({ status, onRefresh }: { status: any, onRefresh: () => void }) {
  const testMutation = useMutation({
    mutationFn: api.testTG,
    onSuccess: (data) => {
      if (data.sent) toast.success('Test message sent to Telegram!');
      else toast.error('Failed to send test message');
    }
  });

  return (
    <div className="bg-bg-surface border border-line-1 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-intel/10 rounded-lg text-intel">
            <Send className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-t1 uppercase">Telegram</h4>
            <span className={cn(
              "text-[9px] font-mono font-bold uppercase tracking-widest",
              status?.connected ? "text-safe" : "text-critical"
            )}>
              {status?.connected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>
        {status?.connected && (
          <span className="text-xs font-mono text-t2">@{status.botName}</span>
        )}
      </div>

      {status?.connected ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-t3">
            <span>Status</span>
            <span>{status.activeUsers} users connected</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => testMutation.mutate()}
              className="flex-1 py-2 bg-bg-elevated border border-line-1 rounded text-xs font-sans font-medium text-t1 hover:bg-bg-subtle transition-all flex items-center justify-center gap-2"
            >
              <Send className="h-3.5 w-3.5" />
              Test Message
            </button>
            <a 
              href={`https://t.me/${status.botName}`} 
              target="_blank" 
              className="flex-1 py-2 bg-intel/10 border border-intel/20 rounded text-xs font-sans font-medium text-intel hover:bg-intel/20 transition-all flex items-center justify-center gap-2"
            >
              Open Bot
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-4 border-t border-line-1">
          <div className="space-y-4 text-xs text-t2 bg-bg-base p-4 rounded-lg">
            <p className="font-bold text-t1 uppercase">How to Connect:</p>
            <ol className="list-decimal list-inside space-y-1 opacity-80">
              <li>Message @BotFather on Telegram</li>
              <li>Send /newbot and follow prompts</li>
              <li>Add your token to .env file</li>
            </ol>
          </div>
          <button onClick={onRefresh} className="w-full py-2.5 bg-bg-elevated border border-line-1 rounded font-sans font-bold text-sm text-t1 hover:bg-bg-subtle transition-all">
            Check Connection
          </button>
        </div>
      )}
    </div>
  );
}

function SecurityTab({ showApiKey, setShowApiKey, apiKey }: any) {
  return (
    <Card className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-3 border-b border-border-dim pb-6">
        <Key className="h-6 w-6 text-text-1" />
        <h3 className="text-xl font-sans font-medium text-text-1 uppercase">Security Keys</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono font-medium uppercase tracking-widest text-text-3 flex items-center gap-2">
                <Shield className="h-3 w-3 text-border-active" />
                Claude AI Engine
              </label>
              <button 
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-[10px] font-sans font-medium uppercase tracking-widest text-border-active hover:underline flex items-center gap-1.5"
              >
                {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showApiKey ? 'Mask Key' : 'Show Key'}
              </button>
            </div>
            <div className="relative group">
              <input 
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                readOnly
                className="w-full bg-bg-surface border border-border-dim rounded px-4 py-2.5 text-xs font-mono opacity-80 group-hover:opacity-100 transition-opacity outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-intel animate-pulse" />
                  <span className="text-[9px] font-mono font-medium uppercase text-intel tracking-tighter">Verified</span>
              </div>
            </div>
        </div>

        <p className="text-[10px] text-text-3 italic leading-relaxed">
          Your keys are encrypted using AES-256 and stored securely. We never store raw keys in our database.
        </p>
      </div>
    </Card>
  );
}

function PreviewTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card className="p-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-border-dim pb-6">
          <Eye className="h-6 w-6 text-text-1" />
          <h3 className="text-xl font-sans font-medium text-text-1 uppercase">Notification Simulation</h3>
        </div>

        <p className="text-sm text-text-2 font-sans">
          Preview exactly how your intelligence signals will appear on each platform before connecting. 
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-text-3">WhatsApp Style</span>
            <div className="bg-[#0b141a] p-4 rounded-lg border border-white/10 font-mono text-[13px] text-[#e9edef] whitespace-pre-wrap leading-tight shadow-xl min-h-[300px]">
              K9 found something
              ────────────────────────
              WHAT'S HAPPENING
              A brand new wallet — opened just 2 days ago — just placed a $47,000 bet on Polymarket that Venezuela's Maduro will be removed from power before January 31st.
              
              CONFIDENCE: 91/100
              TIME TO ACT: 2–6 hours
              
              WHAT YOU CAN DO
              ① Go to polymarket.com - search 'Maduro' - click 'Yes'
              ② Watch for news breaking in the next 24 hours
              ③ Share this signal
              
              HOW RISKY IS THIS?
              HIGH RISK — This is speculation.
              
              SOURCE: Polymarket Insider Tracker
              ────────────────────────
              K9 · k9.app
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-text-3">Telegram Style</span>
            <div className="bg-[#0e1621] p-4 rounded-lg border border-white/10 font-sans text-[13px] text-white whitespace-pre-wrap leading-relaxed shadow-xl min-h-[300px]">
              <b>K9 found something for you</b>
              ─────────────────────────────────
              
              🕵️ <b>INSIDER ALERT</b>
              
              <b>WHAT K9 FOUND</b>
              A brand new wallet — opened just 2 days ago — just placed a $47,000 bet on Polymarket that Venezuela's Maduro will be removed from power before January 31st.
              
              <b>CONFIDENCE:</b> 91/100
              <b>TIME TO ACT:</b> 2–6 hours
              
              <b>WHAT YOU CAN DO</b>
              ① Go to polymarket.com - search 'Maduro' - click 'Yes'
              ② Watch for news breaking in the next 24 hours
              
              <b>HOW RISKY IS THIS?</b>
              <i>HIGH RISK — This is speculation.</i>
              
              <b>SOURCE:</b> Polymarket Insider Tracker
              ─────────────────────────────────
              K9 · <a href="#" className="text-intel underline">Stop missing opportunities</a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BillingTab() {
  return (
    <Card className="p-8 bg-gradient-to-br from-border-active/10 via-border-active/5 to-transparent border-border-active/20 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="absolute -right-4 -top-4 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
        <Zap className="h-32 w-32 text-border-active" />
      </div>
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-border-active text-text-4">
              <Zap className="h-5 w-5 fill-text-4" />
            </div>
            <div>
              <h3 className="text-2xl font-sans font-medium tracking-tight text-text-1 leading-none uppercase">ALPHA PLAN</h3>
              <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-border-active">Pro Subscription</span>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <p className="text-[10px] font-mono font-medium uppercase text-text-3 tracking-widest">Billing Period</p>
              <p className="text-sm font-sans font-medium text-text-1">Annual (HUNT_MASTER)</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-mono font-medium uppercase text-text-3 tracking-widest">Next Renewal</p>
              <p className="text-sm font-sans font-medium text-text-1">Oct 24, 2026</p>
            </div>
        </div>

        <div className="pt-4 flex gap-4">
            <button className="flex-1 h-11 bg-border-active text-text-4 rounded font-sans font-medium text-sm hover:opacity-90 transition-opacity uppercase">Manage Plan</button>
            <button className="flex-1 h-11 bg-bg-surface border border-border-dim rounded font-sans font-medium text-sm text-text-1 hover:border-border-mid transition-all uppercase">Upgrade Tier</button>
        </div>
      </div>
    </Card>
  );
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-bg-surface border border-line-1 rounded-xl", className)}>
      {children}
    </div>
  );
}
