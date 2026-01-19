// transformers/dateTransformer.js
// Date/time formatting utilities used across Synapse Synchrony

/**
 * Format a Date to a human-readable string e.g. "Mar 3, 2026".
 * @param {Date|string|number} date
 * @param {string} [locale]
 */
export const toReadableDate = (date, locale = 'en-US') =>
    new Date(date).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

/**
 * Format a Date to include time e.g. "Mar 3, 2026, 04:00 AM".
 * @param {Date|string|number} date
 * @param {string} [locale]
 */
export const toReadableDateTime = (date, locale = 'en-US') =>
    new Date(date).toLocaleString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

/**
 * Convert a Date to a relative time string e.g. "2 hours ago".
 * @param {Date|string|number} date
 */
export const toRelativeTime = (date) => {
    const now = Date.now();
    const diffMs = now - new Date(date).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffWeek = Math.floor(diffDay / 7);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
    if (diffWeek < 4) return `${diffWeek} week${diffWeek === 1 ? '' : 's'} ago`;
    return toReadableDate(date);
};

/**
 * Return ISO string with only the date portion.
 * @param {Date|string} date
 * @returns {string} e.g. "2026-03-03"
 */
export const toISODateOnly = (date) => new Date(date).toISOString().slice(0, 10);

/**
 * Check if a date is in the past.
 * @param {Date|string} date
 */
export const isPast = (date) => new Date(date) < new Date();

/**
 * Check if two dates fall on the same calendar day.
 * @param {Date|string} a
 * @param {Date|string} b
 */
export const isSameDay = (a, b) =>
    toISODateOnly(a) === toISODateOnly(b);

/**
 * Add N days to a date.
 * @param {Date|string} date
 * @param {number} days
 * @returns {Date}
 */
export const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

export default { toReadableDate, toReadableDateTime, toRelativeTime, toISODateOnly, isPast, isSameDay, addDays };
