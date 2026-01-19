// validators/fileUploadValidator.js
// Request-level validation for file upload endpoints

import { z } from 'zod';

const ALLOWED_IMAGE_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_AUDIO_MIMETYPES = ['audio/webm', 'audio/ogg', 'audio/wav', 'audio/mp4'];
const MAX_IMAGE_SIZE_MB = 10;
const MAX_AUDIO_SIZE_MB = 25;

/**
 * Validate a multer file for image upload.
 * Returns { valid: true } or { valid: false, error: string }.
 * @param {object} file - multer file object
 */
export const validateImageFile = (file) => {
    if (!file) return { valid: false, error: 'No file provided.' };
    if (!ALLOWED_IMAGE_MIMETYPES.includes(file.mimetype)) {
        return { valid: false, error: `Invalid image type: ${file.mimetype}. Allowed: ${ALLOWED_IMAGE_MIMETYPES.join(', ')}.` };
    }
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_IMAGE_SIZE_MB) {
        return { valid: false, error: `Image too large (${sizeMb.toFixed(2)} MB). Maximum is ${MAX_IMAGE_SIZE_MB} MB.` };
    }
    return { valid: true };
};

/**
 * Validate a multer file for audio upload.
 * @param {object} file
 */
export const validateAudioFile = (file) => {
    if (!file) return { valid: false, error: 'No file provided.' };
    if (!ALLOWED_AUDIO_MIMETYPES.includes(file.mimetype)) {
        return { valid: false, error: `Invalid audio type: ${file.mimetype}.` };
    }
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_AUDIO_SIZE_MB) {
        return { valid: false, error: `Audio too large (${sizeMb.toFixed(2)} MB). Maximum is ${MAX_AUDIO_SIZE_MB} MB.` };
    }
    return { valid: true };
};

/**
 * Express middleware: validate a single image upload at req.file.
 */
export const requireImageFile = (req, res, next) => {
    const result = validateImageFile(req.file);
    if (!result.valid) {
        return res.status(400).json({ success: false, message: result.error });
    }
    next();
};

/**
 * Express middleware: validate a single audio upload at req.file.
 */
export const requireAudioFile = (req, res, next) => {
    const result = validateAudioFile(req.file);
    if (!result.valid) {
        return res.status(400).json({ success: false, message: result.error });
    }
    next();
};

export const imageMetaSchema = z.object({
    altText: z.string().max(200).optional(),
    caption: z.string().max(300).optional(),
    isPublic: z.coerce.boolean().default(true),
});

export default {
    validateImageFile,
    validateAudioFile,
    requireImageFile,
    requireAudioFile,
    imageMetaSchema,
};
