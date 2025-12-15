// storageConn/imageProcessor.js
// Client-side image validation and pre-processing before upload

/**
 * Validates an image file's format, size and dimensions before uploading.
 * @param {Express.Multer.File} file
 * @param {object} constraints
 * @returns {{ valid: boolean, errors: string[] }}
 */
export const validateImageFile = (file, constraints = {}) => {
    const {
        maxSizeMB = 5,
        allowedFormats = ['image/jpeg', 'image/png', 'image/webp'],
    } = constraints;

    const errors = [];

    if (!file) {
        return { valid: false, errors: ['No file provided.'] };
    }

    if (!allowedFormats.includes(file.mimetype)) {
        errors.push(`Unsupported file type: ${file.mimetype}. Allowed: ${allowedFormats.join(', ')}`);
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
        errors.push(`File size (${fileSizeMB.toFixed(2)} MB) exceeds maximum of ${maxSizeMB} MB.`);
    }

    if (file.size === 0) {
        errors.push('File is empty.');
    }

    return { valid: errors.length === 0, errors };
};

/**
 * Extracts and returns image metadata from the file buffer using basic header inspection.
 * @param {Buffer} buffer
 * @param {string} mimeType
 * @returns {object}
 */
export const extractImageInfo = (buffer, mimeType) => {
    const info = {
        mimeType,
        sizeBytes: buffer.length,
        sizeMB: (buffer.length / (1024 * 1024)).toFixed(3),
    };

    // Check for image format signature bytes
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
        info.format = 'JPEG';
    } else if (buffer[0] === 0x89 && buffer[1] === 0x50) {
        info.format = 'PNG';
    } else if (buffer.slice(0, 4).toString() === 'RIFF' && buffer.slice(8, 12).toString() === 'WEBP') {
        info.format = 'WebP';
    } else {
        info.format = 'Unknown';
    }

    return info;
};

/**
 * Generates a sanitized filename from an original filename.
 * Strips special characters and replaces spaces with underscores.
 * @param {string} originalName
 * @returns {string}
 */
export const sanitizeFilename = (originalName) => {
    return originalName
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_.\-]/g, '')
        .replace(/\.+/g, '.') // collapse multiple dots
        .substring(0, 100);
};

/**
 * Checks if the buffer belongs to a valid, supported image format
 * by inspecting magic bytes.
 * @param {Buffer} buffer
 * @returns {boolean}
 */
export const isValidImageBuffer = (buffer) => {
    if (!buffer || buffer.length < 4) return false;

    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    const isWebp = buffer.slice(8, 12).toString() === 'WEBP';

    return isJpeg || isPng || isWebp;
};

export default { validateImageFile, extractImageInfo, sanitizeFilename, isValidImageBuffer };
