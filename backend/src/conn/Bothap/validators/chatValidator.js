// validators/chatValidator.js
// Validation schemas for chat / messaging operations

import { z } from 'zod';
import { validateBody } from './authValidator.js';

export const createChatSchema = z.object({
    isGroup: z.boolean().default(false),
    participantID: z
        .string()
        .regex(/^[a-f\d]{24}$/i, 'Invalid participant ID.')
        .optional(),
    participants: z
        .array(z.string().regex(/^[a-f\d]{24}$/i, 'Invalid participant ID.'))
        .max(50, 'Group chats may have at most 50 members.')
        .optional(),
    groupName: z.string().trim().max(60, 'Group name too long.').optional(),
}).superRefine((data, ctx) => {
    if (!data.isGroup && !data.participantID) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'participantID is required for 1-on-1 chats.', path: ['participantID'] });
    }
    if (data.isGroup && (!data.participants || data.participants.length < 2)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Group chats require at least 2 participants.', path: ['participants'] });
    }
    if (data.isGroup && !data.groupName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Group name is required for group chats.', path: ['groupName'] });
    }
});

export const sendMessageSchema = z.object({
    chatId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid chat ID.'),
    content: z.string().trim().max(2000, 'Message too long.').optional(),
    image: z.string().optional(),
    replyTo: z
        .string()
        .regex(/^[a-f\d]{24}$/i)
        .nullable()
        .optional(),
    messageType: z.enum(['text', 'image', 'voice', 'location']).default('text'),
}).refine(
    (d) => d.content || d.image,
    { message: 'Message must have content or an image.', path: ['content'] }
);

export const chatIdParamSchema = z.object({
    chatId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid chat ID.'),
});

export const createChatMiddleware = validateBody(createChatSchema);
export const sendMessageMiddleware = validateBody(sendMessageSchema);

export default {
    createChatSchema,
    sendMessageSchema,
    chatIdParamSchema,
    createChatMiddleware,
    sendMessageMiddleware,
};
