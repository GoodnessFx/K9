import type { ChainRiskIndex } from '../types/index.js';
import logger from '../utils/logger.js';

const CHAINS = ['ethereum', 'arbitrum', 'base', 'solana', 'bsc'];

export const calculateCRI = async (): Promise<ChainRiskIndex[]> => {
  // Composite 0-100 health score per chain, updated every 15 minutes:
  // Components:
  // - TVL 24h change (25%)
  // - New exploit news (25%)
  // - Dev activity (20%)
  // - Network congestion (15%)
  // - Bridge activity (15%)

  try {
    const criScores: ChainRiskIndex[] = CHAINS.map(chain => {
      // Mock data for CRI calculation
      const tvlChange = Math.random() * 20 - 10; // -10% to +10%
      const exploits = Math.random() > 0.9 ? 1 : 0;
      const devActivity = Math.random() * 100;
      const congestion = Math.random() * 100;
      const bridgeActivity = Math.random() * 100;

      let score = 70; // Base score
      score += (tvlChange / 10) * 25;
      score -= exploits * 50;
      score += (devActivity / 100) * 20;
      score -= (congestion / 100) * 15;
      score += (bridgeActivity / 100) * 15;

      score = Math.max(0, Math.min(100, Math.round(score)));

      let status: ChainRiskIndex['status'] = 'MODERATE';
      if (score <= 30) status = 'CRITICAL';
      else if (score <= 50) status = 'HIGH RISK';
      else if (score <= 70) status = 'MODERATE';
      else if (score <= 90) status = 'HEALTHY';
      else status = 'BULLISH';

      return {
        chain,
        score,
        status,
        components: {
          tvlChange24h: tvlChange,
          exploitNews: exploits,
          devActivity,
          networkCongestion: congestion,
          bridgeActivity,
        }
      };
    });

    return criScores;
  } catch (error) {
    logger.error('Error calculating CRI:', error);
    return [];
  }
};
