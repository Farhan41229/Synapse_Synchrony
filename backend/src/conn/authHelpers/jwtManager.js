// authHelpers/jwtManager.js
// JWT token generation, verification, and management utilities

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = process.env.JWT_EXPIRY || '7d';
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '30d';

if (!JWT_SECRET) {
    console.error('[JWTManager] WARNING: JWT_SECRET is not defined. Authentication will not work.');
}

/**
 * Generates a signed JWT access token for a user.
 * @param {string} userId
 * @param {object} extraPayload - Additional fields to include in the token
 * @returns {string}
 */
export const generateAccessToken = (userId, extraPayload = {}) => {
    if (!JWT_SECRET) throw new Error('[JWTManager] JWT_SECRET is not configured.');

    return jwt.sign(
        { userId: userId.toString(), ...extraPayload },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
    );
};

/**
 * Generates a long-lived refresh token.
 * @param {string} userId
 * @returns {string}
 */
export const generateRefreshToken = (userId) => {
    if (!JWT_SECRET) throw new Error('[JWTManager] JWT_SECRET is not configured.');

    return jwt.sign(
        { userId: userId.toString(), type: 'refresh' },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
};

/**
 * Verifies a JWT and returns the decoded payload.
 * @param {string} token
 * @returns {{ valid: boolean, decoded?: object, error?: string }}
 */
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { valid: true, decoded };
    } catch (error) {
        let errorType = 'invalid';
        if (error.name === 'TokenExpiredError') errorType = 'expired';
        if (error.name === 'JsonWebTokenError') errorType = 'malformed';

        return { valid: false, error: error.message, errorType };
    }
};

/**
 * Decodes a JWT without verifying the signature.
 * Useful for reading payload from expired tokens.
 * @param {string} token
 * @returns {object|null}
 */
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch {
        return null;
    }
};

/**
 * Sets a JWT as an HTTP-only cookie on the response.
 * @param {Response} res
 * @param {string} userId
 * @returns {string} The generated token
 */
export const setTokenCookie = (res, userId) => {
    const token = generateAccessToken(userId);
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        path: '/',
    });

    return token;
};

/**
 * Clears the JWT cookie from the response.
 * @param {Response} res
 */
export const clearTokenCookie = (res) => {
    res.clearCookie('token', { path: '/', httpOnly: true });
};

/**
 * Generates a cryptographically secure random token string.
 * Used for email verification, password reset, etc.
 * @param {number} bytes - Length of random bytes (default: 32)
 * @returns {string} hex string
 */
export const generateSecureToken = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Generates a short numeric OTP code.
 * @param {number} digits - Number of digits (default: 6)
 * @returns {string}
 */
export const generateOTP = (digits = 6) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

export default {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    decodeToken,
    setTokenCookie,
    clearTokenCookie,
    generateSecureToken,
    generateOTP,
};
