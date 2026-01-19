// validators/tokenValidator.js
// Token and OTP validation schemas and helpers

import { z } from 'zod';

export const tokenParamSchema = z.object({
    token: z
        .string({ required_error: 'Token is required.' })
        .min(32, 'Invalid token format.')
        .max(128, 'Token too long.'),
});

export const refreshTokenBodySchema = z.object({
    refreshToken: z
        .string({ required_error: 'Refresh token is required.' })
        .min(32, 'Invalid refresh token.'),
});

export const otpVerifySchema = z.object({
    email: z.string().email('Invalid email address.').toLowerCase(),
    otp: z
        .string({ required_error: 'OTP is required.' })
        .length(6, 'OTP must be exactly 6 digits.')
        .regex(/^\d{6}$/, 'OTP must be a 6-digit number.'),
});

export const verifyEmailTokenSchema = z.object({
    token: z.string().min(32, 'Invalid verification token.'),
    userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user ID.'),
});

/**
 * Middleware: validate token in URL params.
 */
export const validateTokenParam = (req, res, next) => {
    const result = tokenParamSchema.safeParse(req.params);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    }
    next();
};

/**
 * Middleware: validate OTP body.
 */
export const validateOtp = (req, res, next) => {
    const result = otpVerifySchema.safeParse(req.body);
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
    tokenParamSchema,
    refreshTokenBodySchema,
    otpVerifySchema,
    verifyEmailTokenSchema,
    validateTokenParam,
    validateOtp,
};
