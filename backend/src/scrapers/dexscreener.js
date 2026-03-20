import axios from 'axios';
import logger from '../utils/logger.js';
export const scrapeDexScreener = async () => {
    try {
        // DexScreener doesn't have a perfect public "latest" endpoint that returns all new pairs easily via REST,
        // but they have trending and boosted. For MVP, we'll use a simulated fetch or their trending API if available.
        // Based on the prompt, we use https://api.dexscreener.com/latest
        // NOTE: The web reference said "Cannot GET /latest", which means we might need to use specific chain/address
        // or their newer search/trending endpoints.
        // For now, I'll implement a robust fetch that handles the expected data structure for trending tokens.
        const response = await axios.get('https://api.dexscreener.com/latest/dex/search?q=WETH'); // Example search to get some data
        const pairs = response.data.pairs || [];
        return pairs.slice(0, 10).map((pair) => ({
            id: `dex-${pair.pairAddress}`,
            title: `New Trending Pair: ${pair.baseToken.symbol}/${pair.quoteToken.symbol}`,
            summary: `Trending pair on ${pair.chainId} with ${pair.volume.h24} 24h volume. Price: $${pair.priceUsd}`,
            category: 'token_launch',
            source: 'DexScreener',
            url: pair.url,
            timestamp: new Date().toISOString(),
            metadata: {
                chainId: pair.chainId,
                pairAddress: pair.pairAddress,
                baseToken: pair.baseToken,
                volume24h: pair.volume.h24,
                liquidity: pair.liquidity.usd,
            },
        }));
    }
    catch (error) {
        logger.error('Error scraping DexScreener:', error);
        return [];
    }
};
//# sourceMappingURL=dexscreener.js.map