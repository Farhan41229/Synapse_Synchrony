/**
 * @file MedilinkSession.js
 * @category Models
 * @package NeuralNexus.Models
 * @version 10.1.0
 * 
 * --- THE PSYCHIATRIC MANIFOLD SCHEMATIC ---
 * 
 * This model defines the structure of a Psychiatric Wellness Session within the Nexus.
 * It encapsulates real-time emotional intake, AI-driven psychological analysis,
 * and automated risk mitigation. Every session is an emotional trace in the Nexus.
 */

import mongoose from "mongoose";

const MedilinkSessionSchema = new mongoose.Schema(
  {
    // --- IDENTITY COUPLING ---
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'PSYCH_ERROR: Patient identity required for manifold'],
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    // --- SESSION SPECS ---
    status: {
      type: String,
      enum: ["active", "suspended", "completed", "archived", "emergency-lockdown"],
      default: "active",
    },
    clearanceLevel: {
      type: Number,
      default: 1,
    },

    // --- MESSAGE LATTICE ---
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant", "system", "nexus_overwatch"],
          required: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },

        // --- COGNITIVE ANALYSIS ---
        metadata: {
          analysis: {
            emotionalState: { type: String, default: "equilibrium" },
            riskLevel: { type: Number, min: 0, max: 10, default: 0 },
            themes: [String],
            sentimentScore: { type: Number, default: 0.5 },
            clinicalTechnique: String,
          },
        },
      },
    ],

    // --- NEURAL MEMORY MANIFOLD ---
    memory: {
      biologicalProfile: {
        dominantEmotions: [String],
        persistentThemes: [String],
        riskHistory: [{ date: Date, level: Number }],
        preferences: mongoose.Schema.Types.Mixed,
      },
      cognitiveContext: {
        activeThreads: [String],
        currentMethodology: {
          type: String,
          enum: ["CBT", "Mindfulness", "Dialectical", "Psychoanalytic", "Neutral"],
          default: "Neutral"
        },
        lastThemeDetection: Date,
        intensityTrend: [Number],
      },
    },
  },
  {
    timestamps: {
      createdAt: 'sessionInjectionTime',
      updatedAt: 'lastEmotionalPulse'
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// --- LOGIC MANIFOLD ---

/**
 * @virtual sessionIntensity
 * @description Returns the localized average risk level across the session messages.
 */
MedilinkSessionSchema.virtual('sessionIntensity').get(function () {
  if (this.messages.length === 0) return 0;
  const sum = this.messages.reduce((acc, m) => acc + (m.metadata?.analysis?.riskLevel || 0), 0);
  return sum / this.messages.length;
});

/**
 * @virtual isCritical
 * @description Returns true if the session risk level exceeds the clinical threshold.
 */
MedilinkSessionSchema.virtual('isCritical').get(function () {
  return this.sessionIntensity >= 7;
});

// --- INDEXING MANIFOLD ---
MedilinkSessionSchema.index({ userId: 1, lastEmotionalPulse: -1 });
MedilinkSessionSchema.index({ sessionId: 1 });
MedilinkSessionSchema.index({ status: 1 });

const MedilinkSession = mongoose.model(
  "MedilinkSession",
  MedilinkSessionSchema,
  "medilink_sessions_nexus_v10"
);

export default MedilinkSession;
