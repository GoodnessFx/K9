/**
 * @file MatchingService.ts
 * @description Core logic for matching talent to verified opportunities.
 * Part of the K9 Matching module.
 */

import { NormalizedListing } from '../sniffer/SourceSniffer.js';
import { TalentVerificationResult } from '../verify/VettingService.js';

export interface MatchResult {
  matchScore: number;
  reasons: string[];
}

export interface JobComplexity {
  skillLevelRequired: 'Junior' | 'Intermediate' | 'Senior' | 'Expert';
  estimatedHours: number;
  technicalStack: string[];
}

export class MatchingService {
  /**
   * Calculate personalized Match Score % for a user
   */
  async matchTalentToJob(
    talent: TalentVerificationResult, 
    job: NormalizedListing,
    complexity: JobComplexity
  ): Promise<MatchResult> {
    let matchScore = 0;
    const reasons: string[] = [];

    // 1. Skill Level Compatibility (40% weight)
    const levelScores = { Junior: 25, Intermediate: 50, Senior: 75, Expert: 100 };
    const talentScore = talent.skillConfidenceScore;
    const requiredScore = levelScores[complexity.skillLevelRequired];

    const levelDiff = talentScore - requiredScore;
    if (levelDiff >= 0) {
      matchScore += 40;
      reasons.push(`Talent skill level (${talentScore}) meets or exceeds required level (${requiredScore}).`);
    } else if (levelDiff > -20) {
      matchScore += 20;
      reasons.push('Talent skill level is slightly below required level.');
    }

    // 2. Technical Stack Match (30% weight)
    const talentBadges = talent.badges.map(b => b.toLowerCase());
    const stackMatches = complexity.technicalStack.filter(skill => 
      talentBadges.some(badge => badge.includes(skill.toLowerCase()))
    );

    const stackMatchRatio = stackMatches.length / complexity.technicalStack.length;
    matchScore += Math.round(stackMatchRatio * 30);
    if (stackMatches.length > 0) {
      reasons.push(`Matched ${stackMatches.length} technical skills: ${stackMatches.join(', ')}.`);
    }

    // 3. Verification & Reputation Bonus (20% weight)
    if (talent.badges.includes('Verified Developer')) {
      matchScore += 10;
      reasons.push('Bonus for Verified Developer status.');
    }
    if (talent.endorsements > 5) {
      matchScore += 10;
      reasons.push('Bonus for high peer endorsements.');
    }

    // 4. Activity & Availability (10% weight)
    // Simulated: Reward active hunters
    matchScore += 10;

    return {
      matchScore: Math.max(0, Math.min(100, matchScore)),
      reasons
    };
  }
}
