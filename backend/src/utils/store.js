/**
 * A simple in-memory store that provides a Redis-like interface.
 * This can be swapped for a real Redis client later.
 */
class MemoryStore {
    store = new Map();
    ttls = new Map();
    async get(key) {
        const value = this.store.get(key);
        const ttl = this.ttls.get(key);
        if (ttl && ttl < Date.now()) {
            this.delete(key);
            return null;
        }
        return value ?? null;
    }
    async set(key, value, ttlSeconds) {
        this.store.set(key, value);
        if (ttlSeconds) {
            this.ttls.set(key, Date.now() + ttlSeconds * 1000);
        }
    }
    async delete(key) {
        this.store.delete(key);
        this.ttls.delete(key);
    }
    async exists(key) {
        return this.store.has(key) && (!this.ttls.has(key) || (this.ttls.get(key) || 0) > Date.now());
    }
    // Specialized methods for signals
    async getSignals() {
        const signals = await this.get('signals');
        return signals ?? [];
    }
    async setSignals(signals) {
        await this.set('signals', signals);
    }
    async getStats() {
        const signals = await this.getSignals();
        return { totalSignals: signals.length };
    }
}
export const store = new MemoryStore();
//# sourceMappingURL=store.js.map