// transformers/streamTransformer.js
// Shape Stream Chat and Video data for Synapse Synchrony frontend

/**
 * Transform a Stream Chat channel data object into a safe chat list item.
 * @param {object} channel - Stream channel object
 * @param {string} requestingUserId
 */
export const toStreamChatItem = (channel, requestingUserId) => {
    const members = Object.values(channel.state?.members ?? {});

    const otherMember =
        members.find((m) => m.user_id !== requestingUserId) ?? null;

    const lastMessage = channel.state?.messages?.slice(-1)[0] ?? null;

    return {
        id: channel.id,
        type: channel.type,
        name: channel.data?.name ?? otherMember?.user?.name ?? 'Chat',
        image: channel.data?.image ?? otherMember?.user?.image ?? null,
        memberCount: members.length,
        isAI: channel.data?.isAI ?? false,
        lastMessage: lastMessage
            ? {
                text: lastMessage.text ?? '',
                createdAt: lastMessage.created_at,
                userId: lastMessage.user?.id,
            }
            : null,
        unreadCount: channel.countUnread() ?? 0,
        createdAt: channel.data?.created_at,
        updatedAt: channel.data?.updated_at,
    };
};

/**
 * Transform a Stream message for a read-receipt summary.
 * @param {object} message - Stream message object
 */
export const toReadReceiptSummary = (message) => ({
    id: message.id,
    readBy: (message.readBy ?? []).map((r) => ({ userId: r.id, name: r.name })),
    createdAt: message.created_at,
});

/**
 * Build Stream Chat custom data for an AI channel.
 * @param {string} userId
 */
export const buildAIChanelData = (userId) => ({
    name: 'Synapse AI',
    isAI: true,
    members: [userId, process.env.AI_BOT_USER_ID ?? 'synapse_ai'],
    image: 'https://synapse.app/assets/ai-avatar.png',
});

export default { toStreamChatItem, toReadReceiptSummary, buildAIChanelData };
