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

          // 1. Drop signals below 70 CONF (Signal Quality Upgrade)
          if (scored.score < 70) {
            logger.info(`DROPPED: Signal ${scored.id} score too low (${scored.score})`);
            continue;
          }

          // 2. Convergence Bonus (The secret weapon)
          // Already handled partially in detectConvergence, but we can boost individual signals here
          // if they match recent signals from other sources
          const currentSignals = await store.getSignals();
          const matches = currentSignals.filter(s => 
            s.id !== scored.id && 
            (s.title.toLowerCase().includes(scored.title.toLowerCase()) || 
             (scored.tokenSymbol && s.tokenSymbol === scored.tokenSymbol))
          );
          if (matches.length >= 1) {
            scored.score += 20;
            scored.isConvergence = true;
            logger.info(`BOOST: Signal ${scored.id} score boosted by convergence (+20)`);
          }

          // 3. Safety Filter (Protect the money)
          if (scored.category === 'defi' || scored.category === 'token_launch') {
            const tokenAddr = scored.metadata?.tokenAddress;
            if (tokenAddr) {
              const safety = await analyzeContract(tokenAddr, scored.chain || '1');
              if (safety.overallRisk === 'critical') {
                logger.info(`DROPPED: Signal ${scored.id} failed safety check (Critical Risk)`);
                continue;
              }
              // Adjust score based on safety (bonus for low risk)
              if (safety.overallRisk === 'low') scored.score += 10;
            }
          }

          // 5. Link Verification (One Card. One Link. Real Money.)
          const isAlive = await this.verifyLink(scored.url);
          if (!isAlive) {
            continue; // Dropped already logged in verifyLink
          }

          // Generate Intelligence Brief for 70+
          scored.intelligenceBrief = await generateIntelligenceBrief(scored);
          
          // 6. WhatsApp/Telegram Alert for 70+
          if (scored.intelligenceBrief) {
            const msg = `🚨 *K9 HIGH SIGNAL OPPORTUNITY (${scored.score}%)*\n\n${scored.intelligenceBrief}`;
            // Call existing notification service
            await require('./notificationService').broadcastSignal(msg, scored.category);
          }

          // IMMEDIATE BROADCAST: Ensure the signal lands in the right UI bucket
            // Map SignalCategory to frontend tab IDs if necessary
            emitter.emit('newSignal', scored);
            
            // Specific category emissions for high-priority streams
            if (scored.category === 'jobs') emitter.emit('newJob', scored);
            if (scored.category === 'airdrop' || scored.category === 'free') emitter.emit('newAirdrop', scored);
            
            logger.info(`📡 Broadcasted high-signal opportunity: ${scored.title} (${scored.category})`);
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

