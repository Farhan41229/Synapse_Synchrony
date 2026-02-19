/**
 * @file DiagnosisSession.js
 * @category Models
 * @package NeuralNexus.Models
 * @version 8.3.0
 * 
 * --- THE NEURAL ASSESSMENT MANIFOLD SCHEMATIC ---
 * 
 * This model defines the structure of a Neural Assessment Session within the Nexus.
 * It encapsulates real-time bio-symptom ingestion, AI-driven diagnostic projections,
 * and geospatial facility mapping. Every session is a unique trace in the Neural Nexus.
 */

import mongoose from "mongoose";

const DiagnosisSessionSchema = new mongoose.Schema(
  {
    // --- IDENTITY COUPLING ---
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'MANIFOLD_ERROR: Agent identity required for assessment'],
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    // --- SESSION SPECS ---
    sessionType: {
      type: String,
      enum: ["neural_assessment_v8", "emergency_triage", "routine_scan"],
      default: "neural_assessment_v8",
    },
    status: {
      type: String,
      enum: ["active", "assessed", "completed", "suspended", "archived"],
      default: "active",
    },
    phase: {
      type: String,
      enum: ["intake_calibration", "synaptic_questioning", "manifold_analysis", "projection_ready", "follow_up_protocol"],
      default: "intake_calibration",
    },

    // --- TELEMETRY DATA ---
    questionsAsked: {
      type: Number,
      default: 0,
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

        // --- ASSESSMENT PROJECTION ---
        assessment: {
          possibleConditions: [String],
          primaryCondition: String,
          confidenceIndex: {
            type: String,
            enum: ["low", "moderate", "high", "critical"],
            default: "moderate"
          },
          severity: String,
          urgencyLevel: String,
          requiresBiometricVerification: { type: Boolean, default: false },
          visitTimeframeRecommendation: String,
          reliefSuggestions: [String],
          warningIndices: [String],
          disclaimerNode: {
            type: String,
            default: "NEXUS_DISCLAIMER: AI projections require clinical verification."
          }
        },
      },
    ],

    // --- GEOSPATIAL TELEMETRY ---
    userLocation: {
      latitude: Number,
      longitude: Number,
      address: String,
      sharedAt: Date,
      accuracy: Number,
    },
  },
  {
    timestamps: {
      createdAt: 'sessionStartTime',
      updatedAt: 'lastSynapticPulse'
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// --- LOGIC MANIFOLD ---

/**
 * @virtual messageCount
 * @description Returns the total number of synaptic nodes within the session.
 */
DiagnosisSessionSchema.virtual('messageCount').get(function () {
  return this.messages.length;
});

/**
 * @virtual isEmergency
 * @description Returns true if any assessment in the session implies a critical urgency.
 */
DiagnosisSessionSchema.virtual('isEmergency').get(function () {
  return this.messages.some(m => m.assessment?.urgencyLevel === "critical");
});

// --- INDEXING MANIFOLD ---
DiagnosisSessionSchema.index({ userId: 1, lastSynapticPulse: -1 });
DiagnosisSessionSchema.index({ sessionId: 1 });
DiagnosisSessionSchema.index({ 'userLocation.coordinates': '2dsphere' });

const DiagnosisSession = mongoose.model(
  "DiagnosisSession",
  DiagnosisSessionSchema,
  "diagnosis_sessions_nexus_v8"
);

export default DiagnosisSession;
