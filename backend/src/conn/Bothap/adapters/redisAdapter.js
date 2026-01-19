// adapters/redisAdapter.js
// Redis cache adapter for Synapse Synchrony session and data caching

import { createClient } from 'redis';

let _client = null;

const DEFAULT_TTL = 3600; // 1 hour

/**
 * Get or create the Redis client.
 */
export const getRedisClient = async () => {
    if (_client && _client.isOpen) return _client;

    _client = createClient({
        url: process.env.REDIS_URL ?? 'redis://localhost:6379',
        socket: {
            reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
        },
    });

    _client.on('error', (err) => console.error('[RedisAdapter] Error:', err.message));

    await _client.connect();
    return _client;
};

/**
 * Store a value in Redis under a key.
 * @param {string} key
 * @param {*} value - will be JSON-stringified
 * @param {number} [ttl] - TTL in seconds
 */
export const set = async (key, value, ttl = DEFAULT_TTL) => {
    const client = await getRedisClient();
    await client.set(key, JSON.stringify(value), { EX: ttl });
};

/**
 * Retrieve and JSON-parse a value from Redis.
 * @param {string} key
 * @returns {Promise<*|null>}
 */
export const get = async (key) => {
    const client = await getRedisClient();
    const raw = await client.get(key);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return raw;
    }
};

/**
 * Delete a key from Redis.
 * @param {string} key
 */
export const del = async (key) => {
    const client = await getRedisClient();
    await client.del(key);
};

/**
 * Check if a key exists.
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export const exists = async (key) => {
    const client = await getRedisClient();
    const count = await client.exists(key);
    return count > 0;
};

/**
 * Set expiry (TTL) on an existing key.
 * @param {string} key
 * @param {number} ttl - seconds
 */
export const expire = async (key, ttl) => {
    const client = await getRedisClient();
    await client.expire(key, ttl);
};

/**
 * Disconnect from Redis.
 */
export const disconnect = async () => {
    if (_client?.isOpen) {
        await _client.disconnect();
        _client = null;
    }
};

export default { getRedisClient, set, get, del, exists, expire, disconnect };
