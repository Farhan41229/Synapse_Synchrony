// cache/cacheManager.js
// In-memory cache manager using a Map with TTL support

/**
 * Simple TTL-based in-memory cache for API responses and frequent DB reads.
 * Suitable for lightweight caching; replace with Redis for production scale.
 */
class CacheManager {
    constructor() {
        this.store = new Map();
        this.timers = new Map();
        this.stats = { hits: 0, misses: 0, sets: 0, deletes: 0 };

        // Run cleanup every 5 minutes to evict expired entries
        this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }

    /**
     * Stores a value with an optional TTL in seconds.
     * @param {string} key
     * @param {any} value
     * @param {number} ttlSeconds - Default: 300 (5 minutes)
     */
    set(key, value, ttlSeconds = 300) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }

        const expiresAt = Date.now() + ttlSeconds * 1000;
        this.store.set(key, { value, expiresAt });

        // Auto-delete after TTL
        const timer = setTimeout(() => {
            this.delete(key);
        }, ttlSeconds * 1000);

        this.timers.set(key, timer);
        this.stats.sets++;
    }

    /**
     * Retrieves a value by key. Returns null if expired or not found.
     * @param {string} key
     * @returns {any|null}
     */
    get(key) {
        const entry = this.store.get(key);

        if (!entry) {
            this.stats.misses++;
            return null;
        }

        if (Date.now() > entry.expiresAt) {
            this.delete(key);
            this.stats.misses++;
            return null;
        }

        this.stats.hits++;
        return entry.value;
    }

    /**
     * Deletes a key from the cache.
     * @param {string} key
     */
    delete(key) {
        this.store.delete(key);
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }
        this.stats.deletes++;
    }

    /**
     * Checks if a key exists and is not expired.
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Gets value if cached, otherwise calls fetchFn and caches result.
     * @param {string} key
     * @param {Function} fetchFn - Async function to fetch the value
     * @param {number} ttlSeconds
     * @returns {Promise<any>}
     */
    async getOrSet(key, fetchFn, ttlSeconds = 300) {
        const cached = this.get(key);
        if (cached !== null) return cached;

        const value = await fetchFn();
        this.set(key, value, ttlSeconds);
        return value;
    }

    /**
     * Invalidates all keys matching a prefix.
     * @param {string} prefix
     */
    invalidateByPrefix(prefix) {
        for (const key of this.store.keys()) {
            if (key.startsWith(prefix)) {
                this.delete(key);
            }
        }
    }

    /**
     * Removes all expired entries from the store.
     */
    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.store.entries()) {
            if (now > entry.expiresAt) {
                this.delete(key);
            }
        }
    }

    /**
     * Clears the entire cache.
     */
    clear() {
        for (const key of this.store.keys()) {
            this.delete(key);
        }
    }

    /**
     * Returns cache statistics.
     */
    getStats() {
        return {
            ...this.stats,
            size: this.store.size,
            hitRate: this.stats.hits + this.stats.misses > 0
                ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2) + '%'
                : '0%',
        };
    }

    /**
     * Destructor: clears all timers and intervals.
     */
    destroy() {
        clearInterval(this.cleanupInterval);
        for (const timer of this.timers.values()) {
            clearTimeout(timer);
        }
        this.store.clear();
        this.timers.clear();
    }
}

// Export a singleton instance
export const cache = new CacheManager();

export default cache;
