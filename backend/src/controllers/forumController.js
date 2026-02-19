const Forum = require('../models/ForumModel');
const Notification = require('../models/notificationModel');

/**
 * @file forumController.js
 * @description Logic for community discussion forums, branching topics, and upvote management.
 */

const createTopic = async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;

        const topic = await Forum.create({
            title,
            content,
            category,
            tags,
            author: req.user.id
        });

        res.status(201).json({ success: true, data: topic });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getTopics = async (req, res) => {
    try {
        const { category, search, sort = 'newest', page = 1, limit = 15 } = req.query;
        let query = {};

        if (category) query.category = category;
        if (search) query.$text = { $search: search };

        let sortQuery = { createdAt: -1 };
        if (sort === 'hot') sortQuery = { views: -1 };
        if (sort === 'upvotes') sortQuery = { "upvotes.length": -1 };

        const skip = (page - 1) * limit;
        const topics = await Forum.find(query)
            .populate('author', 'name avatar')
            .sort(sortQuery)
            .skip(skip)
            .limit(Number(limit));

        const total = await Forum.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            count: topics.length,
            pages: Math.ceil(total / limit),
            data: topics
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTopicById = async (req, res) => {
    try {
        const topic = await Forum.findById(req.params.id)
            .populate('author', 'name avatar')
            .populate('replies.author', 'name avatar');

        if (!topic) return res.status(404).json({ success: false, message: 'Topic not found.' });

        // Increment views on each lookup
        topic.views += 1;
        await topic.save();

        res.status(200).json({ success: true, data: topic });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const upvoteTopic = async (req, res) => {
    try {
        const topic = await Forum.findById(req.params.id);
        if (!topic) return res.status(404).json({ success: false, message: 'Topic missing.' });

        const userId = req.user.id;
        const exists = topic.upvotes.find(u => u.toString() === userId);

        if (exists) {
            topic.upvotes = topic.upvotes.filter(u => u.toString() !== userId);
        } else {
            topic.upvotes.push(userId);

            // Notify author
            if (topic.author.toString() !== userId) {
                await Notification.create({
                    recipient: topic.author,
                    sender: userId,
                    type: 'forum_upvote',
                    title: 'Your topic was upvoted!',
                    body: `${req.user.name} found your discussion useful.`,
                    link: `/forum/${topic._id}`
                });
            }
        }

        await topic.save();
        res.status(200).json({ success: true, upvotes: topic.upvotes.length });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const addReply = async (req, res) => {
    try {
        const { content } = req.body;
        const topic = await Forum.findById(req.params.id);
        if (!topic) return res.status(404).json({ success: false, message: 'Topic missing.' });
        if (topic.isClosed) return res.status(400).json({ success: false, message: 'Discussion closed.' });

        const reply = {
            content,
            author: req.user.id,
            upvotes: [],
            createdAt: new Date()
        };

        topic.replies.push(reply);
        await topic.save();

        // Notify author
        if (topic.author.toString() !== req.user.id.toString()) {
            await Notification.create({
                recipient: topic.author,
                sender: req.user.id,
                type: 'forum_reply',
                title: 'New discussion reply',
                body: `${req.user.name} responded to your forum topic.`,
                link: `/forum/${topic._id}`
            });
        }

        res.status(201).json({ success: true, data: topic.replies });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteTopic = async (req, res) => {
    try {
        const topic = await Forum.findById(req.params.id);
        if (!topic) return res.status(404).json({ success: false, message: 'Already purged.' });

        if (topic.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Nexus authorization required for purging.' });
        }

        await Forum.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Topic expunged from database.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createTopic,
    getTopics,
    getTopicById,
    upvoteTopic,
    addReply,
    deleteTopic
};
