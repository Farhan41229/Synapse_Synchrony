// backend/src/utils/stringUtils.js
// String manipulation helpers for Synapse Synchrony backend

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 */
export const capitalize = (str = '') =>
    str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Convert a string to title case.
 * e.g. "hello world" → "Hello World"
 * @param {string} str
 */
export const titleCase = (str = '') =>
    str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Convert camelCase to snake_case.
 * @param {string} str
 */
export const camelToSnake = (str = '') =>
    str.replace(/([A-Z])/g, '_$1').toLowerCase();

/**
 * Convert snake_case to camelCase.
 * @param {string} str
 */
export const snakeToCamel = (str = '') =>
    str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

/**
 * Convert PascalCase to kebab-case.
 * @param {string} str
 */
export const pascalToKebab = (str = '') =>
    str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');

/**
 * Truncate a string to a max length with an optional suffix.
 * @param {string} str
 * @param {number} maxLen
 * @param {string} [suffix]
 */
export const truncate = (str = '', maxLen = 100, suffix = '...') =>
    str.length <= maxLen ? str : str.slice(0, maxLen - suffix.length) + suffix;

/**
 * Pad a string on the left to a target length.
 * @param {string} str
 * @param {number} length
 * @param {string} [char]
 */
export const padLeft = (str, length, char = '0') =>
    String(str).padStart(length, char);

/**
 * Pad a string on the right to a target length.
 * @param {string} str
 * @param {number} length
 * @param {string} [char]
 */
export const padRight = (str, length, char = ' ') =>
    String(str).padEnd(length, char);

/**
 * Strip HTML tags from a string.
 * @param {string} html
 */
export const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '');

/**
 * Escape HTML special characters.
 * @param {string} str
 */
export const escapeHtml = (str = '') =>
    str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

/**
 * Unescape HTML entities.
 * @param {string} str
 */
export const unescapeHtml = (str = '') =>
    str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");

/**
 * Count words in a string.
 * @param {string} str
 */
export const wordCount = (str = '') =>
    str.trim() === '' ? 0 : str.trim().split(/\s+/).length;

/**
 * Check if a string is a valid email address.
 * @param {string} str
 */
export const isEmail = (str = '') =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

/**
 * Check if a string is a valid URL.
 * @param {string} str
 */
export const isUrl = (str = '') => {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
};

/**
 * Mask part of a string (useful for emails, phone numbers).
 * e.g. maskMiddle("hello@example.com", 2, 5) → "he***@example.com"
 * @param {string} str
 * @param {number} showStart
 * @param {number} showEnd
 * @param {string} [maskChar]
 */
export const maskMiddle = (str = '', showStart = 2, showEnd = 2, maskChar = '*') => {
    if (str.length <= showStart + showEnd) return str;
    const start = str.slice(0, showStart);
    const end = str.slice(str.length - showEnd);
    const middle = maskChar.repeat(str.length - showStart - showEnd);
    return `${start}${middle}${end}`;
};

/**
 * Repeat a string N times.
 * @param {string} str
 * @param {number} times
 */
export const repeat = (str, times) => str.repeat(Math.max(0, times));

/**
 * Count occurrences of a substring in a string.
 * @param {string} str
 * @param {string} sub
 */
export const countOccurrences = (str, sub) => {
    if (!sub) return 0;
    let count = 0;
    let pos = 0;
    while ((pos = str.indexOf(sub, pos)) !== -1) {
        count++;
        pos += sub.length;
    }
    return count;
};

/**
 * Reverse a string.
 * @param {string} str
 */
export const reverse = (str = '') => str.split('').reverse().join('');

/**
 * Check if a string is a palindrome.
 * @param {string} str
 */
export const isPalindrome = (str = '') => {
    const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return clean === reverse(clean);
};

/**
 * Generate a simple random alphanumeric string of a given length.
 * @param {number} length
 */
export const randomString = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

/**
 * Extract all email addresses from a block of text.
 * @param {string} text
 */
export const extractEmails = (text = '') =>
    text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/g) ?? [];

/**
 * Extract all URLs from a block of text.
 * @param {string} text
 */
export const extractUrls = (text = '') =>
    text.match(/https?:\/\/[^\s]+/g) ?? [];

/**
 * Replace all occurrences of a substring (non-regex).
 * @param {string} str
 * @param {string} search
 * @param {string} replace
 */
export const replaceAll = (str, search, replace) =>
    str.split(search).join(replace);

/**
 * Convert a string to a safe filename (replace non-alphanumeric with dashes).
 * @param {string} str
 */
export const toSafeFilename = (str = '') =>
    str.replace(/[^a-z0-9.]/gi, '-').replace(/-{2,}/g, '-').toLowerCase();

/**
 * Wrap a string at a given column width.
 * @param {string} str
 * @param {number} width
 */
export const wordWrap = (str = '', width = 80) => {
    const words = str.split(' ');
    const lines = [];
    let current = '';
    for (const word of words) {
        if ((current + ' ' + word).trim().length > width) {
            if (current) lines.push(current);
            current = word;
        } else {
            current = current ? `${current} ${word}` : word;
        }
    }
    if (current) lines.push(current);
    return lines.join('\n');
};

export default {
    capitalize, titleCase, camelToSnake, snakeToCamel, pascalToKebab,
    truncate, padLeft, padRight, stripHtml, escapeHtml, unescapeHtml,
    wordCount, isEmail, isUrl, maskMiddle, repeat, countOccurrences,
    reverse, isPalindrome, randomString, extractEmails, extractUrls,
    replaceAll, toSafeFilename, wordWrap,
};
