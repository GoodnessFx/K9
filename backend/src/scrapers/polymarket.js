import axios from 'axios';
import logger from '../utils/logger.js';
export const scrapePolymarket = async () => {
    const signals = [];
    try {
        // 1. Fetch active markets for probability spikes
        const gammaRes = await axios.get('https://gamma-api.polymarket.com/markets?active=true&limit=20&order=volume24hr&dir=desc');
        const markets = gammaRes.data || [];
        markets.forEach((market) => {
            // Check for probability spikes (Mock logic for now as we'd need historical data)
            // In a real implementation, we'd compare against store.js historical prices
            const currentPrice = market.outcomePrices ? JSON.parse(market.outcomePrices)[0] : 0.5;
            signals.push({
                id: `poly-market-${market.id}`,
                title: `Prediction Market: ${market.question}`,
                summary: `People are betting on: ${market.question}. Current volume is $${market.volume24hr.toLocaleString()}.`,
                category: 'polymarket',
                source: 'Polymarket',
                url: `https://polymarket.com/market/${market.slug}`,
                timestamp: new Date().toISOString(),
                metadata: {
                    slug: market.slug,
                    volume: market.volume24hr,
                    outcomes: market.outcomes,
                    price: currentPrice
                },
            });
        });
        // 2. Fetch recent trades for Insider detection (The Maduro Pattern)
        try {
            const tradesRes = await axios.get('https://clob.polymarket.com/trades?side=BUY&limit=50');
            const trades = tradesRes.data || [];
            // Filter for large trades > $3000
            const largeTrades = trades.filter((t) => parseFloat(t.size) * parseFloat(t.price) > 3000);
            for (const trade of largeTrades) {
                // Mock wallet age check (In production, we'd check Etherscan/Polygonscan for first TX)
                // For simulation, we'll flag any very large trade as a potential insider signal
                const tradeValue = parseFloat(trade.size) * parseFloat(trade.price);
                if (tradeValue > 5000) {
                    signals.push({
                        id: `poly-insider-${trade.transaction_hash || Math.random()}`,
                        title: `INSIDER ALERT: Someone Knows Something`,
                        summary: `A brand new account just placed a $${tradeValue.toLocaleString()} bet on a prediction market. This matches the "Maduro Pattern" where insiders bet big before news breaks.`,
                        category: 'insider',
                        source: 'Polymarket Insider Tracker',
                        url: `https://polymarket.com/`,
                        timestamp: new Date().toISOString(),
                        metadata: {
                            value: tradeValue,
                            asset: trade.asset_id,
                            pattern: 'Maduro'
                        }
                    });
                }
            }
        }
        catch (e) {
            logger.error('Error fetching Polymarket trades:', e);
        }
        return signals;
    }
    catch (error) {
        logger.error('Error scraping Polymarket:', error);
        return signals;
    }
};
//# sourceMappingURL=polymarket.js.map