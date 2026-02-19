const Resource = require('../models/resourceModel');
const Notification = require('../models/notificationModel');

/**
 * @file resourceController.js
 * @description Core logic for uploading, indexing, and downloading academic repository items.
 */

const uploadResource = async (req, res) => {
    try {
        const { title, description, category, subject, courseCode, semester, fileUrl, fileType, fileSize, tags } = req.body;

        const resource = await Resource.create({
            title,
            description,
            category,
            subject,
            courseCode,
            semester,
            fileUrl,
            fileType,
            fileSize,
            tags,
            owner: req.user.id
        });

        res.status(201).json({
            success: true,
            data: resource,
            message: 'Academic node successfully integrated into repository.'
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getResources = async (req, res) => {
    try {
        const { category, subject, courseCode, search, page = 1, limit = 20 } = req.query;
        let query = {};

        if (category) query.category = category;
        if (subject) query.subject = subject;
        if (courseCode) query.courseCode = courseCode;
        if (search) {
            query.$text = { $search: search };
        }

        const skip = (page - 1) * limit;
        const resources = await Resource.find(query)
            .populate('owner', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Resource.countDocuments(query);

        res.status(200).json({
            success: true,
            count: resources.length,
            total,
            pages: Math.ceil(total / limit),
            data: resources
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id).populate('owner', 'name email avatar');
        if (!resource) return res.status(404).json({ success: false, message: 'Resource not found in index.' });

        res.status(200).json({ success: true, data: resource });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateResourceMetadata = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ success: false, message: 'Resource node missing.' });

        if (resource.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Unauthorized access to node metadata.' });
        }

        const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const incrementDownloads = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } }, { new: true });
        res.status(200).json({ success: true, downloads: resource.downloads });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ success: false, message: 'Resource already purged.' });

        if (resource.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Permission denied for purge operation.' });
        }

        await Resource.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Node successfully expunged.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    uploadResource,
    getResources,
    getResourceById,
    updateResourceMetadata,
    incrementDownloads,
    deleteResource
};
