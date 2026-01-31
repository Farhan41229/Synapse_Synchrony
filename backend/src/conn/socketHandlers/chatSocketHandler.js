// socketHandlers/chatSocketHandler.js
// Handles real-time chat events over Socket.IO

import Message from '../../models/Message.js';
import Chat from '../../models/Chat.js';

const EVENTS = {
    JOIN_CHAT: 'chat:join',
    LEAVE_CHAT: 'chat:leave',
    SEND_MESSAGE: 'chat:message',
    NEW_MESSAGE: 'chat:new_message',
    MESSAGE_DELIVERED: 'chat:delivered',
    TYPING_START: 'chat:typing_start',
    TYPING_STOP: 'chat:typing_stop',
    ERROR: 'chat:error',
};

/**
 * Registers all chat-related Socket.IO event handlers for a connected socket.
 * @param {Server} io
 * @param {Socket} socket
 */
export const registerChatHandlers = (io, socket) => {
    // Join a chat room
    socket.on(EVENTS.JOIN_CHAT, async ({ chatId }) => {
        try {
            if (!chatId) {
                return socket.emit(EVENTS.ERROR, { message: 'chatId is required to join a chat.' });
            }

            const chat = await Chat.findById(chatId);
            if (!chat) {
                return socket.emit(EVENTS.ERROR, { message: 'Chat not found.' });
            }

            // Ensure the user is a participant
            const isParticipant = chat.participants.some(
                (p) => p.toString() === socket.userId.toString()
            );
            if (!isParticipant) {
                return socket.emit(EVENTS.ERROR, { message: 'You are not a participant of this chat.' });
            }

            socket.join(chatId);
            console.log(`[ChatSocket] User ${socket.userId} joined chat room: ${chatId}`);
        } catch (error) {
            console.error('[ChatSocket] Error joining chat:', error.message);
            socket.emit(EVENTS.ERROR, { message: 'Failed to join chat.' });
        }
    });

    // Leave a chat room
    socket.on(EVENTS.LEAVE_CHAT, ({ chatId }) => {
        if (chatId) {
            socket.leave(chatId);
            console.log(`[ChatSocket] User ${socket.userId} left chat room: ${chatId}`);
        }
    });

    // Send a new message
    socket.on(EVENTS.SEND_MESSAGE, async ({ chatId, content, messageType = 'text' }) => {
        try {
            if (!chatId || !content) {
                return socket.emit(EVENTS.ERROR, { message: 'chatId and content are required.' });
            }

            const newMessage = new Message({
                chatId,
                senderId: socket.userId,
                content,
                messageType,
                status: 'sent',
            });

            await newMessage.save();

            // Broadcast new message to all clients in the chat room
            io.to(chatId).emit(EVENTS.NEW_MESSAGE, {
                message: newMessage,
                sender: { id: socket.userId, name: socket.user?.name },
            });

            // Acknowledge delivery
            socket.emit(EVENTS.MESSAGE_DELIVERED, { messageId: newMessage._id });
        } catch (error) {
            console.error('[ChatSocket] Error sending message:', error.message);
            socket.emit(EVENTS.ERROR, { message: 'Failed to send message.' });
        }
    });

    // Typing indicators
    socket.on(EVENTS.TYPING_START, ({ chatId }) => {
        socket.to(chatId).emit(EVENTS.TYPING_START, {
            userId: socket.userId,
            name: socket.user?.name,
        });
    });

    socket.on(EVENTS.TYPING_STOP, ({ chatId }) => {
        socket.to(chatId).emit(EVENTS.TYPING_STOP, { userId: socket.userId });
    });
};

export default registerChatHandlers;
