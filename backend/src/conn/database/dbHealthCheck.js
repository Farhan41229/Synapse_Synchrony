// database/dbHealthCheck.js
// Health check utilities for MongoDB connection monitoring

import mongoose from 'mongoose';

const HEALTH_STATUS = {
    HEALTHY: 'healthy',
    DEGRADED: 'degraded',
    UNHEALTHY: 'unhealthy',
};

/**
 * Performs a lightweight ping to verify MongoDB is reachable.
 * @returns {Promise<{status: string, latencyMs: number, message: string}>}
 */
export const pingDatabase = async () => {
    const start = Date.now();
    try {
        await mongoose.connection.db.admin().ping();
        const latencyMs = Date.now() - start;
        return {
            status: HEALTH_STATUS.HEALTHY,
            latencyMs,
            message: 'MongoDB is reachable.',
        };
    } catch (error) {
        return {
            status: HEALTH_STATUS.UNHEALTHY,
            latencyMs: Date.now() - start,
            message: `MongoDB ping failed: ${error.message}`,
        };
    }
};

/**
 * Returns detailed stats about the current MongoDB connection pool.
 * @returns {object}
 */
export const getConnectionPoolStats = () => {
    const conn = mongoose.connection;
    if (!conn || conn.readyState !== 1) {
        return {
            status: HEALTH_STATUS.UNHEALTHY,
            readyState: conn?.readyState,
            message: 'Connection is not open.',
        };
    }

    return {
        status: HEALTH_STATUS.HEALTHY,
        readyState: conn.readyState,
        host: conn.host,
        port: conn.port,
        name: conn.name,
        message: 'Connection pool is active.',
    };
};

/**
 * Full database health report combining ping and pool stats.
 * @returns {Promise<object>}
 */
export const getDatabaseHealthReport = async () => {
    const pingResult = await pingDatabase();
    const poolStats = getConnectionPoolStats();

    const overallStatus =
        pingResult.status === HEALTH_STATUS.HEALTHY &&
            poolStats.status === HEALTH_STATUS.HEALTHY
            ? HEALTH_STATUS.HEALTHY
            : HEALTH_STATUS.DEGRADED;

    return {
        overall: overallStatus,
        timestamp: new Date().toISOString(),
        ping: pingResult,
        pool: poolStats,
    };
};

/**
 * Mongoose connection state descriptions.
 */
export const MONGOOSE_STATES = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized',
};

export const getReadyStateLabel = () => {
    const state = mongoose.connection.readyState;
    return MONGOOSE_STATES[state] || 'unknown';
};

export default { pingDatabase, getConnectionPoolStats, getDatabaseHealthReport };
