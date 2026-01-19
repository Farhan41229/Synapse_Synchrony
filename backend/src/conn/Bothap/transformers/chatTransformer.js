// transformers/chatTransformer.js
// Shapes chat and message documents for API responses

import { toChatParticipant } from './userTransformer.js';

/**
 * Transform a raw chat document into an API-safe object.
 * @param {object} chat - populated Mongoose chat document
 * @param {string} requestingUserId - the user making the request
 */
export const toChatResponse = (chat, requestingUserId) => {
    const raw = chat?.toObject ? chat.toObject() : { ...chat };
    const participants = (raw.participants ?? []).map(toChatParticipant);

    const otherParticipant = raw.isGroup
        ? null
        : participants.find((p) => p._id !== requestingUserId?.toString()) ?? null;

    return {
        _id: raw._id?.toString(),
        isGroup: raw.isGroup ?? false,
        groupName: raw.groupName ?? null,
        groupAvatar: raw.groupAvatar ?? null,
        participants,
        otherParticipant,
        lastMessage: raw.lastMessage ? toMessagePreview(raw.lastMessage) : null,
        unreadCount: raw.unreadCount ?? 0,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
    };
};

/**
 * Transform a message into a minimal preview object (for chat list).
 * @param {object} message
 */
export const toMessagePreview = (message) => {
    const raw = message?.toObject ? message.toObject() : { ...message };
    return {
        _id: raw._id?.toString(),
        content: raw.content ?? null,
        messageType: raw.messageType ?? 'text',
        image: raw.image ?? null,
        voiceUrl: raw.voiceUrl ?? null,
        sender: raw.sender
            ? { _id: raw.sender._id?.toString(), name: raw.sender.name }
            : null,
        createdAt: raw.createdAt,
    };
};

/**
 * Transform a raw message document into a full API-safe message response.
 * @param {object} message
 */
export const toMessageResponse = (message) => {
    const raw = message?.toObject ? message.toObject() : { ...message };
    return {
        _id: raw._id?.toString(),
        chat: raw.chat?.toString(),
        content: raw.content ?? null,
        image: raw.image ?? null,
        voiceUrl: raw.voiceUrl ?? null,
        voiceDuration: raw.voiceDuration ?? null,
        voiceTranscription: raw.voiceTranscription ?? null,
        messageType: raw.messageType ?? 'text',
        location: raw.location ?? null,
        sender: raw.sender ? toChatParticipant(raw.sender) : null,
        replyTo: raw.replyTo ? toMessagePreview(raw.replyTo) : null,
        status: raw.status ?? 'sent',
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
    };
};

export default { toChatResponse, toMessagePreview, toMessageResponse };
