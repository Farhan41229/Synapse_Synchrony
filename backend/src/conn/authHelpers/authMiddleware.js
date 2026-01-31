// authHelpers/authMiddleware.js
// Express authentication and authorization middleware

import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { HttpResponse } from '../../utils/HttpResponse.js';

const TOKEN_COOKIE_NAME = 'token';

/**
 * Core authentication middleware.
 * Verifies the JWT token from cookies and attaches the userId to the request.
 */
export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies?.[TOKEN_COOKIE_NAME] || extractBearerToken(req.headers.authorization);

        if (!token) {
            return HttpResponse(res, 401, true, 'Authentication required. No token provided.');
        }

        if (!process.env.JWT_SECRET) {
            console.error('[AuthMiddleware] JWT_SECRET is not defined.');
            return HttpResponse(res, 500, true, 'Server configuration error.');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.tokenPayload = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return HttpResponse(res, 401, true, 'Session expired. Please log in again.');
        }
        if (error.name === 'JsonWebTokenError') {
            return HttpResponse(res, 401, true, 'Invalid authentication token.');
        }
        console.error('[AuthMiddleware] Error:', error.message);
        return HttpResponse(res, 500, true, 'Internal Server Error');
    }
};

/**
 * Optional authentication — attaches userId if token present, but doesn't block unauthenticated requests.
 */
export const optionalAuthenticate = (req, res, next) => {
    try {
        const token = req.cookies?.[TOKEN_COOKIE_NAME] || extractBearerToken(req.headers.authorization);
        if (token && process.env.JWT_SECRET) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
        }
    } catch {
        // Silently ignore auth errors for optional middleware
    }
    next();
};

/**
 * Middleware that checks if the authenticated user's email is verified.
 * Must be used AFTER the authenticate middleware.
 */
export const requireVerified = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('isVerified');
        if (!user) return HttpResponse(res, 404, true, 'User not found.');
        if (!user.isVerified) {
            return HttpResponse(res, 403, true, 'Email verification required. Please verify your email address.');
        }
        next();
    } catch (error) {
        console.error('[AuthMiddleware] requireVerified error:', error.message);
        return HttpResponse(res, 500, true, 'Internal Server Error');
    }
};

/**
 * Middleware to check that the authenticated user is accessing their own resource.
 * Compares req.userId with req.params.userId.
 */
export const requireOwnership = (req, res, next) => {
    if (req.userId?.toString() !== req.params.userId?.toString()) {
        return HttpResponse(res, 403, true, 'Access denied. You can only modify your own resources.');
    }
    next();
};

/**
 * Extracts a Bearer token from the Authorization header.
 * @param {string|undefined} authHeader
 * @returns {string|null}
 */
const extractBearerToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return authHeader.slice(7);
};

export default { authenticate, optionalAuthenticate, requireVerified, requireOwnership };
