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

import { OpportunityWorker } from '../workers/OpportunityWorker.js';

import { FilterService } from '../filter/FilterService.js';
import { MatchingService } from '../matching/MatchingService.js';

class SignalEngine {
  private isScanning = false;
  private opportunityWorker = new OpportunityWorker();
  private filterService = new FilterService();
  private matchingService = new MatchingService();

  async runScan() {
    if (this.isScanning) {
      logger.info('Scan already in progress, skipping...');
      return;
    }

    this.isScanning = true;
    logger.info('🚀 Starting signal scan...');

    try {
      // 1. Run Opportunity Sniffer for high-signal sources
      const snifferUrls = [
        'https://remoteok.com/remote-web3-jobs',
        'https://weworkremotely.com/categories/remote-web-development-jobs',
      ];
      
      for (const url of snifferUrls) {
        await this.opportunityWorker.processUrl(url);
      }

      // 2. Fetch raw signals from all sources
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

      // 3. Deduplicate signals
      const uniqueRawSignals = this.deduplicate(allRawSignals);
      logger.info(`Found ${uniqueRawSignals.length} unique signals after deduplication.`);

      // 4. Score and Filter signals
      const scoredSignals: Signal[] = [];
      const batch = uniqueRawSignals.slice(0, config.MAX_SIGNALS_PER_BATCH);

      for (const raw of batch) {
        // AI Scoring (Existing logic)
        const scored = await scoreSignal(raw);
        if (scored) {
          // Apply K9 Filter Logic (Module 3)
          const filterScore = this.filterService.scoreListing({
            role: scored.title,
            company: scored.source, // Simplified mapping
            location: 'Remote',
            type: 'Full-time',
            pay_range: scored.metadata?.pay || 'N/A',
            source: scored.source,
            scraped_at: scored.timestamp,
            raw_url: scored.url,
            vision_parsed: false
          });

          // Combine AI score with Filter score
          scored.score = Math.round((scored.score + filterScore) / 2);

          if (scored.score >= 65) {
            scored.intelligenceBrief = await generateIntelligenceBrief(scored);
            emitter.emit('newSignal', scored);
          }

          scoredSignals.push(scored);
        }
      }

      // 5. Update store and emit stats
      const convergenceSignals = detectConvergence(scoredSignals);
      const correlationSignals = detectCorrelations(scoredSignals);
      const anomalySignals = await detectAnomalies(scoredSignals);

      const allProcessedSignals = [
        ...scoredSignals,
        ...convergenceSignals,
        ...correlationSignals,
        ...anomalySignals
      ];

      const currentSignals = await store.getSignals();
      const updatedSignals = [...allProcessedSignals, ...currentSignals].slice(0, 200);
      await store.setSignals(updatedSignals);

      logger.info(`Successfully processed ${allProcessedSignals.length} signals.`);
      
      emitter.emit('statsUpdate', {
        totalSignals: updatedSignals.length,
        users: 1542,
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

