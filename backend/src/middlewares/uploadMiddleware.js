// backend/src/middlewares/uploadMiddleware.js
// Multer file upload configuration for Synapse Synchrony

import multer from 'multer';
import path from 'path';
import { validateImageFile, validateAudioFile } from '../conn/Bothap/validators/fileUploadValidator.js';

// Use memory storage to allow direct buffer access for Cloudinary uploads
const storage = multer.memoryStorage();

/**
 * File filter that accepts only images.
 */
const imageFilter = (_req, file, cb) => {
    const result = validateImageFile(file);
    if (!result.valid) {
        return cb(new Error(result.error), false);
    }
    cb(null, true);
};

/**
 * File filter that accepts only audio.
 */
const audioFilter = (_req, file, cb) => {
    const result = validateAudioFile(file);
    if (!result.valid) {
        return cb(new Error(result.error), false);
    }
    cb(null, true);
};

/**
 * File filter accepting images or audio.
 */
const mediaFilter = (_req, file, cb) => {
    const imgResult = validateImageFile(file);
    const audResult = validateAudioFile(file);
    if (!imgResult.valid && !audResult.valid) {
        return cb(new Error('Invalid media type. Allowed: images and audio files.'), false);
    }
    cb(null, true);
};

// ─── Multer instances ─────────────────────────────────────────────────

/**
 * Upload a single avatar/image.
 */
export const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}).single('image');

/**
 * Upload multiple images (up to 5).
 */
export const uploadImages = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
}).array('images', 5);

/**
 * Upload a single audio/voice message.
 */
export const uploadAudio = multer({
    storage,
    fileFilter: audioFilter,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
}).single('audio');

/**
 * Upload an image or audio file.
 */
export const uploadMedia = multer({
    storage,
    fileFilter: mediaFilter,
    limits: { fileSize: 25 * 1024 * 1024 },
}).single('file');

/**
 * Multer error handler middleware.
 * Must be used after the multer upload middleware.
 */
export const handleUploadError = (err, _req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`,
            code: err.code,
        });
    }
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message ?? 'File upload failed.',
        });
    }
    next();
};

export default { uploadImage, uploadImages, uploadAudio, uploadMedia, handleUploadError };
