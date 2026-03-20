import { emitter } from '../utils/events.js';
import type { RawSignal, Signal } from '../types/index.js';
import { scrapeDexScreener } from '../scrapers/dexscreener.js';
import { scrapeDefiLlama } from '../scrapers/defillama.js';
import { scrapeRSS } from '../scrapers/rss.js';
import { scrapeGitHub } from '../scrapers/github.js';
import { scrapePolymarket } from '../scrapers/polymarket.js';
import { scrapeFreeMoney } from '../scrapers/freeOpportunities.js';
import { scrapeJobs } from '../scrapers/jobs.js';
import { scrapeGDELT } from '../scrapers/gdelt.js';
import { scrapeHackerNews } from '../scrapers/hackernews.js';
import { scrapeArxiv } from '../scrapers/arxiv.js';
import { scoreSignal, generateIntelligenceBrief } from '../ai/scorer.js';
import { store } from '../utils/store.js';
import logger from '../utils/logger.js';
import { config } from '../config/index.js';
import { calculateVelocity } from './velocity.js';
import { detectConvergence } from './convergence.js';
import { detectCorrelations } from './correlation.js';
import { detectAnomalies } from './baseline.js';

class SignalEngine {
  private isScanning = false;

  async runScan() {
    if (this.isScanning) {
      logger.info('Scan already in progress, skipping...');
      return;
    }

    this.isScanning = true;
    logger.info('🚀 Starting signal scan...');

    try {
      // 1. Fetch raw signals from all sources
      const rawSignalsPromises = [
        scrapeDexScreener(),
        scrapeDefiLlama(),
        scrapeRSS(),
        scrapeGitHub(),
        scrapePolymarket(),
        scrapeFreeMoney(),
        scrapeJobs(),
        scrapeGDELT(),
        scrapeHackerNews(),
        scrapeArxiv(),
      ];

      const results = await Promise.allSettled(rawSignalsPromises);
      const allRawSignals: RawSignal[] = results
        .filter((res): res is PromiseFulfilledResult<RawSignal[]> => res.status === 'fulfilled')
        .flatMap((res) => res.value);

      logger.info(`Fetched ${allRawSignals.length} raw signals.`);

      // 2. Deduplicate signals (simple title-based deduplication)
      const uniqueRawSignals = this.deduplicate(allRawSignals);
      logger.info(`Found ${uniqueRawSignals.length} unique signals after deduplication.`);

      // 3. Score signals with AI
      const scoredSignals: Signal[] = [];
      const batch = uniqueRawSignals.slice(0, config.MAX_SIGNALS_PER_BATCH);

      for (const raw of batch) {
        // Check if signal was already scored recently
        const cached = await store.get<Signal>(`scored-${raw.id}`);
        if (cached) {
          scoredSignals.push(cached);
          continue;
        }

        const scored = await scoreSignal(raw);
        if (scored) {
          // Apply velocity multiplier
          const velocityMultiplier = calculateVelocity(scoredSignals);
          scored.score = Math.min(100, Math.round(scored.score * velocityMultiplier));
          scored.velocityMultiplier = velocityMultiplier;

          // Generate Intelligence Brief for signals scoring 65+
          if (scored.score >= 65) {
            scored.intelligenceBrief = await generateIntelligenceBrief(scored);
          }

          scoredSignals.push(scored);
          await store.set(`scored-${raw.id}`, scored, 1800); // 30 min TTL
          
          // Emit SSE event for new high-quality signal
          if (scored.score >= 65) {
            emitter.emit('newSignal', scored);
          }
        } else if (config.ANTHROPIC_API_KEY === 'sk-ant-placeholder') {
           // Create a mock signal for testing purposes when no API key is provided
           const mockSignal: Signal = {
             ...raw,
             score: 75,
             confidence: 80,
             risk: 'medium',
             analysis: 'Mock AI analysis for testing purposes.',
             intelligenceBrief: `**What's happening** — ${raw.summary}\n\n**How to capitalize** — 1. Monitor the situation. 2. Prepare for a possible entry. 3. Watch for macro confirmation.\n\n**Risks to watch** — 1. Early-stage frontrunning. 2. Macro volatility.\n\n**Information edge** — Early signal from ${raw.source}.`,
             tags: ['mock', 'test'],
             shouldSend: true,
             timestamp: new Date().toISOString()
           };
           scoredSignals.push(mockSignal);
           await store.set(`scored-${raw.id}`, mockSignal, 1800);
           
           // Emit SSE event for mock signal
           emitter.emit('newSignal', mockSignal);
        }
      }

      // 4. Run intelligence systems on scored signals
      const convergenceSignals = detectConvergence(scoredSignals);
      const correlationSignals = detectCorrelations(scoredSignals);
      const anomalySignals = await detectAnomalies(scoredSignals);

      const allProcessedSignals = [
        ...scoredSignals,
        ...convergenceSignals,
        ...correlationSignals,
        ...anomalySignals
      ];

      // 5. Update store
      const currentSignals = await store.getSignals();
      const updatedSignals = [...allProcessedSignals, ...currentSignals].slice(0, 200); // Keep last 200
      await store.setSignals(updatedSignals);

      logger.info(`Successfully processed ${allProcessedSignals.length} signals total.`);
      
      // Emit stats update
      emitter.emit('statsUpdate', {
        totalSignals: updatedSignals.length,
        users: 1542, // Mock data
        lastScan: new Date().toISOString(),
        activeSources: 12,
      });

      return allProcessedSignals;
    } catch (error) {
      logger.error('Error in SignalEngine scan:', error);
      return [];
    } finally {
      this.isScanning = false;
    }
  }

  async analyzeSecurityRisk(address: string, chain: string) {
    // This is handled by security.ts, but can be called from here
    return require('./security').analyzeContract(address, chain);
  }

  async generateDailyDigest() {
    const signals = await store.getSignals();
    const topSignals = signals.filter(s => s.score >= 80);
    return require('../ai/scorer').generateDailyDigest(topSignals);
  }

  private deduplicate(signals: RawSignal[]): RawSignal[] {

    const seen = new Set<string>();
    return signals.filter((s) => {
      const normalizedTitle = s.title.toLowerCase().trim();
      if (seen.has(normalizedTitle)) return false;
      seen.add(normalizedTitle);
      return true;
    });
  }
}

export const signalEngine = new SignalEngine();

