import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiClient } from '../services/api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  ExternalLink,
  Eye,
  Lock,
  Unlock,
  Zap,
  Activity,
  Loader2
} from 'lucide-react';

export function SecurityScanner() {
  const [scanning, setScanning] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [scanStep, setScanStep] = useState(0);
  const [currentAnalysis, setCurrentAnalysis] = useState<any | null>(null);

  const scanSteps = [
    { label: 'Fetching Source Code', icon: <Search className="h-4 w-4" /> },
    { label: 'Static Analysis', icon: <Activity className="h-4 w-4" /> },
    { label: 'AI Risk Assessment', icon: <Zap className="h-4 w-4" /> },
  ];

  const handleScan = async () => {
    if (!searchAddress) return;

    setScanning(true);
    setScanStep(0);
    setCurrentAnalysis(null);

    try {
      // Step 1: Fetching
      setScanStep(0);
      await new Promise(r => setTimeout(r, 1500));
      
      // Step 2: Static
      setScanStep(1);
      await new Promise(r => setTimeout(r, 1500));
      
      // Step 3: AI
      setScanStep(2);
      const result = await apiClient.scanContract(searchAddress, 'ethereum');
      await new Promise(r => setTimeout(r, 1000));
      
      setCurrentAnalysis({
        ...result,
        contractAddress: searchAddress,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setScanning(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="h-5 w-5" />;
      case 'medium': return <AlertTriangle className="h-5 w-5" />;
      case 'high': return <AlertTriangle className="h-5 w-5" />;
      case 'critical': return <XCircle className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-green-600" />
          Security Scanner
        </h1>
        <p className="text-muted-foreground">
          Analyze smart contracts for potential risks, rug pulls, and honeypots
        </p>
      </div>

      {/* Scanner Input */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block uppercase tracking-tighter">Contract Address (EVM)</label>
            <div className="flex gap-2">
              <Input
                placeholder="0x... (Enter contract address to scan)"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="flex-1 font-mono"
              />
              <Button 
                onClick={handleScan}
                disabled={scanning || !searchAddress}
                className="flex items-center gap-2 font-bold"
              >
                {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {scanning ? 'SCANNING...' : 'SCAN CONTRACT'}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {scanning && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t"
              >
                <div className="grid grid-cols-3 gap-4">
                  {scanSteps.map((step, idx) => (
                    <div key={idx} className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${scanStep >= idx ? 'bg-primary/5 border-primary text-primary' : 'bg-muted/50 text-muted-foreground'}`}>
                      {scanStep > idx ? <CheckCircle className="h-5 w-5" /> : step.icon}
                      <span className="text-[10px] font-black uppercase">{step.label}</span>
                    </div>
                  ))}
                </div>
                <Progress value={(scanStep + 1) * 33.3} className="h-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Current Analysis */}
      {currentAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 border-t-4 border-t-primary">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${getRiskColor(currentAnalysis.overallRisk)} font-black`} variant="outline">
                      {getRiskIcon(currentAnalysis.overallRisk)}
                      {currentAnalysis.overallRisk.toUpperCase()} RISK
                    </Badge>
                    <Badge variant="outline" className="font-bold">
                      {currentAnalysis.auditStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground break-all">
                    {currentAnalysis.contractAddress}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="font-bold text-xs uppercase">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Explorer
                </Button>
              </div>

              {/* Risk Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-red-600" />
                    <span className="text-xs font-black uppercase">Rug Pull Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={currentAnalysis.rugPullRisk} className="flex-1 h-2" />
                    <span className="text-sm font-black">{currentAnalysis.rugPullRisk}%</span>
                  </div>
                </Card>

                <Card className="p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    {currentAnalysis.liquidityLocked ? <Lock className="h-4 w-4 text-green-600" /> : <Unlock className="h-4 w-4 text-red-600" />}
                    <span className="text-xs font-black uppercase">Liquidity</span>
                  </div>
                  <span className={`text-sm font-black ${currentAnalysis.liquidityLocked ? 'text-green-600' : 'text-red-600'}`}>
                    {currentAnalysis.liquidityLocked ? 'LOCKED' : 'UNLOCKED'}
                  </span>
                </Card>

                <Card className="p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-black uppercase">Dev Activity</span>
                  </div>
                  <span className="text-sm font-black uppercase">{currentAnalysis.devWalletActivity}</span>
                </Card>

                <Card className="p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-black uppercase">Honeypot</span>
                  </div>
                  <span className={`text-sm font-black ${currentAnalysis.honeypotDetected ? 'text-red-600' : 'text-green-600'}`}>
                    {currentAnalysis.honeypotDetected ? 'DETECTED' : 'NOT DETECTED'}
                  </span>
                </Card>
              </div>

              {/* Findings */}
              <div className="space-y-3">
                <h3 className="text-sm font-black uppercase tracking-widest border-b pb-2">Analysis Findings</h3>
                <div className="space-y-2">
                  {currentAnalysis.findings.map((finding: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border-l-4 border-l-primary">
                      <div className="mt-1">
                        {finding.severity === 'critical' || finding.severity === 'high' ? (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{finding.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">Rec: {finding.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t text-[10px] font-bold text-muted-foreground uppercase">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Scanned: {currentAnalysis.lastUpdated.toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
