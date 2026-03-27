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
export declare class MatchingService {
    /**
     * Calculate personalized Match Score % for a user
     */
    matchTalentToJob(talent: TalentVerificationResult, job: NormalizedListing, complexity: JobComplexity): Promise<MatchResult>;
}
//# sourceMappingURL=MatchingService.d.ts.map