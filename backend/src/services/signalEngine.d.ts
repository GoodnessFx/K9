import type { Signal } from '../types/index.js';
declare class SignalEngine {
    private isScanning;
    runScan(): Promise<Signal[] | undefined>;
    analyzeSecurityRisk(address: string, chain: string): Promise<any>;
    generateDailyDigest(): Promise<any>;
    private deduplicate;
}
export declare const signalEngine: SignalEngine;
export {};
//# sourceMappingURL=signalEngine.d.ts.map