// validators/aiValidator.js
// Validation for AI feature inputs: chat, summarisation, image-to-text

import { z } from 'zod';
import { validateBody } from './authValidator.js';

export const aiChatMessageSchema = z.object({
    message: z
        .string({ required_error: 'Message is required.' })
        .min(1, 'Message cannot be empty.')
        .max(2000, 'Message must not exceed 2000 characters.'),
    chatId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid chat ID.'),
});

export const summariseRequestSchema = z.object({
    resourceId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid resource ID.'),
    type: z.enum(['blog', 'event', 'note'], { required_error: 'Resource type is required.' }),
});

export const imageToTextSchema = z.object({
    imageUrl: z.string().url('Invalid image URL.').optional(),
    // image buffer / base64 comes via multer, not validated here
    language: z.string().length(2, 'Language must be a 2-letter ISO 639-1 code.').default('en'),
});

export const diagnosisRequestSchema = z.object({
    symptoms: z
        .array(z.string().trim().min(2).max(80))
        .min(1, 'At least one symptom is required.')
        .max(15, 'Maximum 15 symptoms allowed.'),
    context: z.string().max(500).optional(),
});

export const aiChatMiddleware = validateBody(aiChatMessageSchema);
export const summariseMiddleware = validateBody(summariseRequestSchema);
export const diagnosisRequestMiddleware = validateBody(diagnosisRequestSchema);

export default {
    aiChatMessageSchema,
    summariseRequestSchema,
    imageToTextSchema,
    diagnosisRequestSchema,
    aiChatMiddleware,
    summariseMiddleware,
    diagnosisRequestMiddleware,
};
