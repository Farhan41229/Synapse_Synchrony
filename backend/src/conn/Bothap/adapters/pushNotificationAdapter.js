// adapters/pushNotificationAdapter.js
// Web Push Notification adapter using the Web Push protocol

import webpush from 'web-push';

let _configured = false;

const ensureConfig = () => {
    if (_configured) return;

    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const email = process.env.VAPID_EMAIL ?? 'mailto:admin@synapse.app';

    if (!publicKey || !privateKey) {
        throw new Error('[PushNotificationAdapter] VAPID keys are not configured.');
    }

    webpush.setVapidDetails(email, publicKey, privateKey);
    _configured = true;
};

/**
 * Send a push notification to a subscriber.
 * @param {object} subscription - PushSubscription object from client
 * @param {{ title: string, body: string, url?: string }} payload
 */
export const sendPushNotification = async (subscription, payload) => {
    ensureConfig();

    const data = JSON.stringify({
        title: payload.title,
        body: payload.body,
        url: payload.url ?? '/',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        timestamp: Date.now(),
    });

    await webpush.sendNotification(subscription, data);
};

/**
 * Fanout: send a notification to multiple subscribers.
 * Silently skips failed subscriptions.
 * @param {object[]} subscriptions
 * @param {object} payload
 * @returns {Promise<{ sent: number, failed: number }>}
 */
export const broadcastPushNotification = async (subscriptions, payload) => {
    ensureConfig();

    const results = await Promise.allSettled(
        subscriptions.map((sub) => sendPushNotification(sub, payload))
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    return { sent, failed };
};

/**
 * Return the VAPID public key for client-side SDK initialisation.
 */
export const getVapidPublicKey = () => {
    const key = process.env.VAPID_PUBLIC_KEY;
    if (!key) throw new Error('[PushNotificationAdapter] VAPID_PUBLIC_KEY is not set.');
    return key;
};

export default { sendPushNotification, broadcastPushNotification, getVapidPublicKey };
