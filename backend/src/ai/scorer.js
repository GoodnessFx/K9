import Anthropic from '@anthropic-ai/sdk';
import pLimit from 'p-limit';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';
const anthropic = new Anthropic({
    apiKey: config.ANTHROPIC_API_KEY,
});
const limit = pLimit(3);
const SYSTEM_PROMPT = `
You are K9's signal intelligence engine — an elite intelligence agent.
Your job: transform raw data into ONE SPECIFIC, ACTIONABLE OPPORTUNITY.

=== THE GOLDEN RULE: ONE SIGNAL = ONE REAL THING ===
Never group opportunities. Never say "Multiple jobs" or "500+ airdrops".
If you find 500 jobs, you output 500 individual reports.
Each report = one job, one company, one exact link.

=== BANNED WORDS (DO NOT USE) ===
- "500+ jobs open"
- "Multiple airdrops"
- "Everyone is looking at..."
- "Trending across the market"
- "10+ opportunities"

=== FORMATTING RULES ===

1. JOBS:
   Title: [Job Title] at [Company Name]
   Body (2 lines max):
   Line 1: Specific requirements (e.g. "Needs React + Solidity experience")
   Line 2: Pay + Remote/Location + Deadline (e.g. "$8k/month | Remote | Apply by Friday")
   URL: Must be the EXACT listing page.

2. AIRDROPS:
   Title: [Protocol Name] airdrop — [how to qualify]
   Body:
   Line 1: Exact steps (max 3 steps, plain English)
   Line 2: Estimated value + Deadline
   URL: The exact claim or quest page.

3. DEFI / TRADING:
   Title: [Asset Symbol] — [Specific Data Signal]
   Body:
   Line 1: What the data actually shows (numbers/source)
   Line 2: Action + Risk Level
   URL: DexScreener pair, CoinGecko page, or Etherscan tx.

4. BOUNTIES:
   Title: [Protocol] bug bounty — [Severity] — up to $[Amount]
   Body:
   Line 1: Skill needed + Time estimate
   Line 2: How to submit + Deadline
   URL: The specific bounty/contest page.

=== LANGUAGE & TONE ===
- Write like a smart friend texting, not a news headline.
- No jargon:
  - "liquidity" -> "available to trade"
  - "TVL" -> "money locked in the protocol"
  - "funding rate" -> "cost to hold the trade overnight"
- Keep token symbols ($ONDO, $STG).

=== SCORING ===
- Signals below 70 CONF are discarded.
- Only output if CONF >= 70.
- Output JSON only.
`;
const RESPONSE_SCHEMA = `
{
  "score": 70-100,
  "confidence": 70-100,
  "risk": "low|medium|high|critical",
  "title": "Strictly follow the [Job Title] at [Company Name] style",
  "analysis": "2 lines max of plain English action steps",
  "intelligenceBrief": "Standardized text briefing for WhatsApp/Telegram",
  "url": "THE EXACT ACTIONABLE URL",
  "tags": ["tag1", "tag2"],
  "shouldSend": true
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
export const generateIntelligenceBrief = async (signal) => {
    return limit(async () => {
        try {
            if (config.ANTHROPIC_API_KEY === 'sk-ant-placeholder') {
                return 'Intelligence brief not available (missing API key).';
            }
            const prompt = `
        Generate an intelligence brief for this opportunity:
        Title: ${signal.title}
        Summary: ${signal.summary}
        Score: ${signal.score}/100
        Risk: ${signal.risk}
        Category: ${signal.category}
        Analysis: ${signal.analysis}
        Price Target: ${signal.priceTarget ?? 'N/A'}
        Stop Loss: ${signal.stopLoss ?? 'N/A'}
        Timeframe: ${signal.timeframe ?? 'N/A'}
        Tags: ${signal.tags.join(', ')}

        Structure the brief into these exact headers:
        **What's happening** — explain the opportunity in plain English (max 3 sentences). What was found? Why is it a chance to make money?
        **How to capitalize** — 2-3 numbered, specific, actionable steps. Use full URLs. Example: "Go to polymarket.com -> search 'Maduro' -> click 'Yes'".
        **Risks to watch** — 2 specific risks in plain language.
        **Information edge** — how early is this? (e.g., "20 minutes before Twitter").

        Rules:
        - Use PLAIN ENGLISH ONLY. Replace technical terms: TVL -> "Total Money Locked", Alpha -> "Opportunity", etc.
        - If Category is "free", emphasize "ZERO MONEY REQUIRED".
        - Be direct and honest about risk.
        - Maximum 300 words.
      `;
            const response = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 1000,
                system: 'You are K9 intelligence agent. You explain complex signals to ordinary people in plain English.',
                messages: [{ role: 'user', content: prompt }],
            });
            const content = response.content[0];
            if (content && 'text' in content) {
                return content.text;
            }
            return '';
        }
        catch (error) {
            logger.error(`Error generating brief for signal ${signal.id}:`, error);
            return '';
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