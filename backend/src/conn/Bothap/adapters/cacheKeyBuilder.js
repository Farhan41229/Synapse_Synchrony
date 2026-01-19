// adapters/cacheKeyBuilder.js
// Standardised Redis cache key generation for Synapse Synchrony

const PREFIX = 'syn';

/**
 * Cache key for a user profile.
 * @param {string} userId
 */
export const userKey = (userId) => `${PREFIX}:user:${userId}`;

/**
 * Cache key for a user's blog list.
 * @param {string} userId
 */
export const userBlogsKey = (userId) => `${PREFIX}:user:${userId}:blogs`;

/**
 * Cache key for a single blog post.
 * @param {string} blogId
 */
export const blogKey = (blogId) => `${PREFIX}:blog:${blogId}`;

/**
 * Cache key for a paginated blog list.
 * @param {object} query
 */
export const blogListKey = (query = {}) =>
    `${PREFIX}:blogs:${JSON.stringify(query)}`;

/**
 * Cache key for a single event.
 * @param {string} eventId
 */
export const eventKey = (eventId) => `${PREFIX}:event:${eventId}`;

/**
 * Cache key for a paginated event list.
 * @param {object} query
 */
export const eventListKey = (query = {}) =>
    `${PREFIX}:events:${JSON.stringify(query)}`;

/**
 * Cache key for a user's chat list.
 * @param {string} userId
 */
export const chatListKey = (userId) => `${PREFIX}:chats:${userId}`;

/**
 * Cache key for a Stream token.
 * @param {string} userId
 */
export const streamTokenKey = (userId) => `${PREFIX}:stream:token:${userId}`;

/**
 * Cache key for email OTP.
 * @param {string} email
 */
export const otpKey = (email) => `${PREFIX}:otp:${email}`;

/**
 * Cache key for a user's notification list.
 * @param {string} userId
 */
export const notificationsKey = (userId) => `${PREFIX}:notifications:${userId}`;

/**
 * Cache key for AI chat history.
 * @param {string} chatId
 */
export const aiChatHistoryKey = (chatId) => `${PREFIX}:ai:history:${chatId}`;

export default {
    userKey,
    userBlogsKey,
    blogKey,
    blogListKey,
    eventKey,
    eventListKey,
    chatListKey,
    streamTokenKey,
    otpKey,
    notificationsKey,
    aiChatHistoryKey,
};
