// diagnostics/performanceMonitor.js
// Track request latency and throughput within Synapse Synchrony

const metrics = {
    requestCount: 0,
    errorCount: 0,
    totalLatencyMs: 0,
    routeStats: new Map(),
    startedAt: Date.now(),
};

/**
 * Express middleware: record latency and status for every request.
 */
export const metricsMiddleware = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const latency = Date.now() - start;
        const route = `${req.method} ${req.route?.path ?? req.path}`;

        metrics.requestCount += 1;
        metrics.totalLatencyMs += latency;

        if (res.statusCode >= 400) metrics.errorCount += 1;

        const existing = metrics.routeStats.get(route) ?? {
            count: 0,
            totalLatency: 0,
            errors: 0,
        };
        existing.count += 1;
        existing.totalLatency += latency;
        if (res.statusCode >= 400) existing.errors += 1;
        metrics.routeStats.set(route, existing);
    });

    next();
};

/**
 * Return a snapshot of current performance metrics.
 */
export const getMetrics = () => {
    const uptimeSec = Math.floor((Date.now() - metrics.startedAt) / 1000);
    const avgLatency =
        metrics.requestCount > 0
            ? (metrics.totalLatencyMs / metrics.requestCount).toFixed(2)
            : 0;

    const routes = {};
    for (const [route, stats] of metrics.routeStats.entries()) {
        routes[route] = {
            requestCount: stats.count,
            averageLatencyMs: (stats.totalLatency / stats.count).toFixed(2),
            errorCount: stats.errors,
        };
    }

    return {
        uptime: `${uptimeSec}s`,
        totalRequests: metrics.requestCount,
        totalErrors: metrics.errorCount,
        errorRate: metrics.requestCount > 0
            ? `${((metrics.errorCount / metrics.requestCount) * 100).toFixed(1)}%`
            : '0%',
        averageLatencyMs: parseFloat(avgLatency),
        memoryUsage: process.memoryUsage(),
        routes,
    };
};

/**
 * Express handler: GET /metrics
 */
export const metricsHandler = (_req, res) => {
    res.status(200).json(getMetrics());
};

/**
 * Reset all metrics (useful for testing).
 */
export const resetMetrics = () => {
    metrics.requestCount = 0;
    metrics.errorCount = 0;
    metrics.totalLatencyMs = 0;
    metrics.routeStats.clear();
    metrics.startedAt = Date.now();
};

export default { metricsMiddleware, getMetrics, metricsHandler, resetMetrics };
