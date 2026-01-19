// validators/wellnessValidator.js
// Validation for mood tracking, stress logging, and wellness suggestions

import { z } from 'zod';
import { validateBody } from './authValidator.js';

export const moodLogSchema = z.object({
    mood: z.enum(['very_happy', 'happy', 'neutral', 'sad', 'very_sad'], {
        required_error: 'Mood value is required.',
    }),
    note: z.string().max(500, 'Note must not exceed 500 characters.').optional(),
    energy: z.number().int().min(1).max(10).optional(),
    loggedAt: z.string().datetime().optional(),
});

export const stressLogSchema = z.object({
    stressLevel: z
        .number({ required_error: 'Stress level is required.' })
        .int()
        .min(1, 'Stress level must be between 1 and 10.')
        .max(10, 'Stress level must be between 1 and 10.'),
    triggers: z.array(z.string().trim().max(60)).max(5).default([]),
    note: z.string().max(500, 'Note must not exceed 500 characters.').optional(),
    loggedAt: z.string().datetime().optional(),
});

export const wellnessGoalSchema = z.object({
    goal: z
        .string({ required_error: 'Goal text is required.' })
        .min(5, 'Goal must be at least 5 characters.')
        .max(200, 'Goal must not exceed 200 characters.'),
    category: z.enum(['mental', 'physical', 'social', 'academic', 'other']).default('mental'),
    targetDate: z.string().datetime().optional(),
    isCompleted: z.boolean().default(false),
});

export const moodLogMiddleware = validateBody(moodLogSchema);
export const stressLogMiddleware = validateBody(stressLogSchema);
export const wellnessGoalMiddleware = validateBody(wellnessGoalSchema);

export default {
    moodLogSchema,
    stressLogSchema,
    wellnessGoalSchema,
    moodLogMiddleware,
    stressLogMiddleware,
    wellnessGoalMiddleware,
};
