// database/dbIndexManager.js
// Manages MongoDB index creation and optimization for all collections

import mongoose from 'mongoose';

/**
 * Defines all compound and single-field indexes that should exist
 * across the Synapse Synchrony database.
 */
const INDEX_DEFINITIONS = [
    // Users collection indexes
    {
        collection: 'users',
        indexes: [
            { fields: { email: 1 }, options: { unique: true, name: 'idx_users_email' } },
            { fields: { verificationToken: 1 }, options: { sparse: true, name: 'idx_users_verif_token' } },
            { fields: { resetPasswordToken: 1 }, options: { sparse: true, name: 'idx_users_reset_token' } },
            { fields: { createdAt: -1 }, options: { name: 'idx_users_created_at' } },
        ],
    },
    // Blogs collection indexes
    {
        collection: 'blogs',
        indexes: [
            { fields: { authorId: 1, createdAt: -1 }, options: { name: 'idx_blogs_author_date' } },
            { fields: { tags: 1 }, options: { name: 'idx_blogs_tags' } },
            { fields: { isPublished: 1, createdAt: -1 }, options: { name: 'idx_blogs_published_date' } },
        ],
    },
    // Diagnosis sessions indexes
    {
        collection: 'diagnosissessions',
        indexes: [
            { fields: { userId: 1, updatedAt: -1 }, options: { name: 'idx_diagnosis_user_date' } },
            { fields: { sessionId: 1 }, options: { unique: true, name: 'idx_diagnosis_session_id' } },
            { fields: { status: 1 }, options: { name: 'idx_diagnosis_status' } },
        ],
    },
    // Messages collection indexes
    {
        collection: 'messages',
        indexes: [
            { fields: { chatId: 1, createdAt: 1 }, options: { name: 'idx_messages_chat_date' } },
            { fields: { senderId: 1 }, options: { name: 'idx_messages_sender' } },
        ],
    },
    // Events collection indexes
    {
        collection: 'events',
        indexes: [
            { fields: { userId: 1, date: 1 }, options: { name: 'idx_events_user_date' } },
            { fields: { isPublic: 1, date: 1 }, options: { name: 'idx_events_public_date' } },
        ],
    },
];

/**
 * Creates all defined indexes on the database.
 * Should be called once during application startup.
 */
export const createAllIndexes = async () => {
    const results = [];

    for (const definition of INDEX_DEFINITIONS) {
        const collection = mongoose.connection.collection(definition.collection);

        for (const indexDef of definition.indexes) {
            try {
                const indexName = await collection.createIndex(indexDef.fields, indexDef.options);
                results.push({ collection: definition.collection, index: indexName, status: 'created' });
                console.log(`[IndexManager] Created index '${indexName}' on '${definition.collection}'`);
            } catch (error) {
                if (error.code === 85 || error.code === 86) {
                    // Index already exists with different options or same key
                    results.push({
                        collection: definition.collection,
                        index: indexDef.options.name,
                        status: 'already_exists',
                    });
                } else {
                    console.error(
                        `[IndexManager] Failed to create index on '${definition.collection}':`,
                        error.message
                    );
                    results.push({
                        collection: definition.collection,
                        index: indexDef.options.name,
                        status: 'failed',
                        error: error.message,
                    });
                }
            }
        }
    }

    return results;
};

/**
 * Lists all indexes for a specific collection.
 * @param {string} collectionName
 */
export const listIndexes = async (collectionName) => {
    try {
        const collection = mongoose.connection.collection(collectionName);
        const indexes = await collection.indexes();
        return indexes;
    } catch (error) {
        console.error(`[IndexManager] Failed to list indexes for '${collectionName}':`, error.message);
        throw error;
    }
};

/**
 * Drops a specific index from a collection.
 * @param {string} collectionName
 * @param {string} indexName
 */
export const dropIndex = async (collectionName, indexName) => {
    try {
        const collection = mongoose.connection.collection(collectionName);
        await collection.dropIndex(indexName);
        console.log(`[IndexManager] Dropped index '${indexName}' from '${collectionName}'`);
    } catch (error) {
        console.error(`[IndexManager] Failed to drop index '${indexName}':`, error.message);
        throw error;
    }
};

export default { createAllIndexes, listIndexes, dropIndex };
