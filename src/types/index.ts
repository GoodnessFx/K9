export interface Signal {
  id: string;
  title: string;
  summary: string;
  analysis: string;
  score: number;
  confidence: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  category: 'defi' | 'security' | 'market' | 'onchain' | 'geo' | 'convergence' | 'airdrop' | 'jobs' | 'insider' | 'prediction' | 'free' | 'nft' | 'developer';
  sources: string[];
  timestamp: string;
  url?: string;
  upvotes: number;
  downvotes: number;
  isConvergence?: boolean;
  intelligenceBrief?: string;
  description?: string;
  timeframe?: string;
  source?: string;
  priceTarget?: string;
  stopLoss?: string;
  tokenSymbol?: string;
  tags?: string[];
}

export interface Alert {
  id: string;
  type: 'security' | 'dev' | 'opportunity';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface SignalFilters {
  category: string;
  risk: string;
  minScore: number;
  chain?: string;
  sortBy?: string;
}

export type AlphaSignal = Signal;
export type ScoredSignal = Signal;

export interface ChainRiskIndex {
  chain: string;
  score: number;
  status: 'HEALTHY' | 'BULLISH' | 'MODERATE' | 'HIGH RISK';
  components: {
    tvlChange24h: number;
    exploitNews: number;
    devActivity: number;
    networkCongestion: number;
    bridgeActivity: number;
  };
}

export interface SecurityScanResult {
  contractAddress: string;
  chain: string;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  rugPullRisk: number;
  honeypotDetected: boolean;
  ownershipRenounced: boolean;
  liquidityLocked: boolean;
  aiSummary: string;
  timestamp: string;
}

export interface TelegramStatus {
  connected: boolean;
  botUsername?: string;
  chatId?: string;
}

export interface TelegramMessage {
  id: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'failed';
}

export interface TelegramRules {
  minScore: number;
  categories: string[];
  frequency: 'instant' | 'batched' | 'digest';
  convergenceOnly: boolean;
}
