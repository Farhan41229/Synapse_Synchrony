// cache/sessionCache.js
// Caches AI session data to reduce redundant DB reads during active sessions

import cache from './cacheManager.js';
import { CacheKeys, TTL } from './cacheKeys.js';

const SESSION_TTL = 30 * 60; // 30 minutes TTL for active sessions

/**
 * Caches a diagnosis session object.
 * @param {string} sessionId
 * @param {object} sessionData
 */
export const cacheDiagnosisSession = (sessionId, sessionData) => {
    const key = CacheKeys.diagnosis.session(sessionId);
    cache.set(key, sessionData, SESSION_TTL);
    console.log(`[SessionCache] Cached diagnosis session: ${sessionId}`);
};

/**
 * Retrieves a cached diagnosis session.
 * @param {string} sessionId
 * @returns {object|null}
 */
export const getCachedDiagnosisSession = (sessionId) => {
    const key = CacheKeys.diagnosis.session(sessionId);
    return cache.get(key);
};

/**
 * Updates specific fields of a cached session without full replacement.
 * @param {string} sessionId
 * @param {object} updates
 */
export const updateCachedSession = (sessionId, updates) => {
    const key = CacheKeys.diagnosis.session(sessionId);
    const existing = cache.get(key);
    if (existing) {
        const updated = { ...existing, ...updates };
        cache.set(key, updated, SESSION_TTL);
    }
};

/**
 * Removes a session from the cache (on completion or expiry).
 * @param {string} sessionId
 */
export const invalidateDiagnosisSession = (sessionId) => {
    const key = CacheKeys.diagnosis.session(sessionId);
    cache.delete(key);
    console.log(`[SessionCache] Invalidated diagnosis session: ${sessionId}`);
};

/**
 * Caches a MediLink (medication chatbot) session.
 * @param {string} sessionId
 * @param {object} sessionData
 */
export const cacheMedilinkSession = (sessionId, sessionData) => {
    const key = `medilink:session:${sessionId}`;
    cache.set(key, sessionData, SESSION_TTL);
};

/**
 * Retrieves a cached MediLink session.
 * @param {string} sessionId
 * @returns {object|null}
 */
export const getCachedMedilinkSession = (sessionId) => {
    return cache.get(`medilink:session:${sessionId}`);
};

/**
 * Caches user wellness analytics for quick dashboard loading.
 * @param {string} userId
 * @param {object} analyticsData
 */
export const cacheWellnessAnalytics = (userId, analyticsData) => {
    const key = `wellness:analytics:${userId}`;
    cache.set(key, analyticsData, TTL.MEDIUM);
};

/**
 * Retrieves cached wellness analytics for a user.
 * @param {string} userId
 * @returns {object|null}
 */
export const getCachedWellnessAnalytics = (userId) => {
    return cache.get(`wellness:analytics:${userId}`);
};

export default {
    cacheDiagnosisSession,
    getCachedDiagnosisSession,
    updateCachedSession,
    invalidateDiagnosisSession,
    cacheMedilinkSession,
    getCachedMedilinkSession,
    cacheWellnessAnalytics,
    getCachedWellnessAnalytics,
};
