// authHelpers/sessionManager.js
// Manages active user sessions and tracks login events

import mongoose from 'mongoose';

// In-memory session registry (complements cookie-based JWTs)
const activeSessions = new Map(); // userId -> [{ sessionId, ip, userAgent, createdAt }]

/**
 * Registers a new login session for a user.
 * @param {string} userId
 * @param {object} details - { ip, userAgent }
 * @returns {string} sessionId
 */
export const registerSession = (userId, details = {}) => {
    const sessionId = `sess_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const session = {
        sessionId,
        ip: details.ip || 'unknown',
        userAgent: details.userAgent || 'unknown',
        createdAt: new Date(),
        lastActiveAt: new Date(),
    };

    if (!activeSessions.has(userId)) {
        activeSessions.set(userId, []);
    }

    const userSessions = activeSessions.get(userId);

    // Enforce max 5 concurrent sessions per user
    if (userSessions.length >= 5) {
        const oldest = userSessions.sort((a, b) => a.createdAt - b.createdAt)[0];
        userSessions.splice(userSessions.indexOf(oldest), 1);
        console.log(`[SessionManager] Evicted oldest session for user ${userId}: ${oldest.sessionId}`);
    }

    userSessions.push(session);
    console.log(`[SessionManager] Registered session ${sessionId} for user ${userId}`);
    return sessionId;
};

/**
 * Updates the lastActiveAt timestamp for a session.
 * @param {string} userId
 * @param {string} sessionId
 */
export const pingSession = (userId, sessionId) => {
    const sessions = activeSessions.get(userId);
    if (!sessions) return;

    const session = sessions.find((s) => s.sessionId === sessionId);
    if (session) {
        session.lastActiveAt = new Date();
    }
};

/**
 * Invalidates a specific session (logout).
 * @param {string} userId
 * @param {string} sessionId
 */
export const invalidateSession = (userId, sessionId) => {
    const sessions = activeSessions.get(userId);
    if (!sessions) return;

    const index = sessions.findIndex((s) => s.sessionId === sessionId);
    if (index !== -1) {
        sessions.splice(index, 1);
        console.log(`[SessionManager] Invalidated session ${sessionId} for user ${userId}`);
    }
};

/**
 * Invalidates all sessions for a user (e.g., password change, account compromise).
 * @param {string} userId
 */
export const invalidateAllSessions = (userId) => {
    activeSessions.delete(userId);
    console.log(`[SessionManager] Invalidated ALL sessions for user ${userId}`);
};

/**
 * Returns all active sessions for a user.
 * @param {string} userId
 * @returns {Array}
 */
export const getUserSessions = (userId) => {
    return activeSessions.get(userId) || [];
};

/**
 * Logs a login event to the database for audit purposes.
 * @param {string} userId
 * @param {object} details
 */
export const logLoginEvent = async (userId, details = {}) => {
    try {
        const eventsCollection = mongoose.connection.collection('login_events');
        await eventsCollection.insertOne({
            userId: new mongoose.Types.ObjectId(userId),
            ip: details.ip || 'unknown',
            userAgent: details.userAgent || 'unknown',
            success: details.success !== false,
            reason: details.reason || null,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error('[SessionManager] Failed to log login event:', error.message);
    }
};

export default { registerSession, pingSession, invalidateSession, invalidateAllSessions, getUserSessions, logLoginEvent };
