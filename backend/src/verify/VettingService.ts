/**
 * @file VettingService.ts
 * @description Core logic for Company (KYB) and Talent (GitHub/Portfolio) verification.
 * Part of the K9 Verification module.
 */

import axios from 'axios';
import logger from '../utils/logger.js';
import { SecurityService } from '../services/securityService.js';

const securityService = new SecurityService();

export interface CompanyVerificationResult {
  isVerified: boolean;
  score: number;
  reasons: string[];
  badges: string[];
  encryptedDocs?: string[];
}

export interface TalentVerificationResult {
  isVerified: boolean;
  skillConfidenceScore: number;
  badges: string[];
  videoProofUrl?: string;
  assessments: Array<{ skill: string; score: number }>;
  endorsements: number;
  encryptedPortfolio?: string;
}

export class VettingService {
  /**
   * Automated Company Verification Flow
   */
  async verifyCompany(companyData: {
    legalName: string;
    website: string;
    linkedin?: string;
    docs?: string[];
  }): Promise<CompanyVerificationResult> {
    const reasons: string[] = [];
    const badges: string[] = [];
    let score = 0;
    let encryptedDocs: string[] = [];

    try {
      // 1. Domain WHOIS Age check (Simplified check via a common WHOIS API or proxy)
      const isDomainOldEnough = await this.checkDomainAge(companyData.website);
      if (isDomainOldEnough) {
        score += 30;
        reasons.push('Domain is at least 6 months old.');
      } else {
        reasons.push('Domain is too young (< 6 months).');
      }

      // 2. Website Reachability & Legitimacy Scan
      const isReachable = await this.checkWebsiteReachable(companyData.website);
      if (isReachable) {
        score += 20;
        reasons.push('Website is reachable and appears legitimate.');
      }

      // 3. LinkedIn Presence Check
      if (companyData.linkedin) {
        const hasLinkedIn = await this.checkLinkedInPresence(companyData.linkedin);
        if (hasLinkedIn) {
          score += 25;
          badges.push('LinkedIn Verified');
        }
      }

      // 4. Encrypt sensitive documentation
      if (companyData.docs) {
        encryptedDocs = companyData.docs.map(doc => securityService.encryptDocument(doc));
      }

      // 5. Reputation (Glassdoor/Crunchbase) - Mocked for now
      score += 15; // Placeholder for reputation match

      const isVerified = score >= 70;
      if (isVerified) badges.push('Verified Employer');

      return { isVerified, score, reasons, badges, encryptedDocs };
    } catch (error) {
      logger.error('Company verification failed:', error);
      return { isVerified: false, score: 0, reasons: ['Verification process failed'], badges: [] };
    }
  }

  /**
   * Automated Talent (GitHub) Scanner
   */
  async verifyTalentGitHub(githubUsername: string): Promise<TalentVerificationResult> {
    try {
      const response = await axios.get(`https://api.github.com/users/${githubUsername}`);
      const userData = response.data;

      let confidenceScore = 0;
      const badges: string[] = [];

      // Repo activity, Readme quality, contributions
      if (userData.public_repos > 5) confidenceScore += 20;
      if (userData.followers > 10) confidenceScore += 10;
      
      // Simulated: Scan repos for Readme quality and language breakdown
      confidenceScore += 15; 

      if (confidenceScore > 60) {
        badges.push('Verified Developer');
      }

      return {
        isVerified: confidenceScore > 50,
        skillConfidenceScore: confidenceScore,
        badges,
        assessments: [],
        endorsements: 0
      };
    } catch (error) {
      logger.error('Talent GitHub verification failed:', error);
      return { isVerified: false, skillConfidenceScore: 0, badges: [], assessments: [], endorsements: 0 };
    }
  }

  /**
   * Submit Video Proof (Live 2-minute submission)
   */
  async submitVideoProof(talentId: string, videoUrl: string): Promise<void> {
    logger.info(`Video proof submitted for talent ${talentId}: ${videoUrl}`);
    // In a real implementation, store this URL and flag for manual/AI review
  }

  /**
   * Add Peer Endorsement
   */
  async addEndorsement(talentId: string, endorserId: string, skill: string): Promise<void> {
    logger.info(`Peer endorsement for ${talentId} from ${endorserId} for skill ${skill}`);
    // In a real implementation, increment endorsement count and adjust confidence score
  }

  /**
   * Record Skill Assessment Result
   */
  async recordAssessment(talentId: string, skill: string, score: number): Promise<void> {
    logger.info(`Skill assessment for ${talentId}: ${skill} - Score: ${score}`);
    // In a real implementation, update talent's assessment record
  }

  private async checkDomainAge(url: string): Promise<boolean> {
    // Simulated: Real implementation would query a WHOIS API
    return true; 
  }

  private async checkWebsiteReachable(url: string): Promise<boolean> {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  private async checkLinkedInPresence(url: string): Promise<boolean> {
    // Simulated: Real implementation would scrape or use LinkedIn API
    return url.includes('linkedin.com/company');
  }
}
