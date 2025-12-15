// serviceMonitor/errorTracker.js
// Centralized error tracking and reporting for Synapse Synchrony

const errorLog = []; // In-memory log; replace with DB or external service in production
const MAX_LOG_SIZE = 500;

/**
 * Error severity levels.
 */
export const ERROR_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
};

/**
 * Logs an error to the in-memory store.
 * @param {Error|string} error
 * @param {object} context - Additional context (userId, endpoint, etc.)
 * @param {string} severity
 */
export const trackError = (error, context = {}, severity = ERROR_SEVERITY.MEDIUM) => {
    const entry = {
        id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : null,
        severity,
        context,
        timestamp: new Date().toISOString(),
    };

    errorLog.push(entry);

    // Keep log size bounded
    if (errorLog.length > MAX_LOG_SIZE) {
        errorLog.shift();
    }

    const logFn = severity === ERROR_SEVERITY.CRITICAL ? console.error : console.warn;
    logFn(`[ErrorTracker][${severity.toUpperCase()}] ${entry.message}`, context);

    return entry.id;
};

/**
 * Returns recent errors, optionally filtered by severity.
 * @param {number} limit
 * @param {string|null} severity
 * @returns {Array}
 */
export const getRecentErrors = (limit = 50, severity = null) => {
    let filtered = errorLog;
    if (severity) {
        filtered = errorLog.filter((e) => e.severity === severity);
    }
    return filtered.slice(-limit).reverse(); // Most recent first
};

/**
 * Clears the error log.
 */
export const clearErrorLog = () => {
    errorLog.length = 0;
    console.log('[ErrorTracker] Error log cleared.');
};

/**
 * Returns error statistics.
 */
export const getErrorStats = () => {
    const stats = { total: errorLog.length };
    for (const level of Object.values(ERROR_SEVERITY)) {
        stats[level] = errorLog.filter((e) => e.severity === level).length;
    }
    return stats;
};

/**
 * Express global error handler middleware.
 * Must be registered last in the middleware chain.
 */
export const globalErrorMiddleware = (err, req, res, next) => {
    const severity =
        err.status >= 500 ? ERROR_SEVERITY.HIGH : ERROR_SEVERITY.MEDIUM;

    trackError(err, {
        method: req.method,
        url: req.originalUrl,
        userId: req.userId,
        ip: req.ip,
    }, severity);

    const status = err.status || 500;
    const message = status === 500 ? 'Internal Server Error' : err.message;

    res.status(status).json({ success: false, message, error: process.env.NODE_ENV === 'development' ? err.stack : undefined });
};

export default { trackError, getRecentErrors, clearErrorLog, getErrorStats, globalErrorMiddleware, ERROR_SEVERITY };
