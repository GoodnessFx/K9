/**
 * @file SecurityService.ts
 * @description Authentication (EIP-712) and Encryption utilities.
 * Part of the K9 Security module.
 */
export declare class SecurityService {
    private encryptionKey;
    constructor();
    /**
     * Verify EIP-712 Signature for Wallet Authentication
     */
    verifyWalletSignature(address: string, signature: string, message: any): boolean;
    /**
     * Encrypt verification documents at rest
     */
    encryptDocument(content: string): string;
    /**
     * Decrypt verification documents
     */
    decryptDocument(encryptedContent: string): string;
}
//# sourceMappingURL=securityService.d.ts.map