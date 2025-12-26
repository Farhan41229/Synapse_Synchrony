// aiClients/aiRateLimiter.js
// Per-user rate limiter for AI API calls to prevent abuse and control costs

const userRequestLog = new Map(); // userId -> { count, windowStart, totalTokens }

const RATE_LIMITS = {
    DIAGNOSIS: { maxPerHour: 10, maxPerDay: 30 },
    WELLNESS_TIP: { maxPerHour: 20, maxPerDay: 100 },
    CHAT: { maxPerHour: 30, maxPerDay: 150 },
    SENTIMENT: { maxPerHour: 50, maxPerDay: 200 },
    DEFAULT: { maxPerHour: 15, maxPerDay: 50 },
};

const WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Checks and enforces rate limits for AI requests per user.
 * @param {string} userId
 * @param {string} taskType - Must match AI_TASK keys
 * @returns {{ allowed: boolean, reason?: string, remaining?: number }}
 */
export const checkAIRateLimit = (userId, taskType) => {
    const limits = RATE_LIMITS[taskType.toUpperCase()] || RATE_LIMITS.DEFAULT;
    const key = `${userId}:${taskType}`;
    const now = Date.now();

    if (!userRequestLog.has(key)) {
        userRequestLog.set(key, { count: 0, windowStart: now, dayCount: 0, dayStart: now });
    }

    const entry = userRequestLog.get(key);

    // Reset hourly window if expired
    if (now - entry.windowStart > WINDOW_MS) {
        entry.count = 0;
        entry.windowStart = now;
    }

    // Reset daily window if expired (24 hours)
    if (now - entry.dayStart > 24 * WINDOW_MS) {
        entry.dayCount = 0;
        entry.dayStart = now;
    }

    // Check hourly limit
    if (entry.count >= limits.maxPerHour) {
        return {
            allowed: false,
            reason: `Hourly limit of ${limits.maxPerHour} AI requests reached for ${taskType}. Please wait.`,
            remaining: 0,
            resetInMs: WINDOW_MS - (now - entry.windowStart),
        };
    }

    // Check daily limit
    if (entry.dayCount >= limits.maxPerDay) {
        return {
            allowed: false,
            reason: `Daily limit of ${limits.maxPerDay} AI requests reached for ${taskType}.`,
            remaining: 0,
            resetInMs: 24 * WINDOW_MS - (now - entry.dayStart),
        };
    }

    entry.count++;
    entry.dayCount++;

    return {
        allowed: true,
        remaining: limits.maxPerHour - entry.count,
        dailyRemaining: limits.maxPerDay - entry.dayCount,
    };
};

/**
 * Middleware factory for Express routes that call AI endpoints.
 * @param {string} taskType
 */
export const aiRateLimitMiddleware = (taskType) => {
    return (req, res, next) => {
        const userId = req.userId?.toString();
        if (!userId) return next(); // Let auth middleware handle missing userId

        const result = checkAIRateLimit(userId, taskType);

        if (!result.allowed) {
            return res.status(429).json({
                success: false,
                message: result.reason,
                retryAfterMs: result.resetInMs,
            });
        }

        req.aiRateInfo = { remaining: result.remaining, dailyRemaining: result.dailyRemaining };
        next();
    };
};

/**
 * Returns current usage stats for a user and task type.
 * @param {string} userId
 * @param {string} taskType
 */
export const getUsageStats = (userId, taskType) => {
    const key = `${userId}:${taskType}`;
    const entry = userRequestLog.get(key);
    if (!entry) return { count: 0, dayCount: 0 };
    return { hourlyCount: entry.count, dailyCount: entry.dayCount };
};

export default { checkAIRateLimit, aiRateLimitMiddleware, getUsageStats };
