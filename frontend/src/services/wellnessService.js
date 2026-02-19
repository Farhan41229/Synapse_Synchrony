// frontend/src/services/wellnessService.js
// API functions for the Wellness module in Synapse Synchrony

import axios from 'axios';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

const wellnessApi = axios.create({ baseURL: `${API}/wellness`, withCredentials: true });

wellnessApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ─── Mood Logs ─────────────────────────────────────────────────────────────

export const getMoodLogs = async (params = {}) => {
    const { data } = await wellnessApi.get('/mood', { params });
    return data;
};

export const createMoodLog = async (payload) => {
    const { data } = await wellnessApi.post('/mood', payload);
    return data;
};

export const deleteMoodLog = async (id) => {
    const { data } = await wellnessApi.delete(`/mood/${id}`);
    return data;
};

export const getMoodSummary = async (params = {}) => {
    const { data } = await wellnessApi.get('/mood/summary', { params });
    return data;
};

// ─── Stress Logs ───────────────────────────────────────────────────────────

export const getStressLogs = async (params = {}) => {
    const { data } = await wellnessApi.get('/stress', { params });
    return data;
};

export const createStressLog = async (payload) => {
    const { data } = await wellnessApi.post('/stress', payload);
    return data;
};

export const deleteStressLog = async (id) => {
    const { data } = await wellnessApi.delete(`/stress/${id}`);
    return data;
};

export const getStressSummary = async (params = {}) => {
    const { data } = await wellnessApi.get('/stress/summary', { params });
    return data;
};

// ─── Wellness Goals ─────────────────────────────────────────────────────────

export const getGoals = async (params = {}) => {
    const { data } = await wellnessApi.get('/goals', { params });
    return data;
};

export const createGoal = async (payload) => {
    const { data } = await wellnessApi.post('/goals', payload);
    return data;
};

export const updateGoal = async (id, payload) => {
    const { data } = await wellnessApi.put(`/goals/${id}`, payload);
    return data;
};

export const deleteGoal = async (id) => {
    const { data } = await wellnessApi.delete(`/goals/${id}`);
    return data;
};

export const completeGoal = async (id) => {
    const { data } = await wellnessApi.patch(`/goals/${id}/complete`);
    return data;
};

// ─── AI Wellness Suggestions ───────────────────────────────────────────────

export const getWellnessSuggestions = async () => {
    const { data } = await wellnessApi.get('/suggestions');
    return data;
};

export const getWeeklySummary = async () => {
    const { data } = await wellnessApi.get('/weekly-summary');
    return data;
};

export default {
    getMoodLogs, createMoodLog, deleteMoodLog, getMoodSummary,
    getStressLogs, createStressLog, deleteStressLog, getStressSummary,
    getGoals, createGoal, updateGoal, deleteGoal, completeGoal,
    getWellnessSuggestions, getWeeklySummary,
};
