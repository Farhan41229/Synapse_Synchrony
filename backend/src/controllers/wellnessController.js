const MoodLog = require('../models/moodLogModel');
const StressLog = require('../models/stressLogModel');
const WellnessGoal = require('../models/wellnessGoalModel');
const moment = require('moment');

// ─── Mood Controllers ───────────────────────────────────────────────

const getMoodLogs = async (req, res) => {
    try {
        const logs = await MoodLog.find({ user: req.user._id })
            .sort({ timestamp: -1 })
            .limit(30);
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createMoodLog = async (req, res) => {
    try {
        const { mood, note } = req.body;
        const log = await MoodLog.create({
            user: req.user._id,
            mood,
            note
        });
        res.status(201).json({ success: true, data: log });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getMoodSummary = async (req, res) => {
    try {
        const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
        const logs = await MoodLog.find({
            user: req.user._id,
            timestamp: { $gte: thirtyDaysAgo }
        });

        const counts = {
            very_happy: 0,
            happy: 0,
            neutral: 0,
            sad: 0,
            very_sad: 0
        };

        logs.forEach(log => {
            counts[log.mood]++;
        });

        res.status(200).json({ success: true, data: counts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Stress Controllers ─────────────────────────────────────────────

const getStressLogs = async (req, res) => {
    try {
        const logs = await StressLog.find({ user: req.user._id })
            .sort({ timestamp: -1 })
            .limit(30);
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createStressLog = async (req, res) => {
    try {
        const { level, triggers, note } = req.body;
        const log = await StressLog.create({
            user: req.user._id,
            level,
            triggers,
            note
        });
        res.status(201).json({ success: true, data: log });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getStressAverage = async (req, res) => {
    try {
        const weekAgo = moment().subtract(7, 'days').toDate();
        const logs = await StressLog.find({
            user: req.user._id,
            timestamp: { $gte: weekAgo }
        });

        if (logs.length === 0) {
            return res.status(200).json({ success: true, data: { average: 0, count: 0 } });
        }

        const sum = logs.reduce((acc, log) => acc + log.level, 0);
        const average = sum / logs.length;

        res.status(200).json({ success: true, data: { average: average.toFixed(1), count: logs.length } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Wellness Goal Controllers ───────────────────────────────────────

const getWellnessGoals = async (req, res) => {
    try {
        const goals = await WellnessGoal.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: goals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createWellnessGoal = async (req, res) => {
    try {
        const goal = await WellnessGoal.create({
            ...req.body,
            user: req.user._id
        });
        res.status(201).json({ success: true, data: goal });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateWellnessGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const goal = await WellnessGoal.findOneAndUpdate(
            { _id: id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!goal) {
            return res.status(404).json({ success: false, message: 'Goal not found.' });
        }

        res.status(200).json({ success: true, data: goal });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteWellnessGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const goal = await WellnessGoal.findOneAndDelete({ _id: id, user: req.user._id });

        if (!goal) {
            return res.status(404).json({ success: false, message: 'Goal not found.' });
        }

        res.status(200).json({ success: true, message: 'Goal deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleGoalCompletion = async (req, res) => {
    try {
        const { id } = req.params;
        const goal = await WellnessGoal.findOne({ _id: id, user: req.user._id });

        if (!goal) {
            return res.status(404).json({ success: false, message: 'Goal not found.' });
        }

        goal.isCompleted = !goal.isCompleted;
        await goal.save();

        res.status(200).json({ success: true, data: goal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getMoodLogs,
    createMoodLog,
    getMoodSummary,
    getStressLogs,
    createStressLog,
    getStressAverage,
    getWellnessGoals,
    createWellnessGoal,
    updateWellnessGoal,
    deleteWellnessGoal,
    toggleGoalCompletion
};
