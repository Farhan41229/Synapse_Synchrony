// adapters/rateLimiterAdapter.js
// In-memory token-bucket rate limiter for Synapse Synchrony API routes

const buckets = new Map();

/**
 * Check and consume one token from a rate limit bucket.
 *
 * @param {string} key - unique identifier (e.g. IP + route)
 * @param {object} opts
 * @param {number} opts.maxRequests - max tokens in bucket
 * @param {number} opts.windowMs   - refill window in milliseconds
 * @returns {{ allowed: boolean, remaining: number, retryAfterMs: number }}
 */
export const checkLimit = (key, { maxRequests = 60, windowMs = 60_000 } = {}) => {
    const now = Date.now();
    let bucket = buckets.get(key);

    if (!bucket || now >= bucket.resetAt) {
        bucket = {
            tokens: maxRequests,
            resetAt: now + windowMs,
        };
    }

    if (bucket.tokens > 0) {
        bucket.tokens -= 1;
        buckets.set(key, bucket);
        return { allowed: true, remaining: bucket.tokens, retryAfterMs: 0 };
    }

    buckets.set(key, bucket);
    return {
        allowed: false,
        remaining: 0,
        retryAfterMs: bucket.resetAt - now,
    };
};

/**
 * Express middleware factory: applies rate limiting to a route.
 * @param {object} opts
 * @param {number} [opts.maxRequests]
 * @param {number} [opts.windowMs]
 * @param {string} [opts.keyPrefix]
 */
export const rateLimitMiddleware = (opts = {}) => (req, res, next) => {
    const ip = req.ip ?? req.socket?.remoteAddress ?? 'unknown';
    const prefix = opts.keyPrefix ?? req.path;
    const key = `${prefix}:${ip}`;

    const result = checkLimit(key, opts);

    res.set('X-RateLimit-Limit', opts.maxRequests ?? 60);
    res.set('X-RateLimit-Remaining', result.remaining);

    if (!result.allowed) {
        return res.status(429).json({
            success: false,
            message: 'Too many requests. Please try again later.',
            retryAfterMs: result.retryAfterMs,
        });
    }

    next();
};

/**
 * Clear all stored rate limit buckets (useful for tests).
 */
export const clearAllBuckets = () => buckets.clear();

export default { checkLimit, rateLimitMiddleware, clearAllBuckets };
