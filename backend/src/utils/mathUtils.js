// backend/src/utils/mathUtils.js
// Mathematical and statistical helpers for Synapse Synchrony analytics

/**
 * Clamp a number between min and max.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Linear interpolation between two values.
 * @param {number} a
 * @param {number} b
 * @param {number} t - 0 to 1
 */
export const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Inverse lerp: find t given a value between a and b.
 * @param {number} a
 * @param {number} b
 * @param {number} val
 */
export const inverseLerp = (a, b, val) =>
    a === b ? 0 : clamp((val - a) / (b - a), 0, 1);

/**
 * Remap a value from one range to another.
 * @param {number} val
 * @param {number} inMin
 * @param {number} inMax
 * @param {number} outMin
 * @param {number} outMax
 */
export const remap = (val, inMin, inMax, outMin, outMax) =>
    lerp(outMin, outMax, inverseLerp(inMin, inMax, val));

/**
 * Round a number to N decimal places.
 * @param {number} val
 * @param {number} [decimals]
 */
export const round = (val, decimals = 0) => {
    const factor = 10 ** decimals;
    return Math.round(val * factor) / factor;
};

/**
 * Calculate the median of an array of numbers.
 * @param {number[]} arr
 */
export const median = (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
};

/**
 * Calculate the mode of an array (most frequent value).
 * @param {number[]} arr
 */
export const mode = (arr) => {
    const freq = new Map();
    for (const v of arr) freq.set(v, (freq.get(v) ?? 0) + 1);
    let maxCount = 0;
    let modeVal = arr[0];
    for (const [v, count] of freq) {
        if (count > maxCount) { maxCount = count; modeVal = v; }
    }
    return modeVal;
};

/**
 * Calculate standard deviation of an array.
 * @param {number[]} arr
 * @param {'population'|'sample'} [type]
 */
export const stdDev = (arr, type = 'population') => {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((acc, v) => acc + (v - mean) ** 2, 0) /
        (type === 'sample' ? arr.length - 1 : arr.length);
    return Math.sqrt(variance);
};

/**
 * Calculate variance of an array.
 * @param {number[]} arr
 */
export const variance = (arr) => {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((acc, v) => acc + (v - mean) ** 2, 0) / arr.length;
};

/**
 * Calculate percentile of a sorted array.
 * @param {number[]} arr
 * @param {number} p - 0 to 100
 */
export const percentile = (arr, p) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
};

/**
 * Greatest Common Divisor (Euclidean algorithm).
 * @param {number} a
 * @param {number} b
 */
export const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/**
 * Least Common Multiple.
 * @param {number} a
 * @param {number} b
 */
export const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

/**
 * Check if a number is prime.
 * @param {number} n
 */
export const isPrime = (n) => {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
};

/**
 * Fibonacci number at index n (iterative).
 * @param {number} n
 */
export const fibonacci = (n) => {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
    return b;
};

/**
 * Factorial of n.
 * @param {number} n
 */
export const factorial = (n) => {
    if (n < 0) throw new Error('Factorial of negative number is undefined.');
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
};

/**
 * Convert degrees to radians.
 * @param {number} deg
 */
export const degToRad = (deg) => (deg * Math.PI) / 180;

/**
 * Convert radians to degrees.
 * @param {number} rad
 */
export const radToDeg = (rad) => (rad * 180) / Math.PI;

/**
 * Format a number as a currency string.
 * @param {number} amount
 * @param {string} [currency]
 * @param {string} [locale]
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') =>
    new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);

/**
 * Format a large number with compact notation (e.g. 1200 → 1.2K).
 * @param {number} n
 */
export const formatCompact = (n) => {
    if (n >= 1_000_000) return `${round(n / 1_000_000, 1)}M`;
    if (n >= 1_000) return `${round(n / 1_000, 1)}K`;
    return String(n);
};

/**
 * Normalize an array of numbers to the [0, 1] range.
 * @param {number[]} arr
 */
export const normalize = (arr) => {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    if (min === max) return arr.map(() => 0);
    return arr.map((v) => (v - min) / (max - min));
};

export default {
    clamp, lerp, inverseLerp, remap, round,
    median, mode, stdDev, variance, percentile,
    gcd, lcm, isPrime, fibonacci, factorial,
    degToRad, radToDeg, formatCurrency, formatCompact, normalize,
};
