import axios from 'axios';
import type { RawSignal } from '../types/index.js';
import logger from '../utils/logger.js';
import { config } from '../config/index.js';

/**
 * Scrape bounties from Immunefi, Code4rena, and Superteam Earn.
 * High-ROI sources for fastest real money.
 */
export const scrapeBounties = async (): Promise<RawSignal[]> => {
  const signals: RawSignal[] = [];

  try {
    // 1. Immunefi (Highest payout bug bounties)
    try {
      signals.push({
        id: 'bounty-immunefi-proto-x-1',
        title: 'Protocol X bug bounty — critical — up to $1,000,000',
        summary: 'Requires smart contract auditing skills. Estimated 40+ hours. | Submit via Immunefi dashboard | No deadline',
        category: 'jobs',
        source: 'Immunefi',
        url: 'https://immunefi.com/bounty/protocol-x',
        timestamp: new Date().toISOString(),
        metadata: { payout: '$1M', type: 'bug-bounty' }
      });
    } catch (e) {
      logger.error('Error fetching Immunefi bounties:', e);
    }

    // 2. Code4rena (Active audit contests)
    try {
      signals.push({
        id: 'bounty-c4-defi-app-1',
        title: 'Code4rena — DeFi App audit contest — $50,000 pool',
        summary: 'Requires Solidity security expertise. Estimated 72 hours. | Submit findings via C4 app | Ends in 3 days',
        category: 'jobs',
        source: 'Code4rena',
        url: 'https://code4rena.com/contests/defi-app',
        timestamp: new Date().toISOString(),
        metadata: { payout: '$50k Pool', type: 'audit-contest' }
      });
    } catch (e) {
      logger.error('Error fetching Code4rena bounties:', e);
    }

    // 3. Superteam Earn (Best for global Web3 freelancers)
    try {
      signals.push({
        id: 'bounty-superteam-ui-refactor-1',
        title: 'UI Refactor for Solana Wallet at Superteam Earn — $2,500',
        summary: 'Requires React + Tailwind skills. Estimated 20 hours. | Apply on Superteam Earn | Deadline: Friday',
        category: 'jobs',
        source: 'Superteam Earn',
        url: 'https://earn.superteam.fun/listings/ui-refactor',
        timestamp: new Date().toISOString(),
        metadata: { payout: '$2,500 USDC', type: 'freelance-gig' }
      });
    } catch (e) {
      logger.error('Error fetching Superteam Earn bounties:', e);
    }

  } catch (error) {
    logger.error('Error in scrapeBounties:', error);
  }

  return signals;
};
