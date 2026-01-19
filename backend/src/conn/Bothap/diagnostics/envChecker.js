// diagnostics/envChecker.js
// Validate required environment variables at application startup

/**
 * Defines the required env vars per feature area.
 */
const REQUIRED_ENV = {
    core: ['NODE_ENV', 'PORT', 'MONGO_URI', 'JWT_SECRET'],
    cloudinary: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
    stream: ['STREAM_API_KEY', 'STREAM_API_SECRET'],
    openai: ['OPENAI_API_KEY'],
    email: ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS'],
    redis: ['REDIS_URL'],
};

/**
 * Check for missing environment variables in a given scope.
 * @param {string} scope - key of REQUIRED_ENV
 * @returns {string[]} names of missing vars
 */
export const getMissing = (scope) => {
    const vars = REQUIRED_ENV[scope] ?? [];
    return vars.filter((key) => !process.env[key]);
};

/**
 * Validate all required environment variables.
 * Throws an aggregated error if any are missing.
 * @param {string[]} [scopes] - which scopes to check; defaults to all
 * @throws {Error}
 */
export const validateEnv = (scopes = Object.keys(REQUIRED_ENV)) => {
    const allMissing = [];

    for (const scope of scopes) {
        const missing = getMissing(scope);
        if (missing.length > 0) {
            allMissing.push(...missing.map((v) => `[${scope}] ${v}`));
        }
    }

    if (allMissing.length > 0) {
        throw new Error(
            `[EnvChecker] Missing required environment variables:\n  ${allMissing.join('\n  ')}`
        );
    }
};

/**
 * Soft check — logs warnings without throwing.
 * @param {string[]} [scopes]
 */
export const warnMissingEnv = (scopes = Object.keys(REQUIRED_ENV)) => {
    for (const scope of scopes) {
        const missing = getMissing(scope);
        if (missing.length > 0) {
            console.warn(
                `[EnvChecker] WARNING: Missing ${scope} env vars: ${missing.join(', ')}`
            );
        }
    }
};

/**
 * Return the current NODE_ENV.
 * @returns {'development'|'production'|'test'}
 */
export const getEnvironment = () =>
    (process.env.NODE_ENV ?? 'development');

/**
 * Returns true when running in production.
 */
export const isProduction = () => getEnvironment() === 'production';

/**
 * Returns true when running in test mode.
 */
export const isTest = () => getEnvironment() === 'test';

export default { getMissing, validateEnv, warnMissingEnv, getEnvironment, isProduction, isTest };
