// diagnostics/auditLogger.js
// Persistent audit trail for security-relevant actions in Synapse Synchrony

const auditLog = [];
const MAX_AUDIT_ENTRIES = 1000;

/**
 * Action type constants.
 */
export const AUDIT_ACTIONS = Object.freeze({
    LOGIN: 'AUTH_LOGIN',
    LOGOUT: 'AUTH_LOGOUT',
    REGISTER: 'AUTH_REGISTER',
    PASSWORD_CHANGE: 'AUTH_PASSWORD_CHANGE',
    PASSWORD_RESET: 'AUTH_PASSWORD_RESET',
    BLOG_CREATE: 'BLOG_CREATE',
    BLOG_UPDATE: 'BLOG_UPDATE',
    BLOG_DELETE: 'BLOG_DELETE',
    EVENT_CREATE: 'EVENT_CREATE',
    EVENT_DELETE: 'EVENT_DELETE',
    CHAT_CREATE: 'CHAT_CREATE',
    MESSAGE_DELETE: 'MESSAGE_DELETE',
    PROFILE_UPDATE: 'PROFILE_UPDATE',
    ADMIN_ACTION: 'ADMIN_ACTION',
});

/**
 * Log an audit event.
 * @param {string} action - one of AUDIT_ACTIONS
 * @param {string} [userId]
 * @param {object} [details]
 */
export const logAction = (action, userId = 'anonymous', details = {}) => {
    const entry = {
        action,
        userId,
        details,
        ip: details.ip ?? null,
        userAgent: details.userAgent ?? null,
        timestamp: new Date().toISOString(),
    };

    // Remove ip/userAgent from nested details to avoid duplication
    const { ip, userAgent, ...rest } = details;
    entry.details = rest;

    auditLog.unshift(entry);
    if (auditLog.length > MAX_AUDIT_ENTRIES) auditLog.pop();
};

/**
 * Query the in-memory audit log.
 * @param {{ userId?: string, action?: string, limit?: number }} [filters]
 */
export const queryLog = ({ userId, action, limit = 100 } = {}) => {
    let results = auditLog;
    if (userId) results = results.filter((e) => e.userId === userId);
    if (action) results = results.filter((e) => e.action === action);
    return results.slice(0, limit);
};

/**
 * Express middleware factory: automatically log an action after a route runs.
 * @param {string} action
 */
export const auditMiddleware = (action) => (req, _res, next) => {
    const userId = req.user?._id?.toString() ?? 'anonymous';
    logAction(action, userId, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        params: req.params,
    });
    next();
};

/**
 * Express handler: GET /diagnostics/audit
 */
export const auditHandler = (req, res) => {
    const { userId, action, limit } = req.query;
    const results = queryLog({
        userId,
        action,
        limit: limit ? parseInt(limit, 10) : 100,
    });
    res.status(200).json({ count: results.length, entries: results });
};

/**
 * Clear the audit log (only for tests).
 */
export const clearAuditLog = () => auditLog.splice(0, auditLog.length);

export default {
    AUDIT_ACTIONS,
    logAction,
    queryLog,
    auditMiddleware,
    auditHandler,
    clearAuditLog,
};
