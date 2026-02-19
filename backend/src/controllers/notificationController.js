const Notification = require('../models/notificationModel');
const { getIO } = require('../conn/Bothap/adapters/socketNotifier');

/**
 * Get all notifications for the authenticated user
 */
const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly = false } = req.query;
        const skip = (page - 1) * limit;

        const query = { recipient: req.user._id };
        if (unreadOnly === 'true') query.isRead = false;

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('sender', 'name avatar');

        const total = await Notification.countDocuments(query);

        res.status(200).json({
            success: true,
            data: notifications,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Mark specific notifications as read
 */
const markAsRead = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ success: false, message: 'Invalid notification IDs provided.' });
        }

        await Notification.updateMany(
            { _id: { $in: ids }, recipient: req.user._id },
            { $set: { isRead: true } }
        );

        res.status(200).json({ success: true, message: 'Notifications marked as read.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Mark all notifications as read for the current user
 */
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ success: true, message: 'All notifications marked as read.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete a notification
 */
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOneAndDelete({ _id: id, recipient: req.user._id });

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found.' });
        }

        res.status(200).json({ success: true, message: 'Notification deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete all notifications for the user
 */
const deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ recipient: req.user._id });
        res.status(200).json({ success: true, message: 'All notifications deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create a notification (utility function to be used by other services)
 */
const createInternalNotification = async (payload) => {
    try {
        const notification = await Notification.create(payload);

        // Emit via socket if user is online
        const io = getIO();
        if (io) {
            io.to(payload.recipient.toString()).emit('new_notification', notification);
        }

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    createInternalNotification
};
