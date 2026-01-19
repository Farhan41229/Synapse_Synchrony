// adapters/encryptionAdapter.js
// bcrypt and AES-256 utilities for Synapse Synchrony credential security

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 12;
const AES_KEY = Buffer.from(process.env.AES_KEY ?? '0'.repeat(64), 'hex'); // 32 bytes
const AES_IV_LENGTH = 16;

// ─── bcrypt helpers ────────────────────────────────────────────────────────

/**
 * Hash a plain-text password.
 * @param {string} plain
 * @returns {Promise<string>}
 */
export const hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);

/**
 * Compare a plain-text password against a stored hash.
 * @param {string} plain
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

// ─── AES-256-CBC helpers ────────────────────────────────────────────────────

/**
 * Encrypt a string with AES-256-CBC.
 * @param {string} text
 * @returns {string} encrypted hex string (iv:encrypted)
 */
export const encrypt = (text) => {
    const iv = crypto.randomBytes(AES_IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

/**
 * Decrypt an AES-256-CBC encrypted string.
 * @param {string} encryptedText - format: iv:ciphertext
 * @returns {string} decrypted plain text
 */
export const decrypt = (encryptedText) => {
    const [ivHex, encHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
};

/**
 * Generate a cryptographically secure random token.
 * @param {number} [bytes]
 * @returns {string} hex string
 */
export const generateSecureToken = (bytes = 32) =>
    crypto.randomBytes(bytes).toString('hex');

/**
 * Hash a string using SHA-256 (non-reversible, for token hashing).
 * @param {string} value
 * @returns {string}
 */
export const sha256 = (value) =>
    crypto.createHash('sha256').update(value).digest('hex');

export default { hashPassword, comparePassword, encrypt, decrypt, generateSecureToken, sha256 };
