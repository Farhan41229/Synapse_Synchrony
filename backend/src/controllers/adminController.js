/**
 * @file adminController.js
 * @description Master control logic for Synapse Synchrony administrative systems.
 * Handles user moderation, system metrics, and audit log retrieval.
 */

const User = require('../models/userModel');
const Blog = require('../models/BlogModel');
const Event = require('../models/EventModel');
const StressLog = require('../models/stressLogModel');
const MoodLog = require('../models/moodLogModel');
const moment = require('moment');
const os = require('os');

/**
 * Retrieves a snapshot of current system and network metrics.
 */
const getSystemMetrics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
        const recentUsers = await User.countDocuments({
            createdAt: { $gte: moment().subtract(7, 'days').toDate() }
        });

        const totalBlogs = await Blog.countDocuments();
        const totalEvents = await Event.countDocuments();

        // System OS metrics
        const systemMetrics = {
            platform: os.platform(),
            uptime: os.uptime(),
            totalMemory: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
            freeMemory: (os.freemem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
            cpuCores: os.cpus().length,
            loadAvg: os.loadavg()
        };

        res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    verified: verifiedUsers,
                    growth7d: recentUsers
                },
                content: {
                    blogs: totalBlogs,
                    events: totalEvents
                },
                system: systemMetrics,
                timestamp: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Fetches a list of all nodes (users) with advanced filtering for moderation.
 */
const getNodesManagement = async (req, res) => {
    try {
        const { role, verified, search } = req.query;
        let query = {};

        if (role) query.role = role;
        if (verified) query.isEmailVerified = verified === 'true';
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const nodes = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: nodes.length,
            data: nodes
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Modifies the integrity status (verified) or role of a specific node.
 */
const updateNodeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, isEmailVerified } = req.body;

        const node = await User.findById(id);
        if (!node) return res.status(404).json({ success: false, message: 'Node not found.' });

        if (role) node.role = role;
        if (typeof isEmailVerified !== 'undefined') node.isEmailVerified = isEmailVerified;

        await node.save();

        res.status(200).json({
            success: true,
            message: `Node ${id} recalculated.`,
            data: node
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * Terminates a node's presence from the network (Delete user).
 */
const terminateNode = async (req, res) => {
    try {
        const { id } = req.params;
        const node = await User.findById(id);

        if (!node) return res.status(404).json({ success: false, message: 'Node already dead.' });
        if (node.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot terminate admin nexus.' });

        // Clean up user content
        await Promise.all([
            Blog.deleteMany({ author: id }),
            MoodLog.deleteMany({ user: id }),
            StressLog.deleteMany({ user: id }),
            User.findByIdAndDelete(id)
        ]);

        res.status(200).json({
            success: true,
            message: `Node ${id} and all relative data purged.`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Aggregates global wellness trends across the entire campus.
 */
const getGlobalWellnessOscillations = async (req, res) => {
    try {
        const thirtyDaysAgo = moment().subtract(30, 'days').toDate();

        const moodTrend = await MoodLog.aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    averageMood: {
                        $avg: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$mood", "very_happy"] }, then: 5 },
                                    { case: { $eq: ["$mood", "happy"] }, then: 4 },
                                    { case: { $eq: ["$mood", "neutral"] }, then: 3 },
                                    { case: { $eq: ["$mood", "sad"] }, then: 2 },
                                    { case: { $eq: ["$mood", "very_sad"] }, then: 1 }
                                ],
                                default: 3
                            }
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const stressTrend = await StressLog.aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    averageStress: { $avg: "$level" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                moodTrend,
                stressTrend,
                period: '30d'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getSystemMetrics,
    getNodesManagement,
    updateNodeStatus,
    terminateNode,
    getGlobalWellnessOscillations
};
