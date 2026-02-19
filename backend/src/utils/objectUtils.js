// backend/src/utils/objectUtils.js
// Object manipulation helpers for Synapse Synchrony

/**
 * Deep clone an object using JSON serialization.
 * Note: Does not handle functions, Dates, RegExp, or undefined values.
 * @param {object} obj
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Deep merge two objects. Arrays are replaced, not merged.
 * @param {object} target
 * @param {object} source
 */
export const deepMerge = (target, source) => {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        if (
            source[key] !== null &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key]) &&
            key in target &&
            typeof target[key] === 'object'
        ) {
            result[key] = deepMerge(target[key], source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
};

/**
 * Pick specific keys from an object.
 * @param {object} obj
 * @param {string[]} keys
 */
export const pick = (obj, keys) =>
    Object.fromEntries(keys.filter((k) => k in obj).map((k) => [k, obj[k]]));

/**
 * Omit specific keys from an object.
 * @param {object} obj
 * @param {string[]} keys
 */
export const omit = (obj, keys) =>
    Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));

/**
 * Flatten a nested object into a flat key-value map with dot-notation keys.
 * @param {object} obj
 * @param {string} [prefix]
 */
export const flattenObject = (obj, prefix = '') => {
    const result = {};
    for (const [key, val] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
            Object.assign(result, flattenObject(val, fullKey));
        } else {
            result[fullKey] = val;
        }
    }
    return result;
};

/**
 * Unflatten a dot-notation flat object back into a nested object.
 * @param {object} obj
 */
export const unflattenObject = (obj) => {
    const result = {};
    for (const [key, val] of Object.entries(obj)) {
        const parts = key.split('.');
        let cur = result;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!cur[parts[i]]) cur[parts[i]] = {};
            cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = val;
    }
    return result;
};

/**
 * Check if an object is empty (has no own enumerable properties).
 * @param {object} obj
 */
export const isEmpty = (obj) =>
    obj == null || Object.keys(obj).length === 0;

/**
 * Deep equality check between two values.
 * @param {*} a
 * @param {*} b
 */
export const deepEqual = (a, b) => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return a === b;

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((v, i) => deepEqual(v, b[i]));
    }

    if (typeof a === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        return keysA.every((k) => deepEqual(a[k], b[k]));
    }

    return false;
};

/**
 * Rename keys in an object using a mapping.
 * @param {object} obj
 * @param {Record<string, string>} keyMap - { oldKey: newKey }
 */
export const renameKeys = (obj, keyMap) =>
    Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [keyMap[k] ?? k, v])
    );

/**
 * Invert an object (swap keys and values).
 * @param {object} obj
 */
export const invertObject = (obj) =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));

/**
 * Filter object entries by a predicate on [key, value].
 * @param {object} obj
 * @param {Function} predicate
 */
export const filterObject = (obj, predicate) =>
    Object.fromEntries(Object.entries(obj).filter(([k, v]) => predicate(k, v)));

/**
 * Map object values using a transform function.
 * @param {object} obj
 * @param {Function} fn
 */
export const mapValues = (obj, fn) =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v, k)]));

/**
 * Map object keys using a transform function.
 * @param {object} obj
 * @param {Function} fn
 */
export const mapKeys = (obj, fn) =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [fn(k, v), v]));

/**
 * Remove keys with null or undefined values from an object.
 * @param {object} obj
 */
export const compactObject = (obj) =>
    filterObject(obj, (_, v) => v != null);

/**
 * Get a nested value by a dot-notation path.
 * @param {object} obj
 * @param {string} path - e.g. "user.profile.name"
 * @param {*} [defaultVal]
 */
export const getIn = (obj, path, defaultVal = undefined) => {
    const parts = path.split('.');
    let cur = obj;
    for (const part of parts) {
        if (cur == null) return defaultVal;
        cur = cur[part];
    }
    return cur ?? defaultVal;
};

/**
 * Set a nested value by a dot-notation path (immutable).
 * @param {object} obj
 * @param {string} path
 * @param {*} value
 */
export const setIn = (obj, path, value) => {
    const parts = path.split('.');
    const result = { ...obj };
    let cur = result;
    for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] = { ...cur[parts[i]] };
        cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
    return result;
};

/**
 * Convert an array of objects to a Map keyed by a field.
 * @param {object[]} arr
 * @param {string} key
 */
export const toMap = (arr, key) =>
    new Map(arr.map((item) => [item[key], item]));

/**
 * Convert an array of objects to a lookup object keyed by a field.
 * @param {object[]} arr
 * @param {string} key
 */
export const toLookup = (arr, key) =>
    Object.fromEntries(arr.map((item) => [item[key], item]));

export default {
    deepClone, deepMerge, pick, omit, flattenObject, unflattenObject,
    isEmpty, deepEqual, renameKeys, invertObject, filterObject,
    mapValues, mapKeys, compactObject, getIn, setIn, toMap, toLookup,
};
