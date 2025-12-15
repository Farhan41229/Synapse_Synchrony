// cache/queryCacheMiddleware.js
// Express middleware to cache GET request responses automatically

import cache from './cacheManager.js';
import { TTL } from './cacheKeys.js';

/**
 * Creates an Express middleware that caches JSON responses for GET requests.
 * Bypasses cache for authenticated user-specific routes unless explicitly enabled.
 *
 * @param {object} options
 * @param {number} options.ttl - TTL in seconds (default: TTL.MEDIUM = 300s)
 * @param {Function} options.keyFn - Custom function to generate cache key from req
 * @param {boolean} options.bypassForAuth - Skip cache if user is authenticated (default: false)
 * @returns {Function} Express middleware
 */
export const queryCacheMiddleware = (options = {}) => {
    const { ttl = TTL.MEDIUM, keyFn, bypassForAuth = false } = options;

    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') return next();

        // Optionally bypass for authenticated requests
        if (bypassForAuth && req.userId) return next();

        // Construct cache key
        const cacheKey = keyFn
            ? keyFn(req)
            : `http:${req.originalUrl}:${req.userId || 'anon'}`;

        // Check cache
        const cached = cache.get(cacheKey);
        if (cached) {
            console.log(`[QueryCache] Cache HIT: ${cacheKey}`);
            return res.status(200).json({ ...cached, _cached: true });
        }

        // Override res.json to intercept and cache the response
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if (res.statusCode === 200 && body && !body.error) {
                cache.set(cacheKey, body, ttl);
                console.log(`[QueryCache] Cache SET: ${cacheKey} (TTL: ${ttl}s)`);
            }
            return originalJson(body);
        };

        next();
    };
};

/**
 * Invalidates cache entries for a given prefix when data changes.
 * Use in update/delete controllers.
 * @param {string} prefix - Cache key prefix to invalidate
 */
export const invalidateCacheByPrefix = (prefix) => {
    cache.invalidateByPrefix(prefix);
    console.log(`[QueryCache] Invalidated cache entries with prefix: "${prefix}"`);
};

/**
 * Cache health stats middleware — adds cache info to response headers.
 */
export const cacheStatsHeader = (req, res, next) => {
    const stats = cache.getStats();
    res.setHeader('X-Cache-Size', stats.size);
    res.setHeader('X-Cache-HitRate', stats.hitRate);
    next();
};

export default { queryCacheMiddleware, invalidateCacheByPrefix, cacheStatsHeader };
