/**
 * @file seedData.js
 * @description Generates a massive amount of project-relevant dummy data for development and testing.
 * This script can populate several thousand records across all models.
 */

const mongoose = require('mongoose');
const User = require('../models/userModel');
const Blog = require('../models/BlogModel'); // Assuming standard name
const Event = require('../models/EventModel');
const MoodLog = require('../models/moodLogModel');
const StressLog = require('../models/stressLogModel');
const AcademicSchedule = require('../models/academicScheduleModel');
const Comment = require('../models/commentModel');

const faker = require('@faker-js/faker').faker;

const SUBJECTS = [
    'Computer Science', 'Software Engineering', 'Data Structures', 'Algorithms',
    'Machine Learning', 'Artificial Intelligence', 'Networking', 'Database Systems',
    'Human Computer Interaction', 'Theory of Computation', 'Cyber Security'
];

const MOODS = ['very_happy', 'happy', 'neutral', 'sad', 'very_sad'];
const CATEGORIES = ['Technology', 'Academic', 'Wellness', 'Campus Life', 'Innovation'];

async function seedDatabase(numUsers = 50) {
    console.log('Starting massive seed process...');

    try {
        // 1. Create Users
        const users = [];
        for (let i = 0; i < numUsers; i++) {
            const user = new User({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: 'Password123!', // Hash in real use
                role: i === 0 ? 'admin' : 'user',
                isEmailVerified: true,
                avatar: faker.image.avatar()
            });
            users.push(await user.save());
        }
        console.log(`Created ${users.length} users.`);

        // 2. Create Blogs
        const blogs = [];
        for (let j = 0; j < numUsers * 3; j++) {
            const author = users[Math.floor(Math.random() * users.length)];
            const blog = new Blog({
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraphs(5),
                author: author._id,
                category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
                tags: [faker.lorem.word(), faker.lorem.word()],
                isPublished: true,
                likes: users.slice(0, Math.floor(Math.random() * users.length)).map(u => u._id)
            });
            blogs.push(await blog.save());
        }
        console.log(`Created ${blogs.length} blogs.`);

        // 3. Create Comments
        for (const blog of blogs) {
            const numComments = Math.floor(Math.random() * 10);
            for (let k = 0; k < numComments; k++) {
                const author = users[Math.floor(Math.random() * users.length)];
                await Comment.create({
                    content: faker.lorem.sentence(),
                    author: author._id,
                    blog: blog._id
                });
            }
        }
        console.log('Created comments for all blogs.');

        // 4. Create Wellness Logs
        for (const user of users) {
            // Last 30 days of logs
            for (let d = 0; d < 30; d++) {
                const date = new Date();
                date.setDate(date.getDate() - d);

                await MoodLog.create({
                    user: user._id,
                    mood: MOODS[Math.floor(Math.random() * MOODS.length)],
                    note: faker.lorem.sentence(),
                    timestamp: date
                });

                await StressLog.create({
                    user: user._id,
                    level: Math.floor(Math.random() * 10) + 1,
                    triggers: [faker.lorem.word()],
                    timestamp: date
                });
            }
        }
        console.log('Created 30 days of wellness logs for all users.');

        // 5. Create Academic Schedules
        for (const user of users) {
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            for (const day of days) {
                const numClasses = Math.floor(Math.random() * 3) + 1;
                for (let c = 0; c < numClasses; c++) {
                    await AcademicSchedule.create({
                        user: user._id,
                        subject: SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)],
                        courseCode: 'CSE' + (Math.floor(Math.random() * 4000) + 1000),
                        instructor: 'Dr. ' + faker.person.lastName(),
                        day,
                        startTime: `${8 + c * 2}:00`,
                        endTime: `${10 + c * 2}:00`,
                        room: 'Building ' + (Math.floor(Math.random() * 5) + 1) + ' Room ' + (Math.floor(Math.random() * 500) + 100),
                        semester: 'Summer 2026'
                    });
                }
            }
        }
        console.log('Created schedules for all users.');

        console.log('Seeding complete! Database is now populated with thousands of records.');
    } catch (error) {
        console.error('Seeding failed:', error);
    }
}

module.exports = { seedDatabase };
