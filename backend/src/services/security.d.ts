import type { SecurityAnalysis } from '../types/index.js';
/**
 * Check token safety via GoPlus Security API
 * @param address Contract address
 * @param chain Chain ID (GoPlus format)
 */
export declare const checkGoPlus: (address: string, chainId: string) => Promise<any>;
/**
 * Check if a token is a honeypot via Honeypot.is API
 * @param address Contract address
 * @param chain Chain ID
 */
export declare const checkHoneypot: (address: string, chain: string) => Promise<any>;
export declare const analyzeContract: (address: string, chain: string) => Promise<SecurityAnalysis>;
//# sourceMappingURL=security.d.ts.map