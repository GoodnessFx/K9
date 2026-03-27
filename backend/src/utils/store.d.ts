import type { Signal } from '../types/index.js';
/**
 * A simple in-memory store that provides a Redis-like interface.
 * This can be swapped for a real Redis client later.
 */
declare class MemoryStore {
    private store;
    private ttls;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
    delete(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    getSignals(): Promise<Signal[]>;
    setSignals(signals: Signal[]): Promise<void>;
    getStats(): Promise<{
        totalSignals: number;
    }>;
}
export declare const store: MemoryStore;
export {};
//# sourceMappingURL=store.d.ts.map