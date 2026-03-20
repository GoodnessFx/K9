import Anthropic from '@anthropic-ai/sdk';
import pLimit from 'p-limit';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';
const anthropic = new Anthropic({
    apiKey: config.ANTHROPIC_API_KEY,
});
const limit = pLimit(3);
const SYSTEM_PROMPT = `
You are K9's signal intelligence engine — an elite crypto and financial market analyst.
Your job: evaluate raw signals and decide if they represent genuine alpha opportunities.

Be brutally honest. Most signals are noise. Only high-conviction opportunities score above 70.

Scoring criteria:
- Novelty: Is this genuinely early information? (before crowd knows)
- Actionability: Can a trader act on this right now?
- Upside potential: What's the realistic reward?
- Risk-adjusted: Does reward justify risk?
- Time sensitivity: How quickly does this opportunity close?
- Convergence: Is this signal confirmed by other independent sources?

Risk levels:
- low: Established protocol, audited, large liquidity, verified team
- medium: Semi-new protocol, some risk, moderate liquidity
- high: New/unaudited contract, small liquidity, anonymous team
- critical: Active exploit, honeypot detected, rug pull in progress

ALWAYS respond with valid JSON only. No markdown.
`;
const RESPONSE_SCHEMA = `
{
  "score": 0-100,
  "confidence": 0-100,
  "risk": "low|medium|high|critical",
  "analysis": "2-3 sentence explanation",
  "priceTarget": "optional",
  "stopLoss": "optional",
  "timeframe": "optional (e.g. '24-48h')",
  "tags": ["tag1", "tag2"],
  "shouldSend": true/false
}
`;
export const scoreSignal = async (raw) => {
    return limit(async () => {
        try {
            // For now, if API key is placeholder, skip AI scoring to avoid errors
            if (config.ANTHROPIC_API_KEY === 'sk-ant-placeholder') {
                logger.warn('Skipping AI scoring due to placeholder API key');
                return null;
            }
            const prompt = `
        Evaluate this raw signal:
        Title: ${raw.title}
        Summary: ${raw.summary}
        Source: ${raw.source}
        Category: ${raw.category}
        Metadata: ${JSON.stringify(raw.metadata)}

        Response schema:
        ${RESPONSE_SCHEMA}
      `;
            const response = await anthropic.messages.create({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1000,
                system: SYSTEM_PROMPT,
                messages: [{ role: 'user', content: prompt }],
            });
            // Extract JSON from response
            const content = response.content[0];
            if (content && 'text' in content) {
                const jsonResponse = JSON.parse(content.text);
                return {
                    ...raw,
                    ...jsonResponse,
                    timestamp: new Date().toISOString(),
                };
            }
            return null;
        }
        catch (error) {
            logger.error(`Error scoring signal ${raw.id}:`, error);
            return null;
        }
    });
};
export const generateDailyDigest = async (signals) => {
    try {
        if (config.ANTHROPIC_API_KEY === 'sk-ant-placeholder')
            return 'Daily digest not available (missing API key).';
        const topSignals = signals.sort((a, b) => b.score - a.score).slice(0, 10);
        const prompt = `
      Generate a daily digest for the top 10 alpha signals from the last 24h.
      Signals: ${JSON.stringify(topSignals)}

      Format: morning summary of top 10 signals. 5-bullet summary for Hunter + Alpha users.
      one bullet per signal, emoji prefix, direct language, no fluff.
    `;
        const response = await anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1000,
            system: 'You are an elite financial analyst. Summarize these signals into a concise daily digest.',
            messages: [{ role: 'user', content: prompt }],
        });
        const content = response.content[0];
        if (content && 'text' in content) {
            return content.text;
        }
        return '';
    }
    catch (error) {
        logger.error('Error generating daily digest:', error);
        return 'Error generating daily digest.';
    }
};
//# sourceMappingURL=scorer.js.map