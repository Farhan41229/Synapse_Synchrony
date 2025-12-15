// cache/cacheKeys.js
// Centralized cache key generators to ensure consistency across the app

/**
 * Cache key generator functions for the Synapse Synchrony backend.
 * Using functions ensures no typos and enables easy cache invalidation by prefix.
 */

export const CacheKeys = {
    // User-related keys
    user: {
        profile: (userId) => `user:profile:${userId}`,
        bookmarks: (userId) => `user:bookmarks:${userId}`,
        activityFeed: (userId) => `user:activity:${userId}`,
    },

    // Blog-related keys
    blog: {
        list: (page = 1, limit = 10) => `blog:list:${page}:${limit}`,
        detail: (blogId) => `blog:detail:${blogId}`,
        trending: () => 'blog:trending',
        byTag: (tag) => `blog:tag:${tag}`,
        userBlogs: (userId) => `blog:user:${userId}`,
    },

    // Event-related keys
    event: {
        list: (page = 1) => `event:list:${page}`,
        detail: (eventId) => `event:detail:${eventId}`,
        upcoming: () => 'event:upcoming',
    },

    // Wellness-related keys
    wellness: {
        suggestions: () => 'wellness:suggestions:all',
        byCategory: (category) => `wellness:category:${category}`,
        moodHistory: (userId, days) => `wellness:mood:${userId}:${days}`,
        stressHistory: (userId, days) => `wellness:stress:${userId}:${days}`,
    },

    // Medication / MediLink keys
    medication: {
        list: (page = 1) => `meds:list:${page}`,
        search: (query) => `meds:search:${encodeURIComponent(query)}`,
        detail: (medId) => `meds:detail:${medId}`,
    },

    // Diagnosis session keys
    diagnosis: {
        session: (sessionId) => `diagnosis:session:${sessionId}`,
        userSessions: (userId) => `diagnosis:user:${userId}`,
    },

    // Schedule keys
    schedule: {
        userSchedules: (userId) => `schedule:user:${userId}`,
        detail: (scheduleId) => `schedule:detail:${scheduleId}`,
    },

    // Public configuration / static data
    config: {
        bangladeshMedications: () => 'config:bd_medications',
        wellnessTips: () => 'config:wellness_tips',
    },
};

/**
 * TTL presets in seconds.
 */
export const TTL = {
    SHORT: 60,           // 1 minute — for frequently changing data
    MEDIUM: 300,         // 5 minutes — default
    LONG: 1800,          // 30 minutes — for stable data
    VERY_LONG: 86400,    // 24 hours — for nearly static data
};

export default { CacheKeys, TTL };
