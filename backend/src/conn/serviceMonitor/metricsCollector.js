// serviceMonitor/metricsCollector.js
// Collects and exposes application performance metrics for Synapse Synchrony

import os from 'os';

const collectionStart = Date.now();
const customMetrics = new Map(); // metric name -> { value, updatedAt }

/**
 * Records a custom metric value.
 * @param {string} name
 * @param {number} value
 * @param {object} labels - Optional key-value tags
 */
export const recordMetric = (name, value, labels = {}) => {
    customMetrics.set(name, { value, labels, updatedAt: Date.now() });
};

/**
 * Increments a counter metric by a given amount.
 * @param {string} name
 * @param {number} increment
 */
export const incrementCounter = (name, increment = 1) => {
    const existing = customMetrics.get(name);
    const currentValue = existing?.value || 0;
    customMetrics.set(name, {
        value: currentValue + increment,
        labels: existing?.labels || {},
        updatedAt: Date.now(),
    });
};

/**
 * Records the duration of an async operation as a timing metric.
 * @param {string} name - Metric name
 * @param {Function} fn - Async function to measure
 * @returns {Promise<any>} - Returns the result of fn
 */
export const measureDuration = async (name, fn) => {
    const start = Date.now();
    try {
        const result = await fn();
        const duration = Date.now() - start;
        recordMetric(`${name}_duration_ms`, duration);
        return result;
    } catch (error) {
        incrementCounter(`${name}_errors`);
        throw error;
    }
};

/**
 * Returns a snapshot of all current metrics.
 * @returns {object}
 */
export const getMetricsSnapshot = () => {
    const memUsage = process.memoryUsage();
    const cpus = os.cpus();

    const nodeMetrics = {
        uptime_seconds: Math.floor(process.uptime()),
        collection_duration_seconds: Math.floor((Date.now() - collectionStart) / 1000),
        heap_used_bytes: memUsage.heapUsed,
        heap_total_bytes: memUsage.heapTotal,
        rss_bytes: memUsage.rss,
        external_bytes: memUsage.external,
        cpu_count: cpus.length,
        load_avg_1m: os.loadavg()[0],
        load_avg_5m: os.loadavg()[1],
        free_memory_bytes: os.freemem(),
        total_memory_bytes: os.totalmem(),
    };

    const custom = {};
    for (const [key, data] of customMetrics.entries()) {
        custom[key] = { value: data.value, updatedAt: new Date(data.updatedAt).toISOString() };
    }

    return {
        collectedAt: new Date().toISOString(),
        node: nodeMetrics,
        custom,
    };
};

/**
 * Express endpoint handler that returns metrics as JSON.
 * @param {Request} req
 * @param {Response} res
 */
export const metricsEndpoint = (req, res) => {
    const snapshot = getMetricsSnapshot();
    res.status(200).json(snapshot);
};

export default { recordMetric, incrementCounter, measureDuration, getMetricsSnapshot, metricsEndpoint };
