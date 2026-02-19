// frontend/src/lib/dateUtils.js
// Date and time utility functions for the Synapse Synchrony frontend

/**
 * Check if a date is today.
 * @param {Date|string} date
 */
export const isToday = (date) => {
    const d = new Date(date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
};

/**
 * Check if a date is yesterday.
 * @param {Date|string} date
 */
export const isYesterday = (date) => {
    const d = new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return d.toDateString() === yesterday.toDateString();
};

/**
 * Format a date relative to now for chat timestamps.
 * e.g. "just now", "5 min", "Yesterday", "Mon", "Mar 3"
 * @param {Date|string|number} date
 */
export const formatChatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60_000);
    const diffHr = Math.floor(diffMs / 3_600_000);

    if (diffMs < 60_000) return 'just now';
    if (diffMin < 60) return `${diffMin}m`;
    if (isToday(d))
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (isYesterday(d)) return 'Yesterday';

    const diffDays = Math.floor(diffMs / 86_400_000);
    if (diffDays < 7) return d.toLocaleDateString('en-US', { weekday: 'short' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Format a full timestamp for message detail views.
 * e.g. "Mon, Mar 3, 2026 at 04:00 AM"
 * @param {Date|string} date
 */
export const formatFullTimestamp = (date) =>
    new Date(date).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

/**
 * Format a date for event cards.
 * e.g. "Tue, Mar 3" or "Mar 3, 2026"
 * @param {Date|string} date
 * @param {boolean} [includeYear]
 */
export const formatEventDate = (date, includeYear = false) =>
    new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        ...(includeYear ? { year: 'numeric' } : {}),
    });

/**
 * Format a time string from a Date.
 * e.g. "4:00 AM"
 * @param {Date|string} date
 */
export const formatTime = (date) =>
    new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

/**
 * Get the number of days until a future date.
 * Returns negative for past dates.
 * @param {Date|string} date
 */
export const daysUntil = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = d - now;
    return Math.ceil(diffMs / 86_400_000);
};

/**
 * Get time elapsed since a date as a human-readable string.
 * @param {Date|string} date
 */
export const timeAgo = (date) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    const week = Math.floor(day / 7);
    const month = Math.floor(day / 30);
    const year = Math.floor(day / 365);

    if (sec < 60) return 'just now';
    if (min < 60) return `${min}m ago`;
    if (hr < 24) return `${hr}h ago`;
    if (day < 7) return `${day}d ago`;
    if (week < 4) return `${week}w ago`;
    if (month < 12) return `${month}mo ago`;
    return `${year}y ago`;
};

/**
 * Format a duration in seconds into MM:SS or HH:MM:SS.
 * @param {number} seconds
 */
export const formatDuration = (seconds) => {
    const s = Math.floor(seconds);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const pad = (n) => String(n).padStart(2, '0');

    return h > 0
        ? `${pad(h)}:${pad(m)}:${pad(sec)}`
        : `${pad(m)}:${pad(sec)}`;
};

/**
 * Check if an event has already passed.
 * @param {Date|string} endDate
 */
export const isEventOver = (endDate) => new Date(endDate) < new Date();

/**
 * Get an array of the last N days as Date objects.
 * @param {number} days
 */
export const getLastNDays = (days) =>
    Array.from({ length: days }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        d.setHours(0, 0, 0, 0);
        return d;
    });

/**
 * Format a Date as a short YYYY-MM-DD string.
 * @param {Date|string} date
 */
export const toYMD = (date) => new Date(date).toISOString().slice(0, 10);

/**
 * Get the start and end of the current week (Sunday to Saturday).
 * @returns {{ start: Date, end: Date }}
 */
export const getCurrentWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    const start = new Date(now);
    start.setDate(now.getDate() - day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

export default {
    isToday, isYesterday, formatChatTime, formatFullTimestamp,
    formatEventDate, formatTime, daysUntil, timeAgo, formatDuration,
    isEventOver, getLastNDays, toYMD, getCurrentWeekRange,
};
