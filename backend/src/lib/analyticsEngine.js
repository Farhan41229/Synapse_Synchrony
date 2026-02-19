/**
 * @file analyticsEngine.js
 * @description Advanced analytics engine for student engagement and wellness correlation.
 * This module processes student logs to find patterns between mood, stress, and academic schedule.
 */

const MoodLog = require('../models/moodLogModel');
const StressLog = require('../models/stressLogModel');
const AcademicSchedule = require('../models/academicScheduleModel');
const moment = require('moment');

/**
 * Calculates the correlation between stress levels and the number of classes per day.
 * @param {string} userId - The student's ID
 * @returns {Promise<Object>} Correlation report
 */
async function analyzeStressVsWorkload(userId) {
    console.log(`Analyzing stress vs workload for user: ${userId}`);

    // Get last 30 days of data
    const thirtyDaysAgo = moment().subtract(30, 'days').toDate();

    // Fetch logs
    const stressLogs = await StressLog.find({
        user: userId,
        timestamp: { $gte: thirtyDaysAgo }
    }).sort({ timestamp: 1 });

    const schedule = await AcademicSchedule.find({ user: userId });

    // Map classes per day
    const classesPerDay = {
        'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0, 'Sunday': 0
    };
    schedule.forEach(slot => {
        if (classesPerDay[slot.day] !== undefined) {
            classesPerDay[slot.day]++;
        }
    });

    const report = {
        totalRecords: stressLogs.length,
        averageStress: 0,
        dayBreakdown: {},
        findings: []
    };

    if (stressLogs.length === 0) return report;

    let totalStress = 0;
    const dayLevels = {};

    stressLogs.forEach(log => {
        const day = moment(log.timestamp).format('dddd');
        totalStress += log.level;

        if (!dayLevels[day]) dayLevels[day] = { sum: 0, count: 0 };
        dayLevels[day].sum += log.level;
        dayLevels[day].count++;
    });

    report.averageStress = (totalStress / stressLogs.length).toFixed(2);

    Object.keys(dayLevels).forEach(day => {
        const avg = (dayLevels[day].sum / dayLevels[day].count).toFixed(2);
        const workload = classesPerDay[day];
        report.dayBreakdown[day] = {
            averageStress: avg,
            classCount: workload
        };

        if (avg > 7 && workload > 4) {
            report.findings.push(`High stress peaks on ${day} correlate with heavy class load (${workload} classes).`);
        }
    });

    return report;
}

/**
 * Sentiment analysis on blog comments (Mock implementation for now)
 * @param {string} blogId 
 */
async function analyzeBlogSentiment(blogId) {
    const Comment = require('../models/commentModel');
    const comments = await Comment.find({ blog: blogId });

    const sentiment = {
        positive: 0,
        negative: 0,
        neutral: 0,
        keywords: new Set()
    };

    const positiveWords = ['great', 'awesome', 'helped', 'clear', 'useful', 'recommend'];
    const negativeWords = ['confused', 'hard', 'unclear', 'boring', 'noisy', 'broken'];

    comments.forEach(c => {
        const text = c.content.toLowerCase();
        let posCount = 0;
        let negCount = 0;

        positiveWords.forEach(w => { if (text.includes(w)) posCount++; });
        negativeWords.forEach(w => { if (text.includes(w)) negCount++; });

        if (posCount > negCount) sentiment.positive++;
        else if (negCount > posCount) sentiment.negative++;
        else sentiment.neutral++;
    });

    return {
        blogId,
        commentCount: comments.length,
        sentimentDistribution: {
            positive: ((sentiment.positive / comments.length) * 100 || 0).toFixed(1) + '%',
            negative: ((sentiment.negative / comments.length) * 100 || 0).toFixed(1) + '%',
            neutral: ((sentiment.neutral / comments.length) * 100 || 0).toFixed(1) + '%'
        }
    };
}

/**
 * Predicts potential burnout risk based on recent logs
 */
async function predictBurnoutRisk(userId) {
    const sevenDaysAgo = moment().subtract(7, 'days').toDate();
    const recentStress = await StressLog.find({
        user: userId,
        timestamp: { $gte: sevenDaysAgo }
    });

    const recentMood = await MoodLog.find({
        user: userId,
        timestamp: { $gte: sevenDaysAgo }
    });

    let riskScore = 0;

    // Stress factor
    if (recentStress.length > 0) {
        const avgStress = recentStress.reduce((a, b) => a + b.level, 0) / recentStress.length;
        if (avgStress > 8) riskScore += 40;
        else if (avgStress > 6) riskScore += 20;
    }

    // Mood factor
    const lowMoods = recentMood.filter(m => m.mood === 'very_sad' || m.mood === 'sad').length;
    if (recentMood.length > 0) {
        const lowMoodRatio = lowMoods / recentMood.length;
        if (lowMoodRatio > 0.6) riskScore += 40;
        else if (lowMoodRatio > 0.3) riskScore += 20;
    }

    let status = 'Healthy';
    if (riskScore > 70) status = 'Critical - Action Recommended';
    else if (riskScore > 40) status = 'Warning - Monitor Closely';

    return {
        userId,
        riskScore,
        status,
        timestamp: new Date()
    };
}

module.exports = {
    analyzeStressVsWorkload,
    analyzeBlogSentiment,
    predictBurnoutRisk
};
