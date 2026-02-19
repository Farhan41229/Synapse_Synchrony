// frontend/src/services/notificationService.js
// API functions for notification management in Synapse Synchrony

import axios from 'axios';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

const notifApi = axios.create({ baseURL: `${API}/notifications`, withCredentials: true });

notifApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

/**
 * Fetch paginated notifications for the authenticated user.
 * @param {{ page?: number, limit?: number, unreadOnly?: boolean }} params
 */
export const getNotifications = async (params = {}) => {
    const { data } = await notifApi.get('/', { params });
    return data;
};

/**
 * Get the unread notification count.
 */
export const getUnreadCount = async () => {
    const { data } = await notifApi.get('/unread-count');
    return data;
};

/**
 * Mark specific notifications as read.
 * @param {string[]} ids
 */
export const markAsRead = async (ids) => {
    const { data } = await notifApi.patch('/mark-read', { ids });
    return data;
};

/**
 * Mark all notifications as read.
 */
export const markAllAsRead = async () => {
    const { data } = await notifApi.patch('/mark-all-read');
    return data;
};

/**
 * Delete a notification by ID.
 * @param {string} id
 */
export const deleteNotification = async (id) => {
    const { data } = await notifApi.delete(`/${id}`);
    return data;
};

/**
 * Delete all notifications for the authenticated user.
 */
export const deleteAllNotifications = async () => {
    const { data } = await notifApi.delete('/');
    return data;
};

/**
 * Subscribe to Web Push notifications.
 * @param {PushSubscription} subscription
 */
export const subscribeToPush = async (subscription) => {
    const { data } = await notifApi.post('/push/subscribe', subscription);
    return data;
};

/**
 * Unsubscribe from Web Push notifications.
 * @param {string} endpoint
 */
export const unsubscribeFromPush = async (endpoint) => {
    const { data } = await notifApi.post('/push/unsubscribe', { endpoint });
    return data;
};

/**
 * Get the VAPID public key for push setup.
 */
export const getVapidKey = async () => {
    const { data } = await notifApi.get('/push/vapid-key');
    return data;
};

export default {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    subscribeToPush,
    unsubscribeFromPush,
    getVapidKey,
};
