const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    uploadResource,
    getResources,
    getResourceById,
    updateResourceMetadata,
    incrementDownloads,
    deleteResource
} = require('../controllers/resourceController');

router.use(protect);

router.get('/', getResources);
router.post('/', uploadResource);
router.get('/:id', getResourceById);
router.put('/:id', updateResourceMetadata);
router.patch('/:id/download', incrementDownloads);
router.delete('/:id', deleteResource);

module.exports = router;
