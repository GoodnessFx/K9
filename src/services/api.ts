const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_SIGNALS = [
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
    shouldSend: true
  },
  {
    id: 'sig-2',
    title: 'New Token Launch: $K9',
    summary: 'K9 utility token launching on Base network.',
    category: 'token_launch',
    score: 95,
    confidence: 85,
    risk: 'medium',
    analysis: 'High social sentiment and strong developer backing. Liquidity locked for 2 years.',
    tags: ['base', 'launch', 'utility'],
    timestamp: new Date().toISOString(),
    source: 'LaunchPad',
    upvotes: 1200,
    downvotes: 45,
    shouldSend: true
  },
  {
    id: 'sig-3',
    title: 'Whale Movement: $BTC Accumulation',
    summary: 'Large wallet moving 5000 BTC from exchange to cold storage.',
    category: 'whale',
    score: 75,
    confidence: 98,
    risk: 'low',
    analysis: 'Classic bullish signal as exchange supply decreases. Accumulation phase continuing.',
    tags: ['btc', 'whale', 'accumulation'],
    timestamp: new Date().toISOString(),
    source: 'WhaleWatcher',
    upvotes: 890,
    downvotes: 5,
    shouldSend: true
  }
];

export const apiClient = {
  getSignals: async (params?: Record<string, any>) => {
    try {
      const query = params ? `?${new URLSearchParams(params)}` : '';
      const res = await fetch(`${API_BASE}/api/signals${query}`);
      if (!res.ok) throw new Error('Failed to fetch signals');
      return res.json();
    } catch (e) {
      console.warn('Using mock signals due to API error');
      await sleep(500);
      return MOCK_SIGNALS;
    }
  },
  
  getSignal: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/signals/${id}`);
      if (!res.ok) throw new Error('Failed to fetch signal');
      return res.json();
    } catch (e) {
      console.warn('Using mock signal due to API error');
      await sleep(300);
      return MOCK_SIGNALS.find(s => s.id === id) || MOCK_SIGNALS[0];
    }
  },

  getStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    } catch (e) {
      await sleep(400);
      return {
        totalSignals: 1250,
        activeHunters: 45,
        avgAlphaScore: 72,
        marketSentiment: 'Bullish'
      };
    }
  },

  getCRI: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cri`);
      if (!res.ok) throw new Error('Failed to fetch CRI');
      return res.json();
    } catch (e) {
      await sleep(600);
      return [
        { chain: 'ethereum', score: 85, status: 'HEALTHY', components: { tvlChange24h: 5.2, exploitNews: 0, devActivity: 88, networkCongestion: 12, bridgeActivity: 75 } },
        { chain: 'arbitrum', score: 78, status: 'HEALTHY', components: { tvlChange24h: 3.1, exploitNews: 0, devActivity: 82, networkCongestion: 15, bridgeActivity: 68 } },
        { chain: 'base', score: 92, status: 'BULLISH', components: { tvlChange24h: 12.5, exploitNews: 0, devActivity: 95, networkCongestion: 25, bridgeActivity: 90 } },
        { chain: 'solana', score: 65, status: 'MODERATE', components: { tvlChange24h: -2.4, exploitNews: 0, devActivity: 78, networkCongestion: 45, bridgeActivity: 55 } },
        { chain: 'bsc', score: 45, status: 'HIGH RISK', components: { tvlChange24h: -8.5, exploitNews: 1, devActivity: 45, networkCongestion: 10, bridgeActivity: 35 } },
      ];
    }
  },

  getConvergence: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/convergence`);
      if (!res.ok) throw new Error('Failed to fetch convergence signals');
      return res.json();
    } catch (e) {
      await sleep(700);
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
    }
  },

  getAnomalies: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/anomalies`);
      if (!res.ok) throw new Error('Failed to fetch anomalies');
      return res.json();
    } catch (e) {
      await sleep(500);
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
  },

  getETFFlows: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/etf-flows`);
      if (!res.ok) throw new Error('Failed to fetch ETF flows');
      return res.json();
    } catch (e) {
      await sleep(300);
      return {
        IBIT: { inflow: 540.2, price: 42.5 },
        FBTC: { inflow: 120.5, price: 65.2 },
        ARKB: { inflow: 45.8, price: 72.1 },
        BITB: { inflow: -12.5, price: 35.4 }
      };
    }
  },

  getStablecoins: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stablecoins`);
      if (!res.ok) throw new Error('Failed to fetch stablecoins');
      return res.json();
    } catch (e) {
      await sleep(300);
      return {
        USDT: { price: 1.0001, depeg: false, marketCap: '105B' },
        USDC: { price: 0.9999, depeg: false, marketCap: '32B' },
        DAI: { price: 1.0000, depeg: false, marketCap: '4.5B' },
        PYUSD: { price: 0.9985, depeg: true, marketCap: '300M' }
      };
    }
  },

  scanContract: async (address: string, chain: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, chain }),
      });
      if (!res.ok) throw new Error('Security scan failed');
      return res.json();
    } catch (e) {
      await sleep(1500);
      return {
        contractAddress: address,
        overallRisk: address.length % 2 === 0 ? 'low' : 'high',
        auditStatus: 'pending',
        rugPullRisk: address.length % 3 === 0 ? 15 : 85,
        liquidityLocked: address.length % 2 === 0,
        devWalletActivity: 'low',
        ownerPrivileges: 'standard',
        honeypotDetected: false,
        buyTax: '0%',
        sellTax: '0%'
      };
    }
  },

  runManualScan: async (apiKey: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/scan/run`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
      });
      if (!res.ok) throw new Error('Manual scan failed');
      return res.json();
    } catch (e) {
      await sleep(2000);
      return { success: true, message: 'Simulation: Manual scan completed successfully' };
    }
  }
};
