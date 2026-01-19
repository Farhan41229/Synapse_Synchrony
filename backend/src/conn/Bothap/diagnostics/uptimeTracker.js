// diagnostics/uptimeTracker.js
// Track application uptime and generate uptime report strings

const startTime = Date.now();

/**
 * Get application uptime in milliseconds.
 */
export const getUptimeMs = () => Date.now() - startTime;

/**
 * Get application uptime as a human-readable string.
 * @returns {string} e.g. "3d 4h 12m 8s"
 */
export const getUptimeString = () => {
    const totalSeconds = Math.floor(getUptimeMs() / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
};

/**
 * Return a structured uptime report object.
 */
export const getUptimeReport = () => ({
    startedAt: new Date(startTime).toISOString(),
    currentTime: new Date().toISOString(),
    uptimeMs: getUptimeMs(),
    uptimeHuman: getUptimeString(),
    processPid: process.pid,
    nodeVersion: process.version,
});

/**
 * Express handler: GET /diagnostics/uptime
 */
export const uptimeHandler = (_req, res) => {
    res.status(200).json(getUptimeReport());
};

export default { getUptimeMs, getUptimeString, getUptimeReport, uptimeHandler };
