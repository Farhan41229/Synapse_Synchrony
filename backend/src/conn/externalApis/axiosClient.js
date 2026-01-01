// externalApis/axiosClient.js
// Configured Axios instances for external HTTP API calls

import axios from 'axios';

const DEFAULT_TIMEOUT = 10000; // 10 seconds

/**
 * Creates a pre-configured Axios instance with retry support.
 * @param {object} config - Axios config defaults
 * @param {number} retries - Number of retry attempts on failure
 * @returns {AxiosInstance}
 */
const createAxiosInstance = (config = {}, retries = 2) => {
    const instance = axios.create({
        timeout: DEFAULT_TIMEOUT,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        ...config,
    });

    // Request interceptor: log outgoing requests
    instance.interceptors.request.use(
        (req) => {
            console.log(`[AxiosClient] --> ${req.method?.toUpperCase()} ${req.url}`);
            return req;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor: log responses and handle errors
    instance.interceptors.response.use(
        (res) => {
            console.log(`[AxiosClient] <-- ${res.status} ${res.config.url}`);
            return res;
        },
        async (error) => {
            const config = error.config;
            if (!config || !retries) return Promise.reject(error);

            config.__retryCount = config.__retryCount || 0;

            if (config.__retryCount >= retries) {
                return Promise.reject(error);
            }

            const isRetriable =
                error.code === 'ECONNABORTED' ||
                (error.response?.status >= 500 && error.response?.status < 600);

            if (!isRetriable) return Promise.reject(error);

            config.__retryCount++;
            const delay = Math.pow(2, config.__retryCount) * 500; // Exponential backoff
            console.warn(`[AxiosClient] Retrying request (${config.__retryCount}/${retries}) after ${delay}ms...`);

            await new Promise((resolve) => setTimeout(resolve, delay));
            return instance(config);
        }
    );

    return instance;
};

/**
 * General-purpose HTTP client with retry.
 */
export const httpClient = createAxiosInstance({}, 2);

/**
 * Client for Google Maps / Geolocation API calls.
 */
export const geoClient = createAxiosInstance({
    baseURL: 'https://maps.googleapis.com/maps/api',
    timeout: 8000,
}, 1);

/**
 * Client for any health-related external data APIs.
 */
export const healthDataClient = createAxiosInstance({
    timeout: 15000, // longer timeout for health data
    headers: {
        'Content-Type': 'application/json',
        'x-source': 'synapse-synchrony-backend',
    },
}, 2);

export default { httpClient, geoClient, healthDataClient, createAxiosInstance };
