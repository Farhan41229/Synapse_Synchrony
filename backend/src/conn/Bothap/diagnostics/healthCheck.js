// diagnostics/healthCheck.js
// Readiness and liveness probes for Synapse Synchrony backend

import mongoose from 'mongoose';

/**
 * Check MongoDB connection state.
 * @returns {{ status: 'ok'|'error', message: string, latencyMs: number }}
 */
export const checkMongoDB = async () => {
    const start = Date.now();
    try {
        const state = mongoose.connection.readyState;
        if (state !== 1) {
            return { status: 'error', message: `MongoDB not connected (state: ${state})`, latencyMs: 0 };
        }
        // Ping by running a no-op command
        await mongoose.connection.db.admin().ping();
        return { status: 'ok', message: 'MongoDB is healthy.', latencyMs: Date.now() - start };
    } catch (err) {
        return { status: 'error', message: err.message, latencyMs: Date.now() - start };
    }
};

/**
 * Check Redis connectivity.
 * @param {import('redis').RedisClientType} redisClient
 */
export const checkRedis = async (redisClient) => {
    const start = Date.now();
    try {
        if (!redisClient?.isOpen) {
            return { status: 'error', message: 'Redis client not open.', latencyMs: 0 };
        }
        await redisClient.ping();
        return { status: 'ok', message: 'Redis is healthy.', latencyMs: Date.now() - start };
    } catch (err) {
        return { status: 'error', message: err.message, latencyMs: Date.now() - start };
    }
};

/**
 * Express handler: /health/live
 * Always returns 200 if the server process is running.
 */
export const livenessHandler = (_req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
};

/**
 * Express handler: /health/ready
 * Returns 200 only if all critical dependencies are healthy.
 */
export const readinessHandler = async (_req, res) => {
    const [mongo] = await Promise.all([checkMongoDB()]);

    const healthy = mongo.status === 'ok';

    res.status(healthy ? 200 : 503).json({
        status: healthy ? 'ready' : 'degraded',
        checks: { mongodb: mongo },
        timestamp: new Date().toISOString(),
    });
};

export default { checkMongoDB, checkRedis, livenessHandler, readinessHandler };
