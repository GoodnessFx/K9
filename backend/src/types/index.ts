export type SignalCategory =
  | 'defi'           // DeFi protocols, TVL, yields
  | 'token_launch'   // New token pairs, launches
  | 'airdrop'        // Airdrop opportunities
  | 'free'           // General free money (learn-to-earn, testnets)
  | 'jobs'           // Crypto jobs, bounties, gigs
  | 'insider'        // Insider activity (large bets, whale moves)
  | 'whale'          // Large wallet movements
  | 'developer'      // GitHub activity, protocol upgrades
  | 'security'       // Exploits, hacks, vulnerabilities
  | 'polymarket'     // Prediction market signals
  | 'tradfi'         // ETFs, stocks, macro
  | 'nft'            // NFT opportunities
  | 'macro'          // Fed, yield curves, inflation signals
  | 'stablecoin'     // Depeg alerts, stablecoin flows
  | 'convergence'    // Multi-source convergence (highest priority)
  | 'anomaly';       // Temporal baseline deviation alerts

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Signal {
  id: string;
  title: string;
  summary: string;
  category: SignalCategory;
  score: number;
  confidence: number;
  risk: RiskLevel;
  analysis: string;
  priceTarget?: string;
  stopLoss?: string;
  timeframe?: string;
  tags: string[];
  chain?: string;
  tokenSymbol?: string;
  url: string;
  timestamp: string;
  source: string;
  shouldSend: boolean;
  velocityMultiplier?: number;
  isConvergence?: boolean;
  intelligenceBrief?: string;
}

export interface RawSignal {
  id: string;
  title: string;
  summary: string;
  category: SignalCategory;
  source: string;
  url: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SecurityAnalysis {
  rugPullRisk: number; // 0-100
  honeypotDetected: boolean;
  liquidityLocked: boolean;
  auditStatus: 'audited' | 'unaudited';
  devWalletActivity: 'normal' | 'suspicious' | 'dumping';
  findings: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    recommendation: string;
  }>;
  overallRisk: RiskLevel;
}

export interface ChainRiskIndex {
  chain: string;
  score: number; // 0-100
  status: 'CRITICAL' | 'HIGH RISK' | 'MODERATE' | 'HEALTHY' | 'BULLISH';
  components: {
    tvlChange24h: number;
    exploitNews: number;
    devActivity: number;
    networkCongestion: number;
    bridgeActivity: number;
  };
}

export interface UserSubscription {
  plan: 'free' | 'hunter' | 'alpha';
  alertCountToday: number;
  minScore: number;
  riskLevels: RiskLevel[];
  chains: string[];
  isActive: boolean;
}
