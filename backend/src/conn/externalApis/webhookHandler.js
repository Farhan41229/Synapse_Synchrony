// externalApis/webhookHandler.js
// Handles incoming webhooks from external services (Cloudinary, Brevo, etc.)

import crypto from 'crypto';

/**
 * Verifies the webhook signature from a provider using HMAC.
 * @param {Buffer|string} rawBody - The raw request body
 * @param {string} signature - The provider-sent signature
 * @param {string} secret - The shared webhook secret
 * @param {string} algorithm - Hash algorithm (default: sha256)
 * @returns {boolean}
 */
export const verifyWebhookSignature = (rawBody, signature, secret, algorithm = 'sha256') => {
    if (!rawBody || !signature || !secret) return false;

    const body = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    const expectedSig = crypto.createHmac(algorithm, secret).update(body).digest('hex');

    // Use timingSafeEqual to prevent timing attacks
    try {
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSig)
        );
    } catch {
        return false;
    }
};

/**
 * Processes a Cloudinary upload notification webhook.
 * @param {object} payload - Webhook payload from Cloudinary
 * @returns {object}
 */
export const handleCloudinaryWebhook = (payload) => {
    const { notification_type, public_id, secure_url, resource_type, bytes } = payload;
    console.log(`[Webhook] Cloudinary event: ${notification_type} | asset: ${public_id}`);

    return {
        event: notification_type,
        assetId: public_id,
        url: secure_url,
        resourceType: resource_type,
        sizeBytes: bytes,
        processedAt: new Date(),
    };
};

/**
 * Processes a Brevo (email provider) delivery status webhook.
 * @param {object} payload
 * @returns {object}
 */
export const handleBrevoWebhook = (payload) => {
    const { event, email, 'message-id': messageId, date } = payload;
    console.log(`[Webhook] Brevo event: ${event} | email: ${email}`);

    const STATUS_MAP = {
        delivered: 'delivered',
        soft_bounce: 'bounced_soft',
        hard_bounce: 'bounced_hard',
        spam: 'marked_spam',
        unsub: 'unsubscribed',
        open: 'opened',
        click: 'clicked',
    };

    return {
        event: STATUS_MAP[event] || event,
        recipientEmail: email,
        messageId,
        timestamp: date ? new Date(date) : new Date(),
    };
};

/**
 * Generic webhook event logger middleware.
 */
export const logWebhookEvent = (req, res, next) => {
    console.log(`[Webhook] Incoming: ${req.method} ${req.path} | Source: ${req.headers['user-agent']}`);
    next();
};

export default { verifyWebhookSignature, handleCloudinaryWebhook, handleBrevoWebhook, logWebhookEvent };
