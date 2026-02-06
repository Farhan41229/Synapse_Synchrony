// database/dbSeeder.js
// Seeds the database with initial/test data for development environments

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Seeds the users collection with sample user accounts.
 */
export const seedUsers = async () => {
    const usersCollection = mongoose.connection.collection('users');
    const count = await usersCollection.countDocuments();

    if (count > 0) {
        console.log(`[Seeder] Users collection already has ${count} documents. Skipping seed.`);
        return;
    }

    const hashedPassword = await bcrypt.hash('SynapseTest@123', 10);
    const sampleUsers = [
        {
            email: 'admin@synapse.com',
            password: hashedPassword,
            name: 'Admin User',
            isVerified: true,
            isAI: false,
            role: 'user',
            bio: 'System administrator account.',
            phone: '+8801700000001',
            gender: 'prefer_not_to_say',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            email: 'testuser@synapse.com',
            password: hashedPassword,
            name: 'Test User',
            isVerified: true,
            isAI: false,
            role: 'user',
            bio: 'Standard test user for development.',
            phone: '+8801700000002',
            gender: 'male',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            email: 'doctor@synapse.com',
            password: hashedPassword,
            name: 'Dr. Farhan Rahman',
            isVerified: true,
            isAI: false,
            role: 'user',
            bio: 'Mental health professional. MBBS, Dhaka Medical College.',
            phone: '+8801700000003',
            gender: 'male',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const result = await usersCollection.insertMany(sampleUsers);
    console.log(`[Seeder] Inserted ${result.insertedCount} sample users.`);
};

/**
 * Seeds the wellness suggestions collection with initial content.
 */
export const seedWellnessSuggestions = async () => {
    const collection = mongoose.connection.collection('wellnesssuggestions');
    const count = await collection.countDocuments();

    if (count > 0) {
        console.log(`[Seeder] Wellness suggestions already seeded (${count} docs). Skipping.`);
        return;
    }

    const suggestions = [
        {
            category: 'mindfulness',
            title: 'Morning Breathing Exercise',
            description: 'Start your day with 5 minutes of deep breathing to calm your nervous system.',
            durationMinutes: 5,
            tags: ['breathing', 'morning', 'anxiety'],
            createdAt: new Date(),
        },
        {
            category: 'physical',
            title: '10-Minute Walk',
            description: 'A short outdoor walk can significantly improve your mood and reduce stress hormones.',
            durationMinutes: 10,
            tags: ['exercise', 'outdoor', 'mood'],
            createdAt: new Date(),
        },
        {
            category: 'social',
            title: 'Connect with a Friend',
            description: 'Reach out to someone you trust. Social connection is essential for mental health.',
            durationMinutes: 15,
            tags: ['social', 'connection', 'support'],
            createdAt: new Date(),
        },
        {
            category: 'sleep',
            title: 'Consistent Sleep Schedule',
            description: 'Go to bed and wake up at the same time every day to regulate your circadian rhythm.',
            durationMinutes: 0,
            tags: ['sleep', 'routine', 'energy'],
            createdAt: new Date(),
        },
    ];

    const result = await collection.insertMany(suggestions);
    console.log(`[Seeder] Inserted ${result.insertedCount} wellness suggestions.`);
};

/**
 * Master seed function — runs all seeders in order.
 */
export const runAllSeeders = async () => {
    console.log('[Seeder] Starting database seeding...');
    await seedUsers();
    await seedWellnessSuggestions();
    console.log('[Seeder] Database seeding complete.');
};

/**
 * Clears all seeded data (use with caution in development only).
 */
export const clearSeedData = async () => {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('[Seeder] Cannot clear seed data in production environment.');
    }

    const collections = ['users', 'wellnesssuggestions'];
    for (const col of collections) {
        await mongoose.connection.collection(col).deleteMany({});
        console.log(`[Seeder] Cleared collection: ${col}`);
    }

    console.log('[Seeder] All seed data cleared.');
};

export default { runAllSeeders, seedUsers, seedWellnessSuggestions, clearSeedData };
