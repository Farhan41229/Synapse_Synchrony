// validators/eventValidator.js
// Validation schemas for event management

import { z } from 'zod';
import { validateBody } from './authValidator.js';

export const createEventSchema = z.object({
    title: z
        .string({ required_error: 'Event title is required.' })
        .min(5, 'Title must be at least 5 characters.')
        .max(120, 'Title must not exceed 120 characters.')
        .trim(),
    description: z
        .string({ required_error: 'Description is required.' })
        .min(20, 'Description must be at least 20 characters.'),
    location: z
        .string({ required_error: 'Location is required.' })
        .min(3, 'Location must be at least 3 characters.'),
    startDate: z
        .string({ required_error: 'Start date is required.' })
        .datetime({ message: 'Invalid start date format. Please use ISO 8601.' }),
    endDate: z
        .string({ required_error: 'End date is required.' })
        .datetime({ message: 'Invalid end date format. Please use ISO 8601.' }),
    capacity: z.number().int().positive('Capacity must be a positive integer.').optional(),
    eventType: z.enum(['Workshop', 'Seminar', 'Hackathon', 'Social', 'Sports', 'Other']),
    isOnline: z.boolean().default(false),
    image: z.string().url('Invalid image URL.').optional().or(z.literal('')),
}).refine(
    (data) => new Date(data.endDate) > new Date(data.startDate),
    { message: 'End date must be after start date.', path: ['endDate'] }
);

export const updateEventSchema = createEventSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be updated.' }
);

export const eventIdParamSchema = z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid event ID format.'),
});

export const eventQuerySchema = z.object({
    q: z.string().trim().optional(),
    eventType: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
    upcoming: z.coerce.boolean().optional(),
});

export const createEventMiddleware = validateBody(createEventSchema);
export const updateEventMiddleware = validateBody(updateEventSchema);

export default {
    createEventSchema,
    updateEventSchema,
    eventIdParamSchema,
    eventQuerySchema,
    createEventMiddleware,
    updateEventMiddleware,
};
