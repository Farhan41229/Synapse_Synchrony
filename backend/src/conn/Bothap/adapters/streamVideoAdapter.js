// adapters/streamVideoAdapter.js
// Server-side Stream Video SDK helpers for call management

import { StreamClient } from '@stream-io/node-sdk';

let _client = null;

const getClient = () => {
    if (_client) return _client;

    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
        throw new Error('[StreamVideoAdapter] Missing STREAM_API_KEY or STREAM_API_SECRET.');
    }

    _client = new StreamClient(apiKey, apiSecret);
    return _client;
};

/**
 * Generate a user token for Stream Video client-side SDK.
 * @param {string} userId
 * @param {number} [expirationSeconds]
 * @returns {string}
 */
export const generateVideoToken = (userId, expirationSeconds = 3600) => {
    const client = getClient();
    const expiry = Math.floor(Date.now() / 1000) + expirationSeconds;
    return client.generateUserToken({ user_id: userId, exp: expiry });
};

/**
 * Create a video/audio call session.
 * @param {string} callId
 * @param {string} callType - 'default' (video) | 'audio_room'
 * @param {string[]} memberIds
 */
export const createCall = async (callId, callType = 'default', memberIds = []) => {
    const client = getClient();
    const call = client.video.call(callType, callId);

    await call.create({
        data: {
            members: memberIds.map((id) => ({ user_id: id })),
            settings_override: {
                recording: { mode: 'disabled' },
            },
        },
    });

    return call;
};

/**
 * End an active call.
 * @param {string} callId
 * @param {string} callType
 */
export const endCall = async (callId, callType = 'default') => {
    const client = getClient();
    const call = client.video.call(callType, callId);
    await call.end();
};

/**
 * Get call details.
 * @param {string} callId
 * @param {string} callType
 */
export const getCallDetails = async (callId, callType = 'default') => {
    const client = getClient();
    const call = client.video.call(callType, callId);
    return call.get();
};

export default { generateVideoToken, createCall, endCall, getCallDetails };
