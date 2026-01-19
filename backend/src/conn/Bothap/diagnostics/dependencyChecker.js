// diagnostics/dependencyChecker.js
// Verify that critical npm packages are installed at the expected version

import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Load the package.json from the backend root.
 */
const loadPackageJson = () => {
    try {
        const pkgPath = resolve(process.cwd(), 'package.json');
        return JSON.parse(readFileSync(pkgPath, 'utf-8'));
    } catch {
        return null;
    }
};

/**
 * Critical runtime dependencies and their minimum required versions.
 */
const CRITICAL_DEPS = {
    mongoose: '7',
    express: '4',
    jsonwebtoken: '9',
    bcryptjs: '2',
    zod: '3',
    'stream-chat': '8',
    cloudinary: '2',
    nodemailer: '6',
};

/**
 * Parse the major version number from a semver-style string.
 * @param {string} version - e.g. "^7.4.0" or "7.4.0"
 */
const parseMajor = (version = '') => parseInt(version.replace(/^[\^~>=]/, ''), 10);

/**
 * Check installed dependency versions against minimum requirements.
 * @returns {{ ok: boolean, results: object[] }}
 */
export const checkDependencies = () => {
    const pkg = loadPackageJson();
    if (!pkg) return { ok: false, results: [{ name: 'package.json', status: 'not_found' }] };

    const allDeps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };

    const results = Object.entries(CRITICAL_DEPS).map(([name, minMajor]) => {
        const installedVersion = allDeps[name];
        if (!installedVersion) {
            return { name, status: 'missing', installed: null, required: `>=${minMajor}.x` };
        }
        const major = parseMajor(installedVersion);
        const ok = major >= parseInt(minMajor, 10);
        return {
            name,
            status: ok ? 'ok' : 'outdated',
            installed: installedVersion,
            required: `>=${minMajor}.x`,
        };
    });

    const allOk = results.every((r) => r.status === 'ok');
    return { ok: allOk, results };
};

/**
 * Express handler: GET /diagnostics/deps
 */
export const depsHandler = (_req, res) => {
    const result = checkDependencies();
    res.status(result.ok ? 200 : 206).json(result);
};

export default { checkDependencies, depsHandler };
