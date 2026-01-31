// socketHandlers/socketMiddleware.js
// Global Socket.IO middleware: rate limiting, logging, error handling

const rateLimitStore = new Map(); // socketId -> { count, windowStart }

const RATE_LIMIT = {
    MAX_EVENTS_PER_WINDOW: 60,
    WINDOW_MS: 60 * 1000, // 1 minute
};

/**
 * Rate limits socket events per socket connection.
 * Disconnects clients that exceed the threshold.
 * @param {Socket} socket
 * @param {Function} next
 */
export const socketRateLimiter = (socket, next) => {
    const socketId = socket.id;

    // Initialize rate limit entry
    if (!rateLimitStore.has(socketId)) {
        rateLimitStore.set(socketId, { count: 0, windowStart: Date.now() });
    }

    const entry = rateLimitStore.get(socketId);
    const now = Date.now();

    // Reset window if expired
    if (now - entry.windowStart > RATE_LIMIT.WINDOW_MS) {
        entry.count = 0;
        entry.windowStart = now;
    }

    entry.count += 1;

    if (entry.count > RATE_LIMIT.MAX_EVENTS_PER_WINDOW) {
        console.warn(`[SocketRateLimiter] Rate limit exceeded for socket: ${socketId}`);
        socket.disconnect(true);
        return next(new Error('Rate limit exceeded. Connection terminated.'));
    }

    // Clean up on disconnect
    socket.on('disconnect', () => {
        rateLimitStore.delete(socketId);
    });

    next();
};

/**
 * Logs every socket event for debugging purposes.
 * Attach to individual sockets via socket.use().
 */
export const socketEventLogger = (socket) => {
    socket.use(([event, ...args], next) => {
        console.log(`[SocketLogger] Event: "${event}" | Socket: ${socket.id} | User: ${socket.userId}`);
        next();
    });
};

/**
 * Global error handler for socket middleware chain.
 */
export const socketErrorHandler = (err, socket) => {
    if (err) {
        console.error(`[SocketError] ${err.message} | Socket: ${socket.id}`);
        socket.emit('error', { message: err.message });
    }
};

export default { socketRateLimiter, socketEventLogger, socketErrorHandler };
