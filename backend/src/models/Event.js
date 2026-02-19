/**
 * @file Event.js
 * @category Models
 * @package NeuralNexus.Models
 * @version 7.2.0
 * 
 * --- THE EVENT LATTICE NODE SCHEMATIC ---
 * 
 * This model defines the structure of an Event Node (Event) within the Nexus.
 * It encapsulates temporal scheduling, geospatial locations, and sector capacities.
 * Each Event Node is a synchronization point in the global Neural Nexus timeline.
 */

import mongoose, { Schema } from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    // --- NODE IDENTIFIERS ---
    title: {
      type: String,
      required: [true, 'TEMPORAL_ERROR: Event title node missing'],
      trim: true,
      maxlength: 512,
    },
    description: {
      type: String,
      required: [true, 'TEMPORAL_ERROR: Event narrative missing'],
    },

    // --- SECTOR SPECS ---
    eventType: {
      type: String,
      enum: ['workshop', 'seminar', 'extracurricular', 'academic', 'social', 'technical_summit'],
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled', 'deferred'],
      default: 'upcoming',
    },

    // --- TEMPORAL MANIFOLD ---
    startDate: {
      type: Date,
      required: [true, 'TEMPORAL_ERROR: Ingress timestamp required'],
    },
    endDate: {
      type: Date,
      required: [true, 'TEMPORAL_ERROR: Egress timestamp required'],
    },

    // --- GEOSPATIAL NODE ---
    location: {
      type: String,
      required: [true, 'GEOSPATIAL_ERROR: Sector location link required'],
      trim: true,
    },

    // --- AGENT TELEMETRY ---
    organizer: {
      name: { type: String, required: true },
      contact: String,
      agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // --- VISUAL LATTICE ---
    image: {
      type: String, // Cloudinary Secure Link
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
    },

    // --- CAPACITY & RESONANCE ---
    capacity: {
      type: Number,
      default: 0, // 0 indicates unlimited sector volume
    },
    registeredUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      }
    ],

    // --- ACCESS CLEARANCE ---
    minimumClearance: {
      type: Number,
      default: 1,
    }
  },
  {
    timestamps: {
      createdAt: 'nodeCreated',
      updatedAt: 'nodeUpdated',
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// --- LOGIC GATES ---

/**
 * @virtual isSectorFull
 * @description Returns true if the node capacity has reached its critical threshold.
 */
EventSchema.virtual('isSectorFull').get(function () {
  if (this.capacity === 0) return false;
  return this.registeredUsers.length >= this.capacity;
});

/**
 * @virtual registryCount
 * @description Returns the number of agents registered for this temporal node.
 */
EventSchema.virtual('registryCount').get(function () {
  return this.registeredUsers.length;
});

// --- INDEXING MANIFOLD ---
EventSchema.index({ startDate: 1, status: 1 });
EventSchema.index({ eventType: 1 });
EventSchema.index({ tags: 1 });
EventSchema.index({ nodeCreated: -1 });

const Event = mongoose.model('Event', EventSchema, 'events_nexus_v6');
export default Event;
