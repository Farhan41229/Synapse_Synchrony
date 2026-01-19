// validators/authValidator.js
// Validation schemas and helpers for authentication routes

import { z } from 'zod';

// ─── Schemas ───────────────────────────────────────────────────────────────

export const registerSchema = z.object({
    name: z
        .string({ required_error: 'Name is required.' })
        .min(2, 'Name must be at least 2 characters.')
        .max(50, 'Name must not exceed 50 characters.')
        .trim(),
    email: z
        .string({ required_error: 'Email is required.' })
        .email('Invalid email address.')
        .toLowerCase(),
    password: z
        .string({ required_error: 'Password is required.' })
        .min(8, 'Password must be at least 8 characters.')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
        .regex(/[0-9]/, 'Password must contain at least one digit.'),
    role: z.enum(['user', 'admin']).default('user'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address.').toLowerCase(),
    password: z.string().min(1, 'Password is required.'),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address.').toLowerCase(),
});

export const resetPasswordSchema = z
    .object({
        token: z.string().min(1, 'Reset token is required.'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters.')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
            .regex(/[0-9]/, 'Password must contain at least one digit.'),
        confirmPassword: z.string().min(1, 'Please confirm your password.'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required.'),
        newPassword: z
            .string()
            .min(8, 'New password must be at least 8 characters.')
            .regex(/[A-Z]/, 'Must contain at least one uppercase letter.')
            .regex(/[0-9]/, 'Must contain at least one digit.'),
        confirmNewPassword: z.string().min(1, 'Please confirm your new password.'),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'Passwords do not match.',
        path: ['confirmNewPassword'],
    });

// ─── Middleware factory ────────────────────────────────────────────────────

/**
 * Creates an Express middleware that validates req.body against a Zod schema.
 * @param {z.ZodSchema} schema
 */
export const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    }
    req.body = result.data;
    next();
};

export default {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    validateBody,
};
