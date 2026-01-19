// diagnostics/connectionPoolMonitor.js
// Monitor Mongoose connection pool stats for Synapse Synchrony

import mongoose from 'mongoose';

const poolEvents = [];
const MAX_EVENTS = 200;

const record = (event, detail = {}) => {
    poolEvents.unshift({ event, detail, timestamp: new Date().toISOString() });
    if (poolEvents.length > MAX_EVENTS) poolEvents.pop();
};

/**
 * Register Mongoose driver-level pool event listeners.
 * Call once after mongoose.connect() succeeds.
 */
export const registerPoolListeners = () => {
    const conn = mongoose.connection;

    conn.on('connected', () => record('connected'));
    conn.on('disconnected', () => record('disconnected'));
    conn.on('reconnected', () => record('reconnected'));
    conn.on('error', (err) => record('error', { message: err.message }));
    conn.on('close', () => record('close'));
    conn.on('fullsetup', () => record('fullsetup'));
    conn.on('all', () => record('all'));
};

/**
 * Return current Mongoose connection pool statistics.
 */
export const getPoolStats = () => {
    const conn = mongoose.connection;

    return {
        readyState: conn.readyState,
        readyStateLabel: ['disconnected', 'connected', 'connecting', 'disconnecting'][conn.readyState] ?? 'unknown',
        host: conn.host ?? null,
        port: conn.port ?? null,
        name: conn.name ?? null,
        recentEvents: poolEvents.slice(0, 20),
    };
};

/**
 * Express handler: GET /diagnostics/pool
 */
export const poolStatsHandler = (_req, res) => {
    res.status(200).json(getPoolStats());
};

/**
 * Clear the pool event log.
 */
export const clearPoolEvents = () => poolEvents.splice(0, poolEvents.length);

export default { registerPoolListeners, getPoolStats, poolStatsHandler, clearPoolEvents };
