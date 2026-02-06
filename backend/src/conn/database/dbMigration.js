// database/dbMigration.js
// Simple migration runner for schema changes and data transforms

import mongoose from 'mongoose';

/**
 * Migration registry — add new migrations in order.
 * Each migration has a unique version, description, and up/down functions.
 */
const migrations = [
    {
        version: '001',
        description: 'Add isAI field to existing users',
        up: async (db) => {
            const usersCollection = db.collection('users');
            const result = await usersCollection.updateMany(
                { isAI: { $exists: false } },
                { $set: { isAI: false } }
            );
            console.log(`[Migration 001] Updated ${result.modifiedCount} users with isAI field.`);
        },
        down: async (db) => {
            const usersCollection = db.collection('users');
            await usersCollection.updateMany({}, { $unset: { isAI: '' } });
            console.log('[Migration 001] Rolled back: removed isAI field from users.');
        },
    },
    {
        version: '002',
        description: 'Add questionsAsked field to existing diagnosis sessions',
        up: async (db) => {
            const sessionsCollection = db.collection('diagnosissessions');
            const result = await sessionsCollection.updateMany(
                { questionsAsked: { $exists: false } },
                { $set: { questionsAsked: 0 } }
            );
            console.log(`[Migration 002] Updated ${result.modifiedCount} diagnosis sessions.`);
        },
        down: async (db) => {
            const sessionsCollection = db.collection('diagnosissessions');
            await sessionsCollection.updateMany({}, { $unset: { questionsAsked: '' } });
            console.log('[Migration 002] Rolled back: removed questionsAsked field.');
        },
    },
    {
        version: '003',
        description: 'Create migration history collection',
        up: async (db) => {
            const collections = await db.listCollections({ name: 'migrations' }).toArray();
            if (collections.length === 0) {
                await db.createCollection('migrations');
                console.log('[Migration 003] Created migrations collection.');
            } else {
                console.log('[Migration 003] Migrations collection already exists.');
            }
        },
        down: async (db) => {
            await db.collection('migrations').drop();
            console.log('[Migration 003] Dropped migrations collection.');
        },
    },
];

/**
 * Runs all pending migrations that haven't been applied yet.
 */
export const runMigrations = async () => {
    const db = mongoose.connection.db;
    const migrationsCollection = db.collection('migrations');

    for (const migration of migrations) {
        const alreadyRun = await migrationsCollection.findOne({ version: migration.version });
        if (alreadyRun) {
            console.log(`[Migrations] Version ${migration.version} already applied. Skipping.`);
            continue;
        }

        try {
            console.log(`[Migrations] Running migration ${migration.version}: ${migration.description}`);
            await migration.up(db);
            await migrationsCollection.insertOne({
                version: migration.version,
                description: migration.description,
                appliedAt: new Date(),
            });
            console.log(`[Migrations] Migration ${migration.version} completed successfully.`);
        } catch (error) {
            console.error(`[Migrations] Migration ${migration.version} failed:`, error.message);
            throw error;
        }
    }

    console.log('[Migrations] All migrations are up to date.');
};

/**
 * Rolls back the last applied migration.
 */
export const rollbackLastMigration = async () => {
    const db = mongoose.connection.db;
    const migrationsCollection = db.collection('migrations');

    const lastMigration = await migrationsCollection
        .find({})
        .sort({ appliedAt: -1 })
        .limit(1)
        .toArray();

    if (!lastMigration.length) {
        console.log('[Migrations] No migrations to roll back.');
        return;
    }

    const toRollback = lastMigration[0];
    const migrationDef = migrations.find((m) => m.version === toRollback.version);

    if (!migrationDef) {
        throw new Error(`[Migrations] Cannot find definition for version ${toRollback.version}`);
    }

    await migrationDef.down(db);
    await migrationsCollection.deleteOne({ version: toRollback.version });
    console.log(`[Migrations] Rolled back migration ${toRollback.version}.`);
};

export default { runMigrations, rollbackLastMigration };
