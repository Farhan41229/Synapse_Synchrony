// emailConn/emailValidator.js
// Email address and content validation utilities

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {{ valid: boolean, reason?: string }}
 */
export const validateEmailAddress = (email) => {
    if (!email || typeof email !== 'string') {
        return { valid: false, reason: 'Email must be a non-empty string.' };
    }

    const trimmed = email.trim().toLowerCase();
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

    if (!EMAIL_REGEX.test(trimmed)) {
        return { valid: false, reason: 'Invalid email address format.' };
    }

    if (trimmed.length > 254) {
        return { valid: false, reason: 'Email address is too long (max 254 characters).' };
    }

    const [localPart] = trimmed.split('@');
    if (localPart.length > 64) {
        return { valid: false, reason: 'Email local part is too long (max 64 characters).' };
    }

    return { valid: true };
};

/**
 * Validates that all required email payload fields are present.
 * @param {object} payload
 * @returns {{ valid: boolean, missing: string[] }}
 */
export const validateEmailPayload = (payload) => {
    const required = ['to', 'subject', 'htmlContent'];
    const missing = required.filter((field) => !payload[field]);

    if (missing.length > 0) {
        return { valid: false, missing };
    }

    const emailValidation = validateEmailAddress(payload.to);
    if (!emailValidation.valid) {
        return { valid: false, missing: [], reason: emailValidation.reason };
    }

    if (payload.subject.length > 998) {
        return { valid: false, missing: [], reason: 'Subject line exceeds maximum length (998 chars).' };
    }

    return { valid: true, missing: [] };
};

/**
 * Sanitizes the subject line to prevent email header injection.
 * @param {string} subject
 * @returns {string}
 */
export const sanitizeSubject = (subject) => {
    if (!subject) return '';
    // Remove newline characters that could inject fake headers
    return subject.replace(/[\r\n]/g, ' ').trim().substring(0, 200);
};

/**
 * Checks if an email belongs to a known temporary/disposable email domain.
 * @param {string} email
 * @returns {boolean}
 */
export const isDisposableEmail = (email) => {
    const disposableDomains = [
        'mailinator.com', 'guerrillamail.com', 'throwam.com',
        'tempmail.com', 'yopmail.com', '10minutemail.com', 'trashmail.com',
        'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
    ];

    const domain = email.toLowerCase().split('@')[1];
    return disposableDomains.includes(domain);
};

export default { validateEmailAddress, validateEmailPayload, sanitizeSubject, isDisposableEmail };
