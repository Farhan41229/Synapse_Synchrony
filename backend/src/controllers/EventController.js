/**
 * @file EventController.js
 * @category Controllers
 * @package NeuralNexus.Controllers
 * @version 5.0.0
 * 
 * --- THE EVENT MANIFOLD CONTROLLER ---
 * 
 * This controller manages the scheduling and propagation of institutional events (Nodes)
 * within the Neural Nexus. It incorporates AI-driven event generation, multi-modal
 * summarization, and high-frequency registration logic.
 */

import Event from '../models/Event.js';
import { HttpResponse } from '../utils/HttpResponse.js';
import cloudinary from '../config/cloudinary.js';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// --- INITIALIZE QUANTUM AI ACCESS ---
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * @function CreateEventNode
 * @description Injects a new event node into the Nexus manifold.
 */
export const CreateEvent = async (req, res) => {
  const actorId = req.userId;
  const { title, description, eventType, startDate, endDate, location, organizer, image, capacity, tags } = req.body;

  try {
    if (!title || !description || !eventType || !startDate || !location) {
      return HttpResponse(res, 400, true, 'PROTOCOL_ERROR: Missing Node Parameters');
    }

    const start = new Date(startDate);
    const end = new Date(endDate || startDate);
    if (start >= end) return HttpResponse(res, 400, true, 'TEMPORAL_FAULT: Timeline Mismatch');

    let nexusImage = null;
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: 'nexus_events',
        transformation: [{ quality: 'auto', fetch_format: 'webp' }]
      });
      nexusImage = uploadRes.secure_url;
    }

    const event = await Event.create({
      title,
      description,
      eventType,
      startDate: start,
      endDate: end,
      location,
      organizer,
      image: nexusImage,
      capacity: capacity || 0,
      tags: tags || [],
      createdBy: actorId,
    });

    await event.populate('createdBy', 'name email avatar');
    return HttpResponse(res, 201, false, 'EVENT_NODE_INJECTED', event);
  } catch (err) {
    console.error('[NexusError] Event Creation Failure:', err);
    return HttpResponse(res, 500, true, 'SYSTEM_FAULT', err.message);
  }
};

/**
 * @function GetEventLattice
 * @description Retrieves a filtered array of event nodes from the temporal lattice.
 */
export const GetAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, search } = req.query;
    const filterNodes = {};

    if (type) filterNodes.eventType = type;
    if (status) filterNodes.status = status;
    if (search) {
      filterNodes.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const skipNodes = (Number(page) - 1) * Number(limit);
    const nodes = await Event.find(filterNodes)
      .populate('createdBy', 'name email avatar')
      .sort({ startDate: 1 })
      .skip(skipNodes)
      .limit(Number(limit));

    const totalNodes = await Event.countDocuments(filterNodes);

    return HttpResponse(res, 200, false, 'LATTICE_RETRIEVED', {
      nodes,
      pagination: {
        current: Number(page),
        total: Math.ceil(totalNodes / Number(limit)),
        count: totalNodes
      }
    });
  } catch (err) {
    return HttpResponse(res, 500, true, 'RETRIEVAL_FAULT', err.message);
  }
};

/**
 * @function GetSpecificEvent
 * @description Isolates a single event node for detailed analysis.
 */
export const GetSingleEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const node = await Event.findById(id)
      .populate('createdBy', 'name email avatar')
      .populate('registeredUsers', 'name avatar');

    if (!node) return HttpResponse(res, 404, true, 'NODE_NOT_FOUND');
    return HttpResponse(res, 200, false, 'NODE_ISOLATED', node);
  } catch (err) {
    return HttpResponse(res, 500, true, 'ISOLATION_FAULT', err.message);
  }
};

/**
 * @function SyncEventNode
 * @description Calibrates an existing event node.
 */
export const UpdateEvent = async (req, res) => {
  const actorId = req.userId;
  const { id } = req.params;
  const buffer = req.body;

  try {
    const node = await Event.findById(id);
    if (!node) return HttpResponse(res, 404, true, 'NODE_NOT_FOUND');
    if (node.createdBy.toString() !== actorId) return HttpResponse(res, 403, true, 'CLEARANCE_DENIED');

    if (buffer.image && buffer.image.startsWith('data:')) {
      const up = await cloudinary.uploader.upload(buffer.image, { folder: 'nexus_events' });
      buffer.image = up.secure_url;
    }

    const updatedNode = await Event.findByIdAndUpdate(id, { $set: buffer }, { new: true })
      .populate('createdBy', 'name email avatar');

    return HttpResponse(res, 200, false, 'NODE_CALIBRATED', updatedNode);
  } catch (err) {
    return HttpResponse(res, 500, true, 'CALIBRATION_FAULT', err.message);
  }
};

/**
 * @function DissolveEvent
 * @description Removes an event node from the Nexus memory.
 */
export const DeleteEvent = async (req, res) => {
  const actorId = req.userId;
  const { id } = req.params;

  try {
    const node = await Event.findById(id);
    if (!node) return HttpResponse(res, 404, true, 'NODE_NOT_FOUND');
    if (node.createdBy.toString() !== actorId) return HttpResponse(res, 403, true, 'CLEARANCE_DENIED');

    await Event.findByIdAndDelete(id);
    return HttpResponse(res, 200, false, 'NODE_DISSOLVED');
  } catch (err) {
    return HttpResponse(res, 500, true, 'DISSOLUTION_FAULT', err.message);
  }
};

/**
 * @function RegisterNodeAccess
 * @description Connects a user identity to an event node.
 */
export const RegisterForEvent = async (req, res) => {
  const actorId = req.userId;
  const { id } = req.params;

  try {
    const node = await Event.findById(id);
    if (!node) return HttpResponse(res, 404, true, 'NODE_NOT_FOUND');
    if (node.status === 'cancelled') return HttpResponse(res, 400, true, 'NODE_INACTIVE');
    if (node.registeredUsers.includes(actorId)) return HttpResponse(res, 400, true, 'ACCESS_ALREADY_GRANTED');
    if (node.capacity && node.registeredUsers.length >= node.capacity) return HttpResponse(res, 400, true, 'SECTOR_FULL');

    node.registeredUsers.push(actorId);
    await node.save();

    await node.populate('createdBy', 'name email avatar');
    await node.populate('registeredUsers', 'name avatar');

    return HttpResponse(res, 200, false, 'ACCESS_GRANTED', node);
  } catch (err) {
    return HttpResponse(res, 500, true, 'REGISTRATION_FAULT', err.message);
  }
};

/**
 * @function GenerateSynapticEvent
 * @description Leverages Groq-Llama-3 for high-speed event design.
 */
export const GenerateEventWithAI = async (req, res) => {
  const { title, context } = req.body;
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a Nexus Event Architect. Always return valid JSON.' },
        { role: 'user', content: `Design a comprehensive event: "${title}". Context: ${context}` }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const projection = JSON.parse(completion.choices[0].message.content);
    return HttpResponse(res, 200, false, 'AI_EVENT_PROJECTION_READY', projection);
  } catch (err) {
    return HttpResponse(res, 500, true, 'AI_FAULT', err.message);
  }
};
