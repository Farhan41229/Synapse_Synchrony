// transformers/noteTransformer.js
// Shape note documents for API responses

/**
 * Transform a note document for the API.
 * @param {object} note
 * @param {string} [requestingUserId]
 */
export const toNoteResponse = (note, requestingUserId) => {
    const raw = note?.toObject ? note.toObject() : { ...note };

    return {
        _id: raw._id?.toString(),
        title: raw.title,
        content: raw.content,
        tags: raw.tags ?? [],
        color: raw.color ?? null,
        isPinned: raw.isPinned ?? false,
        isArchived: raw.isArchived ?? false,
        owner: raw.owner?.toString(),
        wordCount: countWords(raw.content),
        characterCount: (raw.content ?? '').length,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
    };
};

/**
 * Minimal note item for list views.
 * @param {object} note
 */
export const toNoteCard = (note) => {
    const raw = note?.toObject ? note.toObject() : { ...note };
    return {
        _id: raw._id?.toString(),
        title: raw.title,
        excerpt: (raw.content ?? '').slice(0, 120).trim() + ((raw.content ?? '').length > 120 ? '…' : ''),
        tags: raw.tags ?? [],
        color: raw.color ?? null,
        isPinned: raw.isPinned ?? false,
        isArchived: raw.isArchived ?? false,
        updatedAt: raw.updatedAt,
    };
};

/**
 * Count the number of words in a string.
 * @param {string} text
 * @returns {number}
 */
export const countWords = (text = '') =>
    text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

export default { toNoteResponse, toNoteCard, countWords };
