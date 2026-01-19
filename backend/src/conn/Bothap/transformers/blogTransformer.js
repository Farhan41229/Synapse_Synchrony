// transformers/blogTransformer.js
// Shape blog documents for various API response types

import { toPublicUser } from './userTransformer.js';

/**
 * Full blog response — safe for authenticated users.
 * @param {object} blog - populated Mongoose blog document
 * @param {string} [requestingUserId]
 */
export const toBlogResponse = (blog, requestingUserId) => {
    const raw = blog?.toObject ? blog.toObject() : { ...blog };

    const isLiked = requestingUserId
        ? (raw.likes ?? []).some((id) => id?.toString() === requestingUserId)
        : false;

    const isBookmarked = requestingUserId
        ? (raw.bookmarks ?? []).some((id) => id?.toString() === requestingUserId)
        : false;

    return {
        _id: raw._id?.toString(),
        title: raw.title,
        content: raw.content,
        excerpt: buildExcerpt(raw.content),
        category: raw.category,
        tags: raw.tags ?? [],
        image: raw.image ?? null,
        author: raw.author ? toPublicUser(raw.author) : null,
        likeCount: (raw.likes ?? []).length,
        commentCount: raw.commentCount ?? 0,
        views: raw.views ?? 0,
        isPublished: raw.isPublished ?? false,
        isLiked,
        isBookmarked,
        readTimeMinutes: estimateReadTime(raw.content),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
    };
};

/**
 * Minimal blog card — for list responses.
 * @param {object} blog
 */
export const toBlogCard = (blog) => {
    const raw = blog?.toObject ? blog.toObject() : { ...blog };
    return {
        _id: raw._id?.toString(),
        title: raw.title,
        excerpt: buildExcerpt(raw.content),
        category: raw.category,
        image: raw.image ?? null,
        author: raw.author
            ? { _id: raw.author._id?.toString(), name: raw.author.name, avatar: raw.author.avatar }
            : null,
        likeCount: (raw.likes ?? []).length,
        views: raw.views ?? 0,
        readTimeMinutes: estimateReadTime(raw.content),
        createdAt: raw.createdAt,
    };
};

/**
 * Build a short excerpt from blog content.
 * @param {string} content
 * @param {number} [maxLength]
 */
export const buildExcerpt = (content = '', maxLength = 160) => {
    const stripped = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    return stripped.length <= maxLength ? stripped : `${stripped.slice(0, maxLength - 3)}...`;
};

/**
 * Estimate reading time in minutes.
 * @param {string} content
 * @param {number} [wpm] - words per minute
 */
export const estimateReadTime = (content = '', wpm = 200) => {
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wpm));
};

export default { toBlogResponse, toBlogCard, buildExcerpt, estimateReadTime };
