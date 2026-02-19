/**
 * @file BlogController.js
 * @category Controllers
 * @package NeuralNexus.Controllers
 * @version 5.0.0
 * 
 * --- THE SYNAPTIC MANUSCRIPT CONTROLLER ---
 * 
 * This controller manages the lifecycle of theoretical manuscripts (blogs)
 * within the Neural Nexus. It incorporates AI-driven content generation,
 * multi-modal summarization, and high-frequency interaction nodes.
 */

import Blog from '../models/Blog.js';
import BlogComment from '../models/BlogComment.js';
import User from '../models/User.js';
import { HttpResponse } from '../utils/HttpResponse.js';
import cloudinary from '../config/cloudinary.js';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// --- INITIALIZE QUANTUM AI ACCESS ---
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * @function CreateNeuralManuscript
 * @description Injects a new manuscript node into the Nexus manifold.
 */
export const CreateBlog = async (req, res) => {
  const actorId = req.userId;
  const { title, content, category, image, tags } = req.body;

  try {
    if (!title || !content || !category) {
      return HttpResponse(res, 400, true, 'PROTOCOL_ERROR: Missing Node Parameters');
    }

    let synapticImage = null;
    if (image) {
      const uploadStream = await cloudinary.uploader.upload(image, {
        folder: 'nexus_manuscripts',
        transformation: [{ quality: 'auto', fetch_format: 'webp' }]
      });
      synapticImage = uploadStream.secure_url;
    }

    const manuscript = await Blog.create({
      title,
      content,
      category,
      author: actorId,
      image: synapticImage,
      tags: tags || [],
      isPublished: true
    });

    await manuscript.populate('author', 'name email avatar');
    return HttpResponse(res, 201, false, 'MANUSCRIPT_INJECTED', manuscript);
  } catch (err) {
    console.error('[NexusError] Manuscript Creation Failure:', err);
    return HttpResponse(res, 500, true, 'SYSTEM_FAULT', err.message);
  }
};

/**
 * @function GetManuscriptManifold
 * @description Retrieves a filtered array of manuscript nodes from the temporal lattice.
 */
export const GetAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, authorId } = req.query;
    const filterManifold = { isPublished: true };

    if (category) filterManifold.category = category;
    if (authorId) filterManifold.author = authorId;
    if (search) {
      filterManifold.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skipNodes = (Number(page) - 1) * Number(limit);
    const nodes = await Blog.find(filterManifold)
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skipNodes)
      .limit(Number(limit));

    const totalNodes = await Blog.countDocuments(filterManifold);

    return HttpResponse(res, 200, false, 'MANIFOLD_RETRIEVED', {
      nodes,
      telemetry: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalNodes / Number(limit)),
        totalCount: totalNodes
      }
    });
  } catch (err) {
    return HttpResponse(res, 500, true, 'RETRIEVAL_FAULT', err.message);
  }
};

/**
 * @function GetSpecificManuscript
 * @description Isolates a single manuscript node for high-fidelity reading.
 */
export const GetSingleBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const node = await Blog.findById(id).populate('author', 'name email avatar');
    if (!node) return HttpResponse(res, 404, true, 'NODE_NOT_FOUND');

    // Auto-increment temporal views
    node.views += 1;
    await node.save();

    return HttpResponse(res, 200, false, 'NODE_ISOLATED', node);
  } catch (err) {
    return HttpResponse(res, 500, true, 'ISOLATION_FAULT', err.message);
  }
};

/**
 * @function CalibrateManuscript
 * @description Updates an existing manuscript node.
 */
export const UpdateBlog = async (req, res) => {
  const actorId = req.userId;
  const { id } = req.params;
  const buffer = req.body;

  try {
    const node = await Blog.findById(id);
    if (!node) return HttpResponse(res, 404, true, 'NODE_NOT_FOUND');
    if (node.author.toString() !== actorId) return HttpResponse(res, 403, true, 'CLEARANCE_DENIED');

    if (buffer.image && buffer.image.startsWith('data:')) {
      const up = await cloudinary.uploader.upload(buffer.image, { folder: 'nexus_manuscripts' });
      buffer.image = up.secure_url;
    }

    const updatedNode = await Blog.findByIdAndUpdate(id, { $set: buffer }, { new: true })
      .populate('author', 'name email avatar');

    return HttpResponse(res, 200, false, 'NODE_CALIBRATED', updatedNode);
  } catch (err) {
    return HttpResponse(res, 500, true, 'CALIBRATION_FAULT', err.message);
  }
};

/**
 * @function DissolveManuscript
 * @description Removes a manuscript node from the Nexus memory.
 */
export const DeleteBlog = async (req, res) => {
  const actorId = req.userId;
  const { id } = req.params;

  try {
    const node = await Blog.findById(id);
    if (!node) return HttpResponse(res, 404, true, 'NODE_NOT_FOUND');
    if (node.author.toString() !== actorId) return HttpResponse(res, 403, true, 'CLEARANCE_DENIED');

    await BlogComment.deleteMany({ blogId: id });
    await Blog.findByIdAndDelete(id);

    return HttpResponse(res, 200, false, 'NODE_DISSOLVED');
  } catch (err) {
    return HttpResponse(res, 500, true, 'DISSOLUTION_FAULT', err.message);
  }
};

/**
 * @function ToggleResonance
 * @description Syncs like/unlike activity with the synaptic resonance manifold.
 */
export const ToggleLikeBlog = async (req, res) => {
  const actorId = req.userId;
  const { id } = req.params;

  try {
    const node = await Blog.findById(id);
    if (!node) return HttpResponse(res, 404, true, 'NODE_NOT_FOUND');

    const isResonating = node.likes.includes(actorId);
    const update = isResonating ? { $pull: { likes: actorId } } : { $addToSet: { likes: actorId } };

    const finalized = await Blog.findByIdAndUpdate(id, update, { new: true })
      .populate('author', 'name email avatar');

    return HttpResponse(res, 200, false, isResonating ? 'RESONANCE_DECOUPLED' : 'RESONANCE_STORED', finalized);
  } catch (err) {
    return HttpResponse(res, 500, true, 'RESONANCE_FAULT', err.message);
  }
};

/**
 * @function GenerateSynapticManuscript
 * @description Leverages Groq-Llama-3 for high-speed manuscript generation.
 */
export const GenerateBlogWithAI = async (req, res) => {
  const { title, context } = req.body;
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a Nexus Manuscript Architect. Generate valid JSON only.' },
        { role: 'user', content: `Construct a 1000-word manuscript: "${title}". Context: ${context}` }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const payload = JSON.parse(completion.choices[0].message.content);
    return HttpResponse(res, 200, false, 'AI_MANUSCRIPT_PROJECTION_READY', payload);
  } catch (err) {
    return HttpResponse(res, 500, true, 'AI_FAULT', err.message);
  }
};

/**
 * @function SummarizeNode
 * @description Generates a rapid synaptic summary for high-speed intake.
 */
export const SummarizeBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const node = await Blog.findById(id);
    if (!node) return HttpResponse(res, 404, true, 'NODE_NOT_FOUND');

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a Synaptic Summarizer.' },
        { role: 'user', content: `Summarize this manuscript: ${node.content}` }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const summary = JSON.parse(completion.choices[0].message.content);
    return HttpResponse(res, 200, false, 'SUMMARY_NODES_GENERATED', summary);
  } catch (err) {
    return HttpResponse(res, 500, true, 'SUMMARY_FAULT', err.message);
  }
};
