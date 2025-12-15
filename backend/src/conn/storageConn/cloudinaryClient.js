// storageConn/cloudinaryClient.js
// Cloudinary connection and image upload utilities for Synapse Synchrony

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

let isConfigured = false;

/**
 * Configures the Cloudinary client using environment variables.
 */
export const configureCloudinary = () => {
    if (isConfigured) return;

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        throw new Error(
            '[CloudinaryClient] Missing Cloudinary environment variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.'
        );
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });

    isConfigured = true;
    console.log('[CloudinaryClient] Cloudinary configured successfully.');
};

const UPLOAD_FOLDERS = {
    AVATAR: 'synapse/avatars',
    BLOG: 'synapse/blogs',
    EVENT: 'synapse/events',
    DOCUMENT: 'synapse/documents',
};

const TRANSFORMATION_PRESETS = {
    avatar: { width: 200, height: 200, crop: 'fill', gravity: 'face', quality: 'auto' },
    blogThumbnail: { width: 800, height: 450, crop: 'fill', quality: 'auto' },
    thumbnail: { width: 150, height: 150, crop: 'fill', quality: 'auto:low' },
};

/**
 * Uploads an image buffer or data URI to Cloudinary.
 * @param {string} fileData - Base64 data URI or local file path
 * @param {object} options
 * @returns {Promise<object>} - Cloudinary upload result
 */
export const uploadImage = async (fileData, options = {}) => {
    configureCloudinary();
    const {
        folder = UPLOAD_FOLDERS.AVATAR,
        publicId = null,
        transformation = null,
        tags = [],
    } = options;

    try {
        const uploadOptions = {
            folder,
            resource_type: 'image',
            use_filename: false,
            unique_filename: true,
            overwrite: false,
            tags,
        };

        if (publicId) uploadOptions.public_id = publicId;
        if (transformation) uploadOptions.transformation = transformation;

        const result = await cloudinary.uploader.upload(fileData, uploadOptions);

        console.log(`[CloudinaryClient] Uploaded image: ${result.secure_url}`);
        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
        };
    } catch (error) {
        console.error('[CloudinaryClient] Upload failed:', error.message);
        throw new Error(`Image upload failed: ${error.message}`);
    }
};

/**
 * Deletes an image from Cloudinary by its public ID.
 * @param {string} publicId
 * @returns {Promise<object>}
 */
export const deleteImage = async (publicId) => {
    configureCloudinary();
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`[CloudinaryClient] Deleted image: ${publicId} | Result: ${result.result}`);
        return result;
    } catch (error) {
        console.error('[CloudinaryClient] Delete failed:', error.message);
        throw error;
    }
};

/**
 * Generates a signed URL for secure, time-limited access to a private resource.
 * @param {string} publicId
 * @param {number} expiresInSeconds
 * @returns {string}
 */
export const getSignedUrl = (publicId, expiresInSeconds = 3600) => {
    configureCloudinary();
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    return cloudinary.url(publicId, {
        sign_url: true,
        expires_at: expiresAt,
        secure: true,
    });
};

export { UPLOAD_FOLDERS, TRANSFORMATION_PRESETS };
export default { configureCloudinary, uploadImage, deleteImage, getSignedUrl };
