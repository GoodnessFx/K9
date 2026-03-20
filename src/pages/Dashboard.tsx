import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useK9DataEngine, K9Signal } from '../hooks/useK9DataEngine';
import { 
  Send, 
  Filter,
  X,
  Zap,
  ChevronDown,
  Bookmark,
  Loader2,
  Search,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';
import { getCategoryLabel, getCategoryColor } from '../utils/categories';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const FILTER_TABS = [
  { id: 'all',     label: 'All' },
  { id: 'free',    label: 'Free Money' },
  { id: 'jobs',    label: 'Crypto Jobs' },
  { id: 'insider', label: 'Insider Signals' },
  { id: 'market',  label: 'Market Moves' },
  { id: 'verify',  label: 'Safety Alerts' },
];

export default function FeedPage() {
  const { signals, loading, lastUpdated, refreshNow, activeSources, totalSources } = useK9DataEngine();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minScore, setMinScore] = useState(65);
  const [showFilters, setShowFilters] = useState(false);

  const filteredSignals = useMemo(() => {
    let result = signals.filter(s => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'free') return ['airdrop', 'bounty', 'learn', 'grant'].includes(s.category);
      if (activeFilter === 'jobs') return s.category === 'job';
      if (activeFilter === 'insider') return ['insider', 'whale', 'polymarket'].includes(s.category);
      if (activeFilter === 'market') return ['defi', 'tradfi', 'nft'].includes(s.category);
      if (activeFilter === 'verify') return s.category === 'security';
      return s.category === activeFilter;
    });

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.title.toLowerCase().includes(q) || (s.summary || '').toLowerCase().includes(q));
    }
    return result.filter(s => s.confidence >= minScore);
  }, [signals, activeFilter, searchQuery, minScore]);

  return (
    <div className="space-y-12 pb-20 max-w-[1440px] mx-auto">
      {/* Page Header */}
      <section id="dispatch-top" className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-intel/10 border border-intel/20 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-intel">Hunting LIVE</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshNow} 
            disabled={loading}
            className="gap-2 h-8 bg-bg-surface border-line-1 text-t2 hover:text-t1"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Scan Now
          </Button>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-display font-semibold tracking-tight text-t1 uppercase">Dispatch</h2>
            <div className="flex items-center gap-2 text-t3 text-[10px] font-mono uppercase tracking-widest">
              <span>{activeSources}/{totalSources} sources active</span>
              <span>·</span>
              <span>K9 found {signals.length} opportunities. Freshest first.</span>
              {lastUpdated && (
                <>
                  <span>·</span>
                  <span>Updated {Math.round((Date.now() - lastUpdated.getTime()) / 1000)}s ago</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stat Cards Header */}
      <section className="stat-cards">
        {[
          { label: 'Signals found', value: signals.length, delta: `+${signals.filter(s => s.isNew).length} new`, color: 'text-t1', isAlert: false },
          { label: 'High Confidence', value: signals.filter(s => s.confidence >= 85).length, delta: null, color: 'text-t1', isAlert: false },
          { label: 'Avg Confidence', value: signals.length ? Math.round(signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length) : 0, delta: null, color: 'text-t1', isAlert: false },
          { label: 'Critical Risks', value: signals.filter(s => s.risk === 'critical').length, delta: null, color: 'text-t1', isAlert: true },
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
                placeholder="Search signals..."
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
                    <label className="text-[10px] font-mono font-medium uppercase tracking-[0.08em] text-t3">How sure K9 is</label>
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
                       Showing <span className="text-t1 font-mono">{filteredSignals.length}</span> of <span className="text-t1 font-mono">{signals.length}</span> signals
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
          {loading && signals.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-bg-surface border border-line-1 rounded-lg h-[320px] animate-shimmer bg-gradient-to-r from-bg-surface via-bg-elevated to-bg-surface bg-[length:200%_100%]" />
            ))
          ) : filteredSignals.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3 py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <div className="p-4 bg-bg-surface border border-line-1 rounded-full">
                <Zap className="h-10 w-10 text-t3" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-sans font-medium text-t1">K9 is still sniffing. Opportunities load in a few seconds.</h3>
                <p className="text-sm font-sans text-t2 max-w-xs mx-auto leading-relaxed">Check back shortly or try lowering the confidence score.</p>
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

function SignalCard({ signal, index }: { signal: K9Signal, index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sendState, setSendState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');

  const [savedSignals, setSavedSignals] = useState<any[]>(() => {
    const data = localStorage.getItem('saved_opportunities');
    return data ? JSON.parse(data) : [];
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-purple-500';
    if (score >= 80) return 'text-safe';
    return 'text-medium';
  };

  const getStatusDot = (score: number, risk: string) => {
    const r = risk?.toLowerCase() || 'medium';
    if (score >= 90) return <div className="h-3 w-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" title="Rare Insider Signal" />;
    if (r === 'critical') return <div className="h-3 w-3 rounded-full bg-critical shadow-[0_0_8px_rgba(240,58,95,0.5)] animate-pulse" title="Urgent Crisis" />;
    if (r === 'high') return <div className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" title="Act Fast" />;
    if (r === 'medium') return <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" title="Watch Risk" />;
    return <div className="h-3 w-3 rounded-full bg-safe shadow-[0_0_8px_rgba(0,191,114,0.5)]" title="Good Opportunity" />;
  };

  const saveSignal = (signal: K9Signal) => {
    const isSaved = savedSignals.some(s => s.id === signal.id);
    if (isSaved) {
      const updated = savedSignals.filter(s => s.id !== signal.id);
      setSavedSignals(updated);
      localStorage.setItem('saved_opportunities', JSON.stringify(updated));
      toast.success('Removed from saved opportunities');
    } else {
      const updated = [...savedSignals, signal];
      setSavedSignals(updated);
      localStorage.setItem('saved_opportunities', JSON.stringify(updated));
      toast.success('Added to saved opportunities');
    }
  };

  const handleSendToPhone = async () => {
    setSendState('loading');
    try {
      await api.broadcast(signal.id, ['whatsapp', 'telegram']);
      setSendState('sent');
      toast.success('Opportunity sent to your phone!');
    } catch (e) {
      setSendState('error');
      toast.error('Failed to send. Connect keys in Settings.');
    }
    setTimeout(() => setSendState('idle'), 3000);
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "glass-card rounded-lg overflow-hidden flex flex-col h-fit group/card border border-line-1",
        signal.risk === 'critical' && "border-critical/40 border-l-[3px] border-l-critical",
        signal.isNew && "ring-1 ring-intel/30"
      )}
    >
      <div className="p-6 space-y-5 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusDot(signal.confidence, signal.risk)}
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-mono text-t3 uppercase tracking-[0.08em]">Confidence</span>
              <span className={cn("text-xl font-display font-semibold tracking-[-0.02em]", getScoreColor(signal.confidence))}>
                {signal.confidence}/100
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
              {getTimeAgo(signal.timestamp)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.04em]" style={{ color: getCategoryColor(signal.category) }}>
            {getCategoryLabel(signal.category)}
          </span>
          <span className="h-1 w-1 rounded-full bg-line-2" />
          <span className="text-[10px] font-mono text-t3 uppercase">{signal.source}</span>
        </div>

        <h3 className="text-[18px] font-sans font-medium text-t1 leading-tight normal-case tracking-normal">
          {signal.title}
        </h3>

        <p className="text-[14px] font-sans text-t2 leading-relaxed line-clamp-2">
          {signal.summary}
        </p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-bg-inset border-l-2 border-intel p-4 rounded-r-lg mt-4">
                <span className="text-[10px] font-mono font-medium uppercase tracking-[0.08em] text-t3 mb-2 block">Opportunity Insight</span>
                <p className="text-[13px] font-sans italic text-t2 leading-relaxed">
                  {signal.timeToAct ? `⏰ ${signal.timeToAct}` : 'Action required soon.'}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {signal.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-mono bg-bg-elevated text-t3 px-2 py-0.5 rounded-full border border-line-1">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 pt-4 border-t border-line-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-bg-inset border border-line-1 rounded hover:border-line-2 transition-all text-xs font-sans font-medium text-t2 hover:text-t1"
          >
            Details
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

          <a 
            href={signal.actionUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 bg-bg-inset border border-line-1 rounded text-t3 hover:text-intel transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// Utility to fix missing imports/vars in Dashboard
import { Button } from '../components/ui/button';
import { api } from '../api';
