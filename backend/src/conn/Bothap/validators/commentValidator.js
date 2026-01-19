// validators/commentValidator.js
// Validation schemas for blog/event comments

import { z } from 'zod';
import { validateBody } from './authValidator.js';

export const createCommentSchema = z.object({
    content: z
        .string({ required_error: 'Comment content is required.' })
        .min(1, 'Comment cannot be empty.')
        .max(600, 'Comment must not exceed 600 characters.')
        .trim(),
    parentComment: z
        .string()
        .regex(/^[a-f\d]{24}$/i, 'Invalid parent comment ID.')
        .optional(),
});

export const updateCommentSchema = z.object({
    content: z
        .string({ required_error: 'Updated content is required.' })
        .min(1, 'Comment cannot be empty.')
        .max(600, 'Comment must not exceed 600 characters.')
        .trim(),
});

export const reactionSchema = z.object({
    type: z.enum(['like', 'love', 'haha', 'wow', 'sad', 'angry'], {
        required_error: 'Reaction type is required.',
    }),
});

export const createCommentMiddleware = validateBody(createCommentSchema);
export const updateCommentMiddleware = validateBody(updateCommentSchema);
export const reactionMiddleware = validateBody(reactionSchema);

export default {
    createCommentSchema,
    updateCommentSchema,
    reactionSchema,
    createCommentMiddleware,
    updateCommentMiddleware,
    reactionMiddleware,
};
