import { Router } from 'express';
import { store } from '../utils/store.js';
import { signalEngine } from '../services/signalEngine.js';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';
const router = Router();
// GET /api/signals — Latest signals
router.get('/signals', async (req, res) => {
    try {
        const { category, minScore, risk, chain, limit = 20 } = req.query;
        let signals = await store.getSignals();
        if (category) {
            signals = signals.filter(s => s.category === category);
        }
        if (minScore) {
            signals = signals.filter(s => s.score >= Number(minScore));
        }
        if (risk) {
            signals = signals.filter(s => s.risk === risk);
        }
        if (chain) {
            signals = signals.filter(s => s.chain === chain);
        }
        res.json(signals.slice(0, Number(limit)));
    }
    catch (error) {
        logger.error('Error fetching signals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /api/signals/:id — Single signal detail
router.get('/signals/:id', async (req, res) => {
    try {
        const signals = await store.getSignals();
        const signal = signals.find(s => s.id === req.params.id);
        if (!signal) {
            return res.status(404).json({ error: 'Signal not found' });
        }
        res.json(signal);
    }
    catch (error) {
        logger.error('Error fetching signal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /api/stats — Platform stats
router.get('/stats', async (req, res) => {
    try {
        const signals = await store.getSignals();
        res.json({
            totalSignals: signals.length,
            users: 1542, // Mock data
            lastScan: new Date().toISOString(),
            activeSources: 12,
        });
    }
    catch (error) {
        logger.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /api/health — Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// POST /api/scan — Security scan
router.post('/scan', async (req, res) => {
    const { address, chain } = req.body;
    if (!address || !chain) {
        return res.status(400).json({ error: 'Address and chain are required' });
    }
    try {
        const analysis = await require('../services/security').analyzeContract(address, chain);
        res.json(analysis);
    }
    catch (error) {
        logger.error('Error in security scan:', error);
        res.status(500).json({ error: 'Security scan failed' });
    }
});
// POST /api/scan/run — Trigger manual signal scan
router.post('/scan/run', async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== config.API_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        // Run scan in background
        signalEngine.runScan();
        res.json({ message: 'Scan initiated' });
    }
    catch (error) {
        logger.error('Error initiating scan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Mock endpoints for other systems requested
router.get('/cri', (req, res) => {
    res.json([
        { chain: 'ethereum', score: 85, status: 'HEALTHY' },
        { chain: 'arbitrum', score: 78, status: 'HEALTHY' },
        { chain: 'base', score: 92, status: 'BULLISH' },
        { chain: 'solana', score: 65, status: 'MODERATE' },
        { chain: 'bsc', score: 45, status: 'HIGH RISK' },
    ]);
});
router.get('/convergence', (req, res) => {
    res.json([]);
});
router.get('/anomalies', (req, res) => {
    res.json([]);
});
router.get('/etf-flows', (req, res) => {
    res.json({
        ibit: { inflow: 540.2, price: 42.5 },
        fbtc: { inflow: 120.5, price: 65.2 },
    });
});
router.get('/stablecoins', (req, res) => {
    res.json({
        usdt: { price: 1.0001, depeg: false },
        usdc: { price: 0.9999, depeg: false },
        dai: { price: 1.0000, depeg: false },
    });
});
// POST /api/test/whatsapp-opportunity
router.post('/test/whatsapp-opportunity', async (req, res) => {
    const testSignal = {
        id: 'test-001',
        title: 'FREE MONEY: Arbitrum Ecosystem Claim',
        summary: 'Confirmed free token claim for users who used the Arbitrum network before March 2024. Average claim worth $2,400. Zero cost to claim.',
        analysis: 'This is a verified airdrop from a protocol with over $2 billion in total value locked. Snapshot was taken in February. Claim portal is live now.',
        score: 94,
        confidence: 94,
        risk: 'low',
        category: 'airdrop',
        chain: 'arbitrum',
        tokenSymbol: 'ARB',
        priceTarget: 'Free tokens — no purchase needed',
        stopLoss: 'No risk — you are not spending money',
        timeframe: '8 days to claim',
        sources: ['DefiLlama Airdrop Tracker'],
        url: 'https://arbitrum.foundation/airdrop',
        timestamp: new Date().toISOString(),
        intelligenceBrief: `WHAT'S HAPPENING\nArbitrum is giving away free tokens to anyone who used their network before March 2024. The average claim is worth $2,400. You have 8 days before the portal closes.\n\nCONFIDENCE: 94/100\nTIME TO ACT: 8 days remaining\n\nWHAT YOU CAN DO\n① Go to arbitrum.foundation/airdrop → connect your wallet → check eligibility → claim. Takes 5 minutes. Zero cost.\n② Check every wallet you own — each eligible wallet claims separately.\n③ Tell friends who used Arbitrum — they can claim too.\n\nHOW RISKY IS THIS?\nZero risk — you are not spending any money.\n\nWHY YOU'RE SEEING THIS EARLY\nK9 detected the claim portal 45 minutes before the announcement hit major crypto news sites.`,
        source: 'DefiLlama Airdrop Tracker',
        upvotes: 0,
        downvotes: 0
    };
    try {
        const { sendSignalToWhatsApp } = await import('../notifications/whatsapp.js');
        const sent = await sendSignalToWhatsApp(testSignal);
        res.json({ data: { sent, message: sent ? 'Test message delivered to WhatsApp' : 'Failed — check GREEN_API credentials in .env' } });
    }
    catch (error) {
        logger.error('Error sending WhatsApp test:', error);
        res.status(500).json({ error: 'Failed to send WhatsApp test' });
    }
});
export default router;
//# sourceMappingURL=routes.js.map