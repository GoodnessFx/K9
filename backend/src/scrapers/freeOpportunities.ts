import axios from 'axios';
import type { RawSignal } from '../types/index.js';
import logger from '../utils/logger.js';

export const scrapeFreeMoney = async (): Promise<RawSignal[]> => {
  const signals: RawSignal[] = [];

  try {
    // 1. DefiLlama Airdrops (High confidence)
    try {
      const llamaRes = await axios.get('https://yields.llama.fi/airdrops');
      const airdrops = llamaRes.data?.data || [];
      
      airdrops.slice(0, 5).forEach((drop: any) => {
        signals.push({
          id: `airdrop-${drop.name.toLowerCase().replace(/\s+/g, '-')}`,
          title: `FREE MONEY: ${drop.name} Airdrop Confirmed`,
          summary: `${drop.name} has confirmed a free token claim for early users. Protocol has $${(drop.tvl || 0).toLocaleString()} in total money locked.`,
          category: 'free',
          source: 'DefiLlama',
          url: drop.link || 'https://defillama.com/airdrops',
          timestamp: new Date().toISOString(),
          metadata: {
            tvl: drop.tvl,
            tier: drop.tier,
            confirmed: true
          }
        });
      });
    } catch (e) {
      logger.error('Error scraping DefiLlama airdrops:', e);
    }

    // 2. Mock Learn-to-Earn (Coinbase/Binance style)
    // In a real app, we'd scrape their specific landing pages
    signals.push({
      id: 'learn-coinbase-btc',
      title: 'EARN $3: Learn about Bitcoin on Coinbase',
      summary: 'Watch a 2-minute video and answer 3 simple questions to earn $3 worth of Bitcoin instantly.',
      category: 'free',
      source: 'Coinbase Earn',
      url: 'https://coinbase.com/earn',
      timestamp: new Date().toISOString(),
      metadata: { reward: '$3', duration: '2 min', difficulty: 'Easy' }
    });

    // 3. Mock Testnet Opportunity
    signals.push({
      id: 'testnet-berachain',
      title: 'PRACTICE & EARN: Berachain Public Testnet',
      summary: 'Use the Berachain practice network (testnet) with fake money. Early participants often receive real tokens worth $500-$2,000 later.',
      category: 'free',
      source: 'Berachain Docs',
      url: 'https://docs.berachain.com',
      timestamp: new Date().toISOString(),
      metadata: { type: 'Incentivized Testnet', cost: 'Zero' }
    });

    return signals;
  } catch (error) {
    logger.error('Error in free money scraper:', error);
    return signals;
  }
};
