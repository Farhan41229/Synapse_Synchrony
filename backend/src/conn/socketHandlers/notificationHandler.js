// socketHandlers/notificationHandler.js
// Handles real-time in-app notifications via Socket.IO

const NOTIFICATION_EVENTS = {
    SEND: 'notification:send',
    RECEIVE: 'notification:receive',
    MARK_READ: 'notification:mark_read',
    MARK_ALL_READ: 'notification:mark_all_read',
    COUNT_UPDATE: 'notification:count_update',
};

// In-memory notification store per user session (can be moved to Redis)
const userNotificationCounts = new Map();

/**
 * Registers notification event handlers for a connected socket.
 * @param {Server} io
 * @param {Socket} socket
 */
export const registerNotificationHandlers = (io, socket) => {
    const userId = socket.userId?.toString();

    // Join a personal notification room
    socket.join(`notifications:${userId}`);
    console.log(`[NotificationHandler] User ${userId} joined notification room.`);

    // Mark a single notification as read
    socket.on(NOTIFICATION_EVENTS.MARK_READ, ({ notificationId }) => {
        if (!notificationId) return;

        // Decrement count in memory
        const current = userNotificationCounts.get(userId) || 0;
        const updated = Math.max(0, current - 1);
        userNotificationCounts.set(userId, updated);

        // Emit updated count back to user
        socket.emit(NOTIFICATION_EVENTS.COUNT_UPDATE, { unreadCount: updated });
        console.log(`[NotificationHandler] Notification ${notificationId} marked as read for ${userId}.`);
    });

    // Mark all notifications as read
    socket.on(NOTIFICATION_EVENTS.MARK_ALL_READ, () => {
        userNotificationCounts.set(userId, 0);
        socket.emit(NOTIFICATION_EVENTS.COUNT_UPDATE, { unreadCount: 0 });
        console.log(`[NotificationHandler] All notifications marked as read for ${userId}.`);
    });

    // Clean up on disconnect
    socket.on('disconnect', () => {
        socket.leave(`notifications:${userId}`);
    });
};

/**
 * Sends a notification to a specific user via their personal notification room.
 * @param {string} targetUserId
 * @param {object} notification
 * @param {Server} io
 */
export const sendNotificationToUser = (io, targetUserId, notification) => {
    const room = `notifications:${targetUserId}`;
    io.to(room).emit(NOTIFICATION_EVENTS.RECEIVE, notification);

    // Update unread count
    const current = userNotificationCounts.get(targetUserId.toString()) || 0;
    userNotificationCounts.set(targetUserId.toString(), current + 1);

    io.to(room).emit(NOTIFICATION_EVENTS.COUNT_UPDATE, {
        unreadCount: current + 1,
    });

    console.log(`[NotificationHandler] Notification sent to user ${targetUserId}:`, notification.title);
};

export default { registerNotificationHandlers, sendNotificationToUser };
