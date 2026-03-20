export type SignalCategory = 'defi' | 'token_launch' | 'airdrop' | 'whale' | 'developer' | 'security' | 'polymarket' | 'tradfi' | 'nft' | 'macro' | 'stablecoin' | 'convergence' | 'anomaly';
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
    rugPullRisk: number;
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
    score: number;
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
//# sourceMappingURL=index.d.ts.map