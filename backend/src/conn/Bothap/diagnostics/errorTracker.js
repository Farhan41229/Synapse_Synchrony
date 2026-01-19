// diagnostics/errorTracker.js
// Centralised error capture, categorisation, and reporting

const errorLog = [];
const MAX_LOG_SIZE = 500;

/**
 * Categorise an error into a known type.
 * @param {Error} err
 */
export const categoriseError = (err) => {
    if (err.name === 'ValidationError') return 'VALIDATION';
    if (err.name === 'CastError') return 'INVALID_ID';
    if (err.name === 'MongoServerError' && err.code === 11000) return 'DUPLICATE_KEY';
    if (err.name === 'JsonWebTokenError') return 'AUTH_TOKEN';
    if (err.name === 'TokenExpiredError') return 'TOKEN_EXPIRED';
    if (err.message?.includes('timeout')) return 'TIMEOUT';
    if (err.message?.includes('ECONNREFUSED')) return 'CONNECTION_REFUSED';
    return 'UNKNOWN';
};

/**
 * Extract a clean message from a Mongoose ValidationError.
 * @param {object} validationError
 * @returns {string[]}
 */
export const extractMongoosValidationMessages = (validationError) => {
    return Object.values(validationError.errors ?? {}).map((e) => e.message);
};

/**
 * Record an error event in the in-memory log.
 * @param {Error} err
 * @param {string} [context] - e.g. route or service name
 * @param {object} [meta]
 */
export const trackError = (err, context = 'Unknown', meta = {}) => {
    const entry = {
        category: categoriseError(err),
        message: err.message,
        context,
        meta,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        timestamp: new Date().toISOString(),
    };

    errorLog.unshift(entry);
    if (errorLog.length > MAX_LOG_SIZE) errorLog.pop();

    // In production you'd forward to Sentry/Datadog etc. here
};

/**
 * Get the recent error log.
 * @param {number} [limit]
 */
export const getErrorLog = (limit = 50) => errorLog.slice(0, limit);

/**
 * Express global error handler middleware.
 * Must be registered last in the middleware chain.
 */
export const globalErrorHandler = (err, req, res, _next) => {
    const category = categoriseError(err);
    trackError(err, req.path, { method: req.method, body: req.body });

    const statusMap = {
        VALIDATION: 400,
        INVALID_ID: 400,
        DUPLICATE_KEY: 409,
        AUTH_TOKEN: 401,
        TOKEN_EXPIRED: 401,
        TIMEOUT: 504,
        CONNECTION_REFUSED: 503,
        UNKNOWN: 500,
    };

    const status = statusMap[category] ?? 500;

    const message =
        category === 'VALIDATION'
            ? extractMongoosValidationMessages(err).join(' | ') || err.message
            : err.message ?? 'An unexpected error occurred.';

    res.status(status).json({
        success: false,
        message,
        code: category,
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    });
};

export default {
    categoriseError,
    extractMongoosValidationMessages,
    trackError,
    getErrorLog,
    globalErrorHandler,
};
