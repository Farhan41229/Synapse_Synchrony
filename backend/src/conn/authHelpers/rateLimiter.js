// authHelpers/rateLimiter.js
// Per-IP and per-user request rate limiting for auth endpoints

const ipStore = new Map();    // ip -> { count, windowStart }
const userStore = new Map();  // userId -> { count, windowStart }

const LIMITS = {
    LOGIN: { maxAttempts: 10, windowMs: 15 * 60 * 1000 },    // 10 per 15 minutes
    SIGNUP: { maxAttempts: 5, windowMs: 60 * 60 * 1000 },    // 5 per hour
    FORGOT_PASSWORD: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
    VERIFY_EMAIL: { maxAttempts: 10, windowMs: 60 * 60 * 1000 },
    DEFAULT: { maxAttempts: 30, windowMs: 60 * 1000 },        // 30 per minute
};

/**
 * Checks if an IP address has exceeded the rate limit for a given action.
 * @param {string} ip
 * @param {string} action - One of LIMITS keys
 * @returns {{ allowed: boolean, remaining: number, resetInMs: number }}
 */
export const checkIPRateLimit = (ip, action = 'DEFAULT') => {
    const limit = LIMITS[action] || LIMITS.DEFAULT;
    const key = `${ip}:${action}`;
    const now = Date.now();

    const entry = ipStore.get(key) || { count: 0, windowStart: now };

    if (now - entry.windowStart > limit.windowMs) {
        entry.count = 0;
        entry.windowStart = now;
    }

    entry.count++;
    ipStore.set(key, entry);

    const remaining = Math.max(0, limit.maxAttempts - entry.count);
    const resetInMs = limit.windowMs - (now - entry.windowStart);

    return {
        allowed: entry.count <= limit.maxAttempts,
        remaining,
        resetInMs,
        totalAttempts: entry.count,
    };
};

/**
 * Creates an Express middleware factory for rate limiting auth routes.
 * @param {string} action - Rate limit action from LIMITS keys
 */
export const authRateLimitMiddleware = (action = 'DEFAULT') => {
    return (req, res, next) => {
        const ip = req.ip || req.connection?.remoteAddress || 'unknown';
        const result = checkIPRateLimit(ip, action);

        res.setHeader('X-RateLimit-Limit', LIMITS[action]?.maxAttempts || LIMITS.DEFAULT.maxAttempts);
        res.setHeader('X-RateLimit-Remaining', result.remaining);
        res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetInMs / 1000));

        if (!result.allowed) {
            console.warn(`[RateLimiter] IP ${ip} exceeded limit for action: ${action}`);
            return res.status(429).json({
                success: false,
                message: `Too many attempts. Please try again in ${Math.ceil(result.resetInMs / 60000)} minute(s).`,
                retryAfterSeconds: Math.ceil(result.resetInMs / 1000),
            });
        }

        next();
    };
};

/**
 * Clears the rate limit for a specific IP and action (e.g., after successful auth).
 * @param {string} ip
 * @param {string} action
 */
export const clearRateLimit = (ip, action) => {
    ipStore.delete(`${ip}:${action}`);
};

export default { checkIPRateLimit, authRateLimitMiddleware, clearRateLimit };
