// authHelpers/passwordManager.js
// Secure password hashing, comparison, and strength validation

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hashes a plain-text password using bcrypt.
 * @param {string} plainPassword
 * @returns {Promise<string>} hashed password
 */
export const hashPassword = async (plainPassword) => {
    if (!plainPassword) throw new Error('[PasswordManager] Password is required.');
    try {
        const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
        return hashed;
    } catch (error) {
        console.error('[PasswordManager] Error hashing password:', error.message);
        throw error;
    }
};

/**
 * Compares a plain-text password with a stored hash.
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        console.error('[PasswordManager] Error comparing password:', error.message);
        return false;
    }
};

/**
 * Validates a password against the platform's strength requirements.
 * @param {string} password
 * @returns {{ valid: boolean, errors: string[], score: number }}
 */
export const validatePasswordStrength = (password) => {
    const errors = [];
    let score = 0;

    if (!password) return { valid: false, errors: ['Password is required.'], score: 0 };

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long.');
    } else {
        score++;
    }

    if (password.length >= 12) score++;

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter.');
    } else {
        score++;
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter.');
    } else {
        score++;
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number.');
    } else {
        score++;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password should contain at least one special character for better security.');
        // Not required, but lowers score
    } else {
        score++;
    }

    // Common password check
    const commonPasswords = ['password', '12345678', 'qwerty123', 'password123', 'synapse123'];
    if (commonPasswords.includes(password.toLowerCase())) {
        errors.push('Password is too common. Please choose a more unique password.');
        score = Math.max(0, score - 2);
    }

    const labels = { 0: 'very_weak', 1: 'weak', 2: 'fair', 3: 'fair', 4: 'strong', 5: 'strong', 6: 'very_strong' };

    return {
        valid: errors.filter((e) => !e.includes('should')).length === 0,
        errors,
        score,
        strength: labels[Math.min(score, 6)],
    };
};

export default { hashPassword, comparePassword, validatePasswordStrength };
