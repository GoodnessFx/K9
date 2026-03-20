import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { telegramApi } from '../api';
import { 
  Send, 
  Bot, 
  CheckCircle, 
  MessageSquare, 
  Settings2, 
  Zap, 
  ShieldCheck,
  Activity,
  ChevronRight,
  Loader2,
  Trash2,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function TelegramPage() {
  const [step, setStep] = useState(1);
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  
  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ['telegram-status'],
    queryFn: telegramApi.getStatus,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['telegram-messages'],
    queryFn: telegramApi.getMessages,
    enabled: status?.connected,
    refetchInterval: 10000,
  });

  const connectMutation = useMutation({
    mutationFn: telegramApi.connect,
    onSuccess: () => {
      toast.success('Telegram Connected!', {
        description: 'You are now ready to receive opportunities.',
        duration: 3000,
      });
      setStep(3);
      refetchStatus();
    },
    onError: () => {
      toast.error('Connection Failed', {
        description: 'Verify your Bot Token and Chat ID.',
        duration: 3000,
      });
    }
  });

  const testMutation = useMutation({
    mutationFn: telegramApi.test,
    onSuccess: () => {
      toast.success('Test message sent!', {
        description: 'Check your Telegram app.',
        duration: 3000,
      });
    }
  });

  const disconnectMutation = useMutation({
    mutationFn: telegramApi.disconnect,
    onSuccess: () => {
      toast.info('Telegram Disconnected', {
        description: 'All alerts have been paused.',
        duration: 3000,
      });
      setStep(1);
      refetchStatus();
    }
  });

  const [rules, setRules] = useState<{
    minScore: number;
    categories: string[];
    frequency: 'instant' | 'batched' | 'digest';
    convergenceOnly: boolean;
  }>({
    minScore: 75,
    categories: ['free', 'insider', 'market'],
    frequency: 'instant',
    convergenceOnly: false,
  });

  const updateRulesMutation = useMutation({
    mutationFn: (newRules: typeof rules) => telegramApi.updateRules(newRules),
    onSuccess: () => {
      toast.success('Alert rules updated!', {
        description: 'Settings saved successfully.',
        duration: 3000,
      });
    }
  });

  const toggleCategory = (cat: string) => {
    setRules(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) 
        ? prev.categories.filter(c => c !== cat) 
        : [...prev.categories, cat]
    }));
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      {/* Page Header */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-border-active/10 border border-border-active/20">
            <Send className="h-5 w-5 text-border-active" />
          </div>
          <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-text-2">Connect Telegram</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-sans font-medium tracking-tight text-text-1">Telegram Alerts</h2>
            <p className="text-text-2 max-w-xl text-sm leading-relaxed">
              Send strong opportunities directly to your Telegram app so you never miss a chance to profit.
            </p>
          </div>

          <div className="flex items-center gap-3">
             <div className={cn(
               "flex items-center gap-2 px-4 py-2 bg-bg-surface rounded-xl border transition-all",
               status?.connected ? "border-s-low/30 bg-s-low/5 text-s-low" : "border-s-critical/30 bg-s-critical/5 text-s-critical"
             )}>
               <div className={cn(
                 "h-2 w-2 rounded-full",
                 status?.connected ? "bg-s-low shadow-[0_0_8px_rgba(0,214,143,0.5)] animate-pulse" : "bg-s-critical"
               )} />
               <span className="text-[10px] font-mono font-medium uppercase tracking-widest">{status?.connected ? 'CONNECTED' : 'DISCONNECTED'}</span>
             </div>
          </div>
        </div>
      </section>

      {!status?.connected && step < 3 ? (
        /* Setup Wizard */
        <section className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-10 relative px-4">
             <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border-dim -translate-y-1/2 z-0" />
             {[1, 2, 3].map((s) => (
               <div key={s} className="relative z-10 flex flex-col items-center gap-3">
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center font-mono font-medium text-lg transition-all border",
                    step >= s ? "bg-border-active text-text-4 border-border-active shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "bg-bg-surface text-text-3 border-border-dim"
                  )}>
                    {s}
                  </div>
                  <span className={cn(
                    "text-[10px] font-mono font-medium uppercase tracking-widest",
                    step >= s ? "text-text-1" : "text-text-3"
                  )}>
                    {s === 1 ? 'Bot Setup' : s === 2 ? 'Channel ID' : 'Verify'}
                  </span>
               </div>
             ))}
          </div>

          <Card className="p-10 border-border-active/10 bg-border-active/5">
             <AnimatePresence mode="wait">
               {step === 1 && (
                 <motion.div
                   key="step1"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-6"
                 >
                    <div className="space-y-2">
                      <h3 className="text-2xl font-sans font-medium tracking-tight text-text-1 uppercase">Step 1: BOT TOKEN</h3>
                      <p className="text-sm text-text-2">Create a bot via <a href="https://t.me/BotFather" target="_blank" className="text-border-active hover:underline">@BotFather</a> and paste the API token below.</p>
                    </div>
                    <div className="space-y-2">
                       <input 
                        value={botToken}
                        onChange={(e) => setBotToken(e.target.value)}
                        placeholder="0000000000:AA-Example-Bot-Token-Here"
                        className="w-full bg-bg-base border border-border-dim rounded px-4 py-3.5 text-sm font-mono outline-none focus:border-border-active transition-all"
                       />
                    </div>
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!botToken}
                      className="w-full h-14 bg-border-active text-text-4 rounded font-sans font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                    >
                      Next Step
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </motion.div>
               )}

               {step === 2 && (
                 <motion.div
                   key="step2"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-6"
                 >
                    <div className="space-y-2">
                      <h3 className="text-2xl font-sans font-medium tracking-tight text-text-1 uppercase">Step 2: CHANNEL / CHAT ID</h3>
                      <p className="text-sm text-text-2">Add your bot to a channel or group and enter the ID (e.g., @mychannel or -100123456789).</p>
                    </div>
                    <div className="space-y-2">
                       <input 
                        value={chatId}
                        onChange={(e) => setChatId(e.target.value)}
                        placeholder="@my_alpha_channel"
                        className="w-full bg-bg-base border border-border-dim rounded px-4 py-3.5 text-sm font-mono outline-none focus:border-border-active transition-all"
                       />
                    </div>
                    <div className="flex gap-4">
                       <button 
                        onClick={() => setStep(1)}
                        className="flex-1 h-14 bg-bg-surface border border-border-dim rounded font-sans font-medium text-sm text-text-2 hover:text-text-1 hover:border-border-mid transition-all"
                       >
                         Back
                       </button>
                       <button 
                        onClick={() => connectMutation.mutate({ botToken, chatId })}
                        disabled={!chatId || connectMutation.isPending}
                        className="flex-1 h-14 bg-border-active text-text-4 rounded font-sans font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                       >
                         {connectMutation.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Finalize Connection'}
                       </button>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </Card>
        </section>
      ) : (
        /* Active Integration Dashboard */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-10">
             {/* Alert Rules Panel */}
             <div className="bg-bg-surface border border-line-1 rounded-xl p-8 space-y-10 ai-glow">
                <div className="flex items-center justify-between border-b border-line-1 pb-6">
                   <div className="flex items-center gap-3">
                      <Settings2 className="h-6 w-6 text-text-1" />
                      <h3 className="text-xl font-sans font-medium text-text-1 uppercase tracking-tight">Notification Rules</h3>
                   </div>
                   <button 
                    onClick={() => updateRulesMutation.mutate(rules)}
                    className="px-6 py-2 bg-bg-elevated border border-line-1 text-text-2 font-mono font-medium text-[10px] uppercase tracking-widest rounded hover:text-text-1 hover:border-line-3 transition-all"
                   >
                     Save Changes
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <div className="space-y-4">
                         <div className="flex justify-between items-end">
                            <label className="text-[10px] font-mono font-medium uppercase tracking-widest text-t3">Min Confidence Score</label>
                            <span className="text-2xl font-mono font-medium text-intel">{rules.minScore}</span>
                         </div>
                         <div className="h-2 bg-bg-base rounded-full relative">
                            <input 
                              type="range"
                              min="0"
                              max="100"
                              value={rules.minScore}
                              onChange={(e) => setRules({...rules, minScore: parseInt(e.target.value)})}
                              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="h-full bg-intel rounded-full" style={{ width: `${rules.minScore}%` }} />
                         </div>
                         <p className="text-[10px] text-t3 italic leading-relaxed">
                           Only opportunities with a confidence score of {rules.minScore}+ will be sent to your phone.
                         </p>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-line-1">
                         <label className="text-[10px] font-mono font-medium uppercase tracking-widest text-t3">How Often</label>
                         <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'instant', label: 'Instant' },
                              { id: 'batched', label: 'Every Hour' },
                              { id: 'digest', label: 'Daily' }
                            ].map((freq) => (
                              <button
                                key={freq.id}
                                onClick={() => setRules({...rules, frequency: freq.id as any})}
                                className={cn(
                                  "py-3 rounded font-mono font-medium text-[10px] uppercase tracking-widest border transition-all",
                                  rules.frequency === freq.id 
                                    ? "bg-intel text-white border-intel shadow-sm" 
                                    : "bg-bg-base border-line-1 text-t2 hover:text-t1 hover:bg-bg-surface"
                                )}
                              >
                                {freq.label}
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <label className="text-[10px] font-mono font-medium uppercase tracking-widest text-t3">Categories To Track</label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: 'free', label: 'Free Money', icon: Zap },
                          { id: 'prediction', label: 'Prediction Markets', icon: Activity },
                          { id: 'insider', label: 'Insider Activity', icon: Search },
                          { id: 'market', label: 'Market Moves', icon: ShieldCheck },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => toggleCategory(cat.id)}
                            className={cn(
                              "flex items-center justify-between p-4 rounded-lg border transition-all",
                              rules.categories.includes(cat.id) 
                                ? "bg-bg-elevated border-intel/40 text-t1" 
                                : "bg-transparent border-line-1 text-t3 hover:bg-bg-surface"
                            )}
                          >
                             <div className="flex items-center gap-3">
                                <cat.icon className={cn(
                                  "h-4 w-4",
                                  rules.categories.includes(cat.id) ? "text-intel" : "text-t3"
                                )} />
                                <span className="text-xs font-sans font-medium uppercase tracking-tight">{cat.label}</span>
                             </div>
                             <div className={cn(
                               "h-4 w-4 rounded border flex items-center justify-center transition-all",
                               rules.categories.includes(cat.id) ? "bg-intel border-intel text-white" : "border-line-1"
                             )}>
                                {rules.categories.includes(cat.id) && <CheckCircle className="h-3 w-3 stroke-[3]" />}
                             </div>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setRules({...rules, convergenceOnly: !rules.convergenceOnly})}
                        className={cn(
                          "w-full flex items-center justify-between p-4 rounded-lg border transition-all",
                          rules.convergenceOnly 
                            ? "border-intel/40 bg-intel/5 text-t1" 
                            : "border-dashed border-line-1 text-t3 hover:bg-bg-surface"
                        )}
                      >
                         <div className="flex flex-col items-start gap-1">
                            <span className="text-xs font-sans font-medium uppercase tracking-tight">Strong Agreement Only</span>
                            <span className="text-[9px] font-mono font-medium opacity-60 uppercase tracking-tighter">Requires 3+ Sources</span>
                         </div>
                         <div className={cn(
                           "h-10 w-10 rounded flex items-center justify-center border transition-all",
                           rules.convergenceOnly ? "bg-intel text-white border-intel shadow-sm" : "bg-bg-base border-line-1"
                         )}>
                            <Activity className="h-5 w-5" />
                         </div>
                      </button>
                   </div>
                </div>
             </div>

             {/* Connection Management */}
             <div className="flex flex-col sm:flex-row gap-6">
                <Card className="flex-1 p-6 border-s-low/10 bg-s-low/5">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-s-low/20 flex items-center justify-center">
                         <Bot className="h-6 w-6 text-s-low" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] font-mono font-medium text-s-low uppercase tracking-widest mb-1">Active Bot</p>
                         <h4 className="text-lg font-sans font-medium tracking-tight text-text-1 uppercase">@{status?.botUsername || 'TraceDogBot'}</h4>
                      </div>
                      <button 
                        onClick={() => testMutation.mutate()}
                        className="p-3 bg-bg-surface border border-border-dim rounded hover:border-border-active text-s-low transition-all group"
                        title="Send Test Message"
                      >
                        <Send className="h-5 w-5 group-hover:translate-x-1 group-active:scale-90 transition-all" />
                      </button>
                   </div>
                </Card>

                <Card className="flex-1 p-6 border-s-critical/10 bg-s-critical/5 group cursor-pointer hover:bg-s-critical/10 transition-all" onClick={() => disconnectMutation.mutate()}>
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-s-critical/20 flex items-center justify-center">
                         <Trash2 className="h-6 w-6 text-s-critical" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] font-mono font-medium text-s-critical uppercase tracking-widest mb-1">Danger Zone</p>
                         <h4 className="text-lg font-sans font-medium tracking-tight text-text-1 uppercase group-hover:text-s-critical transition-colors">Disconnect Engine</h4>
                      </div>
                      <ChevronRight className="h-5 w-5 text-s-critical opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                   </div>
                </Card>
             </div>
          </div>

          {/* Message Feed Sidebar */}
          <div className="space-y-6">
             <h3 className="text-lg font-sans font-medium uppercase tracking-tight flex items-center gap-2 text-text-1">
                <MessageSquare className="h-5 w-5 text-border-active" />
                Dispatch Log
             </h3>
             <div className="space-y-4">
                {messages.length > 0 ? messages.map((msg: any, i: number) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={msg.id}
                    className="bg-bg-surface p-4 border border-border-dim rounded hover:border-border-active/20 transition-all"
                  >
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                           <div className={cn(
                             "h-1.5 w-1.5 rounded-full",
                             msg.status === 'sent' ? 'bg-s-low' : 'bg-s-critical'
                           )} />
                           <span className="text-[9px] font-mono font-medium uppercase tracking-widest text-text-3">{msg.status}</span>
                        </div>
                        <span className="text-[9px] font-mono font-medium text-text-3 uppercase">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     </div>
                     <p className="text-[11px] font-sans text-text-2 line-clamp-3 leading-relaxed">
                        {msg.text}
                     </p>
                  </motion.div>
                )) : (
                  <div className="bg-bg-surface border border-border-dim rounded p-12 flex flex-col items-center justify-center text-center opacity-40">
                    <MessageSquare className="h-10 w-10 text-text-3 mb-4" />
                    <p className="text-[10px] font-mono font-medium uppercase tracking-widest">No signals dispatched</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  return (
    <div className={cn("bg-bg-surface border border-border-dim rounded-xl", className)} onClick={onClick}>
      {children}
    </div>
  );
}
