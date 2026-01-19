// adapters/slugAdapter.js
// URL slug generation and unique-slug resolution for blogs and events

/**
 * Convert a string to a URL-friendly slug.
 * e.g. "Hello World! 2026" → "hello-world-2026"
 * @param {string} text
 * @returns {string}
 */
export const toSlug = (text = '') =>
    text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/-{2,}/g, '-');

/**
 * Ensure a slug is unique by appending a counter if needed.
 * @param {string} baseSlug
 * @param {Function} existsFn - async (slug: string) => boolean
 * @param {number} [maxAttempts]
 * @returns {Promise<string>}
 */
export const makeUniqueSlug = async (baseSlug, existsFn, maxAttempts = 20) => {
    let candidate = baseSlug;
    let counter = 1;

    while (await existsFn(candidate)) {
        candidate = `${baseSlug}-${counter}`;
        counter += 1;

        if (counter > maxAttempts) {
            candidate = `${baseSlug}-${Date.now()}`;
            break;
        }
    }

    return candidate;
};

/**
 * Generate a slug from a title and resolve uniqueness against a Mongoose model.
 * @param {string} title
 * @param {object} Model - Mongoose model with a `slug` field
 * @param {string} [excludeId] - doc _id to exclude (for updates)
 */
export const generateUniqueSlugFor = async (title, Model, excludeId = null) => {
    const base = toSlug(title);

    const existsFn = async (slug) => {
        const query = { slug };
        if (excludeId) query._id = { $ne: excludeId };
        return !!(await Model.findOne(query).lean());
    };

    return makeUniqueSlug(base, existsFn);
};

/**
 * Validate that a slug string is well-formed.
 * @param {string} slug
 * @returns {boolean}
 */
export const isValidSlug = (slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

export default { toSlug, makeUniqueSlug, generateUniqueSlugFor, isValidSlug };
