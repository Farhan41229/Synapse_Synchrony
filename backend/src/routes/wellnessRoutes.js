const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
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
} = require('../controllers/wellnessController');

// All wellness routes are protected
router.use(protect);

// Mood routes
router.get('/mood', getMoodLogs);
router.post('/mood', createMoodLog);
router.get('/mood/summary', getMoodSummary);

// Stress routes
router.get('/stress', getStressLogs);
router.post('/stress', createStressLog);
router.get('/stress/average', getStressAverage);

// Goal routes
router.get('/goals', getWellnessGoals);
router.post('/goals', createWellnessGoal);
router.put('/goals/:id', updateWellnessGoal);
router.delete('/goals/:id', deleteWellnessGoal);
router.patch('/goals/:id/toggle', toggleGoalCompletion);

module.exports = router;
