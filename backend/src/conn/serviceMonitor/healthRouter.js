// serviceMonitor/healthRouter.js
// Express router exposing health check endpoints for the entire application

import express from 'express';
import { getDatabaseHealthReport } from '../database/dbHealthCheck.js';
import cache from '../cache/cacheManager.js';
import { getStreamClient } from '../streamChat/streamClient.js';
import os from 'os';

const router = express.Router();

/**
 * GET /health
 * Overall application health check — suitable for load balancer pings.
 */
router.get('/', async (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'synapse-synchrony-api',
        version: process.env.npm_package_version || '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
    });
});

/**
 * GET /health/detailed
 * Detailed health report including database, cache, and system metrics.
 * Should be protected in production.
 */
router.get('/detailed', async (req, res) => {
    try {
        const [dbReport, cacheStats] = await Promise.all([
            getDatabaseHealthReport(),
            Promise.resolve(cache.getStats()),
        ]);

        // Stream health check
        let streamStatus = 'unknown';
        try {
            getStreamClient(); // Will throw if not configured
            streamStatus = 'configured';
        } catch {
            streamStatus = 'not_configured';
        }

        // Node.js and system metrics
        const systemMetrics = {
            platform: process.platform,
            nodeVersion: process.version,
            memory: {
                heapUsedMB: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                heapTotalMB: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2),
                rssMB: (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
            },
            cpu: {
                cores: os.cpus().length,
                model: os.cpus()[0]?.model || 'unknown',
                loadAvg: os.loadavg(),
            },
            uptimeSeconds: Math.floor(process.uptime()),
            osUptimeSeconds: Math.floor(os.uptime()),
        };

        const allGood =
            dbReport.overall === 'healthy' &&
            streamStatus !== 'error';

        return res.status(allGood ? 200 : 207).json({
            overall: allGood ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            database: dbReport,
            cache: cacheStats,
            stream: { status: streamStatus },
            system: systemMetrics,
        });
    } catch (error) {
        console.error('[HealthRouter] Error generating health report:', error.message);
        return res.status(500).json({ overall: 'unhealthy', error: error.message });
    }
});

/**
 * GET /health/readiness
 * Readiness probe — checks if the service is ready to accept traffic.
 */
router.get('/readiness', async (req, res) => {
    try {
        const dbReport = await getDatabaseHealthReport();
        if (dbReport.overall !== 'healthy') {
            return res.status(503).json({ ready: false, reason: 'Database unavailable.' });
        }
        return res.status(200).json({ ready: true });
    } catch (error) {
        return res.status(503).json({ ready: false, reason: error.message });
    }
});

export default router;
