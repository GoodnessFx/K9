import { Telegraf, Context } from 'telegraf';
import { config } from '../config/index.js';
import { store } from '../utils/store.js';
import logger from '../utils/logger.js';
const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);
// Middleware for error handling
bot.catch((err, ctx) => {
    logger.error(`Telegraf error for ${ctx.updateType}`, err);
});
// Welcome message
bot.start((ctx) => {
    ctx.replyWithHTML(`
🤖 <b>Welcome to K9</b>

K9 is an AI-powered alpha intelligence platform that scans the market for real-time opportunities.

<b>Available Commands:</b>
/signals - Latest 5 alpha signals
/top - High-conviction signals (80+)
/defi - DeFi signals
/security - Security alerts
/cri - Chain Risk Index
/help - Show all commands

<i>Stay ahead of the market with K9.</i>
  `);
});
// Command: Latest signals
bot.command('signals', async (ctx) => {
    const signals = await store.getSignals();
    const latest = signals.slice(0, 5);
    if (latest.length === 0) {
        return ctx.reply('No signals found yet. Scanning in progress...');
    }
    for (const signal of latest) {
        await ctx.replyWithHTML(formatSignal(signal));
    }
});
// Command: High conviction signals
bot.command('top', async (ctx) => {
    const signals = await store.getSignals();
    const top = signals.filter(s => s.score >= 80).slice(0, 5);
    if (top.length === 0) {
        return ctx.reply('No high-conviction signals found in the last 24h.');
    }
    for (const signal of top) {
        await ctx.replyWithHTML(formatSignal(signal));
    }
});
// Command: DeFi signals
bot.command('defi', async (ctx) => {
    const signals = await store.getSignals();
    const defi = signals.filter(s => s.category === 'defi').slice(0, 5);
    if (defi.length === 0) {
        return ctx.reply('No DeFi signals found.');
    }
    for (const signal of defi) {
        await ctx.replyWithHTML(formatSignal(signal));
    }
});
// Command: Security alerts
bot.command('security', async (ctx) => {
    const signals = await store.getSignals();
    const security = signals.filter(s => s.category === 'security').slice(0, 5);
    if (security.length === 0) {
        return ctx.reply('No security alerts found.');
    }
    for (const signal of security) {
        await ctx.replyWithHTML(formatSignal(signal));
    }
});
// Command: Chain Risk Index (mock for now)
bot.command('cri', async (ctx) => {
    ctx.replyWithHTML(`
<b>Chain Risk Index (CRI)</b>

🔹 Ethereum: 85 (HEALTHY)
🔹 Arbitrum: 78 (HEALTHY)
🔹 Base: 92 (BULLISH)
🔹 Solana: 65 (MODERATE)
🔹 BSC: 45 (HIGH RISK)
  `);
});
// Helper: Format signal for Telegram HTML
function formatSignal(signal) {
    const emoji = getCategoryEmoji(signal.category);
    const scoreBar = '█'.repeat(Math.floor(signal.score / 10)) + '░'.repeat(10 - Math.floor(signal.score / 10));
    const riskEmoji = getRiskEmoji(signal.risk);
    return `
${emoji} <b>${signal.title.toUpperCase()}</b>

${signal.summary}

Score: ${scoreBar} ${signal.score}/100
Risk:  ${riskEmoji} ${signal.risk.toUpperCase()}
Confidence: ${signal.confidence}%
${signal.chain ? `Chain: ${signal.chain}` : ''}
${signal.tokenSymbol ? `Token: ${signal.tokenSymbol}` : ''}
${signal.priceTarget ? `Target: ${signal.priceTarget}` : ''}
${signal.stopLoss ? `Stop: ${signal.stopLoss}` : ''}
${signal.timeframe ? `Timeframe: ${signal.timeframe}` : ''}

AI says: "${signal.analysis}"

${signal.tags.map(t => `#${t}`).join(' ')} #${signal.category}

<a href="${signal.url}">View source →</a>
⏰ ${new Date(signal.timestamp).toUTCString()}
  `;
}
function getCategoryEmoji(cat) {
    switch (cat) {
        case 'defi': return '🏦';
        case 'token_launch': return '🚀';
        case 'airdrop': return '🎁';
        case 'whale': return '🐋';
        case 'developer': return '👨‍💻';
        case 'security': return '🛡️';
        case 'polymarket': return '🔮';
        case 'tradfi': return '📉';
        case 'nft': return '🖼️';
        case 'macro': return '🌍';
        case 'stablecoin': return '⚖️';
        case 'convergence': return '🎯';
        case 'anomaly': return '⚠️';
        default: return '📢';
    }
}
function getRiskEmoji(risk) {
    switch (risk) {
        case 'low': return '🟢';
        case 'medium': return '🟡';
        case 'high': return '🔴';
        case 'critical': return '🔥';
        default: return '⚪';
    }
}
export const startBot = async () => {
    if (config.TELEGRAM_BOT_TOKEN === 'placeholder') {
        logger.warn('Skipping Telegram bot start due to placeholder token');
        return;
    }
    try {
        await bot.launch();
        logger.info('🤖 Telegram bot launched successfully.');
    }
    catch (error) {
        logger.error('Error launching Telegram bot:', error);
    }
};
export default bot;
//# sourceMappingURL=bot.js.map