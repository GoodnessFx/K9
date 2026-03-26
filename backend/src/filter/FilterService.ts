/**
 * @file FilterService.ts
 * @description Logic for filtering and scoring scraped job listings.
 * Part of the K9 Filter module.
 */

import { NormalizedListing } from '../sniffer/SourceSniffer.js';
import logger from '../utils/logger.js';

export class FilterService {
  /**
   * Main Scoring Pipeline for a listing
   */
  scoreListing(listing: NormalizedListing): number {
    let score = 50; // Starting baseline

    // 1. Penalize: No salary/rate info
    if (listing.pay_range === 'N/A' || !listing.pay_range) {
      score -= 20;
    }

    // 2. Penalize: Older than 72 hours (Simulated activity check)
    const scrapedAt = new Date(listing.scraped_at).getTime();
    const ageHours = (Date.now() - scrapedAt) / (1000 * 60 * 60);
    if (ageHours > 72) {
      score -= 15;
    }

    // 3. Ghost Job Detection: Listing posted for > 90 days
    // This requires history tracking; simulated for now.
    const isGhostJob = this.detectGhostJob(listing);
    if (isGhostJob) {
      score -= 50; // Heavily penalize and suppress
    }

    // 4. Reward: K9-verified companies (Simulated)
    if (this.isVerifiedCompany(listing.company)) {
      score += 25;
    }

    // 5. Final normalization (0-100 range)
    return Math.max(0, Math.min(100, score));
  }

  private detectGhostJob(listing: NormalizedListing): boolean {
    // In a real implementation, query a database to check:
    // "Has this exact job title/company been posted for > 90 days?"
    return false; // Mock
  }

  private isVerifiedCompany(companyName: string): boolean {
    // Check against K9 Verified Company database
    return false; // Mock
  }
}
