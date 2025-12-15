// streamChat/streamWebhookVerifier.js
// Verifies incoming Stream Chat webhook events

import crypto from 'crypto';

const STREAM_WEBHOOK_SECRET = process.env.STREAM_WEBHOOK_SECRET;

/**
 * Verifies that a webhook request originated from Stream Chat.
 * Stream signs webhooks using HMAC-SHA256.
 * @param {string|Buffer} rawBody
 * @param {string} signatureHeader - The value of the x-signature header
 * @returns {boolean}
 */
export const verifyStreamWebhook = (rawBody, signatureHeader) => {
    if (!STREAM_WEBHOOK_SECRET) {
        console.warn('[StreamWebhook] STREAM_WEBHOOK_SECRET not set. Skipping signature verification.');
        return true; // Allow in dev mode without secret
    }

    if (!rawBody || !signatureHeader) return false;

    const body = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    const expectedSignature = crypto
        .createHmac('sha256', STREAM_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

    try {
        return crypto.timingSafeEqual(
            Buffer.from(signatureHeader),
            Buffer.from(expectedSignature)
        );
    } catch {
        return false;
    }
};

/**
 * Known Stream Chat webhook event types.
 */
export const STREAM_WEBHOOK_EVENTS = {
    MESSAGE_NEW: 'message.new',
    MESSAGE_UPDATED: 'message.updated',
    MESSAGE_DELETED: 'message.deleted',
    CHANNEL_CREATED: 'channel.created',
    CHANNEL_DELETED: 'channel.deleted',
    MEMBER_ADDED: 'member.added',
    MEMBER_REMOVED: 'member.removed',
    USER_BANNED: 'user.banned',
};

/**
 * Processes a verified Stream Chat webhook event payload.
 * @param {object} payload
 * @returns {object} normalized event data
 */
export const processStreamWebhookEvent = (payload) => {
    const { type, cid, channel, user, message, member } = payload;

    console.log(`[StreamWebhook] Received event: ${type} | Channel: ${cid || 'N/A'}`);

    return {
        eventType: type,
        channelId: cid,
        channelType: channel?.type,
        userId: user?.id,
        userName: user?.name,
        messageId: message?.id,
        messageText: message?.text,
        memberId: member?.user_id,
        timestamp: new Date(payload.created_at || Date.now()),
        raw: payload,
    };
};

export default { verifyStreamWebhook, processStreamWebhookEvent, STREAM_WEBHOOK_EVENTS };
