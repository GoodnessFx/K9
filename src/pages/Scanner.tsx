import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Zap, 
  Loader2, 
  ChevronRight,
  History as HistoryIcon,
  Lock as LockIcon,
  Info,
  Send,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../api';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const STAGES = [
  { label: 'Fetching Source', description: 'Retrieving contract source code and metadata' },
  { label: 'Static Analysis', description: 'Scanning for known malicious patterns and honeypots' },
  { label: 'AI Review', description: 'Claude is reviewing contract logic for hidden dangers' },
  { label: 'Finalizing', description: 'Generating plain English safety report' },
];

export default function ScannerPage() {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentStage, setCurrentStage] = useState(0);

  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('scan_history');
    return saved ? JSON.parse(saved) : [];
  });

  const handleScan = async () => {
    if (!address) {
      toast.error('Please enter a crypto account address');
      return;
    }
    
    setIsScanning(true);
    setResult(null);
    setCurrentStage(1);
    
    try {
      // Simulate stages for "AI vibe"
      const stageTimer = setInterval(() => {
        setCurrentStage(prev => (prev < 4 ? prev + 1 : prev));
      }, 1500);

      const data = await api.scanContract(address, chain);
      
      clearInterval(stageTimer);
      setCurrentStage(4);
      await new Promise(r => setTimeout(r, 500));
      
      const isSafe = data.overallRisk === 'low' && !data.honeypotDetected;
      const score = 100 - data.rugPullRisk;
      
      const scanResult = {
        ...data,
        isSafe,
        score
      };
      
      setResult(scanResult);
      
      const newHistory = [{ 
        address, 
        chain, 
        isSafe,
        score,
        timestamp: new Date().toISOString() 
      }, ...history].slice(0, 10);
      
      setHistory(newHistory);
      localStorage.setItem('scan_history', JSON.stringify(newHistory));
      
      toast.success('Check complete');
    } catch (error) {
      toast.error('Check failed. Please verify the address.');
    } finally {
      setIsScanning(false);
      setCurrentStage(0);
    }
  };

  const getRiskIcon = (isSafe: boolean) => {
    if (isSafe) return <ShieldCheck className="h-10 w-10 text-safe" />;
    return <ShieldAlert className="h-10 w-10 text-critical" />;
  };

  return (
    <div className="space-y-12 pb-20 max-w-[1440px] mx-auto px-4 lg:px-8">
      {/* Page Header */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-safe/10 border border-safe/20">
            <ShieldCheck className="h-5 w-5 text-safe" />
          </div>
          <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-t2">Safety Audit</span>
        </div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-t1 uppercase">Check If It's Safe</h2>
        <p className="text-t2 max-w-xl text-sm leading-relaxed">
          Instantly check any crypto account to see if it's safe to use or if there are hidden dangers.
        </p>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-bg-surface border border-line-1 rounded-lg p-8 ai-glow space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-mono font-medium uppercase tracking-widest text-t3 ml-1">Crypto Account Address</label>
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-t3" />
                   <input 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="0x... or Solana Address"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck={false}
                    inputMode="text"
                    className="w-full bg-bg-base border border-line-1 rounded-md pl-12 pr-4 py-3.5 text-sm font-mono text-t1 outline-none focus:border-intel transition-all"
                   />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-medium uppercase tracking-widest text-t3 ml-1">Network</label>
                <select 
                  value={chain}
                  onChange={(e) => setChain(e.target.value)}
                  className="w-full bg-bg-base border border-line-1 rounded px-4 py-3.5 text-sm font-sans font-medium uppercase tracking-widest text-t1 outline-none focus:border-intel transition-colors appearance-none cursor-pointer"
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="solana">Solana</option>
                  <option value="base">Base</option>
                  <option value="arbitrum">Arbitrum</option>
                  <option value="optimism">Optimism</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleScan}
              disabled={isScanning || !address}
              className="w-full h-14 bg-intel text-white rounded font-sans font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
               {isScanning ? (
                 <Loader2 className="h-5 w-5 animate-spin" />
               ) : (
                 <>
                   <Zap className="h-4 w-4 fill-white" />
                   <span>Run Safety Check</span>
                 </>
               )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isScanning ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-bg-surface border border-line-1 rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-8"
              >
                <div className="relative h-24 w-24">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-t-intel border-r-transparent border-b-transparent border-l-transparent rounded-full"
                  />
                  <div className="absolute inset-4 bg-bg-elevated rounded-full flex items-center justify-center">
                    <Zap className="h-8 w-8 text-intel animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-sans font-medium text-t1 uppercase">
                    {STAGES[currentStage - 1]?.label || 'Initializing...'}
                  </h3>
                  <p className="text-t2 text-sm font-sans">
                    {STAGES[currentStage - 1]?.description || 'Preparing safety audit engine'}
                  </p>
                </div>

                <div className="w-full max-w-md space-y-4">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-t3">
                    <span>Audit Progress</span>
                    <span>{currentStage * 25}%</span>
                  </div>
                  <div className="w-full bg-bg-base h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${currentStage * 25}%` }}
                      className="bg-intel h-full transition-all duration-500"
                    />
                  </div>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "bg-bg-surface border rounded-xl p-10 transition-all",
                  result.isSafe ? "border-safe/20 bg-safe/5" : "border-critical/20 bg-critical/5"
                )}
              >
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex flex-col items-center gap-6 text-center min-w-[160px]">
                    <div className={cn(
                      "p-6 bg-bg-base rounded-full border",
                      result.isSafe ? "border-safe/20" : "border-critical/20"
                    )}>
                      {getRiskIcon(result.isSafe)}
                    </div>
                    <div className="space-y-1">
                       <h3 className={cn(
                         "text-2xl font-display font-bold uppercase tracking-tight",
                         result.isSafe ? "text-safe" : "text-critical"
                       )}>
                        {result.isSafe ? 'VERIFIED SAFE' : 'DANGER DETECTED'}
                       </h3>
                       <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-t3">Security Rating</span>
                    </div>
                    <div className="pt-6 border-t border-line-1 w-full">
                       <div className="text-4xl font-display font-bold text-t1 tracking-tighter">{result.score}/100</div>
                       <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-t3">Security Score</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Honeypot Check', value: !result.honeypotDetected, icon: ShieldAlert },
                        { label: 'Ownership Status', value: result.ownershipRenounced, icon: LockIcon },
                        { label: 'Available Money Lock', value: result.liquidityLocked, icon: LockIcon },
                        { label: 'Verified Source', value: result.overallRisk === 'low', icon: ShieldCheck },
                      ].map((check, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-bg-base border border-line-1">
                           <div className="flex items-center gap-3">
                              <check.icon className={cn(
                                "h-4 w-4",
                                check.value ? "text-safe" : "text-critical"
                              )} />
                              <span className="text-xs font-sans font-medium text-t1">{check.label}</span>
                           </div>
                           <span className={cn(
                             "text-[10px] font-mono font-medium uppercase tracking-widest",
                             check.value ? "text-safe" : "text-critical"
                           )}>
                             {check.value ? 'PASSED' : 'FAILED'}
                           </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                       <h4 className="text-[10px] font-mono font-medium uppercase tracking-[0.08em] text-t3 flex items-center gap-2">
                         <Info className="h-4 w-4 text-intel" />
                         What This Means
                       </h4>
                       <p className="text-[14px] font-sans text-t2 leading-relaxed p-5 bg-bg-base border border-line-1 rounded-lg italic">
                         {result.summary || result.aiSummary}
                       </p>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <button className="flex-1 h-11 bg-intel text-white rounded font-sans font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                        <Send className="h-4 w-4" />
                        <span>Share Safety Alert</span>
                      </button>
                      <a href={`https://etherscan.io/address/${address}`} target="_blank" className="flex-1 h-11 bg-bg-surface border border-line-1 rounded font-sans font-bold text-sm text-t2 hover:text-t1 hover:border-line-2 transition-all flex items-center justify-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        <span>View Explorer</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-bg-surface border border-line-1 rounded-xl p-16 flex flex-col items-center justify-center text-center opacity-40">
                <ShieldCheck className="h-16 w-16 text-t3 mb-6" />
                <h3 className="text-xl font-display font-semibold text-t1 uppercase tracking-tight mb-2">Ready for Safety Audit</h3>
                <p className="text-sm font-sans text-t2 max-w-xs leading-relaxed">
                  Paste a crypto account address above to begin a multi-vector safety check.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 border-b border-line-1 pb-4 mb-6">
              <div className="h-5 w-5 text-t2 flex items-center justify-center">
                <HistoryIcon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-sans font-bold text-t1 uppercase">Recent Checks</h3>
            </div>
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map((item, i) => (
                  <div key={i} className="p-3 bg-bg-surface border border-line-1 rounded-lg flex items-center justify-between group cursor-pointer hover:border-intel transition-all" onClick={() => { setAddress(item.address); setChain(item.chain); }}>
                    <div className="space-y-1 overflow-hidden">
                      <p className="text-[11px] font-mono text-t1 truncate">{item.address}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-t3 uppercase">{item.chain}</span>
                        <div className={cn("h-1 w-1 rounded-full", item.isSafe ? "bg-safe" : "bg-critical")} />
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-t3 group-hover:text-intel" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-t3 italic text-center py-10">No recent audit history</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-bg-surface border border-line-1 rounded-xl", className)}>
      {children}
    </div>
  );
}
