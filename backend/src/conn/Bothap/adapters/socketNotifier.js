// adapters/socketNotifier.js
// Utility to push real-time notifications through the Socket.IO instance

let _io = null;

/**
 * Register the Socket.IO server instance (called once at startup).
 * @param {import('socket.io').Server} io
 */
export const registerSocketServer = (io) => {
    _io = io;
};

/**
 * Emit an event to a specific connected user's socket room.
 * @param {string} userId
 * @param {string} event
 * @param {*} payload
 */
export const notifyUser = (userId, event, payload) => {
    if (!_io) {
        console.warn('[SocketNotifier] Socket.IO server not registered.');
        return;
    }
    _io.to(`user:${userId}`).emit(event, payload);
};

/**
 * Emit an event to everyone in a chat room.
 * @param {string} chatId
 * @param {string} event
 * @param {*} payload
 */
export const notifyChat = (chatId, event, payload) => {
    if (!_io) return;
    _io.to(`chat:${chatId}`).emit(event, payload);
};

/**
 * Broadcast to all connected clients.
 * @param {string} event
 * @param {*} payload
 */
export const broadcast = (event, payload) => {
    if (!_io) return;
    _io.emit(event, payload);
};

/**
 * Emit a new-message notification to all chat participants except the sender.
 * @param {string} chatId
 * @param {string} senderId
 * @param {object} message
 */
export const notifyNewMessage = (chatId, senderId, message) => {
    if (!_io) return;
    _io.to(`chat:${chatId}`).except(`user:${senderId}`).emit('new_message', {
        chatId,
        message,
    });
};

/**
 * Emit a typing indicator event.
 * @param {string} chatId
 * @param {string} userId
 * @param {boolean} isTyping
 */
export const notifyTyping = (chatId, userId, isTyping) => {
    if (!_io) return;
    _io.to(`chat:${chatId}`).except(`user:${userId}`).emit('typing', {
        chatId,
        userId,
        isTyping,
    });
};

export default {
    registerSocketServer,
    notifyUser,
    notifyChat,
    broadcast,
    notifyNewMessage,
    notifyTyping,
};
