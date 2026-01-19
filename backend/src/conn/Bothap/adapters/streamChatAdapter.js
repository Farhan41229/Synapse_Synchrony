// adapters/streamChatAdapter.js
// Adapter layer for Stream Chat API operations in Synapse Synchrony

import { StreamChat } from 'stream-chat';

let _client = null;

/**
 * Initialise and return the Stream Chat server-side client.
 * The instance is memoised so the SDK connection is reused.
 */
export const getStreamClient = () => {
    if (_client) return _client;

    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
        throw new Error('[StreamChatAdapter] Missing STREAM_API_KEY or STREAM_API_SECRET env vars.');
    }

    _client = StreamChat.getInstance(apiKey, apiSecret);
    return _client;
};

/**
 * Generate a user token for client-side authentication.
 * @param {string} userId
 * @returns {string} JWT token
 */
export const generateUserToken = (userId) => {
    const client = getStreamClient();
    return client.createToken(userId);
};

/**
 * Upsert a user profile on Stream Chat.
 * @param {{ id: string, name: string, image?: string }} userData
 */
export const upsertStreamUser = async (userData) => {
    const client = getStreamClient();
    await client.upsertUser({
        id: userData.id,
        name: userData.name,
        image: userData.image ?? '',
        role: 'user',
    });
};

/**
 * Create or get an existing channel between two users.
 * @param {string} channelId
 * @param {string[]} memberIds
 * @param {boolean} isGroup
 * @param {string} [groupName]
 */
export const createOrGetChannel = async (channelId, memberIds, isGroup = false, groupName = '') => {
    const client = getStreamClient();
    const channelType = 'messaging';

    const channel = client.channel(channelType, channelId, {
        members: memberIds,
        name: isGroup ? groupName : undefined,
    });

    await channel.create();
    return channel;
};

/**
 * Delete a channel by ID.
 * @param {string} channelId
 */
export const deleteChannel = async (channelId) => {
    const client = getStreamClient();
    const channel = client.channel('messaging', channelId);
    await channel.delete();
};

/**
 * Add members to an existing channel.
 * @param {string} channelId
 * @param {string[]} userIds
 */
export const addChannelMembers = async (channelId, userIds) => {
    const client = getStreamClient();
    const channel = client.channel('messaging', channelId);
    await channel.addMembers(userIds);
};

/**
 * Remove members from an existing channel.
 * @param {string} channelId
 * @param {string[]} userIds
 */
export const removeChannelMembers = async (channelId, userIds) => {
    const client = getStreamClient();
    const channel = client.channel('messaging', channelId);
    await channel.removeMembers(userIds);
};

export default {
    getStreamClient,
    generateUserToken,
    upsertStreamUser,
    createOrGetChannel,
    deleteChannel,
    addChannelMembers,
    removeChannelMembers,
};
