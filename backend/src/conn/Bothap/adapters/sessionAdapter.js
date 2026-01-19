// adapters/sessionAdapter.js
// Express session and refresh-token management helpers

import { generateSecureToken, sha256 } from './encryptionAdapter.js';

const REFRESH_TOKEN_TTL_DAYS = 7;

/**
 * Generate a new refresh token + its hashed version for DB storage.
 * @returns {{ raw: string, hashed: string, expiresAt: Date }}
 */
export const createRefreshToken = () => {
    const raw = generateSecureToken(48);
    const hashed = sha256(raw);
    const expiresAt = new Date(
        Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
    );
    return { raw, hashed, expiresAt };
};

/**
 * Set the refresh token as an HTTP-only cookie.
 * @param {object} res - Express response
 * @param {string} token
 */
export const setRefreshCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
        path: '/api/auth/refresh',
    });
};

/**
 * Clear the refresh token cookie.
 * @param {object} res - Express response
 */
export const clearRefreshCookie = (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/api/auth/refresh',
    });
};

/**
 * Build a session payload object for logging.
 * @param {object} user
 * @param {object} req
 */
export const buildSessionMeta = (user, req) => ({
    userId: user._id?.toString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    createdAt: new Date().toISOString(),
});

export default { createRefreshToken, setRefreshCookie, clearRefreshCookie, buildSessionMeta };
