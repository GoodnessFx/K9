export interface OutcomeRecord {
    id: string;
    talentName: string;
    skillCategory: string;
    opportunityType: string;
    valueTier: '$0-500' | '$500-2k' | '$2k-10k' | '$10k+';
    date: string;
    txHash: string;
    isVerified: boolean;
    signature: string;
    previousHash: string;
    merkleRoot?: string;
}
export interface ProofClip {
    clipId: string;
    recordId: string;
    summary: string;
    ogCardUrl: string;
    verifiedBadge: string;
}
export declare class ProofService {
    private lastRecordHash;
    /**
     * Auto-create signed Outcome Record upon escrow release
     * Records are immutable and hash-chained.
     */
    createOutcomeRecord(data: {
        talentName: string;
        skillCategory: string;
        opportunityType: string;
        value: number;
        txHash: string;
        isAnonymous?: boolean;
    }): Promise<OutcomeRecord>;
    /**
     * Verify the integrity of a record by checking its signature and chain
     */
    verifyRecordIntegrity(record: OutcomeRecord, expectedPreviousHash: string): boolean;
    /**
     * Generate a compact Proof Clip for social sharing
     */
    generateProofClip(record: OutcomeRecord): Promise<ProofClip>;
    private signRecord;
    private getValueTier;
    private saveRecordToImmutableStorage;
    private generateOGCard;
}
export declare const proofService: ProofService;
//# sourceMappingURL=ProofService.d.ts.map