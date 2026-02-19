// backend/src/middlewares/requestIdMiddleware.js
// Attach a unique request ID to every incoming request

import { randomUUID } from 'crypto';

/**
 * Middleware: generate and attach a unique X-Request-Id header.
 * Check for an existing client-provided request ID first.
 */
export const requestId = (req, res, next) => {
    const existingId = req.headers['x-request-id'];
    const id = existingId && isValidUuid(existingId) ? existingId : randomUUID();

    req.requestId = id;
    res.set('X-Request-Id', id);
    next();
};

/**
 * Validate that a string looks like a UUID v4.
 * @param {string} str
 */
const isValidUuid = (str) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

export default { requestId };
