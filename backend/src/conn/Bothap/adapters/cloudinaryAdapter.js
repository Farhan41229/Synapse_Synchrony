// adapters/cloudinaryAdapter.js
// Wraps Cloudinary SDK operations for Synapse Synchrony media handling

import { v2 as cloudinary } from 'cloudinary';

let _configured = false;

/**
 * Ensure Cloudinary is configured with env credentials.
 */
const ensureConfig = () => {
    if (_configured) return;

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });

    _configured = true;
};

/**
 * Upload a base64 or URL string to Cloudinary.
 * @param {string} source - base64 data URI or remote URL
 * @param {string} folder - destination folder on Cloudinary
 * @param {object} [options]
 * @returns {Promise<object>} Cloudinary upload result
 */
export const uploadMedia = async (source, folder = 'synapse', options = {}) => {
    ensureConfig();

    const result = await cloudinary.uploader.upload(source, {
        folder,
        resource_type: 'auto',
        ...options,
    });

    return result;
};

/**
 * Upload a voice recording buffer as a raw audio file.
 * @param {Buffer} buffer
 * @param {string} publicId
 */
export const uploadAudioBuffer = async (buffer, publicId) => {
    ensureConfig();

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'raw', folder: 'synapse/audio', public_id: publicId },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

/**
 * Delete an asset from Cloudinary by public ID.
 * @param {string} publicId
 * @param {'image'|'video'|'raw'} [resourceType]
 */
export const deleteMedia = async (publicId, resourceType = 'image') => {
    ensureConfig();
    return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

/**
 * Generate a signed URL for temporary access.
 * @param {string} publicId
 * @param {number} [expiresIn] - seconds from now
 */
export const getSignedUrl = (publicId, expiresIn = 3600) => {
    ensureConfig();
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
    return cloudinary.url(publicId, { sign_url: true, expires_at: expiresAt });
};

export default { uploadMedia, uploadAudioBuffer, deleteMedia, getSignedUrl };
