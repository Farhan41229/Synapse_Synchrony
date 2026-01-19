// diagnostics/systemInfo.js
// Expose Node.js and OS runtime information for diagnostic endpoints

import os from 'os';

/**
 * Collect Node.js process runtime information.
 */
export const getProcessInfo = () => ({
    pid: process.pid,
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    uptime: `${Math.floor(process.uptime())}s`,
    memoryUsage: {
        rss: formatBytes(process.memoryUsage().rss),
        heapTotal: formatBytes(process.memoryUsage().heapTotal),
        heapUsed: formatBytes(process.memoryUsage().heapUsed),
        external: formatBytes(process.memoryUsage().external),
    },
    cpuUsage: process.cpuUsage(),
});

/**
 * Collect system / OS information.
 */
export const getSystemInfo = () => ({
    hostname: os.hostname(),
    osType: os.type(),
    osRelease: os.release(),
    arch: os.arch(),
    totalMemory: formatBytes(os.totalmem()),
    freeMemory: formatBytes(os.freemem()),
    cpuCount: os.cpus().length,
    cpuModel: os.cpus()[0]?.model ?? 'Unknown',
    loadAvg: os.loadavg(),
    networkInterfaces: sanitiseNetworkInterfaces(os.networkInterfaces()),
    uptimeSec: os.uptime(),
});

/**
 * Express handler: GET /diagnostics/system
 */
export const systemInfoHandler = (_req, res) => {
    res.status(200).json({
        process: getProcessInfo(),
        system: getSystemInfo(),
        timestamp: new Date().toISOString(),
    });
};

/**
 * Format bytes into a human-readable string.
 * @param {number} bytes
 */
export const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const pow = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** pow).toFixed(2)} ${units[pow]}`;
};

/**
 * Sanitise network interfaces: strip private IPv6 and loopback entries.
 * @param {object} interfaces
 */
const sanitiseNetworkInterfaces = (interfaces) => {
    const result = {};
    for (const [name, addrs] of Object.entries(interfaces)) {
        result[name] = (addrs ?? [])
            .filter((a) => a.family === 'IPv4' && !a.internal)
            .map((a) => a.address);
    }
    return result;
};

export default { getProcessInfo, getSystemInfo, systemInfoHandler, formatBytes };
