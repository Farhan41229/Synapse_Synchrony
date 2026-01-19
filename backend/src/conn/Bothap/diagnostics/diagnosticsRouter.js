// diagnostics/diagnosticsRouter.js
// Express router exposing all diagnostic endpoints at /diagnostics

import { Router } from 'express';
import { livenessHandler, readinessHandler } from './healthCheck.js';
import { metricsHandler } from './performanceMonitor.js';
import { auditHandler } from './auditLogger.js';
import { poolStatsHandler } from './connectionPoolMonitor.js';
import { systemInfoHandler } from './systemInfo.js';
import { samplesHandler } from './requestSampler.js';
import { depsHandler } from './dependencyChecker.js';
import { uptimeHandler } from './uptimeTracker.js';

const router = Router();

/**
 * All diagnostics routes are restricted to admin role in real usage.
 * Add auth middleware before mounting this router in production.
 */

// Liveness and readiness probes
router.get('/live', livenessHandler);
router.get('/ready', readinessHandler);

// Performance and request metrics
router.get('/metrics', metricsHandler);
router.get('/samples', samplesHandler);

// System and process info
router.get('/system', systemInfoHandler);
router.get('/uptime', uptimeHandler);

// Database pool stats
router.get('/pool', poolStatsHandler);

// Audit log
router.get('/audit', auditHandler);

// Dependency check
router.get('/deps', depsHandler);

export default router;
