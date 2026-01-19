// adapters/jwtAdapter.js
// Centralised JWT signing/verification for Synapse Synchrony authentication

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'synapse_fallback_secret';
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY ?? '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY ?? '7d';

/**
 * Sign an access token for a user.
 * @param {{ _id: string, role: string }} user
 * @returns {string}
 */
export const signAccessToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: ACCESS_EXPIRY,
        issuer: 'synapse-synchrony',
        audience: 'synapse-client',
    });

/**
 * Sign a refresh token.
 * @param {string} userId
 * @returns {string}
 */
export const signRefreshToken = (userId) =>
    jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: REFRESH_EXPIRY,
        issuer: 'synapse-synchrony',
        audience: 'synapse-refresh',
    });

/**
 * Verify and decode a JWT token.
 * @param {string} token
 * @returns {{ id: string, role?: string, iat: number, exp: number }}
 * @throws {Error} if verification fails
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw new Error(`[JwtAdapter] Token verification failed: ${err.message}`);
    }
};

/**
 * Decode a token without verification (unsafe — inspection only).
 * @param {string} token
 * @returns {object|null}
 */
export const decodeToken = (token) => jwt.decode(token);

/**
 * Sign a one-time short-lived token for email verification or password reset.
 * @param {string} userId
 * @param {string} purpose - e.g. 'email_verify' | 'password_reset'
 * @param {string} [expiry]
 */
export const signOtpToken = (userId, purpose = 'generic', expiry = '1h') =>
    jwt.sign({ id: userId, purpose }, JWT_SECRET, { expiresIn: expiry });

export default { signAccessToken, signRefreshToken, verifyToken, decodeToken, signOtpToken };
