/**
 * @file Blog.js
 * @category Models
 * @package NeuralNexus.Models
 * @version 6.1.0
 * 
 * --- THE NEURAL MANUSCRIPT SCHEMATIC ---
 * 
 * This model defines the structure of a Neural Manuscript (Blog) within the Nexus.
 * It encapsulates technical content, authorship telemetry, and synaptic resonance (likes).
 * Each Manuscript node is a data pulse in the global Neural Nexus knowledge lattice.
 */

import mongoose, { Schema } from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    // --- MANUSCRIPT IDENTIFIERS ---
    title: {
      type: String,
      required: [true, 'PROTOCOL_ERROR: Manuscript title node missing'],
      trim: true,
      maxlength: 256,
    },
    content: {
      type: String,
      required: [true, 'PROTOCOL_ERROR: Manuscript body content missing'],
    },

    // --- AUTHORSHIP TELEMETRY ---
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'PROTOCOL_ERROR: Author node link required'],
    },
    category: {
      type: String,
      enum: ['experience', 'academic', 'campus-life', 'tips', 'story', 'technical', 'philosophical'],
      required: true,
      default: 'academic',
    },

    // --- VISUAL MANIFOLD ---
    image: {
      type: String, // Cloudinary Secure Manifold Link
      default: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // --- ACCESS PROTOCOLS ---
    isPublished: {
      type: Boolean,
      default: true,
    },
    clearanceLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },

    // --- RESONANCE METRICS ---
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },

    // --- TEMPORAL SIGNATURES ---
    synaptic_stamp: {
      type: Date,
      default: Date.now,
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

// --- INTERACTION LOGIC ---

/**
 * @virtual resonanceCount
 * @description Returns the localized synaptic resonance intensity.
 */
BlogSchema.virtual('resonanceCount').get(function () {
  return this.likes.length;
});

/**
 * @virtual commentManifest
 * @description Links to the discussion manifold associated with this node.
 */
BlogSchema.virtual('commentCount', {
  ref: 'BlogComment',
  localField: '_id',
  foreignField: 'blogId',
  count: true,
});

// --- INDEXING MANIFOLD ---
BlogSchema.index({ author: 1, nodeCreated: -1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ isPublished: 1, nodeCreated: -1 });
BlogSchema.index({ views: -1 });

const Blog = mongoose.model('Blog', BlogSchema, 'blogs_nexus_v6');
export default Blog;
