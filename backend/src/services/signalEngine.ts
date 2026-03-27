import { emitter } from '../utils/events.js';
import type { RawSignal, Signal } from '../types/index.js';
import { scrapeDexScreener } from '../scrapers/dexscreener.js';
import { scrapeDefiLlama } from '../scrapers/defillama.js';
import { scrapeRSS } from '../scrapers/rss.js';
import { scrapeGitHub } from '../scrapers/github.js';
import { scrapePolymarket } from '../scrapers/polymarket.js';
import { scrapeFreeMoney } from '../scrapers/freeOpportunities.js';
import { scrapeJobs } from '../scrapers/jobs.js';
import { scrapeBounties } from '../scrapers/bounties.js';
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
import { analyzeContract } from './security.js';
import axios from 'axios';

class SignalEngine {
  private isScanning = false;
  private opportunityWorker = new OpportunityWorker();
  private filterService = new FilterService();
  private matchingService = new MatchingService();

  /**
   * Verify if a URL is alive before surfacing it.
   */
  private async verifyLink(url: string): Promise<boolean> {
    if (!url || url === '#' || url.startsWith('javascript:')) return false;
    try {
      // Basic check: head request to see if it exists
      const res = await axios.head(url, { timeout: 3000, validateStatus: (s) => s < 400 });
      return res.status < 400;
    } catch (e) {
      // Fallback to GET if HEAD is not allowed
      try {
        const res = await axios.get(url, { timeout: 3000, validateStatus: (s) => s < 400 });
        return res.status < 400;
      } catch (e2) {
        logger.warn(`DROPPED: dead link - ${url}`);
        return false;
      }
    }
  }

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
        try {
          await this.opportunityWorker.processSniffJob(url);
        } catch (e) {
          logger.error(`Sniffer failed for ${url}`, e);
        }
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
        scrapeBounties(),
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
      const batch = uniqueRawSignals.slice(0, config.MAX_SIGNALS_PER_BATCH || 50);

      for (const raw of batch) {
        try {
          const scored = await scoreSignal(raw);
          if (!scored) continue;

          // Apply K9 Filter Logic
          const filterScore = this.filterService.scoreListing({
            role: scored.title,
            company: scored.source,
            location: 'Remote',
            type: 'Full-time',
            pay_range: scored.metadata?.pay || 'N/A',
            source: scored.source,
            scraped_at: scored.timestamp,
            raw_url: scored.url,
            vision_parsed: false
          });

          scored.score = Math.round((scored.score + filterScore) / 2);

          // Signal Quality Upgrade: Threshold 70
          if (scored.score < 70) {
            logger.info(`DROPPED: Signal ${scored.id} score too low (${scored.score})`);
            continue;
          }

          // Convergence Bonus
          const currentSignals = await store.getSignals();
          const matches = currentSignals.filter(s => 
            s.id !== scored.id && 
            (s.title.toLowerCase().includes(scored.title.toLowerCase()) || 
             (scored.tokenSymbol && s.tokenSymbol === scored.tokenSymbol))
          );
          if (matches.length >= 1) {
            scored.score += 20;
            scored.isConvergence = true;
          }

          // Safety Filter
          if (scored.category === 'defi' || scored.category === 'token_launch') {
            const tokenAddr = scored.metadata?.tokenAddress;
            if (tokenAddr) {
              const safety = await analyzeContract(tokenAddr, scored.chain || '1');
              if (safety.overallRisk === 'critical') {
                logger.info(`DROPPED: Signal ${scored.id} failed safety check`);
                continue;
              }
              if (safety.overallRisk === 'low') scored.score += 10;
            }
          }

          // Link Verification
          const isAlive = await this.verifyLink(scored.url);
          if (!isAlive) continue;

          // AI Briefing
          scored.intelligenceBrief = await generateIntelligenceBrief(scored);
          
          // Alerts are handled by NotificationService listening to 'newSignal'
          // if score >= 80. For 70-79, they just appear in the feed.

          // Real-time broadcast
          emitter.emit('newSignal', scored);
          if (scored.category === 'jobs') emitter.emit('newJob', scored);
          if (scored.category === 'airdrop' || scored.category === 'free') emitter.emit('newAirdrop', scored);
          
          scoredSignals.push(scored);
        } catch (err) {
          logger.error(`Error processing signal ${raw.id}:`, err);
        }
      }

      // 5. Advanced Analysis
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
    const { analyzeContract } = await import('./security.js');
    return analyzeContract(address, chain);
  }

  async generateDailyDigest() {
    const signals = await store.getSignals();
    const topSignals = signals.filter(s => s.score >= 80);
    const { generateDailyDigest } = await import('../ai/scorer.js');
    return generateDailyDigest(topSignals);
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
