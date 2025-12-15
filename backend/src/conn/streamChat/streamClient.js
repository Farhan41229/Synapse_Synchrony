// streamChat/streamClient.js
// Stream Chat SDK client initialization and user management

import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';
dotenv.config();

let streamInstance = null;

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

/**
 * Returns the initialized Stream Chat server-side client singleton.
 * @returns {StreamChat}
 */
export const getStreamClient = () => {
    if (streamInstance) return streamInstance;

    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
        throw new Error(
            '[StreamClient] STREAM_API_KEY and STREAM_API_SECRET must be defined in environment variables.'
        );
    }

    streamInstance = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
    console.log('[StreamClient] Stream Chat client initialized.');
    return streamInstance;
};

/**
 * Creates or updates a user in Stream Chat.
 * @param {object} userPayload - { id, name, image, role }
 * @returns {Promise<object>}
 */
export const upsertStreamUser = async (userPayload) => {
    const client = getStreamClient();

    if (!userPayload.id) {
        throw new Error('[StreamClient] User ID is required for Stream upsert.');
    }

    try {
        const response = await client.upsertUser({
            id: userPayload.id,
            name: userPayload.name || 'Synapse User',
            image: userPayload.image || '',
            role: userPayload.role || 'user',
        });

        console.log(`[StreamClient] Upserted Stream user: ${userPayload.id}`);
        return response;
    } catch (error) {
        console.error('[StreamClient] Error upserting Stream user:', error.message);
        throw error;
    }
};

/**
 * Generates a Stream Chat user auth token.
 * @param {string} userId
 * @returns {string}
 */
export const generateStreamToken = (userId) => {
    const client = getStreamClient();
    if (!userId) throw new Error('[StreamClient] userId is required to generate token.');

    const token = client.createToken(userId.toString());
    console.log(`[StreamClient] Generated Stream token for user: ${userId}`);
    return token;
};

/**
 * Deletes a user from Stream Chat.
 * @param {string} userId
 */
export const deleteStreamUser = async (userId) => {
    const client = getStreamClient();
    try {
        await client.deleteUser(userId, { mark_messages_deleted: false });
        console.log(`[StreamClient] Deleted Stream user: ${userId}`);
    } catch (error) {
        console.error(`[StreamClient] Failed to delete Stream user ${userId}:`, error.message);
        throw error;
    }
};

export default { getStreamClient, upsertStreamUser, generateStreamToken, deleteStreamUser };
