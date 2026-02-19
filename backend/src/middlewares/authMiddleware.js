// backend/src/middlewares/authMiddleware.js
// Authentication and authorization middleware for Synapse Synchrony

import { verifyToken } from '../conn/Bothap/adapters/jwtAdapter.js';
import User from '../models/userModel.js';

/**
 * Protect routes — require a valid JWT access token.
 * Sets req.user to the authenticated user document.
 */
export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please log in.',
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        const user = await User.findById(decoded.id).select('-password -refreshToken').lean();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'The account associated with this token no longer exists.',
            });
        }

        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been suspended. Please contact support.',
            });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Your session has expired. Please log in again.',
                code: 'TOKEN_EXPIRED',
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid authentication token.',
        });
    }
};

/**
 * Permit only users with specific roles.
 * Must be used after the `protect` middleware.
 * @param {...string} roles - allowed roles
 */
export const permitRoles = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: `Access denied. Required role(s): ${roles.join(', ')}.`,
        });
    }
    next();
};

/**
 * Restrict access to admin role only.
 * Shorthand for permitRoles('admin').
 */
export const adminOnly = permitRoles('admin');

/**
 * Optional auth — populate req.user if a valid token is provided,
 * but do not block the request if no token is present.
 */
export const optionalAuth = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);
            const user = await User.findById(decoded.id).select('-password -refreshToken').lean();
            req.user = user ?? null;
        } else {
            req.user = null;
        }
    } catch {
        req.user = null;
    }
    next();
};

/**
 * Ensure the authenticated user is the owner of a resource.
 * Reads ownerId from req.params.userId or req.resource.owner.
 * Must be used after `protect`.
 * @param {Function} getOwnerId - fn(req) => ownerId string
 */
export const ownerOrAdmin = (getOwnerId) => (req, res, next) => {
    const ownerId = getOwnerId(req);
    const userId = req.user?._id?.toString();

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    if (userId !== ownerId?.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to perform this action.',
        });
    }

    next();
};

/**
 * Require the user's email to be verified before accessing a route.
 */
export const requireEmailVerified = (req, res, next) => {
    if (!req.user?.isEmailVerified) {
        return res.status(403).json({
            success: false,
            message: 'Please verify your email address to access this feature.',
            code: 'EMAIL_NOT_VERIFIED',
        });
    }
    next();
};

export default {
    protect,
    permitRoles,
    adminOnly,
    optionalAuth,
    ownerOrAdmin,
    requireEmailVerified,
};
