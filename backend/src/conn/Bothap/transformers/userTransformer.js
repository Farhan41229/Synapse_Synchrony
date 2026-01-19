// transformers/userTransformer.js
// Sanitise and shape user documents before sending to clients

/**
 * Strip sensitive fields from a raw Mongoose user document.
 * Safe to expose over HTTP.
 * @param {object} user - raw Mongoose doc or plain object
 * @returns {object}
 */
export const toPublicUser = (user) => {
    const raw = user?.toObject ? user.toObject() : { ...user };

    const {
        password,
        refreshToken,
        verifyToken,
        resetPasswordToken,
        resetPasswordExpiry,
        __v,
        ...safe
    } = raw;

    return safe;
};

/**
 * Shape a user into a minimal chat participant object.
 * @param {object} user
 * @returns {{ _id: string, name: string, avatar: string, isOnline: boolean }}
 */
export const toChatParticipant = (user) => ({
    _id: user._id?.toString(),
    name: user.name ?? 'Unknown',
    avatar: user.avatar ?? '',
    isOnline: user.isOnline ?? false,
});

/**
 * Shape a user document for the sidebar/dropdown avatar.
 * @param {object} user
 */
export const toAvatarMeta = (user) => ({
    _id: user._id?.toString(),
    name: user.name ?? '',
    avatar: user.avatar ?? '',
    email: user.email ?? '',
    role: user.role ?? 'user',
});

/**
 * Build a leaderboard entry from a user object and a score.
 * @param {object} user
 * @param {number} score
 * @param {number} rank
 */
export const toLeaderboardEntry = (user, score, rank) => ({
    rank,
    userId: user._id?.toString(),
    name: user.name ?? 'Anonymous',
    avatar: user.avatar ?? '',
    score,
});

/**
 * Convert an array of users to a lookup map by _id.
 * @param {object[]} users
 * @returns {Map<string, object>}
 */
export const usersToMap = (users) =>
    new Map(users.map((u) => [u._id?.toString(), toPublicUser(u)]));

export default { toPublicUser, toChatParticipant, toAvatarMeta, toLeaderboardEntry, usersToMap };
