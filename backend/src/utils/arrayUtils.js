// backend/src/utils/arrayUtils.js
// Comprehensive array manipulation utilities for Synapse Synchrony backend

/**
 * Remove duplicate values from an array (shallow comparison).
 * @param {Array} arr
 * @returns {Array}
 */
export const unique = (arr) => [...new Set(arr)];

/**
 * Remove duplicate objects from an array by a specific key.
 * @param {object[]} arr
 * @param {string} key
 */
export const uniqueBy = (arr, key) => {
    const seen = new Set();
    return arr.filter((item) => {
        const val = item[key];
        if (seen.has(val)) return false;
        seen.add(val);
        return true;
    });
};

/**
 * Chunk an array into groups of `size`.
 * @param {Array} arr
 * @param {number} size
 */
export const chunk = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

/**
 * Flatten an array one level deep.
 * @param {Array[]} arr
 */
export const flatten = (arr) => arr.reduce((acc, val) => acc.concat(val), []);

/**
 * Deep flatten an array.
 * @param {Array} arr
 */
export const deepFlatten = (arr) =>
    arr.reduce(
        (acc, val) => acc.concat(Array.isArray(val) ? deepFlatten(val) : val),
        []
    );

/**
 * Group an array of objects by a key.
 * @param {object[]} arr
 * @param {string|Function} keyOrFn
 * @returns {Record<string, object[]>}
 */
export const groupBy = (arr, keyOrFn) => {
    const getKey = typeof keyOrFn === 'function' ? keyOrFn : (item) => item[keyOrFn];
    return arr.reduce((acc, item) => {
        const key = getKey(item);
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
};

/**
 * Sort an array of objects by a key ascending or descending.
 * @param {object[]} arr
 * @param {string} key
 * @param {'asc'|'desc'} [order]
 */
export const sortBy = (arr, key, order = 'asc') =>
    [...arr].sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
    });

/**
 * Pick random N items from an array.
 * @param {Array} arr
 * @param {number} n
 */
export const sample = (arr, n = 1) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return n === 1 ? shuffled[0] : shuffled.slice(0, n);
};

/**
 * Intersect two arrays.
 * @param {Array} a
 * @param {Array} b
 */
export const intersect = (a, b) => a.filter((v) => b.includes(v));

/**
 * Difference between two arrays (elements in `a` not in `b`).
 * @param {Array} a
 * @param {Array} b
 */
export const difference = (a, b) => a.filter((v) => !b.includes(v));

/**
 * Union of two arrays (unique values from both).
 * @param {Array} a
 * @param {Array} b
 */
export const union = (a, b) => unique([...a, ...b]);

/**
 * Partition an array into two groups based on a predicate.
 * @param {Array} arr
 * @param {Function} predicate
 * @returns {[Array, Array]} [passing, failing]
 */
export const partition = (arr, predicate) => {
    const pass = [];
    const fail = [];
    for (const item of arr) {
        (predicate(item) ? pass : fail).push(item);
    }
    return [pass, fail];
};

/**
 * Count occurrences of each value in an array.
 * @param {Array} arr
 * @returns {Map<any, number>}
 */
export const countBy = (arr) => {
    const map = new Map();
    for (const item of arr) {
        map.set(item, (map.get(item) ?? 0) + 1);
    }
    return map;
};

/**
 * Zip two arrays together into an array of pairs.
 * @param {Array} a
 * @param {Array} b
 */
export const zip = (a, b) => a.map((v, i) => [v, b[i]]);

/**
 * Move an element in an array from one index to another (immutable).
 * @param {Array} arr
 * @param {number} fromIndex
 * @param {number} toIndex
 */
export const move = (arr, fromIndex, toIndex) => {
    const result = [...arr];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
};

/**
 * Find the min/max value in an array of objects by a key.
 * @param {object[]} arr
 * @param {string} key
 */
export const minBy = (arr, key) => arr.reduce((min, item) => (item[key] < min[key] ? item : min));
export const maxBy = (arr, key) => arr.reduce((max, item) => (item[key] > max[key] ? item : max));

/**
 * Sum all values in an array, or sum by a key for objects.
 * @param {Array} arr
 * @param {string} [key]
 */
export const sum = (arr, key) =>
    arr.reduce((acc, item) => acc + (key != null ? item[key] : item), 0);

/**
 * Average values in an array.
 * @param {number[]} arr
 */
export const average = (arr) => (arr.length === 0 ? 0 : sum(arr) / arr.length);

/**
 * Get the last N elements of an array.
 * @param {Array} arr
 * @param {number} n
 */
export const last = (arr, n = 1) =>
    n === 1 ? arr[arr.length - 1] : arr.slice(-n);

/**
 * Rotate an array left or right by a given number of positions.
 * @param {Array} arr
 * @param {number} positions - positive = rotate left, negative = rotate right
 */
export const rotate = (arr, positions) => {
    const n = arr.length;
    if (n === 0) return arr;
    const shift = ((positions % n) + n) % n;
    return [...arr.slice(shift), ...arr.slice(0, shift)];
};

/**
 * Check if an array is sorted in ascending order.
 * @param {Array} arr
 */
export const isSorted = (arr) => arr.every((v, i) => i === 0 || arr[i - 1] <= v);

/**
 * Generate an array of numbers from start to end (inclusive).
 * @param {number} start
 * @param {number} end
 * @param {number} [step]
 */
export const range = (start, end, step = 1) => {
    const result = [];
    for (let i = start; i <= end; i += step) result.push(i);
    return result;
};

/**
 * Randomly shuffle an array (Fisher-Yates).
 * @param {Array} arr
 */
export const shuffle = (arr) => {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

export default {
    unique, uniqueBy, chunk, flatten, deepFlatten,
    groupBy, sortBy, sample, intersect, difference, union,
    partition, countBy, zip, move, minBy, maxBy,
    sum, average, last, rotate, isSorted, range, shuffle,
};
