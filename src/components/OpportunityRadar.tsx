import { useState } from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Radar,
  Zap,
  Target,
  Pause,
  Play,
  Settings,
  Activity,
  Flame,
  Layers,
  Clock,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { ScoredSignal } from '../types';

// Chain Risk Index Widget Component
const CRIWidget = () => {
  const { data: criData = [] } = useQuery({
    queryKey: ['cri'],
    queryFn: apiClient.getCRI,
    refetchInterval: 900000, // 15 minutes
  });

  const getCRIColor = (score: number) => {
    if (score <= 30) return 'bg-red-500';
    if (score <= 60) return 'bg-orange-500';
    if (score <= 90) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <Layers className="h-5 w-5 text-blue-500" />
        CHAIN RISK INDEX (CRI)
      </h3>
      <div className="space-y-4">
        {criData.map((item: any) => (
          <div key={item.chain} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium capitalize">{item.chain}</span>
              <span className="font-bold">{item.score}/100</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                className={`h-full ${getCRIColor(item.score)}`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
              <span>{item.status}</span>
              <span>Updated 15m ago</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Radar visualization component (simplified for real signals)
const RadarVisualization = ({ signals }: { signals: ScoredSignal[] }) => {
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;
  
  const getRadarPosition = (score: number, risk: string, index: number) => {
    const riskMultiplier = risk === 'low' ? 0.3 : risk === 'medium' ? 0.6 : 0.9;
    const radius = (score / 100) * maxRadius * riskMultiplier;
    const angle = (index / (signals.length || 1)) * 2 * Math.PI;
    
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };
  
  return (
    <div className="relative">
      <svg width="300" height="300" className="border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        {[20, 40, 60, 80, 100].map((radius) => (
          <circle key={radius} cx={centerX} cy={centerY} r={(radius / 100) * maxRadius} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        ))}
        {signals.slice(0, 12).map((signal, index) => {
          const score = signal.score ?? signal.confidence ?? 0;
          const pos = getRadarPosition(score, signal.risk, index);
          const color = score > 80 ? '#f59e0b' : '#3b82f6';
          
          return (
            <g key={signal.id}>
              <circle cx={pos.x} cy={pos.y} r="5" fill={color} opacity="0.8" className="animate-pulse" />
              <text x={pos.x} y={pos.y - 8} textAnchor="middle" className="text-[10px] font-bold fill-current">
                {signal.tokenSymbol || signal.title.slice(0, 4)}
              </text>
            </g>
          );
        })}
        <circle cx={centerX} cy={centerY} r="3" fill="currentColor" opacity="0.5" />
      </svg>
      <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground font-bold">
        DISTANCE = SCORE | RING = RISK
      </div>
    </div>
  );
};

export function OpportunityRadar() {
  const [scanning, setScanning] = useState(true);
  const [activeView, setActiveView] = useState('opportunities');
  const [filters, setFilters] = useState({
    category: 'all',
    risk: 'all',
    minScore: 60,
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data: signals = [], isLoading } = useQuery<ScoredSignal[]>({
    queryKey: ['signals-radar', filters],
    queryFn: () => apiClient.getSignals({
      category: filters.category !== 'all' ? filters.category : undefined,
      risk: filters.risk !== 'all' ? filters.risk : undefined,
      minScore: filters.minScore,
    }),
    enabled: scanning,
    refetchInterval: 30000,
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'critical': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-8 pb-20">
       {/* Page Header */}
       <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <Radar className="h-4 w-4 text-indigo-500" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-indigo-500">Spatial Intelligence</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">ALPHA RADAR</h1>
          <p className="text-muted-foreground max-w-xl text-sm font-medium leading-relaxed">
            Visualizing market convergence and multi-source signals on a spatial map for intuitive opportunity detection.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setScanning(!scanning)}
            className="rounded-xl font-black text-[10px] uppercase tracking-tighter gap-2 h-11 px-5 border-border/50 hover:bg-accent"
          >
            {scanning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {scanning ? 'Pause Engine' : 'Resume Engine'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`rounded-xl h-11 w-11 transition-colors ${showAdvanced ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-accent'}`}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Advanced Filters - Redesigned */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="overflow-hidden"
        >
          <Card className="p-6 rounded-[2rem] border-none bg-muted/30 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Category</label>
                <Select value={filters.category} onValueChange={(value: string) => setFilters({...filters, category: value})}>
                  <SelectTrigger className="rounded-xl border-none bg-background font-bold text-xs h-11 shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="defi">DeFi</SelectItem>
                    <SelectItem value="token_launch">Token Launch</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Risk Level</label>
                <Select value={filters.risk} onValueChange={(value: string) => setFilters({...filters, risk: value})}>
                  <SelectTrigger className="rounded-xl border-none bg-background font-bold text-xs h-11 shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="critical">Critical Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-3 px-1">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Min Alpha Score</label>
                  <span className="text-sm font-black text-primary">{filters.minScore}</span>
                </div>
                <Slider 
                  value={[filters.minScore]} 
                  max={100} 
                  step={5} 
                  onValueChange={([val]: number[]) => setFilters({...filters, minScore: val})}
                  className="py-2"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Tabs for different views - Redesigned */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <div className="p-1.5 bg-muted/30 rounded-[1.5rem] border border-border/50 inline-flex">
          <TabsList className="bg-background rounded-2xl h-11 p-1 shadow-sm border border-border/50">
            <TabsTrigger value="opportunities" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-2">
              <Target className="h-3.5 w-3.5" />
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="radar" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-2">
              <Radar className="h-3.5 w-3.5" />
              Alpha Map
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-2">
              <Activity className="h-3.5 w-3.5" />
              CRI & Heatmap
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-2">
              <BarChart3 className="h-3.5 w-3.5" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="opportunities" className="space-y-6 mt-0">
          {/* Scanning Status - Redesigned */}
          <Card className="p-4 rounded-2xl border-border/50 bg-background/50 backdrop-blur shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`h-2.5 w-2.5 rounded-full ${scanning ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-muted-foreground'}`} />
                  {scanning && <div className="absolute inset-0 h-2.5 w-2.5 bg-green-500 rounded-full animate-ping opacity-75" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {scanning ? 'SCANNING ACTIVE' : 'SCAN PAUSED'}
                </span>
                <Badge variant="secondary" className="ml-2 font-black text-[10px] bg-primary/10 text-primary border-none">
                  {signals.length} LIVE SIGNALS
                </Badge>
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase">
                Updated: Just Now
              </div>
            </div>
          </Card>

          {/* Opportunities Grid - Redesigned */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
               Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6 h-48 animate-pulse bg-muted/50 rounded-[2rem]" />
              ))
            ) : (
              signals.map((signal, index) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-6 h-full hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-background rounded-[2rem] group overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-xl tracking-tight uppercase group-hover:text-primary transition-colors">
                              {signal.tokenSymbol || signal.title.slice(0, 15)}
                            </h3>
                            {(signal.score ?? signal.confidence ?? 0) >= 85 && <Flame className="h-4 w-4 text-orange-500 fill-orange-500 animate-pulse" />}
                          </div>
                          <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-tighter bg-muted/50 border-none">
                            {signal.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1 mb-1">
                            <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="text-2xl font-black tracking-tighter bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent">
                              {signal.score}
                            </span>
                          </div>
                          <Badge className={`rounded-lg px-2 py-0.5 font-black text-[8px] uppercase tracking-widest border ${getRiskColor(signal.risk)}`}>
                            {signal.risk} Risk
                          </Badge>
                        </div>
                      </div>

                      <p className="text-xs font-medium text-muted-foreground line-clamp-2 leading-relaxed italic">"{signal.analysis}"</p>

                      <div className="flex items-center justify-between pt-4 border-t border-border/50 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                        <span className="bg-muted/50 px-2 py-1 rounded-md">{signal.source}</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {signal.timeframe || 'TBD'}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="radar" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-8 rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-xl shadow-sm min-h-[600px] flex flex-col items-center justify-center relative group overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
               <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="flex items-center gap-3 mb-8 self-start px-2">
                    <div className="h-2 w-2 bg-indigo-500 rounded-full animate-ping shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    <h3 className="font-black text-sm uppercase tracking-tighter">Live Alpha Constellation</h3>
                  </div>
                  <RadarVisualization signals={signals} />
               </div>
            </Card>

            <div className="space-y-6">
               <CRIWidget />
               <Card className="p-6 rounded-[2rem] border-none bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Zap className="h-24 w-24" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-lg bg-white/20">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Radar Insights</span>
                    </div>
                    <h4 className="text-2xl font-black mb-2 tracking-tight uppercase">SOLANA CLUSTER</h4>
                    <p className="text-xs font-medium text-white/80 leading-relaxed">
                      High signal density detected in the Solana ecosystem. 4 independent vectors are converging on DeFi yield optimizers.
                    </p>
                    <Button variant="secondary" className="w-full mt-8 rounded-xl font-black text-[10px] uppercase tracking-tighter h-12 bg-white text-indigo-600 hover:bg-white/90 shadow-lg shadow-black/10">
                      Explore Cluster Details
                    </Button>
                  </div>
               </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <CRIWidget />
              </div>
              <Card className="lg:col-span-2 p-8 rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-3xl bg-orange-500/10 border border-orange-500/20 mb-6">
                  <Activity className="h-10 w-10 text-orange-600 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black mb-2 tracking-tight uppercase">MARKET VELOCITY</h3>
                <p className="text-sm font-medium text-muted-foreground max-w-sm leading-relaxed">
                  Real-time velocity tracking and trend visualization is currently being optimized for high-frequency data streams.
                </p>
                <Badge className="mt-6 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-none font-black text-[10px] px-4 h-8 uppercase">Coming in Phase 2</Badge>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { label: 'Total Signals (24h)', value: signals.length, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
               { label: 'Avg Alpha Score', value: signals.length > 0 ? Math.round(signals.reduce((a, b) => a + (b.score ?? b.confidence ?? 0), 0) / signals.length) : 0, icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                { label: 'High Confidence (>85)', value: signals.filter(s => (s.score ?? s.confidence ?? 0) >= 85).length, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' }
             ].map((stat, i) => (
               <Card key={i} className="p-8 rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur shadow-sm flex flex-col items-center justify-center text-center relative group overflow-hidden hover:-translate-y-1 transition-all">
                  <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity ${stat.color}`}>
                    <stat.icon className="h-24 w-24" />
                  </div>
                  <div className={`p-2.5 rounded-xl ${stat.bg} mb-6`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">{stat.label}</span>
                  <div className={`text-5xl font-black tracking-tighter ${stat.color}`}>{stat.value}</div>
               </Card>
             ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
