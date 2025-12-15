// serviceMonitor/requestLogger.js
// HTTP request/response logging middleware for the Synapse Synchrony API

/**
 * Log levels.
 */
const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
};

// In-memory request log (bounded)
const requestLog = [];
const MAX_LOG = 1000;

/**
 * Formats a log entry for console output.
 */
const formatLog = ({ method, url, status, durationMs, userId, ip }) => {
    const statusColor = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
    const reset = '\x1b[0m';
    const userTag = userId ? ` | user:${userId}` : '';
    return `${statusColor}[API] ${method} ${url} → ${status} (${durationMs}ms)${reset} | ip:${ip}${userTag}`;
};

/**
 * HTTP request logger middleware.
 * Logs method, URL, status code, response time, and optionally userId.
 */
export const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';

    // Log on response finish
    res.on('finish', () => {
        const durationMs = Date.now() - startTime;
        const entry = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            durationMs,
            userId: req.userId || null,
            ip,
            timestamp: new Date().toISOString(),
            userAgent: req.headers['user-agent']?.substring(0, 100),
        };

        // Store in memory
        requestLog.push(entry);
        if (requestLog.length > MAX_LOG) requestLog.shift();

        // Skip logging for health check endpoints to reduce noise
        if (!req.originalUrl.includes('/health')) {
            const level = res.statusCode >= 500 ? LOG_LEVELS.ERROR :
                res.statusCode >= 400 ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;

            if (level === LOG_LEVELS.ERROR) {
                console.error(formatLog(entry));
            } else if (level === LOG_LEVELS.WARN) {
                console.warn(formatLog(entry));
            } else {
                console.log(formatLog(entry));
            }
        }
    });

    next();
};

/**
 * Returns recent request logs, optionally filtered by status or path.
 * @param {number} limit
 * @param {object} filters - { minStatus, maxStatus, path }
 * @returns {Array}
 */
export const getRecentRequests = (limit = 100, filters = {}) => {
    let filtered = requestLog;

    if (filters.minStatus) filtered = filtered.filter((r) => r.status >= filters.minStatus);
    if (filters.maxStatus) filtered = filtered.filter((r) => r.status <= filters.maxStatus);
    if (filters.path) filtered = filtered.filter((r) => r.url.includes(filters.path));

    return filtered.slice(-limit).reverse();
};

/**
 * Returns aggregate request statistics.
 */
export const getRequestStats = () => {
    const total = requestLog.length;
    const errors = requestLog.filter((r) => r.status >= 500).length;
    const clientErrors = requestLog.filter((r) => r.status >= 400 && r.status < 500).length;
    const avgDuration = total ? requestLog.reduce((sum, r) => sum + r.durationMs, 0) / total : 0;

    return {
        total,
        errors,
        clientErrors,
        successRate: total ? (((total - errors - clientErrors) / total) * 100).toFixed(1) + '%' : '100%',
        avgResponseMs: avgDuration.toFixed(2),
    };
};

export default { requestLogger, getRecentRequests, getRequestStats };
