import axios from 'axios';
import logger from '../utils/logger.js';
export const scrapePolymarket = async () => {
    try {
        // Polymarket Gamma API for active markets
        const response = await axios.get('https://gamma-api.polymarket.com/markets?active=true&limit=10&order=volume24hr&dir=desc');
        const markets = response.data || [];
        return markets.map((market) => ({
            id: `poly-${market.id}`,
            title: `Polymarket Opportunity: ${market.question}`,
            summary: `Prediction market for ${market.question} with $${market.volume24hr.toLocaleString()} volume in 24h. Outcomes: ${market.outcomes.join(', ')}.`,
            category: 'polymarket',
            source: 'Polymarket',
            url: `https://polymarket.com/market/${market.slug}`,
            timestamp: new Date().toISOString(),
            metadata: {
                slug: market.slug,
                volume: market.volume24hr,
                outcomes: market.outcomes,
                outcomesPrices: market.outcomePrices,
            },
        }));
    }
    catch (error) {
        logger.error('Error scraping Polymarket:', error);
        return [];
    }
};
//# sourceMappingURL=polymarket.js.map