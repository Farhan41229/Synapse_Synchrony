// validators/blogValidator.js
// Validation schemas for blog CRUD operations in Synapse Synchrony

import { z } from 'zod';
import { validateBody } from './authValidator.js';

export const createBlogSchema = z.object({
    title: z
        .string({ required_error: 'Blog title is required.' })
        .min(5, 'Title must be at least 5 characters.')
        .max(150, 'Title must not exceed 150 characters.')
        .trim(),
    content: z
        .string({ required_error: 'Content is required.' })
        .min(50, 'Content must be at least 50 characters.'),
    category: z.string({ required_error: 'Category is required.' }).trim(),
    tags: z.array(z.string().trim()).max(10, 'Maximum 10 tags allowed.').default([]),
    isPublished: z.boolean().default(false),
    image: z.string().url('Invalid image URL.').optional().or(z.literal('')),
});

export const updateBlogSchema = createBlogSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be updated.' }
);

export const blogIdParamSchema = z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid blog ID format.'),
});

export const blogSearchQuerySchema = z.object({
    q: z.string().trim().optional(),
    category: z.string().trim().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
    sort: z.enum(['newest', 'oldest', 'popular']).default('newest'),
});

/**
 * Middleware: validate query params for blog search.
 */
export const validateBlogQuery = (req, res, next) => {
    const result = blogSearchQuerySchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    }
    req.query = result.data;
    next();
};

export const createBlogMiddleware = validateBody(createBlogSchema);
export const updateBlogMiddleware = validateBody(updateBlogSchema);

export default {
    createBlogSchema,
    updateBlogSchema,
    blogIdParamSchema,
    blogSearchQuerySchema,
    validateBlogQuery,
    createBlogMiddleware,
    updateBlogMiddleware,
};
