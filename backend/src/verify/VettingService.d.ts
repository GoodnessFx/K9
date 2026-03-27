/**
 * @file VettingService.ts
 * @description Core logic for Company (KYB) and Talent (GitHub/Portfolio) verification.
 * Part of the K9 Verification module.
 */
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
    assessments: Array<{
        skill: string;
        score: number;
    }>;
    endorsements: number;
    encryptedPortfolio?: string;
}
export declare class VettingService {
    /**
     * Automated Company Verification Flow
     */
    verifyCompany(companyData: {
        legalName: string;
        website: string;
        linkedin?: string;
        docs?: string[];
    }): Promise<CompanyVerificationResult>;
    /**
     * Automated Talent (GitHub) Scanner
     */
    verifyTalentGitHub(githubUsername: string): Promise<TalentVerificationResult>;
    /**
     * Submit Video Proof (Live 2-minute submission)
     */
    submitVideoProof(talentId: string, videoUrl: string): Promise<void>;
    /**
     * Add Peer Endorsement
     */
    addEndorsement(talentId: string, endorserId: string, skill: string): Promise<void>;
    /**
     * Record Skill Assessment Result
     */
    recordAssessment(talentId: string, skill: string, score: number): Promise<void>;
    private checkDomainAge;
    private checkWebsiteReachable;
    private checkLinkedInPresence;
}
//# sourceMappingURL=VettingService.d.ts.map