import type { Signal } from '../types/index.js';
declare class SignalEngine {
    private isScanning;
    private opportunityWorker;
    private filterService;
    private matchingService;
    /**
     * Verify if a URL is alive before surfacing it.
     */
    private verifyLink;
    runScan(): Promise<Signal[] | undefined>;
    analyzeSecurityRisk(address: string, chain: string): Promise<import("../types/index.js").SecurityAnalysis>;
    generateDailyDigest(): Promise<string>;
    private deduplicate;
}
export declare const signalEngine: SignalEngine;
export {};
//# sourceMappingURL=signalEngine.d.ts.map