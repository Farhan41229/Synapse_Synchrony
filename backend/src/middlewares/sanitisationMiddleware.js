// backend/src/middlewares/sanitisationMiddleware.js
// Input sanitisation middleware to prevent XSS and injection attacks

/**
 * Recursively sanitise a value — escapes HTML in strings.
 * @param {*} val
 * @returns {*}
 */
const sanitiseValue = (val) => {
    if (typeof val === 'string') {
        return val
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            .trim();
    }
    if (Array.isArray(val)) return val.map(sanitiseValue);
    if (val !== null && typeof val === 'object') {
        return Object.fromEntries(
            Object.entries(val).map(([k, v]) => [k, sanitiseValue(v)])
        );
    }
    return val;
};

/**
 * Sanitise req.body to prevent XSS.
 * Applies HTML-escaping to all string values in the body.
 */
export const sanitiseBody = (req, _res, next) => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitiseValue(req.body);
    }
    next();
};

/**
 * Sanitise req.query to prevent injection via query params.
 */
export const sanitiseQuery = (req, _res, next) => {
    if (req.query && typeof req.query === 'object') {
        req.query = sanitiseValue(req.query);
    }
    next();
};

/**
 * Sanitise req.params.
 */
export const sanitiseParams = (req, _res, next) => {
    if (req.params && typeof req.params === 'object') {
        req.params = sanitiseValue(req.params);
    }
    next();
};

/**
 * Composite middleware — sanitise body, query, and params.
 */
export const sanitiseAll = (req, res, next) => {
    sanitiseBody(req, res, () => {
        sanitiseQuery(req, res, () => {
            sanitiseParams(req, res, next);
        });
    });
};

/**
 * Strip MongoDB operator injection from query objects.
 * Removes any keys starting with $ or containing dots.
 * @param {object} obj
 */
export const stripMongoOperators = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    const result = {};
    for (const [key, val] of Object.entries(obj)) {
        if (key.startsWith('$') || key.includes('.')) continue;
        result[key] = typeof val === 'object' ? stripMongoOperators(val) : val;
    }
    return result;
};

/**
 * Middleware: strip MongoDB operators from req.body.
 */
export const preventMongoInjection = (req, _res, next) => {
    if (req.body) req.body = stripMongoOperators(req.body);
    next();
};

export default {
    sanitiseBody,
    sanitiseQuery,
    sanitiseParams,
    sanitiseAll,
    preventMongoInjection,
};
