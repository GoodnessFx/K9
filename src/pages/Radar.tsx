import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { criApi } from '../api';
import { 
  Radar, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Layers,
  ArrowRight,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function HuntPage() {
  const { data: cri = [], isLoading: isCRILoading } = useQuery({
    queryKey: ['cri'],
    queryFn: criApi.getCRI,
    refetchInterval: 60000,
  });

  const { data: convergence = [], isLoading: isConvergenceLoading } = useQuery({
    queryKey: ['convergence'],
    queryFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/convergence`);
        return res.json();
      } catch (e) {
        return [
          { name: 'Venezuela Prediction Market', sources: 3, score: 91, trend: 'up' },
          { name: 'Arbitrum Ecosystem Airdrop', sources: 4, score: 94, trend: 'up' },
          { name: 'Solana High Volume Pair', sources: 2, score: 78, trend: 'down' },
        ];
      }
    },
    refetchInterval: 60000,
  });

  const { data: anomalies = [], isLoading: isAnomaliesLoading } = useQuery({
    queryKey: ['anomalies'],
    queryFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/anomalies`);
        return res.json();
      } catch (e) {
        return [
          { title: 'Pentagon Pizza Spike', target: 'Prediction Markets', risk: 'high' },
          { title: 'Stablecoin Depeg Warning', target: 'USDT/USD', risk: 'critical' },
          { title: 'Silent Whale Accumulation', target: 'Token $XYZ', risk: 'medium' },
        ];
      }
    },
    refetchInterval: 60000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'text-safe border-safe/20 bg-safe/5 shadow-[0_0_15px_rgba(0,191,114,0.1)]';
      case 'BULLISH': return 'text-intel border-intel/20 bg-intel/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
      case 'MODERATE': return 'text-medium border-medium/20 bg-medium/5 shadow-[0_0_15px_rgba(212,168,67,0.1)]';
      case 'HIGH RISK': return 'text-critical border-critical/20 bg-critical/5 shadow-[0_0_15px_rgba(240,58,95,0.1)]';
      default: return 'text-t3 border-line-1 bg-bg-surface';
    }
  };

  return (
    <div className="space-y-12 pb-20 max-w-[1440px] mx-auto">
      {/* Page Header */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-intel/10 border border-intel/20">
            <Radar className="h-5 w-5 text-intel" />
          </div>
          <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-text-2">Intelligent Scanning</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-display font-semibold tracking-tight text-t1 uppercase">Find Opportunities</h2>
            <p className="text-t2 max-w-xl text-sm leading-relaxed">
              Scan the entire market for big money moves, new tokens, and informed bets.
            </p>
          </div>
        </div>
      </section>

      {/* CRI Heatmap Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-sans font-medium uppercase tracking-tight flex items-center gap-2 text-t1">
            <Activity className="h-5 w-5 text-intel" />
            Market Health Index
          </h3>
          <div className="flex items-center gap-4 text-[10px] font-mono font-medium uppercase tracking-widest text-t3">
             <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-safe" /> Healthy</div>
             <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-intel" /> Bullish</div>
             <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-medium" /> Moderate</div>
             <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-critical shadow-[0_0_8px_rgba(240,58,95,0.5)] animate-pulse" /> Risk</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {isCRILoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-bg-surface border border-line-1 p-6 h-[220px] animate-shimmer rounded-lg" />
            ))
          ) : (
            Array.isArray(cri) && cri.map((item: any, i) => (
              <motion.div
                key={item.chain}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "p-6 group cursor-pointer hover:-translate-y-1 transition-all duration-120 border-l-4 rounded-lg border border-line-1 bg-bg-surface",
                  getStatusColor(item.status)
                )}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-display font-semibold tracking-tight uppercase text-t1 group-hover:text-intel transition-colors">{item.chain}</h4>
                    <span className="text-[10px] font-mono font-medium uppercase tracking-widest opacity-80">{item.status}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-display font-bold tracking-tighter text-t1">{item.score}</div>
                    <span className="text-[9px] font-mono font-medium uppercase tracking-tighter opacity-60 text-t3">Health Score</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-medium uppercase tracking-tighter text-t3">Money Movement (24h)</span>
                    <div className={cn(
                      "flex items-center gap-1 text-[11px] font-mono font-medium",
                      (item.components?.tvlChange24h ?? 0) > 0 ? 'text-safe' : 'text-critical'
                    )}>
                      {(item.components?.tvlChange24h ?? 0) > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(item.components?.tvlChange24h ?? 0)}%
                    </div>
                  </div>
                  <div className="h-1 bg-bg-inset rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      className="h-full bg-current" 
                    />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Multi-Source Convergence Tracker */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-sans font-medium uppercase tracking-tight flex items-center gap-2 text-t1">
            <Layers className="h-5 w-5 text-intel" />
            Where Sources Agree
          </h3>
          <div className="bg-bg-surface border border-line-1 rounded-lg overflow-hidden">
            <table className="w-full text-left font-sans border-collapse">
              <thead className="bg-bg-inset border-b border-line-2">
                <tr>
                  <th className="p-4 text-[10px] font-mono font-medium uppercase tracking-widest text-t3">Opportunity</th>
                  <th className="p-4 text-[10px] font-mono font-medium uppercase tracking-widest text-t3">Source Count</th>
                  <th className="p-4 text-[10px] font-mono font-medium uppercase tracking-widest text-t3">Avg Confidence</th>
                  <th className="p-4 text-[10px] font-mono font-medium uppercase tracking-widest text-t3">Trend</th>
                  <th className="p-4 text-[10px] font-mono font-medium uppercase tracking-widest text-t3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-1">
                {isConvergenceLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="p-4 h-12 animate-pulse bg-bg-surface/50" /></tr>
                  ))
                ) : (
                  convergence.map((row: any, i: number) => (
                    <tr key={i} className="group hover:bg-bg-inset transition-colors">
                      <td className="p-4">
                        <span className="text-sm font-medium text-t1 group-hover:text-intel transition-colors">{row.name}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex -space-x-2">
                            {Array.from({ length: row.sources }).map((_, j) => (
                              <div key={j} className="h-6 w-6 rounded-full border-2 border-bg-surface bg-intel/20 flex items-center justify-center text-[8px] font-mono font-medium text-intel">S{j+1}</div>
                            ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-mono font-medium text-intel">{row.score}</span>
                      </td>
                      <td className="p-4">
                        {row.trend === 'up' ? <TrendingUp className="h-4 w-4 text-safe" /> : <TrendingDown className="h-4 w-4 text-critical" />}
                      </td>
                      <td className="p-4">
                        <button className="p-2 text-t3 hover:text-t1 transition-colors">
                            <ArrowRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-sans font-medium uppercase tracking-tight flex items-center gap-2 text-t1">
            <AlertTriangle className="h-5 w-5 text-critical" />
            Unusual Activity
          </h3>
          <div className="space-y-4">
             {isAnomaliesLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 bg-bg-surface border border-line-1 rounded-lg h-20 animate-shimmer" />
                ))
             ) : (
               anomalies.map((anomaly: any, i: number) => (
                 <div key={i} className="p-4 bg-bg-surface border border-line-1 rounded-lg flex items-center gap-4 hover:border-line-2 transition-all cursor-pointer group">
                    <div className={cn(
                      "p-3 rounded-lg",
                      anomaly.risk === 'critical' ? "bg-critical/10 text-critical" : 
                      anomaly.risk === 'high' ? "bg-high/10 text-high" :
                      anomaly.risk === 'medium' ? "bg-medium/10 text-medium" : "bg-safe/10 text-safe"
                    )}>
                       <Zap className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-sm font-sans font-medium text-t1 group-hover:text-intel transition-colors truncate">{anomaly.title}</h4>
                       <p className="text-[10px] font-mono text-t3 uppercase tracking-widest">{anomaly.target}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-t3 group-hover:text-t1 group-hover:translate-x-1 transition-all" />
                 </div>
               ))
             )}
          </div>
        </div>
      </section>
    </div>
  );
}
