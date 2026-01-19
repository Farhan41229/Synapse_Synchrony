// adapters/searchIndexAdapter.js
// Wrapper to build and query full-text search indexes in MongoDB

import mongoose from 'mongoose';

/**
 * Ensure a text index exists on the given collection and fields.
 * Safe to call multiple times — Mongoose is idempotent with createIndex.
 *
 * @param {string} modelName - registered Mongoose model name
 * @param {object} fields    - e.g. { title: 'text', content: 'text' }
 * @param {object} [options]
 */
export const ensureTextIndex = async (modelName, fields, options = {}) => {
    const collection = mongoose.connection.collection(
        mongoose.model(modelName).collection.collectionName
    );

    await collection.createIndex(fields, {
        name: `text_${modelName.toLowerCase()}`,
        default_language: 'english',
        ...options,
    });
};

/**
 * Build a MongoDB $text search stage for aggregation.
 * @param {string} query
 * @param {object} [extraFilter]
 */
export const buildTextSearchStage = (query, extraFilter = {}) => ({
    $match: {
        $text: { $search: query },
        ...extraFilter,
    },
});

/**
 * Add a relevance score projection stage.
 */
export const addScoreProjection = () => ({
    $addFields: { score: { $meta: 'textScore' } },
});

/**
 * Build a complete text-search aggregation pipeline.
 * @param {string} query
 * @param {object} [filter]
 * @param {number} [limit]
 * @param {number} [skip]
 */
export const buildTextSearchPipeline = (query, filter = {}, limit = 20, skip = 0) => [
    buildTextSearchStage(query, filter),
    addScoreProjection(),
    { $sort: { score: { $meta: 'textScore' } } },
    { $skip: skip },
    { $limit: limit },
];

export default {
    ensureTextIndex,
    buildTextSearchStage,
    addScoreProjection,
    buildTextSearchPipeline,
};
