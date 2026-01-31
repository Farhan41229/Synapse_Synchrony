// socketHandlers/socketServer.js
// Initializes and configures the Socket.IO server for real-time features

import { Server } from 'socket.io';
import { verifySocketToken } from './socketAuth.js';
import { registerChatHandlers } from './chatSocketHandler.js';
import { registerNotificationHandlers } from './notificationHandler.js';
import { registerPresenceHandlers } from './presenceHandler.js';
import { socketRateLimiter } from './socketMiddleware.js';

let ioInstance = null;

/**
 * Initializes a Socket.IO server attached to an existing HTTP server.
 * @param {http.Server} httpServer
 * @returns {Server} io
 */
export const initSocketServer = (httpServer) => {
    if (ioInstance) {
        console.warn('[SocketServer] Socket.IO has already been initialized. Returning existing instance.');
        return ioInstance;
    }

    ioInstance = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
        transports: ['websocket', 'polling'],
    });

    console.log('[SocketServer] Socket.IO server initialized.');

    // Apply global middleware
    ioInstance.use(verifySocketToken);
    ioInstance.use(socketRateLimiter);

    // Connection handler
    ioInstance.on('connection', (socket) => {
        console.log(`[SocketServer] Client connected: ${socket.id} | User: ${socket.userId}`);

        // Register domain-specific handlers
        registerChatHandlers(ioInstance, socket);
        registerNotificationHandlers(ioInstance, socket);
        registerPresenceHandlers(ioInstance, socket);

        socket.on('disconnect', (reason) => {
            console.log(`[SocketServer] Client disconnected: ${socket.id} | Reason: ${reason}`);
        });

        socket.on('error', (err) => {
            console.error(`[SocketServer] Socket error for ${socket.id}:`, err.message);
        });
    });

    return ioInstance;
};

/**
 * Returns the existing Socket.IO instance.
 * Throws if not yet initialized.
 */
export const getIO = () => {
    if (!ioInstance) {
        throw new Error('[SocketServer] Socket.IO server has not been initialized yet.');
    }
    return ioInstance;
};

/**
 * Emits an event to all connected clients.
 * @param {string} event
 * @param {any} data
 */
export const broadcastToAll = (event, data) => {
    const io = getIO();
    io.emit(event, data);
};

/**
 * Emits an event to a specific room.
 * @param {string} room
 * @param {string} event
 * @param {any} data
 */
export const emitToRoom = (room, event, data) => {
    const io = getIO();
    io.to(room).emit(event, data);
};

export default { initSocketServer, getIO, broadcastToAll, emitToRoom };
