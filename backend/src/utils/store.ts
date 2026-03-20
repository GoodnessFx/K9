import type { Signal } from '../types/index.js';

/**
 * A simple in-memory store that provides a Redis-like interface.
 * This can be swapped for a real Redis client later.
 */
class MemoryStore {
  private store: Map<string, any> = new Map();
  private ttls: Map<string, number> = new Map();

  async get<T>(key: string): Promise<T | null> {
    const value = this.store.get(key);
    const ttl = this.ttls.get(key);

    if (ttl && ttl < Date.now()) {
      this.delete(key);
      return null;
    }

    return value ?? null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    this.store.set(key, value);
    if (ttlSeconds) {
      this.ttls.set(key, Date.now() + ttlSeconds * 1000);
    }
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
    this.ttls.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.store.has(key) && (!this.ttls.has(key) || (this.ttls.get(key) || 0) > Date.now());
  }

  // Specialized methods for signals
  async getSignals(): Promise<Signal[]> {
    const signals = await this.get<Signal[]>('signals');
    return signals ?? [];
  }

  async setSignals(signals: Signal[]): Promise<void> {
    await this.set('signals', signals);
  }

  async getStats(): Promise<{ totalSignals: number }> {
    const signals = await this.getSignals();
    return { totalSignals: signals.length };
  }
}

export const store = new MemoryStore();
