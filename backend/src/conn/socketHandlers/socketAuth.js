// socketHandlers/socketAuth.js
// JWT-based authentication middleware for Socket.IO connections

import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

const SOCKET_AUTH_COOKIE = 'token';

/**
 * Extracts and verifies the JWT from the socket handshake.
 * Attaches userId and user object to the socket instance.
 * @param {Socket} socket
 * @param {Function} next
 */
export const verifySocketToken = async (socket, next) => {
    try {
        // Try to get token from cookie or auth header
        let token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.cookie
                ?.split(';')
                ?.find((c) => c.trim().startsWith(`${SOCKET_AUTH_COOKIE}=`))
                ?.split('=')[1];

        if (!token) {
            return next(new Error('Authentication error: No token provided.'));
        }

        if (!process.env.JWT_SECRET) {
            console.error('[SocketAuth] JWT_SECRET is not defined.');
            return next(new Error('Server configuration error.'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return next(new Error('Authentication error: User not found.'));
        }

        if (!user.isVerified) {
            return next(new Error('Authentication error: Email is not verified.'));
        }

        // Attach user info to socket
        socket.userId = decoded.userId;
        socket.user = user;

        console.log(`[SocketAuth] Authenticated socket for user: ${user.name} (${user._id})`);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new Error('Authentication error: Token has expired.'));
        }
        if (error.name === 'JsonWebTokenError') {
            return next(new Error('Authentication error: Invalid token.'));
        }
        console.error('[SocketAuth] Unexpected error:', error.message);
        return next(new Error('Authentication error.'));
    }
};

export default verifySocketToken;
