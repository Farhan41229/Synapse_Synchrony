// storageConn/multerConfig.js
// Multer configuration for file upload handling (avatars, blog images, documents)

import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOC_TYPES = ['application/pdf', 'text/plain'];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_DOC_SIZE_MB = 10;

/**
 * File filter factory — accepts only specified MIME types.
 * @param {string[]} allowedTypes
 * @returns {Function} Multer fileFilter function
 */
const createFileFilter = (allowedTypes) => (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new multer.MulterError(
                'LIMIT_UNEXPECTED_FILE',
                `File type ${file.mimetype} is not allowed. Accepted: ${allowedTypes.join(', ')}`
            ),
            false
        );
    }
};

/**
 * Memory storage configuration — stores files in memory as Buffer.
 * (Files passed to Cloudinary for upload, not saved to disk)
 */
const memoryStorage = multer.memoryStorage();

/**
 * Multer instance for avatar uploads.
 * Accepts single image file, max 5MB.
 */
export const avatarUpload = multer({
    storage: memoryStorage,
    limits: { fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024, files: 1 },
    fileFilter: createFileFilter(ALLOWED_IMAGE_TYPES),
});

/**
 * Multer instance for blog thumbnail uploads.
 * Accepts single image file, max 5MB.
 */
export const blogImageUpload = multer({
    storage: memoryStorage,
    limits: { fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024, files: 1 },
    fileFilter: createFileFilter(ALLOWED_IMAGE_TYPES),
});

/**
 * Multer instance for event cover image uploads.
 */
export const eventImageUpload = multer({
    storage: memoryStorage,
    limits: { fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024, files: 1 },
    fileFilter: createFileFilter(ALLOWED_IMAGE_TYPES),
});

/**
 * Multer instance for generic document uploads.
 * Accepts PDF and text files up to 10MB.
 */
export const documentUpload = multer({
    storage: memoryStorage,
    limits: { fileSize: MAX_DOC_SIZE_MB * 1024 * 1024, files: 3 },
    fileFilter: createFileFilter([...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES]),
});

/**
 * Generates a unique filename for storage.
 * @param {string} originalName
 * @returns {string}
 */
export const generateFileName = (originalName) => {
    const ext = path.extname(originalName).toLowerCase();
    const uniqueId = crypto.randomBytes(8).toString('hex');
    return `${Date.now()}-${uniqueId}${ext}`;
};

/**
 * Converts a multer file buffer to a base64 data URI for Cloudinary upload.
 * @param {Express.Multer.File} file
 * @returns {string}
 */
export const fileToDataUri = (file) => {
    const base64 = file.buffer.toString('base64');
    return `data:${file.mimetype};base64,${base64}`;
};

/**
 * Express error handler for Multer errors.
 */
export const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'File size exceeds maximum limit.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ success: false, message: err.field || 'Invalid file type.' });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    next(err);
};

export default { avatarUpload, blogImageUpload, eventImageUpload, documentUpload, fileToDataUri, generateFileName };
