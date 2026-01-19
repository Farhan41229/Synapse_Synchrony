// validators/noteValidator.js
// Validation schemas for the Notes feature

import { z } from 'zod';
import { validateBody } from './authValidator.js';

export const createNoteSchema = z.object({
    title: z
        .string({ required_error: 'Note title is required.' })
        .min(1, 'Title cannot be empty.')
        .max(120, 'Title must not exceed 120 characters.')
        .trim(),
    content: z
        .string({ required_error: 'Note content is required.' })
        .min(1, 'Content cannot be empty.'),
    tags: z.array(z.string().trim().max(30)).max(10).default([]),
    color: z
        .string()
        .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Invalid color hex code.')
        .optional(),
    isPinned: z.boolean().default(false),
    isArchived: z.boolean().default(false),
});

export const updateNoteSchema = createNoteSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be updated.' }
);

export const noteQuerySchema = z.object({
    q: z.string().trim().optional(),
    tags: z.string().optional(), // comma-separated
    pinned: z.coerce.boolean().optional(),
    archived: z.coerce.boolean().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export const createNoteMiddleware = validateBody(createNoteSchema);
export const updateNoteMiddleware = validateBody(updateNoteSchema);

export default {
    createNoteSchema,
    updateNoteSchema,
    noteQuerySchema,
    createNoteMiddleware,
    updateNoteMiddleware,
};
