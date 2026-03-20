import { Signal, ChainRiskIndex } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_SIGNALS: Signal[] = [
  {
    id: 'sig-1',
    title: 'Solana Ecosystem Expansion',
    summary: 'Increased activity in Solana DeFi protocols suggests a new growth phase.',
    category: 'defi',
    score: 88,
    confidence: 92,
    risk: 'low',
    analysis: 'Multiple protocols reporting 20%+ TVL growth in 24h. Institutional interest rising.',
    tags: ['solana', 'defi', 'tvl'],
    timestamp: new Date().toISOString(),
    source: 'EcosystemMonitor',
    upvotes: 450,
    downvotes: 12,
  }
];

export const apiClient = {
  getSignals: async (_options?: { limit?: number }) => {
    return MOCK_SIGNALS;
  },
  
  getSignal: async (id: string) => {
    return MOCK_SIGNALS.find(s => s.id === id) || MOCK_SIGNALS[0];
  },

  getStats: async () => {
    return {
      totalSignals: 1250,
      activeHunters: 45,
      avgAlphaScore: 72,
      marketSentiment: 'Bullish'
    };
  },

  getCRI: async (): Promise<ChainRiskIndex[]> => {
    await sleep(100);
    return [
      { chain: 'ethereum', score: 85, status: 'HEALTHY', components: { tvlChange24h: 5.2, exploitNews: 0, devActivity: 88, networkCongestion: 12, bridgeActivity: 75 } },
      { chain: 'arbitrum', score: 78, status: 'HEALTHY', components: { tvlChange24h: 3.1, exploitNews: 0, devActivity: 82, networkCongestion: 15, bridgeActivity: 68 } },
      { chain: 'base', score: 92, status: 'BULLISH', components: { tvlChange24h: 12.5, exploitNews: 0, devActivity: 95, networkCongestion: 25, bridgeActivity: 90 } },
      { chain: 'solana', score: 65, status: 'MODERATE', components: { tvlChange24h: -2.4, exploitNews: 0, devActivity: 78, networkCongestion: 45, bridgeActivity: 55 } },
      { chain: 'bsc', score: 45, status: 'HIGH RISK', components: { tvlChange24h: -8.5, exploitNews: 1, devActivity: 45, networkCongestion: 10, bridgeActivity: 35 } },
    ];
  },

  getETFFlows: async () => {
    return {
      IBIT: { inflow: 540.2, price: 42.5 },
      FBTC: { inflow: 120.5, price: 65.2 },
      ARKB: { inflow: 45.8, price: 72.1 },
      BITB: { inflow: -12.5, price: 35.4 }
    };
  },

  getStablecoins: async () => {
    return [
      { symbol: 'USDT', marketCap: 95000, change24h: 0.5 },
      { symbol: 'USDC', marketCap: 28000, change24h: -0.2 },
      { symbol: 'DAI', marketCap: 5200, change24h: 0.1 },
      { symbol: 'PYUSD', marketCap: 320, change24h: 12.5 }
    ];
  },

  scanContract: async (_address: string, _chain: string) => {
    return {
      address: _address,
      chain: _chain,
      isSafe: true,
      riskScore: 0,
      warnings: []
    };
  },

  getConvergence: async () => {
    return [
      {
        id: 'conv-1',
        title: 'CONVERGENCE: AI + DePIN Narrative',
        summary: 'Multiple sources confirming massive capital rotation into AI-DePIN protocols.',
        category: 'convergence',
        score: 98,
        confidence: 95,
        risk: 'medium',
        analysis: 'Signals from WhaleWatcher, DevFeed, and SocialTrends converged in 2h window.',
        tags: ['ai', 'depin', 'convergence'],
        timestamp: new Date().toISOString(),
        source: 'ConvergenceEngine',
        upvotes: 2100,
        downvotes: 15,
        shouldSend: true,
        isConvergence: true
      }
    ];
  },

  getAnomalies: async () => {
    return [
      {
        id: 'anom-1',
        title: 'ANOMALY: Volume Spike on $BTC',
        summary: 'Unexpected 500% volume spike on BTC/USDT pair in 5 minutes.',
        category: 'anomaly',
        score: 82,
        confidence: 88,
        risk: 'high',
        analysis: 'Activity is 4.5 standard deviations above the 7-day rolling baseline.',
        tags: ['btc', 'volume', 'anomaly'],
        timestamp: new Date().toISOString(),
        source: 'AnomalyDetector',
        upvotes: 560,
        downvotes: 22,
        shouldSend: true
      }
    ];
  }
};
