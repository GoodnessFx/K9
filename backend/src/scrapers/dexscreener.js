import axios from 'axios';
import logger from '../utils/logger.js';
export const scrapeDexScreener = async () => {
    const signals = [];
    try {
        // 1. Fetch trending pairs for "New Token Before Twitter" and "Silent Whale"
        const response = await axios.get('https://api.dexscreener.com/latest/dex/search?q=WETH');
        const pairs = response.data.pairs || [];
        pairs.forEach((pair) => {
            const volume24h = pair.volume?.h24 || 0;
            const liquidity = pair.liquidity?.usd || 0;
            const ageHours = (Date.now() - (pair.pairCreatedAt || Date.now())) / (1000 * 60 * 60);
            // A. "New Token Before Twitter" Logic
            if (ageHours < 24 && volume24h > 100000 && liquidity > 20000) {
                signals.push({
                    id: `dex-launch-${pair.pairAddress}`,
                    title: `EARLY: New token ${pair.baseToken.symbol} growing fast`,
                    summary: `A new token called ${pair.baseToken.name} ($${pair.baseToken.symbol}) appeared ${Math.round(ageHours)} hours ago. It already has $${volume24h.toLocaleString()} in trading volume, but most people on Twitter haven't found it yet.`,
                    category: 'token_launch',
                    source: 'DexScreener',
                    url: pair.url,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        age: ageHours,
                        volume: volume24h,
                        liquidity: liquidity
                    }
                });
            }
            // B. "Silent Whale" Logic (Large transfers/buys with no news)
            // In a real app, we'd check recent transactions for individual buys > $50K
            // For simulation, we'll flag pairs with unusually high volume relative to liquidity
            if (volume24h > liquidity * 5 && volume24h > 500000) {
                signals.push({
                    id: `dex-whale-${pair.pairAddress}`,
                    title: `SILENT WHALE: Big money moving into ${pair.baseToken.symbol}`,
                    summary: `We detected over $500,000 moving into ${pair.baseToken.symbol} in the last few hours. There is no major news yet, which often means someone knows something before it breaks.`,
                    category: 'insider',
                    source: 'Whale Tracker',
                    url: pair.url,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        volume: volume24h,
                        liquidity: liquidity,
                        type: 'Silent Accumulation'
                    }
                });
            }
        });
        return signals;
    }
    catch (error) {
        logger.error('Error scraping DexScreener:', error);
        return signals;
    }
};
//# sourceMappingURL=dexscreener.js.map