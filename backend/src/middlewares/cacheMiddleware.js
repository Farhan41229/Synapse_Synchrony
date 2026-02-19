// backend/src/middlewares/cacheMiddleware.js
// Redis response caching middleware for Synapse Synchrony API routes

import { get, set } from '../conn/Bothap/adapters/redisAdapter.js';

const DEFAULT_TTL = 300; // 5 minutes

/**
 * Cache GET responses in Redis.
 * Cache key is derived from the full URL + optional user-scoping.
 *
 * @param {number} [ttl] - cache TTL in seconds
 * @param {object} [opts]
 * @param {boolean} [opts.userScoped] - include userId in the cache key
 * @param {Function} [opts.keyFn] - custom fn(req) => string
 */
export const cacheResponse = (ttl = DEFAULT_TTL, opts = {}) => async (req, res, next) => {
    if (req.method !== 'GET') return next();

    let cacheKey;
    if (opts.keyFn) {
        cacheKey = opts.keyFn(req);
    } else {
        const userId = opts.userScoped ? req.user?._id?.toString() ?? 'anon' : '';
        const queryStr = new URLSearchParams(req.query).toString();
        cacheKey = `cache:${userId}:${req.path}${queryStr ? `:${queryStr}` : ''}`;
    }

    try {
        const cached = await get(cacheKey);
        if (cached) {
            res.set('X-Cache', 'HIT');
            return res.status(200).json(cached);
        }
    } catch {
        // Cache miss or Redis error — continue without cache
    }

    // Intercept res.json to store the response
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
        if (res.statusCode === 200) {
            try {
                await set(cacheKey, body, ttl);
            } catch {
                // Silently ignore cache write errors
            }
        }
        res.set('X-Cache', 'MISS');
        return originalJson(body);
    };

    next();
};

/**
 * Invalidate cache keys matching a pattern.
 * Use this in mutation handlers (POST/PUT/DELETE) to bust stale caches.
 *
 * @param {...string} keys - exact cache keys or prefixes to delete
 */
export const invalidateCache = (...keys) => async (_req, _res, next) => {
    const { del } = await import('../conn/Bothap/adapters/redisAdapter.js');
    for (const key of keys) {
        try {
            await del(key);
        } catch {
            // Ignore errors
        }
    }
    next();
};

/**
 * Middleware: add standard cache-control headers.
 * @param {number} [maxAgeSeconds]
 */
export const setCacheHeaders = (maxAgeSeconds = 60) => (_req, res, next) => {
    res.set('Cache-Control', `public, max-age=${maxAgeSeconds}`);
    next();
};

/**
 * Middleware: set no-cache headers (for sensitive/private data).
 */
export const noCache = (_req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
};

export default { cacheResponse, invalidateCache, setCacheHeaders, noCache };
