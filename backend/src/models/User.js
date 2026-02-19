/**
 * @file User.js
 * @category Models
 * @package NeuralNexus.Models
 * @version 6.5.0
 * 
 * --- THE NEURAL IDENTITY SCHEMATIC ---
 * 
 * This model defines the structure of a Neural Identity (User) within the Nexus.
 * It encapsulates biological identifiers, security nodes, and synaptic manifolds.
 * Each User node is a terminal in the global Neural Nexus network.
 */

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    // --- AUTHENTICATION NODES ---
    email: {
      type: String,
      required: [true, 'IDENTITY_ERROR: Primary email node missing'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'SECURITY_ERROR: Access key undefined'],
      minlength: 8,
    },

    // --- BIOMETRIC PORTRAIT ---
    name: {
      type: String,
      required: [true, 'IDENTITY_ERROR: Biological identifier required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://i.ibb.co.com/0yrpXd6k/Blank-Pfp.webp',
    },
    bio: {
      type: String,
      default: 'A seeker of synaptic synchrony.',
      maxlength: 1024,
    },

    // --- SYSTEM METADATA ---
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator', 'architect'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'dormant', 'deleted'],
      default: 'active',
    },
    clearanceLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },

    // --- TEMPORAL TRACKING ---
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,

    // --- GEOSPATIAL MANIFOLD ---
    address: {
      street: { type: String, default: 'UNKNOWN_SECTOR' },
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'NEURAL_NEXUS_GLOBAL' },
      coordinates: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
      },
    },

    // --- BIOSOCIAL CONNECTORS ---
    phone: String,
    emergencyContact: {
      name: { type: String, default: 'NEXUS_OVERWATCH' },
      phone: String,
      relation: String,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'non-binary', 'prefer_not_to_say', ''],
      default: '',
    },

    // --- SYNAPTIC REGISTRY ---
    bookmarkedBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
    neuralSignatures: [
      {
        timestamp: { type: Date, default: Date.now },
        hash: String,
        deviceId: String,
        location: String,
      }
    ],

    // --- TELEMETRY PREFERENCES ---
    settings: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'cyber-minimalist', 'deep-black'],
        default: 'cyber-minimalist',
      },
      privacy: {
        profilePublic: { type: Boolean, default: true },
        showWellness: { type: Boolean, default: false },
        shareDiagnostics: { type: Boolean, default: false },
      }
    },
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

// --- VIRTUALS & MIDDLEWARE ---

/**
 * @virtual fullName
 * @description Returns the localized identifier.
 */
UserSchema.virtual('fullName').get(function () {
  return this.name;
});

/**
 * @middleware pre-save
 * @description Ensures data normalization before injection.
 */
UserSchema.pre('save', function (next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// --- INDEXING MANIFOLD ---
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'address.coordinates': '2dsphere' });
UserSchema.index({ nodeCreated: -1 });

const User = mongoose.model('User', UserSchema, 'users_nexus_v6');
export default User;
