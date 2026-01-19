// validators/subscriptionValidator.js
// Push notification subscription endpoint validation

import { z } from 'zod';
import { validateBody } from './authValidator.js';

export const pushSubscriptionSchema = z.object({
    endpoint: z.string().url('Invalid subscription endpoint URL.'),
    keys: z.object({
        p256dh: z.string().min(10, 'Invalid p256dh key.'),
        auth: z.string().min(10, 'Invalid auth key.'),
    }),
    expirationTime: z.number().nullable().optional(),
});

export const unsubscribeSchema = z.object({
    endpoint: z.string().url('Invalid subscription endpoint URL.'),
});

export const pushTestSchema = z.object({
    userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user ID.'),
    title: z.string().min(1).max(80).default('Test Notification'),
    body: z.string().min(1).max(300).default('This is a test push notification from Synapse Synchrony.'),
});

export const pushSubscriptionMiddleware = validateBody(pushSubscriptionSchema);
export const unsubscribeMiddleware = validateBody(unsubscribeSchema);
export const pushTestMiddleware = validateBody(pushTestSchema);

export default {
    pushSubscriptionSchema,
    unsubscribeSchema,
    pushTestSchema,
    pushSubscriptionMiddleware,
    unsubscribeMiddleware,
    pushTestMiddleware,
};
