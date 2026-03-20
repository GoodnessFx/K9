import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { apiClient } from '../services/api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  ShieldCheck, 
  Activity
} from 'lucide-react';

export const MarketPanel = () => {
  const { data: etfFlows = {} } = useQuery({
    queryKey: ['etf-flows'],
    queryFn: apiClient.getETFFlows,
    refetchInterval: 300000, // 5 minutes
  });

  const { data: stablecoins = {} } = useQuery({
    queryKey: ['stablecoins'],
    queryFn: apiClient.getStablecoins,
    refetchInterval: 60000, // 1 minute
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ETF Flow Tracker - Enhanced */}
      <Card className="p-6 rounded-[2rem] border-border/50 bg-background/50 backdrop-blur-xl shadow-sm overflow-hidden relative group">
        <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <BarChart3 className="h-24 w-24" />
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="font-black uppercase tracking-tighter text-sm">ETF FLOWS</h3>
          </div>
          <Badge variant="outline" className="text-[10px] font-black border-blue-500/30 text-blue-600 bg-blue-500/5">24H LIVE</Badge>
        </div>

        <div className="space-y-4 relative z-10">
          {Object.entries(etfFlows).map(([ticker, data]: [string, any]) => (
            <div key={ticker} className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 rounded-2xl border border-border/30 transition-colors group/item">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-background border border-border/50 flex items-center justify-center font-black text-xs">
                  {ticker[0]}
                </div>
                <div>
                  <span className="font-black text-sm uppercase group-hover/item:text-blue-500 transition-colors">{ticker}</span>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Institutional Feed</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center justify-end gap-1 font-black text-sm ${data.inflow > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {data.inflow > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {data.inflow > 0 ? '+' : ''}${data.inflow}M
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Est. Net Flow</div>
              </div>
            </div>
          ))}
          
          <div className="pt-4 px-1">
             <div className="flex justify-between text-[10px] font-black uppercase mb-2 text-muted-foreground tracking-widest">
               <span>Aggregated Market Flow</span>
               <span className="text-green-500">+$660.7M Bullish</span>
             </div>
             <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                />
             </div>
          </div>
        </div>
      </Card>

      {/* Stablecoin Health - Enhanced */}
      <Card className="p-6 rounded-[2rem] border-border/50 bg-background/50 backdrop-blur-xl shadow-sm overflow-hidden relative group">
        <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <ShieldCheck className="h-24 w-24" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <ShieldCheck className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="font-black uppercase tracking-tighter text-sm">STABLE HEALTH</h3>
          </div>
          <Badge variant="outline" className="text-[10px] font-black border-green-500/30 text-green-600 bg-green-500/5">MONITORING</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
          {Object.entries(stablecoins).map(([symbol, data]: [string, any]) => (
            <div key={symbol} className="p-4 border border-border/30 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all group/stable">
              <div className="flex items-center justify-between mb-3">
                <span className="font-black uppercase text-xs tracking-tight group-hover/stable:text-green-500 transition-colors">{symbol}</span>
                {data.depeg ? (
                  <div className="h-2 w-2 bg-red-500 rounded-full animate-ping" />
                ) : (
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter leading-none">${data.price.toFixed(4)}</span>
                <span className={`text-[9px] font-black uppercase mt-2 tracking-tighter ${data.depeg ? 'text-red-500' : 'text-green-600 opacity-70'}`}>
                  {data.depeg ? 'DEPEG ALERT' : 'SECURE PEG'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-background/50 rounded-2xl border border-border/50 flex items-center gap-3 group/info hover:border-primary/30 transition-colors">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Activity className="h-3 w-3 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">Heuristic Engine</span>
            <span className="text-[10px] font-bold tracking-tight">Monitoring ±0.3% price deviation thresholds</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
