import { useState } from 'react';
import { motion } from 'motion/react';
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
  Activity
} from 'lucide-react';
import { SecurityAnalysis } from '../types';

const mockAnalyses: SecurityAnalysis[] = [
  {
    contractAddress: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
    riskLevel: 'safe',
    liquidityLocked: true,
    rugPullRisk: 15,
    devWalletMovement: false,
    honeypotDetected: false,
    auditStatus: 'verified',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30),
    findings: [
      'Liquidity locked for 6 months',
      'Contract verified on Etherscan',
      'No suspicious functions detected',
      'Ownership renounced',
      'No hidden mint functions'
    ]
  },
  {
    contractAddress: '0x742d35Cc6a6C4532CFc66FFcE56e77842d1c5478',
    riskLevel: 'danger',
    liquidityLocked: false,
    rugPullRisk: 85,
    devWalletMovement: true,
    honeypotDetected: true,
    auditStatus: 'unaudited',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 5),
    findings: [
      '⚠️ Honeypot detected - selling disabled',
      '🚨 Dev wallet moved 40% of tokens',
      '❌ Liquidity not locked',
      '❌ Contract not verified',
      '❌ Suspicious transfer functions',
      '❌ Owner can mint unlimited tokens'
    ]
  },
  {
    contractAddress: '0xA0b86a33E6B99d0b25dd72e26b55D89f6f3B3e31',
    riskLevel: 'caution',
    liquidityLocked: true,
    rugPullRisk: 45,
    devWalletMovement: false,
    honeypotDetected: false,
    auditStatus: 'pending',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2),
    findings: [
      '⚠️ High trading fees (12%)',
      '✅ Liquidity locked for 3 months',
      '⚠️ Large dev wallet (15% supply)',
      '✅ Contract partially verified',
      '⚠️ Unusual token distribution'
    ]
  }
];

export function SecurityScanner() {
  const [scanning, setScanning] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentAnalysis, setCurrentAnalysis] = useState<SecurityAnalysis | null>(null);

  const handleScan = async () => {
    if (!searchAddress) return;

    setScanning(true);
    setScanProgress(0);
    setCurrentAnalysis(null);

    // Simulate scanning process
    const scanSteps = [
      'Analyzing contract bytecode...',
      'Checking liquidity locks...',
      'Scanning for honeypot patterns...',
      'Analyzing token distribution...',
      'Checking dev wallet activity...',
      'Verifying audit status...',
      'Calculating risk score...',
      'Generating report...'
    ];

    for (let i = 0; i < scanSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setScanProgress(((i + 1) / scanSteps.length) * 100);
    }

    // Return mock result or random analysis
    const existingAnalysis = mockAnalyses.find(a => 
      a.contractAddress.toLowerCase() === searchAddress.toLowerCase()
    );

    if (existingAnalysis) {
      setCurrentAnalysis(existingAnalysis);
    } else {
      // Generate random analysis for demo
      const randomAnalysis: SecurityAnalysis = {
        contractAddress: searchAddress,
        riskLevel: Math.random() > 0.7 ? 'danger' : Math.random() > 0.4 ? 'caution' : 'safe',
        liquidityLocked: Math.random() > 0.3,
        rugPullRisk: Math.floor(Math.random() * 100),
        devWalletMovement: Math.random() > 0.7,
        honeypotDetected: Math.random() > 0.8,
        auditStatus: Math.random() > 0.5 ? 'verified' : 'unaudited',
        lastUpdated: new Date(),
        findings: [
          'Contract analysis completed',
          'Token distribution checked',
          'Liquidity status verified'
        ]
      };
      setCurrentAnalysis(randomAnalysis);
    }

    setScanning(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'safe': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'caution': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'danger': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'safe': return <CheckCircle className="h-5 w-5" />;
      case 'caution': return <AlertTriangle className="h-5 w-5" />;
      case 'danger': return <XCircle className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getAuditStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'unaudited': return 'text-red-600';
      default: return 'text-gray-600';
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
            <label className="text-sm font-medium mb-2 block">Contract Address</label>
            <div className="flex gap-2">
              <Input
                placeholder="0x... (Enter contract address to scan)"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleScan}
                disabled={scanning || !searchAddress}
                className="flex items-center gap-2"
              >
                {scanning ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scanning
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Scan Contract
                  </>
                )}
              </Button>
            </div>
          </div>

          {scanning && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Analyzing contract security...</span>
                <span className="text-sm text-muted-foreground">{Math.round(scanProgress)}%</span>
              </div>
              <Progress value={scanProgress} />
            </div>
          )}
        </div>
      </Card>

      {/* Current Analysis */}
      {currentAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="space-y-6">
              {/* Risk Level Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getRiskColor(currentAnalysis.riskLevel)} variant="outline">
                      {getRiskIcon(currentAnalysis.riskLevel)}
                      {currentAnalysis.riskLevel.toUpperCase()} 
                    </Badge>
                    <Badge variant="outline" className={getAuditStatusColor(currentAnalysis.auditStatus)}>
                      {currentAnalysis.auditStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="font-mono text-sm text-muted-foreground break-all">
                    {currentAnalysis.contractAddress}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              {/* Risk Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Rug Pull Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={currentAnalysis.rugPullRisk} className="flex-1 h-2" />
                    <span className="text-sm font-semibold">{currentAnalysis.rugPullRisk}%</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {currentAnalysis.liquidityLocked ? (
                      <Lock className="h-4 w-4 text-green-600" />
                    ) : (
                      <Unlock className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium">Liquidity</span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    currentAnalysis.liquidityLocked ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentAnalysis.liquidityLocked ? 'Locked' : 'Not Locked'}
                  </span>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Dev Wallet</span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    currentAnalysis.devWalletMovement ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {currentAnalysis.devWalletMovement ? 'Active' : 'Stable'}
                  </span>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Honeypot</span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    currentAnalysis.honeypotDetected ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {currentAnalysis.honeypotDetected ? 'Detected' : 'Clear'}
                  </span>
                </div>
              </div>

              {/* Findings */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Security Analysis</h3>
                <div className="space-y-2">
                  {currentAnalysis.findings.map((finding, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-accent/50 rounded-lg">
                      {finding.includes('⚠️') || finding.includes('❌') ? (
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      ) : finding.includes('🚨') ? (
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-sm">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Last updated: {currentAnalysis.lastUpdated.toLocaleString()}
                </div>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  View on Explorer
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recent Scans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Security Scans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockAnalyses.map((analysis, index) => (
            <motion.div
              key={analysis.contractAddress}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setCurrentAnalysis(analysis)}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge className={getRiskColor(analysis.riskLevel)} variant="outline">
                      {getRiskIcon(analysis.riskLevel)}
                      {analysis.riskLevel.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(analysis.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="font-mono text-xs text-muted-foreground truncate">
                    {analysis.contractAddress}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Risk Score:</span>
                    <span className={`font-semibold ${
                      analysis.rugPullRisk > 70 ? 'text-red-600' :
                      analysis.rugPullRisk > 40 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {analysis.rugPullRisk}%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      {analysis.liquidityLocked ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600" />
                      )}
                      Liquidity
                    </div>
                    <div className="flex items-center gap-1">
                      {analysis.honeypotDetected ? (
                        <XCircle className="h-3 w-3 text-red-600" />
                      ) : (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      )}
                      Honeypot
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}