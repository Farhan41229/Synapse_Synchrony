// validators/notificationValidator.js
// Validation schemas for notification management

import { z } from 'zod';
import { validateBody } from './authValidator.js';

export const createNotificationSchema = z.object({
    recipient: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid recipient ID.'),
    type: z.enum([
        'message',
        'friend_request',
        'blog_like',
        'blog_comment',
        'event_registration',
        'mention',
        'system',
    ], { required_error: 'Notification type is required.' }),
    title: z.string().min(1, 'Title is required.').max(80).trim(),
    body: z.string().min(1, 'Body is required.').max(300).trim(),
    link: z.string().url('Invalid link URL.').optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

export const markNotificationsReadSchema = z.object({
    ids: z
        .array(z.string().regex(/^[a-f\d]{24}$/i))
        .min(1, 'At least one notification ID is required.')
        .max(100, 'Cannot mark more than 100 notifications at once.'),
});

export const notificationQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20),
    unreadOnly: z.coerce.boolean().optional(),
    type: z.string().optional(),
});

export const createNotificationMiddleware = validateBody(createNotificationSchema);
export const markReadMiddleware = validateBody(markNotificationsReadSchema);

export default {
    createNotificationSchema,
    markNotificationsReadSchema,
    notificationQuerySchema,
    createNotificationMiddleware,
    markReadMiddleware,
};
