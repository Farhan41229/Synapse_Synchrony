// transformers/adminTransformer.js
// Shape admin dashboard analytics and user management responses

import { toPublicUser } from './userTransformer.js';

/**
 * Transform a user doc for admin user list view.
 * Includes more data than the public profile.
 * @param {object} user
 */
export const toAdminUserRow = (user) => {
    const raw = user?.toObject ? user.toObject() : { ...user };
    return {
        _id: raw._id?.toString(),
        name: raw.name,
        email: raw.email,
        role: raw.role ?? 'user',
        avatar: raw.avatar ?? null,
        isEmailVerified: raw.isEmailVerified ?? false,
        isBanned: raw.isBanned ?? false,
        banReason: raw.banReason ?? null,
        createdAt: raw.createdAt,
        lastLogin: raw.lastLogin ?? null,
    };
};

/**
 * Build a platform analytics summary.
 * @param {object} counts
 */
export const toPlatformAnalytics = (counts) => ({
    totalUsers: counts.users ?? 0,
    activeUsers: counts.activeUsers ?? 0,
    totalBlogs: counts.blogs ?? 0,
    publishedBlogs: counts.publishedBlogs ?? 0,
    totalEvents: counts.events ?? 0,
    upcomingEvents: counts.upcomingEvents ?? 0,
    totalChats: counts.chats ?? 0,
    totalMessages: counts.messages ?? 0,
    totalNotes: counts.notes ?? 0,
    generatedAt: new Date().toISOString(),
});

/**
 * Transform a ban action to a log-friendly object.
 * @param {object} admin
 * @param {object} bannedUser
 * @param {string} reason
 */
export const toBanLog = (admin, bannedUser, reason) => ({
    action: 'BAN',
    performedBy: { id: admin._id?.toString(), name: admin.name },
    target: { id: bannedUser._id?.toString(), name: bannedUser.name, email: bannedUser.email },
    reason,
    timestamp: new Date().toISOString(),
});

export default { toAdminUserRow, toPlatformAnalytics, toBanLog };
