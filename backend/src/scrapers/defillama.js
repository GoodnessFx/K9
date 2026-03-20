import axios from 'axios';
import logger from '../utils/logger.js';
export const scrapeDefiLlama = async () => {
    try {
        // DefiLlama yields endpoint
        const response = await axios.get('https://yields.llama.fi/pools');
        const pools = response.data.data || [];
        // Filter for high yield, high TVL pools or recent significant changes
        const interestingPools = pools
            .filter((pool) => pool.tvlUsd > 1000000 && pool.apy > 20)
            .slice(0, 5);
        return interestingPools.map((pool) => ({
            id: `llama-${pool.pool}`,
            title: `High Yield Opportunity: ${pool.project} on ${pool.chain}`,
            summary: `Protocol ${pool.project} is offering ${pool.apy}% APY on ${pool.symbol} with $${pool.tvlUsd.toLocaleString()} TVL.`,
            category: 'defi',
            source: 'DefiLlama',
            url: `https://defillama.com/yields/pool/${pool.pool}`,
            timestamp: new Date().toISOString(),
            metadata: {
                chain: pool.chain,
                project: pool.project,
                symbol: pool.symbol,
                tvl: pool.tvlUsd,
                apy: pool.apy,
            },
        }));
    }
    catch (error) {
        logger.error('Error scraping DefiLlama:', error);
        return [];
    }
};
//# sourceMappingURL=defillama.js.map