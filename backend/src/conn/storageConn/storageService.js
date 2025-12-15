// storageConn/storageService.js
// Unified service layer for handling file uploads and deletions via Cloudinary

import { uploadImage, deleteImage, UPLOAD_FOLDERS, TRANSFORMATION_PRESETS } from './cloudinaryClient.js';
import { fileToDataUri } from './multerConfig.js';

/**
 * Uploads a user avatar image.
 * @param {Express.Multer.File} file - Multer file object
 * @param {string} userId - Used as part of the public ID for easy management
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export const uploadUserAvatar = async (file, userId) => {
    const dataUri = fileToDataUri(file);
    return uploadImage(dataUri, {
        folder: UPLOAD_FOLDERS.AVATAR,
        publicId: `user_${userId}`,
        transformation: TRANSFORMATION_PRESETS.avatar,
        tags: ['avatar', `user:${userId}`],
    });
};

/**
 * Replaces a user's existing avatar — deletes old one first if publicId is provided.
 * @param {Express.Multer.File} file
 * @param {string} userId
 * @param {string|null} oldPublicId
 * @returns {Promise<object>}
 */
export const replaceUserAvatar = async (file, userId, oldPublicId = null) => {
    if (oldPublicId && !oldPublicId.includes('Blank-Pfp')) {
        try {
            await deleteImage(oldPublicId);
        } catch (err) {
            console.warn(`[StorageService] Could not delete old avatar (${oldPublicId}):`, err.message);
        }
    }
    return uploadUserAvatar(file, userId);
};

/**
 * Uploads a blog thumbnail image.
 * @param {Express.Multer.File} file
 * @param {string} blogId
 * @returns {Promise<object>}
 */
export const uploadBlogThumbnail = async (file, blogId) => {
    const dataUri = fileToDataUri(file);
    return uploadImage(dataUri, {
        folder: UPLOAD_FOLDERS.BLOG,
        publicId: `blog_${blogId}`,
        transformation: TRANSFORMATION_PRESETS.blogThumbnail,
        tags: ['blog', `blog:${blogId}`],
    });
};

/**
 * Uploads an event cover image.
 * @param {Express.Multer.File} file
 * @param {string} eventId
 * @returns {Promise<object>}
 */
export const uploadEventCover = async (file, eventId) => {
    const dataUri = fileToDataUri(file);
    return uploadImage(dataUri, {
        folder: UPLOAD_FOLDERS.EVENT,
        publicId: `event_${eventId}`,
        tags: ['event', `event:${eventId}`],
    });
};

/**
 * Deletes a stored file by its Cloudinary public ID.
 * @param {string} publicId
 */
export const deleteStoredFile = async (publicId) => {
    if (!publicId) {
        console.warn('[StorageService] No publicId provided for deletion.');
        return;
    }
    return deleteImage(publicId);
};

export default {
    uploadUserAvatar,
    replaceUserAvatar,
    uploadBlogThumbnail,
    uploadEventCover,
    deleteStoredFile,
};
