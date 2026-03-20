import Anthropic from '@anthropic-ai/sdk';
import pLimit from 'p-limit';
import type { RawSignal, Signal } from '../types/index.js';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

const anthropic = new Anthropic({
  apiKey: config.ANTHROPIC_API_KEY,
});

const limit = pLimit(3);

const SYSTEM_PROMPT = `
You are K9's signal intelligence engine — an elite intelligence agent.
Your job: evaluate raw signals and decide if they represent genuine opportunities for users.

Be brutally honest. Most signals are noise. Only high-conviction opportunities score above 70.

Scoring criteria:
- Novelty: Is this genuinely early information? (before crowd knows)
- Actionability: Can a user act on this right now?
- Upside potential: What's the realistic reward?
- Risk-adjusted: Does reward justify risk?
- Time sensitivity: How quickly does this opportunity close?
- Plain English: Can a 40-year-old teacher understand this? (Highest priority for descriptions)

Categories:
- free: Zero investment required (Airdrops, testnets, learn-to-earn)
- jobs: Crypto jobs, bounties, freelance work
- insider: Someone clearly knows something (large bets, whale moves)
- market: Market-wide moves (TVL, volume, etc.)

Risk levels:
- low: Zero money spent OR established/audited/safe
- medium: Semi-new, some risk, moderate liquidity
- high: New/unaudited contract, small liquidity, speculative
- critical: Active exploit, depeg, rug pull in progress

ALWAYS respond with valid JSON only. No markdown.
`;

const RESPONSE_SCHEMA = `
{
  "score": 0-100,
  "confidence": 0-100,
  "risk": "low|medium|high|critical",
  "analysis": "2-3 sentence explanation in PLAIN ENGLISH (NO JARGON)",
  "priceTarget": "optional",
  "stopLoss": "optional",
  "timeframe": "optional (e.g. '2-6 hours', '3 days')",
  "tags": ["tag1", "tag2"],
  "shouldSend": true/false
}
`;

export const scoreSignal = async (raw: RawSignal): Promise<Signal | null> => {
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
        } as Signal;
      }

      return null;
    } catch (error) {
      logger.error(`Error scoring signal ${raw.id}:`, error);
      return null;
    }
  });
};

export const generateIntelligenceBrief = async (signal: Signal): Promise<string> => {
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
    } catch (error) {
      logger.error(`Error generating brief for signal ${signal.id}:`, error);
      return '';
    }
  });
};

export const generateDailyDigest = async (signals: Signal[]): Promise<string> => {
  try {
    if (config.ANTHROPIC_API_KEY === 'sk-ant-placeholder') return 'Daily digest not available (missing API key).';

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
  } catch (error) {
    logger.error('Error generating daily digest:', error);
    return 'Error generating daily digest.';
  }
};
