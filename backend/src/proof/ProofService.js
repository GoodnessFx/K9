import crypto from 'crypto';
import logger from '../utils/logger.js';
import { config } from '../config/index.js';
import { emitter } from '../utils/events.js';
export class ProofService {
    // In a real app, this would be fetched from the last DB entry
    lastRecordHash = 'genesis-hash';
    /**
     * Auto-create signed Outcome Record upon escrow release
     * Records are immutable and hash-chained.
     */
    async createOutcomeRecord(data) {
        const valueTier = this.getValueTier(data.value);
        const talentDisplay = data.isAnonymous ? 'Anonymous' : data.talentName;
        // 1. Construct the base record (including link to previous hash)
        const recordBase = {
            id: `proof-${crypto.randomBytes(8).toString('hex')}`,
            talentName: talentDisplay,
            skillCategory: data.skillCategory,
            opportunityType: data.opportunityType,
            valueTier,
            date: new Date().toISOString(),
            txHash: data.txHash,
            isVerified: true,
            previousHash: this.lastRecordHash
        };
        // 2. Generate HMAC signature (Server-side proof of validity)
        const signature = this.signRecord(recordBase);
        const signedRecord = { ...recordBase, signature };
        // 3. Update the chaining hash (The next record will point to this one's signature hash)
        this.lastRecordHash = crypto.createHash('sha256').update(signature).digest('hex');
        try {
            // 4. Save to storage (Logic for append-only should be enforced at DB level)
            await this.saveRecordToImmutableStorage(signedRecord);
            // 5. Broadcast for real-time Pulse updates
            emitter.emit('newPulse', signedRecord);
            return signedRecord;
        }
        catch (error) {
            logger.error('Failed to create outcome record:', error);
            throw error;
        }
    }
    /**
     * Verify the integrity of a record by checking its signature and chain
     */
    verifyRecordIntegrity(record, expectedPreviousHash) {
        // Check signature
        const recordBase = { ...record };
        delete recordBase.signature;
        const recalculatedSignature = this.signRecord(recordBase);
        if (recalculatedSignature !== record.signature)
            return false;
        // Check chain link
        if (record.previousHash !== expectedPreviousHash)
            return false;
        return true;
    }
    /**
     * Generate a compact Proof Clip for social sharing
     */
    async generateProofClip(record) {
        const clipId = `clip-${crypto.randomBytes(4).toString('hex')}`;
        const summary = `${record.talentName} completed a ${record.skillCategory} gig (${record.valueTier})`;
        // Auto-generate OG card (Simulated)
        const ogCardUrl = this.generateOGCard(record);
        return {
            clipId,
            recordId: record.id,
            summary,
            ogCardUrl,
            verifiedBadge: 'K9-CONTRACT-VERIFIED'
        };
    }
    signRecord(record) {
        const data = JSON.stringify(record);
        return crypto
            .createHmac('sha256', config.API_SECRET || 'k9-secret-fallback')
            .update(data)
            .digest('hex');
    }
    getValueTier(value) {
        if (value < 500)
            return '$0-500';
        if (value < 2000)
            return '$500-2k';
        if (value < 10000)
            return '$2k-10k';
        return '$10k+';
    }
    async saveRecordToImmutableStorage(record) {
        logger.info(`Saving immutable record: ${record.id}`);
        // This is where append-only DB logic (e.g., Supabase RLS) would be applied
    }
    generateOGCard(record) {
        return `https://k9.work/api/og/proof/${record.id}`;
    }
}
export const proofService = new ProofService();
//# sourceMappingURL=ProofService.js.map