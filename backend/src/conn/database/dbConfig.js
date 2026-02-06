// database/dbConfig.js
// Configuration and environment resolution for database connections

import dotenv from 'dotenv';
dotenv.config();

/**
 * Supported environment modes.
 */
export const ENV_MODES = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
    STAGING: 'staging',
};

const currentEnv = process.env.NODE_ENV || ENV_MODES.DEVELOPMENT;

/**
 * Returns the MongoDB URI based on the current environment.
 * Falls back to a local URI for development.
 */
export const getMongoURI = () => {
    switch (currentEnv) {
        case ENV_MODES.PRODUCTION:
            if (!process.env.MONGO_URI_PROD) {
                throw new Error('[dbConfig] MONGO_URI_PROD is not defined in environment variables.');
            }
            return process.env.MONGO_URI_PROD;

        case ENV_MODES.STAGING:
            if (!process.env.MONGO_URI_STAGING) {
                throw new Error('[dbConfig] MONGO_URI_STAGING is not defined in environment variables.');
            }
            return process.env.MONGO_URI_STAGING;

        case ENV_MODES.TEST:
            return process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/synapse_test';

        case ENV_MODES.DEVELOPMENT:
        default:
            return process.env.MONGO_URI || 'mongodb://localhost:27017/synapse_synchrony';
    }
};

/**
 * Returns database-specific mongoose options tuned for the environment.
 */
export const getDbOptions = () => {
    const baseOptions = {
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
    };

    if (currentEnv === ENV_MODES.PRODUCTION || currentEnv === ENV_MODES.STAGING) {
        return {
            ...baseOptions,
            maxPoolSize: 50,
            minPoolSize: 5,
            retryWrites: true,
            w: 'majority',
            readPreference: 'secondaryPreferred',
        };
    }

    if (currentEnv === ENV_MODES.TEST) {
        return {
            ...baseOptions,
            maxPoolSize: 5,
            serverSelectionTimeoutMS: 3000,
        };
    }

    return baseOptions;
};

/**
 * Database collection name constants used throughout the project.
 */
export const COLLECTIONS = {
    USERS: 'users',
    BLOGS: 'blogs',
    BLOG_COMMENTS: 'blogcomments',
    CHATS: 'chats',
    MESSAGES: 'messages',
    EVENTS: 'events',
    SCHEDULES: 'schedules',
    NOTES: 'notes',
    MOOD_ENTRIES: 'moodentries',
    STRESS_ENTRIES: 'stressentries',
    DIAGNOSIS_SESSIONS: 'diagnosissessions',
    MEDILINK_SESSIONS: 'medilinksessions',
    MEDICATIONS: 'medications',
    WELLNESS_SUGGESTIONS: 'wellnesssuggestions',
    ACTIVITY_RECORDS: 'activityrecords',
};

/**
 * Returns the database name for the current environment.
 */
export const getDbName = () => {
    const names = {
        [ENV_MODES.PRODUCTION]: 'synapse_production',
        [ENV_MODES.STAGING]: 'synapse_staging',
        [ENV_MODES.TEST]: 'synapse_test',
        [ENV_MODES.DEVELOPMENT]: 'synapse_synchrony',
    };
    return names[currentEnv] || 'synapse_synchrony';
};

export const dbConfig = {
    uri: getMongoURI(),
    options: getDbOptions(),
    dbName: getDbName(),
    currentEnv,
};

export default dbConfig;
