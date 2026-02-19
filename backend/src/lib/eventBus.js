// backend/src/lib/eventBus.js  
// Simple typed in-process event bus for decoupling services

import { EventEmitter } from 'events';

class SynapseEventBus extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(50);
        this._eventLog = [];
        this._maxLogSize = 500;
    }

    /**
     * Publish an event with a typed payload.
     * @param {string} event
     * @param {*} payload
     */
    publish(event, payload) {
        this._eventLog.unshift({
            event,
            payload,
            timestamp: new Date().toISOString(),
        });
        if (this._eventLog.length > this._maxLogSize) this._eventLog.pop();
        this.emit(event, payload);
    }

    /**
     * Subscribe to an event.
     * @param {string} event
     * @param {Function} handler
     */
    subscribe(event, handler) {
        this.on(event, handler);
        return () => this.off(event, handler); // returns unsubscribe function
    }

    /**
     * Subscribe to an event exactly once.
     * @param {string} event
     * @param {Function} handler
     */
    subscribeOnce(event, handler) {
        this.once(event, handler);
    }

    /**
     * Get the recent event log.
     * @param {number} [limit]
     */
    getLog(limit = 50) {
        return this._eventLog.slice(0, limit);
    }

    /**
     * Clear the event log.
     */
    clearLog() {
        this._eventLog = [];
    }
}

// Singleton instance
const eventBus = new SynapseEventBus();

// ─── Typed Event Constants ─────────────────────────────────────────────────

export const EVENTS = Object.freeze({
    // Auth
    USER_REGISTERED: 'user:registered',
    USER_LOGGED_IN: 'user:login',
    USER_LOGGED_OUT: 'user:logout',
    USER_PASSWORD_RESET: 'user:password_reset',
    USER_EMAIL_VERIFIED: 'user:email_verified',
    USER_BANNED: 'user:banned',

    // Blog
    BLOG_CREATED: 'blog:created',
    BLOG_PUBLISHED: 'blog:published',
    BLOG_LIKED: 'blog:liked',
    BLOG_COMMENTED: 'blog:commented',
    BLOG_DELETED: 'blog:deleted',

    // Events
    EVENT_CREATED: 'event:created',
    EVENT_REGISTERED: 'event:registered',
    EVENT_UNREGISTERED: 'event:unregistered',
    EVENT_CANCELLED: 'event:cancelled',

    // Chat
    MESSAGE_SENT: 'message:sent',
    MESSAGE_DELETED: 'message:deleted',
    CHAT_CREATED: 'chat:created',

    // Wellness
    MOOD_LOGGED: 'wellness:mood_logged',
    STRESS_LOGGED: 'wellness:stress_logged',
    GOAL_COMPLETED: 'wellness:goal_completed',

    // System
    ERROR_OCCURRED: 'system:error',
    CACHE_INVALIDATED: 'system:cache_invalidated',
});

export { eventBus };
export default eventBus;
