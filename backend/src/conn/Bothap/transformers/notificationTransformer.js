// transformers/notificationTransformer.js
// Shape notification documents for API responses

/**
 * Transform a notification document.
 * @param {object} notification
 */
export const toNotificationResponse = (notification) => {
    const raw = notification?.toObject ? notification.toObject() : { ...notification };
    return {
        _id: raw._id?.toString(),
        type: raw.type,
        title: raw.title,
        body: raw.body,
        link: raw.link ?? null,
        isRead: raw.isRead ?? false,
        metadata: raw.metadata ?? {},
        createdAt: raw.createdAt,
    };
};

/**
 * Build a notification summary for an unread-count badge.
 * @param {object[]} notifications
 */
export const toNotificationSummary = (notifications = []) => {
    const unread = notifications.filter((n) => !n.isRead).length;
    const latest = notifications[0] ? toNotificationResponse(notifications[0]) : null;
    return {
        total: notifications.length,
        unreadCount: unread,
        latestNotification: latest,
    };
};

/**
 * Group notifications by type.
 * @param {object[]} notifications
 * @returns {Record<string, object[]>}
 */
export const groupByType = (notifications = []) => {
    const groups = {};
    for (const n of notifications) {
        const type = n.type ?? 'system';
        if (!groups[type]) groups[type] = [];
        groups[type].push(toNotificationResponse(n));
    }
    return groups;
};

export default { toNotificationResponse, toNotificationSummary, groupByType };
