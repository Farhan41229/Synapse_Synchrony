// adapters/loggerAdapter.js
// Structured logger adapter for Synapse Synchrony backend services

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

const currentLevel =
    LEVELS[process.env.LOG_LEVEL?.toLowerCase()] ?? LEVELS.info;

/**
 * Format a log entry as a structured JSON string.
 */
const format = (level, context, message, meta = {}) => {
    const entry = {
        timestamp: new Date().toISOString(),
        level: level.toUpperCase(),
        context,
        message,
        ...(Object.keys(meta).length > 0 ? { meta } : {}),
    };
    return JSON.stringify(entry);
};

/**
 * Create a named logger scoped to a specific module/service.
 * @param {string} context - e.g. 'MongoClient', 'ChatService'
 */
export const createLogger = (context) => ({
    error: (message, meta = {}) => {
        if (LEVELS.error <= currentLevel)
            console.error(format('error', context, message, meta));
    },
    warn: (message, meta = {}) => {
        if (LEVELS.warn <= currentLevel)
            console.warn(format('warn', context, message, meta));
    },
    info: (message, meta = {}) => {
        if (LEVELS.info <= currentLevel)
            console.info(format('info', context, message, meta));
    },
    debug: (message, meta = {}) => {
        if (LEVELS.debug <= currentLevel)
            console.debug(format('debug', context, message, meta));
    },
});

/**
 * Global application-level logger.
 */
export const logger = createLogger('App');

/**
 * Express request logger middleware.
 */
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        logger.info('HTTP Request', {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${Date.now() - start}ms`,
            ip: req.ip,
        });
    });
    next();
};

export default { createLogger, logger, requestLogger };
