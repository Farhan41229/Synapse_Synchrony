// transformers/responseTransformer.js
// Standardise API HTTP response envelopes for Synapse Synchrony

/**
 * Build a successful response envelope.
 * @param {*} data
 * @param {string} [message]
 * @param {object} [meta] - pagination or extra metadata
 */
export const successResponse = (data = null, message = 'Success', meta = null) => ({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
});

/**
 * Build an error response envelope.
 * @param {string} message
 * @param {object} [errors] - field-level errors
 * @param {string} [code] - application-level error code
 */
export const errorResponse = (message = 'An error occurred.', errors = null, code = null) => ({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(code ? { code } : {}),
});

/**
 * Express middleware: attach helper methods to res.
 * res.success(data, message, meta)
 * res.fail(message, errors, code)
 */
export const responseHelpers = (_req, res, next) => {
    res.success = (data, message = 'Success', meta = null, statusCode = 200) =>
        res.status(statusCode).json(successResponse(data, message, meta));

    res.fail = (message = 'Error', errors = null, code = null, statusCode = 400) =>
        res.status(statusCode).json(errorResponse(message, errors, code));

    next();
};

/**
 * Build a paginated success envelope.
 * @param {Array} data
 * @param {number} total
 * @param {number} page
 * @param {number} limit
 * @param {string} [message]
 */
export const paginatedSuccess = (data, total, page, limit, message = 'Success') =>
    successResponse(data, message, {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
    });

/**
 * 404 Not Found helper.
 * @param {string} resource
 */
export const notFoundResponse = (resource = 'Resource') =>
    errorResponse(`${resource} not found.`, null, 'NOT_FOUND');

export default {
    successResponse,
    errorResponse,
    responseHelpers,
    paginatedSuccess,
    notFoundResponse,
};
