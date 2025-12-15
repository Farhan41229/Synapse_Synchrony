// streamChat/channelManager.js
// Creates and manages Stream Chat channels for user conversations

import { getStreamClient } from './streamClient.js';

const CHANNEL_TYPES = {
    MESSAGING: 'messaging',
    SUPPORT: 'support',
    COMMUNITY: 'community',
};

/**
 * Creates or retrieves a one-to-one (DM) messaging channel between two users.
 * @param {string} userId1
 * @param {string} userId2
 * @returns {Promise<object>} - The Stream channel object
 */
export const getOrCreateDMChannel = async (userId1, userId2) => {
    const client = getStreamClient();

    // Use sorted user IDs to generate a consistent channel ID
    const [id1, id2] = [userId1, userId2].sort();
    const channelId = `dm_${id1}_${id2}`;

    try {
        const channel = client.channel(CHANNEL_TYPES.MESSAGING, channelId, {
            members: [userId1, userId2],
            created_by_id: userId1,
        });

        const response = await channel.create();
        console.log(`[ChannelManager] DM channel ready: ${channelId}`);

        return {
            channelId: response.channel.id,
            type: response.channel.type,
            cid: response.channel.cid,
            memberCount: response.channel.member_count,
        };
    } catch (error) {
        console.error('[ChannelManager] Error creating DM channel:', error.message);
        throw new Error(`Failed to create DM channel: ${error.message}`);
    }
};

/**
 * Creates a group/community channel.
 * @param {string} creatorId
 * @param {string[]} memberIds
 * @param {string} channelName
 * @param {string} channelType
 * @returns {Promise<object>}
 */
export const createGroupChannel = async (creatorId, memberIds, channelName, channelType = CHANNEL_TYPES.COMMUNITY) => {
    const client = getStreamClient();
    const channelId = `group_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    try {
        const channel = client.channel(channelType, channelId, {
            name: channelName,
            members: [creatorId, ...memberIds],
            created_by_id: creatorId,
            channelType,
        });

        const response = await channel.create();
        console.log(`[ChannelManager] Group channel created: ${channelId}`);

        return {
            channelId: response.channel.id,
            name: response.channel.name,
            cid: response.channel.cid,
            memberCount: response.channel.member_count,
        };
    } catch (error) {
        console.error('[ChannelManager] Error creating group channel:', error.message);
        throw new Error(`Failed to create group channel: ${error.message}`);
    }
};

/**
 * Adds members to an existing channel.
 * @param {string} channelId
 * @param {string} channelType
 * @param {string[]} userIds
 */
export const addMembersToChannel = async (channelId, channelType, userIds) => {
    const client = getStreamClient();
    const channel = client.channel(channelType, channelId);
    await channel.addMembers(userIds);
    console.log(`[ChannelManager] Added ${userIds.length} members to channel: ${channelId}`);
};

/**
 * Removes a member from a channel.
 * @param {string} channelId
 * @param {string} channelType
 * @param {string} userId
 */
export const removeMemberFromChannel = async (channelId, channelType, userId) => {
    const client = getStreamClient();
    const channel = client.channel(channelType, channelId);
    await channel.removeMembers([userId]);
    console.log(`[ChannelManager] Removed user ${userId} from channel: ${channelId}`);
};

/**
 * Returns all channels a user is a member of.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const getUserChannels = async (userId) => {
    const client = getStreamClient();
    const filter = { members: { $in: [userId] } };
    const sort = [{ last_message_at: -1 }];

    const channels = await client.queryChannels(filter, sort, { limit: 20, member_limit: 10 });
    return channels.map((ch) => ({
        cid: ch.cid,
        id: ch.id,
        type: ch.type,
        name: ch.data?.name,
        memberCount: ch.data?.member_count,
        lastMessageAt: ch.data?.last_message_at,
    }));
};

export { CHANNEL_TYPES };
export default { getOrCreateDMChannel, createGroupChannel, addMembersToChannel, removeMemberFromChannel, getUserChannels };
