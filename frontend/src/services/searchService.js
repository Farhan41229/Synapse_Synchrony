// frontend/src/services/searchService.js
// Global search API service for Synapse Synchrony

import axios from 'axios';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

const searchApi = axios.create({ baseURL: `${API}/search`, withCredentials: true });

searchApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

/**
 * Perform a global search across all resource types.
 * @param {{ q: string, type?: string, page?: number, limit?: number }} params
 */
export const globalSearch = async (params) => {
    const { data } = await searchApi.get('/', { params });
    return data;
};

/**
 * Search for users by name or email.
 * @param {{ q: string, excludeSelf?: boolean, limit?: number }} params
 */
export const searchUsers = async (params) => {
    const { data } = await searchApi.get('/users', { params });
    return data;
};

/**
 * Search blog posts.
 * @param {{ q: string, category?: string, page?: number }} params
 */
export const searchBlogs = async (params) => {
    const { data } = await searchApi.get('/blogs', { params });
    return data;
};

/**
 * Search events.
 * @param {{ q: string, eventType?: string, upcoming?: boolean }} params
 */
export const searchEvents = async (params) => {
    const { data } = await searchApi.get('/events', { params });
    return data;
};

/**
 * Search user's notes.
 * @param {{ q: string, tags?: string, pinned?: boolean }} params
 */
export const searchNotes = async (params) => {
    const { data } = await searchApi.get('/notes', { params });
    return data;
};

export default { globalSearch, searchUsers, searchBlogs, searchEvents, searchNotes };
