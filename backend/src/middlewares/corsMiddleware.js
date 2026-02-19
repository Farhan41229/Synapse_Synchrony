// backend/src/middlewares/corsMiddleware.js
// CORS configuration for Synapse Synchrony API

import cors from 'cors';

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

// Always allow localhost in development
if (process.env.NODE_ENV !== 'production') {
    ALLOWED_ORIGINS.push(
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173'
    );
}

/**
 * Dynamic origin validator.
 * @param {string} origin
 * @param {Function} callback
 */
const originValidator = (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
    }

    callback(new Error(`CORS policy: Origin "${origin}" is not allowed.`));
};

/**
 * Main CORS middleware configuration.
 */
export const corsOptions = {
    origin: originValidator,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
    ],
    exposedHeaders: [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-Cache',
        'X-Request-Id',
    ],
    credentials: true,
    maxAge: 86400, // 24 hours preflight cache
};

export const corsMiddleware = cors(corsOptions);

/**
 * Permissive CORS for public/read-only endpoints.
 */
export const publicCors = cors({
    origin: '*',
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: false,
    maxAge: 3600,
});

/**
 * Strict CORS for auth routes — only exact origins allowed.
 */
export const strictCors = cors({
    origin: ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS : false,
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});

export default { corsMiddleware, publicCors, strictCors, corsOptions };
