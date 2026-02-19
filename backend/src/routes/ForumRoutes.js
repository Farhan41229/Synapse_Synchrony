const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    createTopic,
    getTopics,
    getTopicById,
    upvoteTopic,
    addReply,
    deleteTopic
} = require('../controllers/forumController');

router.use(protect);

router.get('/', getTopics);
router.post('/', createTopic);
router.get('/:id', getTopicById);
router.post('/:id/upvote', upvoteTopic);
router.post('/:id/reply', addReply);
router.delete('/:id', deleteTopic);

module.exports = router;
