// diagnostics/requestSampler.js
// Probabilistic request sampling for performance profiling

let sampleRate = parseFloat(process.env.SAMPLE_RATE ?? '0.1'); // 10% default
const samples = [];
const MAX_SAMPLES = 300;

/**
 * Update the sampling rate at runtime.
 * @param {number} rate - between 0 and 1
 */
export const setSampleRate = (rate) => {
    if (rate < 0 || rate > 1) throw new Error('Sample rate must be between 0 and 1.');
    sampleRate = rate;
};

/**
 * Decide whether the current request should be sampled.
 * @returns {boolean}
 */
export const shouldSample = () => Math.random() < sampleRate;

/**
 * Express middleware: probabilistically record full request details.
 */
export const requestSampler = (req, res, next) => {
    if (!shouldSample()) return next();

    const start = process.hrtime.bigint();

    res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

        const sample = {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            durationMs: parseFloat(durationMs.toFixed(3)),
            query: req.query,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            userId: req.user?._id?.toString() ?? null,
            timestamp: new Date().toISOString(),
        };

        samples.unshift(sample);
        if (samples.length > MAX_SAMPLES) samples.pop();
    });

    next();
};

/**
 * Get the collected samples.
 * @param {number} [limit]
 */
export const getSamples = (limit = 50) => samples.slice(0, limit);

/**
 * Express handler: GET /diagnostics/samples
 */
export const samplesHandler = (_req, res) => {
    res.status(200).json({
        sampleRate,
        count: samples.length,
        samples: getSamples(),
    });
};

/**
 * Clear the sample buffer.
 */
export const clearSamples = () => samples.splice(0, samples.length);

export default { setSampleRate, shouldSample, requestSampler, getSamples, samplesHandler, clearSamples };
