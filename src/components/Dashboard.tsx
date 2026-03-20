import { motion, AnimatePresence } from 'motion/react';
import { useAlphaFeed } from '../hooks/useAlphaFeed';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import { MarketPanel } from './MarketPanel';
import { K9SignalCelebration } from './K9Dog';
import { useSignalCelebration } from '../hooks/useSignalCelebration';
import { 
  Zap, 
  RefreshCw, 
  Target, 
  Shield, 
  ExternalLink, 
  Bookmark, 
  ThumbsUp,
  ThumbsDown,
  Share2,
  Info,
  Sparkles,
  Activity,
  Clock
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

function getRiskIcon(risk: string): string {
  const icons: Record<string, string> = {
    low:      '🟢',
    medium:   '🟡',
    high:     '🟠',
    critical: '🔴',
  };
  return icons[risk] ?? '⚪';
}

export function Dashboard() {
  const { signals, loading, filters, setFilters, refreshFeed, upvoteSignal, downvoteSignal } = useAlphaFeed();
  const { celebrating, activeSignal, onCelebrationDone } = useSignalCelebration(signals);

  const saveSignal = (signalId: string) => {
    const signal = signals.find(s => s.id === signalId);
    if (signal) {
      toast.success('Alpha saved to vault!', {
        description: (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-sm">{signal.title}</p>
              <p className="text-xs opacity-80">Added to your Alpha Vault</p>
            </div>
          </div>
        ),
        duration: 4000,
      });
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'critical': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'defi': return <Activity className="h-3 w-3" />;
      case 'token_launch': return <Sparkles className="h-3 w-3" />;
      case 'whale': return <Target className="h-3 w-3" />;
      case 'security': return <Shield className="h-3 w-3" />;
      case 'convergence': return <Zap className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  const getTimeAgo = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 uppercase tracking-tight">
            <Activity className="h-8 w-8 text-intel" />
            Alpha Terminal
          </h1>
          <p className="text-muted-foreground">Real-time intelligence from the edge of the network.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refreshFeed()} disabled={loading} className="gap-2">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh Feed
          </Button>
          <Button size="sm" className="gap-2">
            <Zap className="h-4 w-4 fill-white" />
            Live Stream
          </Button>
        </div>
      </div>

      <MarketPanel />

      <Card className="p-4 border-intel/20 bg-intel/5">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">Minimum Alpha Score</span>
              <span className="text-sm font-mono font-bold text-intel">{filters.minConfidence}</span>
            </div>
            <Slider 
              value={[filters.minConfidence]} 
              min={0} 
              max={100} 
              step={5} 
              onValueChange={([v]) => setFilters(f => ({ ...f, minConfidence: v }))}
            />
          </div>
          <div className="flex gap-4">
            <div className="space-y-1.5 min-w-[140px]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground ml-1">Category</span>
              <Select value={filters.category} onValueChange={(v) => setFilters(f => ({ ...f, category: v }))}>
                <SelectTrigger className="h-9 bg-background">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="defi">DeFi Alpha</SelectItem>
                  <SelectItem value="token_launch">Token Launches</SelectItem>
                  <SelectItem value="airdrop">Free Money</SelectItem>
                  <SelectItem value="security">Security Risks</SelectItem>
                  <SelectItem value="convergence">Market Consensus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 min-w-[140px]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground ml-1">Risk Level</span>
              <Select value={filters.risk} onValueChange={(v) => setFilters(f => ({ ...f, risk: v }))}>
                <SelectTrigger className="h-9 bg-background">
                  <SelectValue placeholder="Any Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {signals.map((signal) => (
            <motion.div
              key={signal.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden flex flex-col h-full group hover:border-intel/40 transition-all">
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={cn("gap-1.5 font-bold uppercase text-[10px]", getRiskColor(signal.risk))}>
                        {getRiskIcon(signal.risk)}
                        {signal.risk} Risk
                      </Badge>
                      <Badge variant="secondary" className="gap-1.5 font-bold uppercase text-[10px]">
                        {getCategoryIcon(signal.category)}
                        {signal.category}
                      </Badge>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(signal.timestamp)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold leading-tight group-hover:text-intel transition-colors">{signal.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {signal.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Confidence</span>
                      <span className="text-xl font-black font-display">{signal.score}%</span>
                    </div>
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-intel" style={{ width: `${signal.score}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 border-t flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-intel" onClick={() => upvoteSignal(signal.id)}>
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-mono font-bold">{signal.upvotes}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => downvoteSignal(signal.id)}>
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => saveSignal(signal.id)}>
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="h-8 gap-2" asChild>
                      <a href={signal.url} target="_blank" rel="noopener noreferrer">
                        Access <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* K9 Celebration — floats above everything */}
      <K9SignalCelebration 
        signal={activeSignal} 
        active={celebrating} 
        onDone={onCelebrationDone} 
      />
    </div>
  );
}
