import type { RawSignal, Signal } from '../types/index.js';
export declare const scoreSignal: (raw: RawSignal) => Promise<Signal | null>;
export declare const generateIntelligenceBrief: (signal: Signal) => Promise<string>;
export declare const generateDailyDigest: (signals: Signal[]) => Promise<string>;
//# sourceMappingURL=scorer.d.ts.map