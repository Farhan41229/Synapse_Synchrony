// socketHandlers/presenceHandler.js
// Tracks and broadcasts online/offline user presence in real-time

const PRESENCE_EVENTS = {
    USER_ONLINE: 'presence:online',
    USER_OFFLINE: 'presence:offline',
    GET_ONLINE_USERS: 'presence:get_online',
    ONLINE_USERS_LIST: 'presence:online_list',
    HEARTBEAT: 'presence:heartbeat',
};

// In-memory store of userId -> Set of socketIds (handles multi-tab logins)
const onlineUsers = new Map();

/**
 * Registers presence tracking handlers for a connected socket.
 * @param {Server} io
 * @param {Socket} socket
 */
export const registerPresenceHandlers = (io, socket) => {
    const userId = socket.userId?.toString();

    // Mark user as online
    if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Broadcast online status to all
    io.emit(PRESENCE_EVENTS.USER_ONLINE, {
        userId,
        name: socket.user?.name,
        timestamp: new Date().toISOString(),
    });

    console.log(`[Presence] User ${userId} is now ONLINE. Active sockets: ${onlineUsers.get(userId).size}`);

    // Return list of online users on request
    socket.on(PRESENCE_EVENTS.GET_ONLINE_USERS, () => {
        const onlineList = Array.from(onlineUsers.keys());
        socket.emit(PRESENCE_EVENTS.ONLINE_USERS_LIST, { onlineUserIds: onlineList });
    });

    // Heartbeat to confirm user is active
    socket.on(PRESENCE_EVENTS.HEARTBEAT, () => {
        // Client can ping to maintain presence registration
        socket.emit(PRESENCE_EVENTS.HEARTBEAT, { ok: true, timestamp: Date.now() });
    });

    // Handle disconnect: remove from online tracking
    socket.on('disconnect', () => {
        if (onlineUsers.has(userId)) {
            onlineUsers.get(userId).delete(socket.id);

            // Only broadcast offline if all sockets are gone
            if (onlineUsers.get(userId).size === 0) {
                onlineUsers.delete(userId);
                io.emit(PRESENCE_EVENTS.USER_OFFLINE, {
                    userId,
                    timestamp: new Date().toISOString(),
                });
                console.log(`[Presence] User ${userId} is now OFFLINE.`);
            }
        }
    });
};

/**
 * Returns a list of currently online user IDs.
 * @returns {string[]}
 */
export const getOnlineUserIds = () => Array.from(onlineUsers.keys());

/**
 * Checks if a specific user is currently online.
 * @param {string} userId
 * @returns {boolean}
 */
export const isUserOnline = (userId) => onlineUsers.has(userId?.toString());

export default { registerPresenceHandlers, getOnlineUserIds, isUserOnline };
