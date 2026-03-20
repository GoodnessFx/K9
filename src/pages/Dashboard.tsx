import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { signalsApi, criApi } from '../api';
import { 
  Send, 
  Filter,
  X,
  Zap,
  ChevronDown,
  Bookmark,
  Loader2,
  Search
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { getCategoryLabel, getCategoryColor, getCategoryBg } from '../utils/categories';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const FILTER_TABS = [
  { id: 'all',     label: 'All' },
  { id: 'free',    label: 'Free Money / Airdrop' },
  { id: 'jobs',    label: 'Jobs / Gigs / Bounty' },
  { id: 'insider', label: 'Insider Signals' },
  { id: 'market',  label: 'Market Moves' },
  { id: 'verify',  label: 'Safety Alerts' },
];

export default function FeedPage() {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState(() => {
    if (location.pathname === '/free-money') return 'free';
    if (location.pathname === '/jobs') return 'jobs';
    return 'all';
  });

  useEffect(() => {
    if (location.pathname === '/free-money') setActiveFilter('free');
    else if (location.pathname === '/jobs') setActiveFilter('jobs');
    else if (location.pathname === '/feed') setActiveFilter('all');
  }, [location.pathname]);

  const [searchQuery, setSearchQuery] = useState('');
  const [minScore, setMinScore] = useState(65);
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: signals = [], isLoading } = useQuery({
    queryKey: ['signals'],
    queryFn: () => signalsApi.getSignals(),
    refetchInterval: 30000,
  });

  const filteredSignals = useMemo(() => {
    let result = Array.isArray(signals) ? signals : [];
    
    // Tab filtering
    if (activeFilter === 'free') {
      result = result.filter(s => ['airdrop', 'bounty', 'learn', 'grant'].includes(s.category));
    } else if (activeFilter === 'jobs') {
      result = result.filter(s => s.category === 'job');
    } else if (activeFilter === 'insider') {
      result = result.filter(s => ['insider', 'whale', 'convergence', 'polymarket'].includes(s.category));
    } else if (activeFilter === 'market') {
      result = result.filter(s => ['defi', 'tradfi', 'nft', 'stablecoin'].includes(s.category));
    } else if (activeFilter === 'verify') {
      result = result.filter(s => s.category === 'security');
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.title.toLowerCase().includes(q) || (s.summary || '').toLowerCase().includes(q));
    }
    return result.filter(s => (s.score || s.confidence || 0) >= minScore);
  }, [signals, activeFilter, searchQuery, minScore]);

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: signalsApi.getStats,
    refetchInterval: 30000,
  });

  const { data: cri = [] } = useQuery({
    queryKey: ['cri'],
    queryFn: criApi.getCRI,
    refetchInterval: 30000,
  });

  return (
    <div className="space-y-12 pb-20 max-w-[1440px] mx-auto">
      {/* Page Header */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-intel/10 border border-intel/20 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-intel">Dispatch LIVE</span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-display font-semibold tracking-tight text-t1 uppercase">Dispatch</h2>
            <p className="text-t2 max-w-xl text-sm leading-relaxed">
              K9 found {signals.length} opportunities. Newest first.
            </p>
          </div>
        </div>
      </section>

      {/* Stat Cards Header */}
      <section className="stat-cards">
        {[
          { label: 'Opportunities today', value: stats?.signalsToday ?? 0, delta: stats?.signalsToday > 0 ? `+${stats.signalsToday} today` : '0 today', color: 'text-t1', isAlert: false },
          { label: 'Strong Signals', value: stats?.highConviction ?? 0, delta: null, color: 'text-t1', isAlert: false },
          { label: 'Avg Confidence Score', value: stats?.avgScore ?? 0, delta: null, color: 'text-t1', isAlert: false },
          { label: 'Active Alerts', value: stats?.activeAlerts ?? 0, delta: stats?.criticalAlerts ? `${stats.criticalAlerts} critical` : null, color: 'text-t1', isAlert: true },
        ].map((stat, i) => (
          <div key={i} className="bg-bg-surface border border-line-1 p-5 rounded-lg space-y-3 relative overflow-hidden group">
            <div className="flex flex-col gap-1 relative z-10">
              <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-t3 group-hover:text-intel transition-colors">{stat.label}</span>
              <div className="flex items-baseline gap-2">
                <span className={cn("text-3xl font-display font-bold tracking-tighter", stat.color)}>{stat.value}</span>
                {stat.delta && <span className="text-[10px] font-mono text-safe uppercase">{stat.delta}</span>}
              </div>
            </div>
            {stat.isAlert && (
              <div className="absolute right-0 top-0 h-full w-1 bg-critical shadow-[0_0_12px_rgba(240,58,95,0.4)]" />
            )}
          </div>
        ))}
      </section>

      {/* Real-time Market Health Indicator */}
      <section className="bg-bg-surface border border-line-1 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden relative group">
        <div className="flex items-center gap-4 min-w-fit">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-intel animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-t1">Market Health</span>
          </div>
          <div className="h-4 w-px bg-line-1 hidden lg:block" />
          <div className="flex items-center gap-4 text-[10px] font-mono font-medium uppercase tracking-widest text-t3">
             <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-safe" /> Healthy</div>
             <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-intel" /> Bullish</div>
             <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-medium" /> Moderate</div>
             <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-critical shadow-[0_0_8px_rgba(240,58,95,0.5)] animate-pulse" /> Risk</div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          <div className="flex items-center gap-8 min-w-max">
            {cri?.map((chain: any) => (
              <div key={chain.chain} className="flex flex-col gap-1.5 min-w-[100px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-mono font-bold text-t2">{chain.chain}</span>
                  <span className={cn(
                    "text-[10px] font-mono font-bold",
                    chain.status === 'BULLISH' ? 'text-intel' : 
                    chain.status === 'HEALTHY' ? 'text-safe' : 
                    chain.status === 'MODERATE' ? 'text-medium' : 'text-critical'
                  )}>{chain.score}</span>
                </div>
                <div className="h-1 w-full bg-bg-base rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      chain.status === 'BULLISH' ? 'bg-intel shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 
                      chain.status === 'HEALTHY' ? 'bg-safe' : 
                      chain.status === 'MODERATE' ? 'bg-medium' : 'bg-critical'
                    )}
                    style={{ width: `${chain.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Bar & Feed Controls */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-line-2 pb-6">
          <div className="filter-tabs w-full lg:w-auto">
            {FILTER_TABS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={cn(
                  "filter-tab rounded font-sans font-medium text-[13px] transition-all whitespace-nowrap",
                  activeFilter === cat.id 
                  ? "bg-intel text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                  : "text-t2 hover:text-t1"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative group flex-1 lg:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-t3 group-focus-within:text-line-3 transition-colors" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search opportunities..."
                className="w-full lg:w-64 bg-bg-inset border border-line-1 rounded-md pl-9 pr-4 py-1.5 text-xs font-sans text-t1 outline-none focus:border-line-3 transition-all placeholder:text-t3"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-t3 hover:text-t1">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-sans font-medium transition-all whitespace-nowrap",
                showFilters || minScore > 65 ? "bg-bg-elevated border-line-3 text-t1" : "bg-bg-surface border-line-1 text-t2 hover:text-t1"
              )}
            >
              <Filter className="h-3.5 w-3.5" />
              Filters {(minScore > 65) && <span className="h-1.5 w-1.5 rounded-full bg-line-3 ml-0.5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-bg-surface border border-line-1 rounded-lg p-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono font-medium uppercase tracking-[0.08em] text-t3">Minimum Confidence Score</label>
                    <span className="text-sm font-mono text-line-3 font-medium">{minScore}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5" 
                    value={minScore}
                    onChange={(e) => setMinScore(parseInt(e.target.value))}
                    className="w-full accent-line-3 bg-bg-inset h-1.5 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-t3">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="space-y-2">
                     <span className="text-[10px] font-mono font-medium uppercase tracking-[0.08em] text-t3 block">Signal Count</span>
                     <p className="text-sm font-sans text-t2">
                       Showing <span className="text-t1 font-mono">{filteredSignals.length}</span> of <span className="text-t1 font-mono">{Array.isArray(signals) ? signals.length : 0}</span> signals
                     </p>
                  </div>
                  <button 
                    onClick={() => { setMinScore(65); setActiveFilter('all'); setSearchQuery(''); }}
                    className="text-[10px] font-mono font-medium uppercase tracking-[0.08em] text-t3 hover:text-critical transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Live Feed Grid */}
      <section className="signal-grid">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-bg-surface border border-line-1 rounded-lg h-[320px] animate-shimmer bg-gradient-to-r from-bg-surface via-bg-elevated to-bg-surface bg-[length:200%_100%]" />
            ))
          ) : filteredSignals.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3 py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <div className="p-4 bg-bg-surface border border-line-1 rounded-full">
                <Zap className="h-10 w-10 text-t3" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-sans font-medium text-t1">No opportunities matching filters</h3>
                <p className="text-sm font-sans text-t2 max-w-xs mx-auto leading-relaxed">The scanner runs every 5 minutes — check back shortly or try clearing filters.</p>
              </div>
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => { setMinScore(0); setActiveFilter('all'); setSearchQuery(''); }}
                  className="text-xs font-mono font-medium uppercase tracking-[0.08em] text-line-3 hover:underline"
                >
                  Clear all filters
                </button>
                <button className="text-xs font-mono font-medium uppercase tracking-[0.08em] text-t2 hover:underline">
                  View all
                </button>
              </div>
            </div>
          ) : (
            filteredSignals.map((signal, i) => (
              <SignalCard 
                key={signal.id} 
                signal={signal} 
                index={i} 
              />
            ))
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

function IntelligenceBrief({ brief }: { brief: string }) {
  return (
    <div className="bg-bg-inset border border-intel/20 rounded-lg p-4 mt-4 text-sm text-t2 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-1.5 w-1.5 rounded-full bg-intel animate-pulse" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-intel">Intelligence Brief</span>
      </div>
      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-intel prose-strong:font-bold">
        <ReactMarkdown>{brief}</ReactMarkdown>
      </div>
    </div>
  );
}

function SignalCard({ signal, index }: { signal: any, index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [brief, setBrief] = useState<string | null>(signal.intelligenceBrief ?? null);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [sendState, setSendState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');

  const [savedSignals, setSavedSignals] = useState<any[]>(() => {
    const data = localStorage.getItem('saved_opportunities');
    return data ? JSON.parse(data) : [];
  });

  const getScoreColor = (score: number) => {
    const s = score || 0;
    if (s >= 90) return 'text-purple-500';
    if (s >= 80) return 'text-safe';
    return 'text-medium';
  };

  const getStatusDot = (score: number, risk: string) => {
    const s = score || 0;
    const r = risk?.toLowerCase() || 'medium';
    if (s >= 90) return <div className="h-3 w-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" title="Rare Insider Signal" />;
    if (r === 'critical') return <div className="h-3 w-3 rounded-full bg-critical shadow-[0_0_8px_rgba(240,58,95,0.5)] animate-pulse" title="Urgent Crisis" />;
    if (r === 'high') return <div className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" title="Act Fast" />;
    if (r === 'medium') return <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" title="Watch Risk" />;
    return <div className="h-3 w-3 rounded-full bg-safe shadow-[0_0_8px_rgba(0,191,114,0.5)]" title="Good Opportunity" />;
  };

  const handleExpand = async () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && !brief && !loadingBrief) {
      setLoadingBrief(true);
      try {
        const data = await signalsApi.getSignalBrief(signal.id);
        setBrief(data.brief);
      } catch (e) {
        setBrief('Unable to load intelligence brief. Please check your connection.');
      } finally {
        setLoadingBrief(false);
      }
    }
  };

  const handleSendToPhone = async () => {
    setSendState('loading');
    try {
      const status = await signalsApi.getNotificationStatus();
      const channels = [];
      if (status.whatsapp?.connected) channels.push('whatsapp');
      if (status.telegram?.connected) channels.push('telegram');
      
      if (channels.length === 0) {
        toast.error('Connect WhatsApp or Telegram first in Settings');
        setSendState('idle');
        return;
      }

      await signalsApi.broadcast(signal.id, channels);
      setSendState('sent');
      toast.success('Opportunity sent to your phone!');
    } catch (e) {
      setSendState('error');
      toast.error('Failed to send. Check your connection.');
    }
    setTimeout(() => setSendState('idle'), 3000);
  };

  const removeSignal = (id: string) => {
    const updated = savedSignals.filter(s => s.id !== id);
    setSavedSignals(updated);
    localStorage.setItem('saved_opportunities', JSON.stringify(updated));
    toast.success('Removed from saved opportunities');
  };

  const saveSignal = (signal: any) => {
    const isSaved = savedSignals.some(s => s.id === signal.id);
    if (isSaved) {
      removeSignal(signal.id);
    } else {
      const updated = [...savedSignals, signal];
      setSavedSignals(updated);
      localStorage.setItem('saved_opportunities', JSON.stringify(updated));
      toast.success('Added to saved opportunities');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "glass-card rounded-lg overflow-hidden flex flex-col h-fit group/card",
        signal.isConvergence && "animate-convergence-pulse border-convergence/40 border-l-[3px] border-l-convergence"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-intel/5 to-transparent h-1/2 w-full -translate-y-full group-hover/card:animate-[scan_2s_ease-in-out_infinite] pointer-events-none opacity-0 group-hover/card:opacity-100" />
      
      <div className="p-6 space-y-5 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusDot(signal.score || signal.confidence, signal.risk)}
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-mono text-t3 uppercase tracking-[0.08em]">Confidence</span>
              <span className={cn("text-xl font-display font-semibold tracking-[-0.02em]", getScoreColor(signal.score || signal.confidence))}>
                {signal.score || signal.confidence || 0}/100
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => saveSignal(signal)}
              className={cn(
                "p-1.5 rounded-md border transition-all",
                savedSignals.some(s => s.id === signal.id) 
                  ? "bg-intel/20 border-intel/40 text-intel" 
                  : "border-line-1 text-t3 hover:text-t1 hover:border-line-2"
              )}
            >
              <Bookmark className={cn("h-3.5 w-3.5", savedSignals.some(s => s.id === signal.id) && "fill-current")} />
            </button>
            <span className="text-[11px] font-mono text-t3 uppercase">
              {new Date(signal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.04em]" style={{ color: getCategoryColor(signal.category) }}>
            {signal.isConvergence ? 'Multiple Sources Agree' : getCategoryLabel(signal.category)}
          </span>
        </div>

        <h3 className="text-[18px] font-sans font-medium text-t1 leading-tight normal-case tracking-normal">
          {signal.title}
        </h3>

        <p className="text-[14px] font-sans text-t2 leading-relaxed line-clamp-2">
          {signal.summary || signal.description}
        </p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {loadingBrief ? (
                <div className="py-4 flex items-center justify-center gap-2 text-t3 text-xs">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Loading intelligence brief...</span>
                </div>
              ) : brief ? (
                <IntelligenceBrief brief={brief} />
              ) : null}

              <div className="space-y-5 pt-4">
                <div className="bg-bg-inset border-l-2 border-intel p-4 rounded-r-lg">
                  <span className="text-[10px] font-mono font-medium uppercase tracking-[0.08em] text-t3 mb-2 block">What This Means</span>
                  <p className="text-[13px] font-sans italic text-t2 leading-relaxed">
                    {signal.analysis}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 font-mono text-[12px]">
                  <div className="space-y-1">
                    <span className="text-t3 block uppercase text-[10px] tracking-widest">Target</span>
                    <span className="text-safe font-medium">{signal.priceTarget || signal.target || 'N/A'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-t3 block uppercase text-[10px] tracking-widest">Stop Loss</span>
                    <span className="text-critical font-medium">{signal.stopLoss || signal.stop || 'N/A'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-t3 block uppercase text-[10px] tracking-widest">Timeframe</span>
                    <span className="text-t2 font-medium">{signal.timeframe || signal.duration || 'Today only'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 pt-4 border-t border-line-1">
          <button 
            onClick={handleExpand}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-bg-inset border border-line-1 rounded hover:border-line-2 transition-all text-xs font-sans font-medium text-t2 hover:text-t1"
          >
            What can I do?
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-180")} />
          </button>
          
          <button 
            onClick={handleSendToPhone}
            disabled={sendState === 'loading'}
            className={cn(
              "flex items-center gap-2 px-3 py-2 border rounded transition-all text-xs font-sans font-medium whitespace-nowrap",
              sendState === 'sent' ? "bg-safe/10 border-safe/20 text-safe" : 
              sendState === 'error' ? "bg-critical/10 border-critical/20 text-critical" :
              "bg-intel/10 border-intel/20 text-intel hover:bg-intel/20"
            )}
          >
            {sendState === 'loading' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {sendState === 'sent' ? 'Sent ✓' : sendState === 'error' ? 'Failed' : 'Send to phone'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
