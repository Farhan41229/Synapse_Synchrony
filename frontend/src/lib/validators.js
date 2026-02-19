// frontend/src/lib/validators.js
// Client-side validation helpers for Synapse Synchrony forms

/**
 * Check if a value is not empty (string, array, or object).
 * @param {*} val
 */
export const isRequired = (val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === 'string') return val.trim().length > 0;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'object') return Object.keys(val).length > 0;
    return true;
};

/**
 * Validate email address format.
 * @param {string} email
 */
export const isValidEmail = (email = '') =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/**
 * Validate password strength.
 * Returns { valid, errors }.
 * @param {string} password
 */
export const validatePassword = (password = '') => {
    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters.');
    if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter.');
    if (!/[0-9]/.test(password)) errors.push('At least one number.');
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
        errors.push('At least one special character (optional but recommended).');

    const criticalErrors = errors.filter((e) => !e.includes('optional'));
    return { valid: criticalErrors.length === 0, errors };
};

/**
 * Validate that two passwords match.
 * @param {string} p1
 * @param {string} p2
 */
export const passwordsMatch = (p1, p2) => p1 === p2;

/**
 * Validate a phone number (basic international format).
 * @param {string} phone
 */
export const isValidPhone = (phone = '') =>
    /^\+?[0-9\s\-().]{7,20}$/.test(phone.trim());

/**
 * Validate a URL.
 * @param {string} url
 */
export const isValidUrl = (url = '') => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Validate a MongoDB ObjectId (24-char hex).
 * @param {string} id
 */
export const isValidObjectId = (id = '') =>
    /^[a-f\d]{24}$/i.test(id);

/**
 * Validate that a string is within min/max length.
 * @param {string} str
 * @param {number} min
 * @param {number} [max]
 */
export const inLength = (str = '', min = 0, max = Infinity) =>
    str.trim().length >= min && str.trim().length <= max;

/**
 * Validate a date string is not in the past.
 * @param {string} dateStr
 */
export const isFutureDate = (dateStr) => new Date(dateStr) > new Date();

/**
 * Validate a file's MIME type against an allowed list.
 * @param {File} file
 * @param {string[]} allowedTypes
 */
export const isAllowedFileType = (file, allowedTypes) =>
    allowedTypes.includes(file?.type);

/**
 * Validate a file's size in bytes.
 * @param {File} file
 * @param {number} maxBytes
 */
export const isFileSizeOk = (file, maxBytes) => file?.size <= maxBytes;

/**
 * Get the strength label and score (0–4) for a password.
 * @param {string} password
 * @returns {{ score: number, label: 'Very Weak'|'Weak'|'Fair'|'Strong'|'Very Strong' }}
 */
export const getPasswordStrength = (password = '') => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    return { score: Math.min(score, 4), label: labels[Math.min(score, 4)] };
};

export default {
    isRequired, isValidEmail, validatePassword, passwordsMatch,
    isValidPhone, isValidUrl, isValidObjectId, inLength,
    isFutureDate, isAllowedFileType, isFileSizeOk, getPasswordStrength,
};
