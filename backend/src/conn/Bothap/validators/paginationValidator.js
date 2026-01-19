// validators/paginationValidator.js
// Generic pagination + sorting query param validator

import { z } from 'zod';

export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z.string().trim().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Parse and validate pagination query params from req.query.
 * Returns defaults if fields are missing.
 * @param {object} query - req.query
 */
export const parsePagination = (query = {}) => {
    const result = paginationSchema.safeParse(query);
    if (!result.success) {
        return { page: 1, limit: 10, sortOrder: 'desc' };
    }
    return result.data;
};

/**
 * Build a Mongoose-compatible sort object.
 * @param {string} [sortBy]
 * @param {'asc'|'desc'} [sortOrder]
 * @returns {object}
 */
export const buildSortObject = (sortBy, sortOrder = 'desc') => {
    if (!sortBy) return { createdAt: sortOrder === 'asc' ? 1 : -1 };
    return { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
};

/**
 * Build a Mongoose-compatible skip/limit object.
 * @param {number} page
 * @param {number} limit
 * @returns {{ skip: number, limit: number }}
 */
export const buildPaginationOptions = (page, limit) => ({
    skip: (page - 1) * limit,
    limit,
});

/**
 * Build a standard paginated response envelope.
 * @param {Array} data
 * @param {number} total
 * @param {number} page
 * @param {number} limit
 */
export const paginatedResponse = (data, total, page, limit) => ({
    data,
    meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
    },
});

export default {
    paginationSchema,
    parsePagination,
    buildSortObject,
    buildPaginationOptions,
    paginatedResponse,
};
