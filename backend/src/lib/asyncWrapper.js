// backend/src/lib/asyncWrapper.js
// Async route handler wrapper and retry utility

/**
 * Wrap an async Express route handler to automatically catch errors
 * and pass them to next().
 * @param {Function} fn
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Retry an async function up to N times with exponential backoff.
 * @param {Function} fn - async function to retry
 * @param {object} [opts]
 * @param {number} [opts.retries]
 * @param {number} [opts.delayMs]
 * @param {number} [opts.backoffFactor]
 * @param {Function} [opts.onRetry] - called with (error, attempt)
 */
export const withRetry = async (fn, opts = {}) => {
    const {
        retries = 3,
        delayMs = 500,
        backoffFactor = 2,
        onRetry,
    } = opts;

    let lastError;
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            if (attempt <= retries) {
                if (onRetry) onRetry(err, attempt);
                const waitMs = delayMs * backoffFactor ** (attempt - 1);
                await new Promise((resolve) => setTimeout(resolve, waitMs));
            }
        }
    }
    throw lastError;
};

/**
 * Execute multiple async functions with a concurrency limit.
 * @param {Function[]} tasks - array of async functions
 * @param {number} [concurrency]
 * @returns {Promise<Array>} results in input order
 */
export const withConcurrency = async (tasks, concurrency = 5) => {
    const results = new Array(tasks.length);
    let index = 0;

    const worker = async () => {
        while (index < tasks.length) {
            const i = index++;
            results[i] = await tasks[i]();
        }
    };

    const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, worker);
    await Promise.all(workers);
    return results;
};

/**
 * Run an async function with a timeout.
 * @param {Function} fn
 * @param {number} timeoutMs
 */
export const withTimeout = (fn, timeoutMs) => {
    return Promise.race([
        fn(),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
        ),
    ]);
};

/**
 * Execute an async function and return [result, error] instead of throwing.
 * @param {Promise} promise
 * @returns {Promise<[any, Error|null]>}
 */
export const tryCatch = async (promise) => {
    try {
        const result = await promise;
        return [result, null];
    } catch (err) {
        return [null, err];
    }
};

/**
 * Debounce an async function.
 * @param {Function} fn
 * @param {number} delayMs
 */
export const debounceAsync = (fn, delayMs) => {
    let timer;
    return (...args) =>
        new Promise((resolve, reject) => {
            clearTimeout(timer);
            timer = setTimeout(async () => {
                try {
                    resolve(await fn(...args));
                } catch (err) {
                    reject(err);
                }
            }, delayMs);
        });
};

export default { asyncHandler, withRetry, withConcurrency, withTimeout, tryCatch, debounceAsync };
