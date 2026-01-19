// validators/diagnosisValidator.js
// Validation schemas for health/diagnosis input in Synapse Medilink

import { z } from 'zod';
import { validateBody } from './authValidator.js';

const SYMPTOM_MAX = 20;

export const symptomInputSchema = z.object({
    symptoms: z
        .array(
            z.string().trim().min(2, 'Symptom too short.').max(80, 'Symptom too long.')
        )
        .min(1, 'At least one symptom is required.')
        .max(SYMPTOM_MAX, `Maximum ${SYMPTOM_MAX} symptoms allowed.`),
    age: z.number().int().min(0).max(130).optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    existingConditions: z.array(z.string().trim().max(80)).max(10).default([]),
    durationDays: z.number().int().min(0).optional(),
    severity: z.enum(['mild', 'moderate', 'severe']).optional(),
});

export const diagnosisHistoryQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
    sort: z.enum(['newest', 'oldest']).default('newest'),
});

export const saveDiagnosisSchema = z.object({
    diagnosisId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid diagnosis ID.').optional(),
    note: z.string().max(300).optional(),
    isFavourite: z.boolean().default(false),
});

export const symptomMiddleware = validateBody(symptomInputSchema);
export const saveDiagnosisMiddleware = validateBody(saveDiagnosisSchema);

export default {
    symptomInputSchema,
    diagnosisHistoryQuerySchema,
    saveDiagnosisSchema,
    symptomMiddleware,
    saveDiagnosisMiddleware,
};
