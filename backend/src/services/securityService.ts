/**
 * @file SecurityService.ts
 * @description Authentication (EIP-712) and Encryption utilities.
 * Part of the K9 Security module.
 */

import sigUtil from 'eth-sig-util';
import * as ethUtil from 'ethereumjs-util';
import crypto from 'crypto';
import logger from '../utils/logger.js';
import { config } from '../config/index.js';

export class SecurityService {
  private encryptionKey: Buffer;

  constructor() {
    this.encryptionKey = crypto.scryptSync(config.API_SECRET, 'salt', 32);
  }

  /**
   * Verify EIP-712 Signature for Wallet Authentication
   */
  verifyWalletSignature(
    address: string,
    signature: string,
    message: any
  ): boolean {
    try {
      const recovered = sigUtil.recoverTypedSignature({
        data: message,
        sig: signature,
      });

      return recovered.toLowerCase() === address.toLowerCase();
    } catch (error) {
      logger.error('EIP-712 signature verification failed:', error);
      return false;
    }
  }

  /**
   * Encrypt verification documents at rest
   */
  encryptDocument(content: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    
    let encrypted = cipher.update(content, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt verification documents
   */
  decryptDocument(encryptedContent: string): string {
    const [ivHex, encryptedHex] = encryptedContent.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
