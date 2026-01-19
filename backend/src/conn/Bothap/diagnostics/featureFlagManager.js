// diagnostics/featureFlagManager.js
// Simple in-process feature flag system for Synapse Synchrony

/**
 * Default feature flags — can be overridden via env vars or at runtime.
 */
const defaultFlags = {
    AI_CHAT: true,
    AI_SUMMARISE: true,
    VOICE_MESSAGES: true,
    LOCATION_SHARING: true,
    VIDEO_CALLS: true,
    AUDIO_CALLS: true,
    IMAGE_TO_TEXT: true,
    PUSH_NOTIFICATIONS: false,
    WELLNESS_MODULE: true,
    MEDILINK_MODULE: true,
    ADMIN_DIAGNOSTICS: process.env.NODE_ENV !== 'production',
    RATE_LIMITING: true,
};

const runtimeFlags = { ...defaultFlags };

/**
 * Check if a feature flag is enabled.
 * @param {string} flagName
 * @returns {boolean}
 */
export const isEnabled = (flagName) => runtimeFlags[flagName] === true;

/**
 * Enable a feature at runtime.
 * @param {string} flagName
 */
export const enableFlag = (flagName) => {
    runtimeFlags[flagName] = true;
};

/**
 * Disable a feature at runtime.
 * @param {string} flagName
 */
export const disableFlag = (flagName) => {
    runtimeFlags[flagName] = false;
};

/**
 * Return all current feature flags.
 */
export const getAllFlags = () => ({ ...runtimeFlags });

/**
 * Reset all flags to their defaults.
 */
export const resetFlags = () => {
    Object.assign(runtimeFlags, defaultFlags);
};

/**
 * Express middleware: return 503 if a feature is disabled.
 * @param {string} flagName
 */
export const requireFeature = (flagName) => (req, res, next) => {
    if (!isEnabled(flagName)) {
        return res.status(503).json({
            success: false,
            message: `The "${flagName}" feature is currently disabled.`,
        });
    }
    next();
};

/**
 * Express handler: GET /diagnostics/flags
 */
export const flagsHandler = (_req, res) => {
    res.status(200).json(getAllFlags());
};

export default {
    isEnabled,
    enableFlag,
    disableFlag,
    getAllFlags,
    resetFlags,
    requireFeature,
    flagsHandler,
};
