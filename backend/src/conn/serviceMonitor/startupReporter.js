// serviceMonitor/startupReporter.js
// Prints a formatted startup summary to the console when the server initializes

import mongoose from 'mongoose';

/**
 * Prints a formatted startup banner with connection and configuration details.
 * @param {object} config
 * @param {number} config.port - HTTP server port
 * @param {string} config.env - Current NODE_ENV
 * @param {string} config.dbUri - MongoDB connection URI (masked)
 */
export const printStartupBanner = (config = {}) => {
    const { port = 5000, env = 'development', dbUri = '' } = config;

    const maskedUri = dbUri.includes('@')
        ? dbUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
        : (dbUri.substring(0, 20) + '...' || 'Not configured');

    const banner = `
╔═══════════════════════════════════════════════════════════╗
║           ⚡ SYNAPSE SYNCHRONY API SERVER ⚡              ║
╠═══════════════════════════════════════════════════════════╣
║  Status    : ✅ Online                                     ║
║  Port      : ${String(port).padEnd(43)} ║
║  Env       : ${String(env).padEnd(43)} ║
║  Database  : ${maskedUri.substring(0, 43).padEnd(43)} ║
║  Time      : ${new Date().toISOString().padEnd(43)} ║
║  Node.js   : ${process.version.padEnd(43)} ║
╠═══════════════════════════════════════════════════════════╣
║  Features Active:                                         ║
║  • MongoDB Connection Manager                             ║
║  • Socket.IO Real-Time Handlers                           ║
║  • AI Clients (Gemini, Groq, HuggingFace)                 ║
║  • Cloudinary Storage Integration                         ║
║  • Stream Chat Integration                                ║
║  • In-Memory Cache                                        ║
║  • Email Provider (Brevo)                                 ║
╚═══════════════════════════════════════════════════════════╝`;

    console.log(banner);
};

/**
 * Checks all required environment variables and reports missing ones.
 * @returns {{ allPresent: boolean, missing: string[], present: string[] }}
 */
export const checkRequiredEnvVars = () => {
    const required = [
        'MONGO_URI',
        'JWT_SECRET',
        'BREVO_API_KEY',
        'GOOGLE_API_KEY',
        'GROQ_API_KEY',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
        'STREAM_API_KEY',
        'STREAM_API_SECRET',
        'CLIENT_URL',
    ];

    const missing = required.filter((key) => !process.env[key]);
    const present = required.filter((key) => !!process.env[key]);

    if (missing.length > 0) {
        console.warn(`\n[StartupReporter] ⚠️  Missing ${missing.length} environment variable(s):`);
        missing.forEach((key) => console.warn(`  - ${key}`));
    } else {
        console.log('[StartupReporter] ✅ All required environment variables are set.');
    }

    return { allPresent: missing.length === 0, missing, present };
};

/**
 * Reports the mongoose connection state on startup.
 */
export const reportDatabaseStatus = () => {
    const state = mongoose.connection.readyState;
    const states = { 0: 'Disconnected', 1: 'Connected ✅', 2: 'Connecting...', 3: 'Disconnecting' };
    console.log(`[StartupReporter] Database state: ${states[state] || 'Unknown'}`);
};

export default { printStartupBanner, checkRequiredEnvVars, reportDatabaseStatus };
