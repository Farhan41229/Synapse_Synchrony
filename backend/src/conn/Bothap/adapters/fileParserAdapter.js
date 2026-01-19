// adapters/fileParserAdapter.js
// Multipart file parsing helpers for Synapse Synchrony API routes

import { createReadStream } from 'fs';
import path from 'path';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_AUDIO_TYPES = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_AUDIO_BYTES = 25 * 1024 * 1024; // 25 MB

/**
 * Validate an uploaded image file.
 * @param {{ mimetype: string, size: number }} file
 * @throws {Error} if validation fails
 */
export const validateImage = (file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        throw new Error(`Invalid image type: ${file.mimetype}. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
    }
    if (file.size > MAX_IMAGE_BYTES) {
        throw new Error(`Image too large: ${file.size} bytes. Max: ${MAX_IMAGE_BYTES} bytes.`);
    }
};

/**
 * Validate an uploaded audio/voice file.
 * @param {{ mimetype: string, size: number }} file
 * @throws {Error}
 */
export const validateAudio = (file) => {
    if (!ALLOWED_AUDIO_TYPES.includes(file.mimetype)) {
        throw new Error(`Invalid audio type: ${file.mimetype}.`);
    }
    if (file.size > MAX_AUDIO_BYTES) {
        throw new Error(`Audio file too large: ${file.size} bytes.`);
    }
};

/**
 * Convert a multer file to a base64 data URI.
 * @param {{ buffer: Buffer, mimetype: string }} file
 * @returns {string}
 */
export const toBase64DataUri = (file) => {
    const base64 = file.buffer.toString('base64');
    return `data:${file.mimetype};base64,${base64}`;
};

/**
 * Extract the filename extension from a mimetype.
 * @param {string} mimetype
 * @returns {string}
 */
export const mimetypeToExtension = (mimetype) => {
    const map = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'audio/webm': 'webm',
        'audio/mp4': 'm4a',
        'audio/ogg': 'ogg',
        'audio/wav': 'wav',
    };
    return map[mimetype] ?? mimetype.split('/')[1] ?? 'bin';
};

/**
 * Check whether a path has a safe, non-traversal filename.
 * @param {string} filename
 * @returns {boolean}
 */
export const isSafeFilename = (filename) => {
    const base = path.basename(filename);
    return base === filename && !filename.includes('..') && !/[<>:"/\\|?*]/.test(filename);
};

export default { validateImage, validateAudio, toBase64DataUri, mimetypeToExtension, isSafeFilename };
