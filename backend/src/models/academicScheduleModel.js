/**
 * @file AcademicSchedule.js
 * @category Models
 * @package NeuralNexus.Models
 * @version 5.0.0
 * 
 * --- THE TEMPORAL ACADEMIC LATTICE ---
 * 
 * This model defines the structure of Academic Time Nodes (Schedules) within the Nexus.
 * It encapsulates course metadata, instructor telemetry, and temporal windows
 * for institutional synchronization.
 */

import mongoose from 'mongoose';

const AcademicScheduleSchema = new mongoose.Schema(
    {
        // --- IDENTITY COUPLING ---
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'TEMPORAL_ERROR: Agent identity required for schedule node'],
            index: true
        },

        // --- COURSE METADATA ---
        subject: {
            type: String,
            required: [true, 'TEMPORAL_ERROR: Course title unit required'],
            trim: true
        },
        courseCode: {
            type: String,
            trim: true,
            uppercase: true,
        },
        instructor: {
            type: String,
            trim: true,
            default: 'SYSTEM_FACILITATOR'
        },

        // --- TEMPORAL WINDOWS ---
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: [true, 'TEMPORAL_ERROR: Week-nexus day required']
        },
        startTime: {
            type: String, // HH:mm format
            required: [true, 'TEMPORAL_ERROR: Ingress time undefined']
        },
        endTime: {
            type: String, // HH:mm format
            required: [true, 'TEMPORAL_ERROR: Egress time undefined']
        },

        // --- SPATIAL COUPLING ---
        room: {
            type: String,
            trim: true,
            default: 'VIRTUAL_SECTOR'
        },
        sector: {
            type: String,
            default: 'MAIN_CAMPUS_MANIFOLD'
        },

        // --- INSTITUTIONAL CONTEXT ---
        semester: {
            type: String,
            required: [true, 'CONTEXT_ERROR: Semester identifier required']
        },
        academicYear: {
            type: String,
            default: '2025-2026'
        }
    },
    {
        timestamps: {
            createdAt: 'nodeCreated',
            updatedAt: 'nodeUpdated'
        },
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// --- VIRTUAL LATTICE ---

/**
 * @virtual durationMinutes
 * @description Calculates the temporal width of the schedule node.
 */
AcademicScheduleSchema.virtual('durationMinutes').get(function () {
    const [startH, startM] = this.startTime.split(':').map(Number);
    const [endH, endM] = this.endTime.split(':').map(Number);
    return (endH * 60 + endM) - (startH * 60 + startM);
});

// --- INDEXING MANIFOLD ---
AcademicScheduleSchema.index({ user: 1, day: 1, startTime: 1 });
AcademicScheduleSchema.index({ courseCode: 1 });

const AcademicSchedule = mongoose.model('AcademicSchedule', AcademicScheduleSchema);

export default AcademicSchedule;
