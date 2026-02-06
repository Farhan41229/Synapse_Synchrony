// database/mongoClient.js
// Core MongoDB connection manager for Synapse Synchrony backend

import mongoose from 'mongoose';
import { EventEmitter } from 'events';

const connectionEmitter = new EventEmitter();

const DEFAULT_OPTIONS = {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  w: 'majority',
};

let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

/**
 * Establishes a connection to MongoDB with retry logic.
 * @param {string} uri - MongoDB connection URI
 * @param {object} options - Additional mongoose options
 */
export const connectMongo = async (uri, options = {}) => {
  if (isConnected) {
    console.log('[MongoClient] Already connected to MongoDB.');
    return mongoose.connection;
  }

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  while (connectionAttempts < MAX_RETRIES) {
    try {
      connectionAttempts++;
      console.log(
        `[MongoClient] Attempting MongoDB connection (${connectionAttempts}/${MAX_RETRIES})...`
      );

      await mongoose.connect(uri, mergedOptions);
      isConnected = true;
      connectionAttempts = 0;

      console.log('[MongoClient] Successfully connected to MongoDB.');
      connectionEmitter.emit('connected');

      return mongoose.connection;
    } catch (error) {
      console.error(`[MongoClient] Connection attempt ${connectionAttempts} failed:`, error.message);

      if (connectionAttempts >= MAX_RETRIES) {
        console.error('[MongoClient] Max retries reached. Could not connect to MongoDB.');
        connectionEmitter.emit('error', error);
        throw new Error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts: ${error.message}`);
      }

      console.log(`[MongoClient] Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
};

/**
 * Gracefully close the MongoDB connection.
 */
export const disconnectMongo = async () => {
  if (!isConnected) {
    console.log('[MongoClient] Not connected. Nothing to disconnect.');
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[MongoClient] MongoDB disconnected successfully.');
    connectionEmitter.emit('disconnected');
  } catch (error) {
    console.error('[MongoClient] Error while disconnecting:', error.message);
    throw error;
  }
};

/**
 * Returns the current connection status.
 * @returns {boolean}
 */
export const getConnectionStatus = () => isConnected;

/**
 * Returns the raw mongoose connection object.
 */
export const getConnection = () => mongoose.connection;

/**
 * Subscribe to connection lifecycle events.
 * @param {'connected'|'disconnected'|'error'} event
 * @param {Function} callback
 */
export const onConnectionEvent = (event, callback) => {
  connectionEmitter.on(event, callback);
};

// Register mongoose event listeners
mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('[MongoClient] Mongoose connected event fired.');
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('[MongoClient] Mongoose disconnected event fired. Attempting reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoClient] Mongoose connection error:', err.message);
  isConnected = false;
});

export default connectMongo;
