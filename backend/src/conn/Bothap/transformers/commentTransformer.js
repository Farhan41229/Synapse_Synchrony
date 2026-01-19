// transformers/commentTransformer.js
// Shape comment documents for API responses

import { toPublicUser } from './userTransformer.js';

/**
 * Transform a comment document for the API.
 * @param {object} comment
 * @param {string} [requestingUserId]
 */
export const toCommentResponse = (comment, requestingUserId) => {
    const raw = comment?.toObject ? comment.toObject() : { ...comment };

    const isLiked = requestingUserId
        ? (raw.likes ?? []).some((id) => id?.toString() === requestingUserId)
        : false;

    return {
        _id: raw._id?.toString(),
        content: raw.content,
        author: raw.author ? toPublicUser(raw.author) : null,
        parentComment: raw.parentComment?.toString() ?? null,
        likeCount: (raw.likes ?? []).length,
        isLiked,
        replies: (raw.replies ?? []).map((r) => toCommentResponse(r, requestingUserId)),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
    };
};

/**
 * Build a flat list of comments threaded by parentComment.
 * @param {object[]} comments - all comment docs for a resource
 * @returns {object[]} - top-level comments with nested replies
 */
export const threadComments = (comments = []) => {
    const map = new Map();
    const roots = [];

    for (const comment of comments) {
        const c = toCommentResponse(comment);
        c.replies = [];
        map.set(c._id, c);
    }

    for (const comment of comments) {
        const c = map.get(comment._id?.toString());
        if (comment.parentComment) {
            const parent = map.get(comment.parentComment?.toString());
            if (parent) {
                parent.replies.push(c);
            } else {
                roots.push(c);
            }
        } else {
            roots.push(c);
        }
    }

    return roots;
};

export default { toCommentResponse, threadComments };
