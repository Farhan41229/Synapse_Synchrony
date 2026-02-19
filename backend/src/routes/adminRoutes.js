const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
    getSystemMetrics,
    getNodesManagement,
    updateNodeStatus,
    terminateNode,
    getGlobalWellnessOscillations
} = require('../controllers/adminController');

// All admin routes are highly protected
router.use(protect);
router.use(admin);

router.get('/metrics', getSystemMetrics);
router.get('/users', getNodesManagement);
router.get('/wellness-trends', getGlobalWellnessOscillations);

router.put('/nodes/:id', updateNodeStatus);
router.delete('/nodes/:id', terminateNode);

module.exports = router;
