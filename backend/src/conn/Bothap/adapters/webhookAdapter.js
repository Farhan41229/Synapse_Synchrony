// adapters/webhookAdapter.js
// Inbound and outbound webhook handling for Synapse Synchrony integrations

import crypto from 'crypto';

/**
 * Verify an HMAC-SHA256 webhook signature.
 * @param {Buffer|string} body - raw request body
 * @param {string} signature   - value from the X-Hub-Signature-256 header
 * @param {string} secret      - shared webhook secret
 * @returns {boolean}
 */
export const verifyWebhookSignature = (body, signature, secret) => {
    const expected = `sha256=${crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex')}`;

    try {
        return crypto.timingSafeEqual(
            Buffer.from(expected, 'utf8'),
            Buffer.from(signature, 'utf8')
        );
    } catch {
        return false;
    }
};

/**
 * Express middleware: validate an incoming webhook signature.
 * Reads the raw body attached to req.rawBody by an upstream middleware.
 * @param {string} secret
 * @param {string} [headerName]
 */
export const webhookSignatureMiddleware =
    (secret, headerName = 'x-hub-signature-256') =>
        (req, res, next) => {
            const signature = req.headers[headerName];
            if (!signature) {
                return res.status(401).json({ success: false, message: 'Missing webhook signature.' });
            }

            const body = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
            const valid = verifyWebhookSignature(body, signature, secret);

            if (!valid) {
                return res.status(403).json({ success: false, message: 'Invalid webhook signature.' });
            }

            next();
        };

/**
 * Dispatch an outbound webhook POST request.
 * @param {string} url
 * @param {object} payload
 * @param {string} [secret] - if provided, sends an HMAC signature header
 */
export const dispatchWebhook = async (url, payload, secret) => {
    const body = JSON.stringify(payload);
    const headers = {
        'Content-Type': 'application/json',
    };

    if (secret) {
        const sig = crypto.createHmac('sha256', secret).update(body).digest('hex');
        headers['X-Hub-Signature-256'] = `sha256=${sig}`;
    }

    const res = await fetch(url, { method: 'POST', headers, body });
    if (!res.ok) {
        throw new Error(`[WebhookAdapter] POST to ${url} failed with status ${res.status}.`);
    }
    return res.json().catch(() => null);
};

export default { verifyWebhookSignature, webhookSignatureMiddleware, dispatchWebhook };
