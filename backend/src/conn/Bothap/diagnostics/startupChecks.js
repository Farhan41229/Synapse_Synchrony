// diagnostics/startupChecks.js
// Orchestrate all startup validation checks for Synapse Synchrony backend

import { validateEnv, warnMissingEnv } from './envChecker.js';
import { checkDependencies } from './dependencyChecker.js';
import { registerPoolListeners } from './connectionPoolMonitor.js';
import { createLogger } from '../adapters/loggerAdapter.js';

const log = createLogger('StartupChecks');

/**
 * Run all pre-flight checks before the server accepts traffic.
 * Throws if any critical check fails.
 *
 * @param {object} [opts]
 * @param {boolean} [opts.skipEnv]  - skip env validation (e.g. in test mode)
 * @param {boolean} [opts.skipDeps] - skip dependency check
 */
export const runStartupChecks = async ({ skipEnv = false, skipDeps = false } = {}) => {
    log.info('Running startup checks...');

    // 1. Environment variable validation
    if (!skipEnv) {
        try {
            validateEnv(['core']);
            warnMissingEnv(['cloudinary', 'stream', 'openai', 'email', 'redis']);
            log.info('Environment variables validated.');
        } catch (err) {
            log.error('Critical env vars missing.', { message: err.message });
            throw err;
        }
    }

    // 2. Dependency version check
    if (!skipDeps) {
        const { ok, results } = checkDependencies();
        const issues = results.filter((r) => r.status !== 'ok');
        if (issues.length > 0) {
            log.warn('Dependency version issues detected.', { issues });
        } else {
            log.info('All critical dependencies are at expected versions.');
        }
    }

    // 3. Register MongoDB pool event listeners
    registerPoolListeners();
    log.info('MongoDB pool event listeners registered.');

    log.info('All startup checks passed. Server ready.');
};

/**
 * Graceful shutdown handler — clean up resources in order.
 * @param {Function} [onComplete] - callback after cleanup
 */
export const gracefulShutdown = async (onComplete) => {
    log.info('Initiating graceful shutdown...');

    try {
        const mongoose = (await import('mongoose')).default;
        await mongoose.disconnect();
        log.info('MongoDB disconnected.');
    } catch (e) {
        log.error('Error disconnecting MongoDB.', { message: e.message });
    }

    log.info('Graceful shutdown complete.');
    if (typeof onComplete === 'function') onComplete();
};

export default { runStartupChecks, gracefulShutdown };
