// validators/searchValidator.js
// Global search query validation for Synapse Synchrony

import { z } from 'zod';

export const globalSearchSchema = z.object({
    q: z
        .string({ required_error: 'Search query is required.' })
        .min(1, 'Search query cannot be empty.')
        .max(200, 'Search query too long.')
        .trim(),
    type: z
        .enum(['all', 'blogs', 'events', 'users', 'notes'])
        .default('all'),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(30).default(10),
});

/**
 * Middleware: validate global search query params.
 */
export const validateSearchQuery = (req, res, next) => {
    const result = globalSearchSchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    }
    req.query = result.data;
    next();
};

export const userSearchSchema = z.object({
    q: z.string().trim().min(1).max(100),
    excludeSelf: z.coerce.boolean().default(true),
    limit: z.coerce.number().int().positive().max(20).default(10),
});

export const validateUserSearch = (req, res, next) => {
    const result = userSearchSchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    }
    req.query = result.data;
    next();
};

export default { globalSearchSchema, validateSearchQuery, userSearchSchema, validateUserSearch };
