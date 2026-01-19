// transformers/searchTransformer.js
// Build MongoDB query objects from user search input for Synapse Synchrony

/**
 * Build a MongoDB text-search-compatible filter for blogs.
 * @param {string} [query]
 * @param {string} [category]
 */
export const buildBlogFilter = (query = '', category = '') => {
    const filter = { isPublished: true };

    if (query.trim()) {
        filter.$or = [
            { title: { $regex: query.trim(), $options: 'i' } },
            { content: { $regex: query.trim(), $options: 'i' } },
            { tags: { $in: [new RegExp(query.trim(), 'i')] } },
        ];
    }

    if (category.trim()) {
        filter.category = { $regex: `^${category.trim()}$`, $options: 'i' };
    }

    return filter;
};

/**
 * Build a MongoDB filter for events.
 * @param {string} [query]
 * @param {string} [eventType]
 * @param {boolean} [upcoming]
 */
export const buildEventFilter = (query = '', eventType = '', upcoming = false) => {
    const filter = {};

    if (query.trim()) {
        filter.$or = [
            { title: { $regex: query.trim(), $options: 'i' } },
            { description: { $regex: query.trim(), $options: 'i' } },
            { location: { $regex: query.trim(), $options: 'i' } },
        ];
    }

    if (eventType.trim()) {
        filter.eventType = eventType.trim();
    }

    if (upcoming) {
        filter.startDate = { $gt: new Date() };
    }

    return filter;
};

/**
 * Build a MongoDB filter for user search.
 * @param {string} [query]
 */
export const buildUserFilter = (query = '') => {
    if (!query.trim()) return {};
    return {
        $or: [
            { name: { $regex: query.trim(), $options: 'i' } },
            { email: { $regex: query.trim(), $options: 'i' } },
        ],
    };
};

/**
 * Build a MongoDB filter for note search.
 * @param {string} [query]
 * @param {string[]} [tags]
 * @param {boolean} [pinned]
 * @param {boolean} [archived]
 * @param {string} ownerId
 */
export const buildNoteFilter = (query = '', tags = [], pinned, archived, ownerId) => {
    const filter = { owner: ownerId };

    if (query.trim()) {
        filter.$or = [
            { title: { $regex: query.trim(), $options: 'i' } },
            { content: { $regex: query.trim(), $options: 'i' } },
        ];
    }

    if (tags.length > 0) {
        filter.tags = { $in: tags };
    }

    if (pinned !== undefined) filter.isPinned = pinned;
    if (archived !== undefined) filter.isArchived = archived;
    else filter.isArchived = false;

    return filter;
};

export default { buildBlogFilter, buildEventFilter, buildUserFilter, buildNoteFilter };
