import crypto from 'crypto';
import logger from '../utils/logger.js';
import { config } from '../config/index.js';
import { emitter } from '../utils/events.js';

export interface OutcomeRecord {
  id: string;
  talentName: string; // "Anonymous" if opt-out
  skillCategory: string;
  opportunityType: string;
  valueTier: '$0-500' | '$500-2k' | '$2k-10k' | '$10k+';
  date: string;
  txHash: string;
  isVerified: boolean;
  signature: string; // Cryptographic proof of validity
  previousHash: string; // Hash-chaining for immutability
  merkleRoot?: string; // Optional: For batch verification
}

export interface ProofClip {
  clipId: string;
  recordId: string;
  summary: string;
  ogCardUrl: string;
  verifiedBadge: string;
}

export class ProofService {
  // In a real app, this would be fetched from the last DB entry
  private lastRecordHash: string = 'genesis-hash';

  /**
   * Auto-create signed Outcome Record upon escrow release
   * Records are immutable and hash-chained.
   */
  async createOutcomeRecord(data: {
    talentName: string;
    skillCategory: string;
    opportunityType: string;
    value: number;
    txHash: string;
    isAnonymous?: boolean;
  }): Promise<OutcomeRecord> {
    const valueTier = this.getValueTier(data.value);
    const talentDisplay = data.isAnonymous ? 'Anonymous' : data.talentName;
    
    // 1. Construct the base record (including link to previous hash)
    const recordBase: Omit<OutcomeRecord, 'signature'> = {
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
    const signedRecord: OutcomeRecord = { ...recordBase, signature };

    // 3. Update the chaining hash (The next record will point to this one's signature hash)
    this.lastRecordHash = crypto.createHash('sha256').update(signature).digest('hex');

    try {
      // 4. Save to storage (Logic for append-only should be enforced at DB level)
      await this.saveRecordToImmutableStorage(signedRecord);
      
      // 5. Broadcast for real-time Pulse updates
      emitter.emit('newPulse', signedRecord);
      
      return signedRecord;
    } catch (error) {
      logger.error('Failed to create outcome record:', error);
      throw error;
    }
  }

  /**
   * Verify the integrity of a record by checking its signature and chain
   */
  verifyRecordIntegrity(record: OutcomeRecord, expectedPreviousHash: string): boolean {
    // Check signature
    const recordBase = { ...record };
    delete (recordBase as any).signature;
    const recalculatedSignature = this.signRecord(recordBase);
    
    if (recalculatedSignature !== record.signature) return false;

    // Check chain link
    if (record.previousHash !== expectedPreviousHash) return false;

    return true;
  }

  /**
   * Generate a compact Proof Clip for social sharing
   */
  async generateProofClip(record: OutcomeRecord): Promise<ProofClip> {
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

  private signRecord(record: any): string {
    const data = JSON.stringify(record);
    return crypto
      .createHmac('sha256', config.API_SECRET || 'k9-secret-fallback')
      .update(data)
      .digest('hex');
  }

  private getValueTier(value: number): OutcomeRecord['valueTier'] {
    if (value < 500) return '$0-500';
    if (value < 2000) return '$500-2k';
    if (value < 10000) return '$2k-10k';
    return '$10k+';
  }

  private async saveRecordToImmutableStorage(record: OutcomeRecord) {
    logger.info(`Saving immutable record: ${record.id}`);
    // This is where append-only DB logic (e.g., Supabase RLS) would be applied
  }

  private generateOGCard(record: OutcomeRecord): string {
    return `https://k9.work/api/og/proof/${record.id}`;
  }
}

export const proofService = new ProofService();
