// validators/profileValidator.js
// User profile update validation schemas

import { z } from 'zod';
import { validateBody } from './authValidator.js';

export const updateProfileSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters.')
        .max(50, 'Name must not exceed 50 characters.')
        .trim()
        .optional(),
    bio: z
        .string()
        .max(300, 'Bio must not exceed 300 characters.')
        .trim()
        .optional(),
    avatar: z.string().url('Invalid avatar URL.').optional().or(z.literal('')),
    phone: z
        .string()
        .regex(/^\+?[0-9\s\-().]{7,20}$/, 'Invalid phone number format.')
        .optional()
        .or(z.literal('')),
    website: z.string().url('Invalid website URL.').optional().or(z.literal('')),
    location: z.string().max(100, 'Location too long.').optional(),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
    dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format.')
        .refine((d) => !isNaN(Date.parse(d)), 'Invalid date of birth.')
        .optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided.' }
);

export const socialLinksSchema = z.object({
    github: z.string().url('Invalid GitHub URL.').optional().or(z.literal('')),
    linkedin: z.string().url('Invalid LinkedIn URL.').optional().or(z.literal('')),
    twitter: z.string().url('Invalid Twitter URL.').optional().or(z.literal('')),
    instagram: z.string().url('Invalid Instagram URL.').optional().or(z.literal('')),
});

export const privacySettingsSchema = z.object({
    showEmail: z.boolean().optional(),
    showPhone: z.boolean().optional(),
    allowFriendRequests: z.boolean().optional(),
    allowMessages: z.enum(['everyone', 'friends', 'none']).optional(),
});

export const updateProfileMiddleware = validateBody(updateProfileSchema);
export const socialLinksMiddleware = validateBody(socialLinksSchema);

export default {
    updateProfileSchema,
    socialLinksSchema,
    privacySettingsSchema,
    updateProfileMiddleware,
    socialLinksMiddleware,
};
