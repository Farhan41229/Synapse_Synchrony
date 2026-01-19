// validators/adminValidator.js
// Admin-specific validation schemas for Synapse Synchrony management routes

import { z } from 'zod';
import { validateBody } from './authValidator.js';

export const banUserSchema = z.object({
    userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user ID.'),
    reason: z
        .string({ required_error: 'Ban reason is required.' })
        .min(10, 'Please provide a detailed reason (min 10 chars).')
        .max(500, 'Reason must not exceed 500 characters.'),
    durationDays: z.number().int().positive().optional(),
    permanent: z.boolean().default(false),
});

export const updateRoleSchema = z.object({
    userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user ID.'),
    role: z.enum(['user', 'moderator', 'admin'], { required_error: 'Role is required.' }),
});

export const broadcastNotificationSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters.').max(80),
    message: z.string().min(10, 'Message must be at least 10 characters.').max(500),
    audience: z.enum(['all', 'users', 'admins']).default('all'),
    priority: z.enum(['low', 'normal', 'high']).default('normal'),
});

export const adminQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sort: z.enum(['newest', 'oldest', 'name_asc', 'name_desc']).default('newest'),
    role: z.enum(['user', 'moderator', 'admin', 'all']).default('all'),
    status: z.enum(['active', 'banned', 'unverified', 'all']).default('all'),
    q: z.string().trim().optional(),
});

export const banUserMiddleware = validateBody(banUserSchema);
export const updateRoleMiddleware = validateBody(updateRoleSchema);
export const broadcastNotificationMiddleware = validateBody(broadcastNotificationSchema);

export default {
    banUserSchema,
    updateRoleSchema,
    broadcastNotificationSchema,
    adminQuerySchema,
    banUserMiddleware,
    updateRoleMiddleware,
    broadcastNotificationMiddleware,
};
