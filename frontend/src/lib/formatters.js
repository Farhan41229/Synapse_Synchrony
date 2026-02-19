// frontend/src/lib/formatters.js
// Number, file size, and count formatting utilities for Synapse Synchrony UI

/**
 * Format a number with compact notation (1200 → 1.2K, 1200000 → 1.2M).
 * @param {number} n
 * @param {number} [decimals]
 */
export const formatCompact = (n, decimals = 1) => {
    if (n === null || n === undefined || isNaN(n)) return '0';
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(decimals)}B`;
    if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(decimals)}M`;
    if (abs >= 1_000) return `${(n / 1_000).toFixed(decimals)}K`;
    return String(n);
};

/**
 * Format a number with ordinal suffix (1st, 2nd, 3rd, ...).
 * @param {number} n
 */
export const formatOrdinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/**
 * Format bytes into a human-readable string.
 * @param {number} bytes
 * @param {number} [decimals]
 */
export const formatFileSize = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Format a number as a percentage string.
 * @param {number} value - 0 to 1, or 0 to 100
 * @param {boolean} [isDecimal] - true if value is 0–1
 * @param {number} [decimals]
 */
export const formatPercent = (value, isDecimal = true, decimals = 0) => {
    const pct = isDecimal ? value * 100 : value;
    return `${pct.toFixed(decimals)}%`;
};

/**
 * Format a reaction or like count for display.
 * 0 → '' (empty), 1 → '1', 1000 → '1K'
 * @param {number} count
 */
export const formatCount = (count) => {
    if (!count || count === 0) return '';
    return formatCompact(count);
};

/**
 * Pluralise a word based on a count.
 * @param {number} count
 * @param {string} singular
 * @param {string} [plural]
 */
export const pluralise = (count, singular, plural) =>
    count === 1 ? `${count} ${singular}` : `${count} ${plural ?? singular + 's'}`;

/**
 * Format a phone number into a display-friendly format.
 * Very basic — strips non-digits and re-formats as (123) 456-7890.
 * @param {string} phone
 */
export const formatPhone = (phone = '') => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11) {
        return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return phone;
};

/**
 * Truncate a string at a word boundary.
 * @param {string} str
 * @param {number} maxWords
 */
export const truncateWords = (str = '', maxWords = 20) => {
    const words = str.trim().split(/\s+/);
    if (words.length <= maxWords) return str;
    return words.slice(0, maxWords).join(' ') + '…';
};

/**
 * Mask an email for privacy display.
 * e.g. "farhan@example.com" → "fa***@example.com"
 * @param {string} email
 */
export const maskEmail = (email = '') => {
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;
    const masked = local.slice(0, 2) + '*'.repeat(Math.max(0, local.length - 2));
    return `${masked}@${domain}`;
};

/**
 * Format a stress level (1–10) as a color.
 * @param {number} level
 */
export const stressLevelColor = (level) => {
    if (level <= 3) return 'text-green-500';
    if (level <= 6) return 'text-yellow-500';
    return 'text-red-500';
};

/**
 * Format mood emoji for display.
 * @param {'very_happy'|'happy'|'neutral'|'sad'|'very_sad'} mood
 */
export const moodEmoji = (mood) => {
    const map = {
        very_happy: '😄',
        happy: '🙂',
        neutral: '😐',
        sad: '😔',
        very_sad: '😢',
    };
    return map[mood] ?? '❓';
};

export default {
    formatCompact, formatOrdinal, formatFileSize, formatPercent,
    formatCount, pluralise, formatPhone, truncateWords,
    maskEmail, stressLevelColor, moodEmoji,
};
