/**
 * @file DiagnosisController.js
 * @category Controllers
 * @package NeuralNexus.Controllers
 * @version 5.1.0
 * 
 * --- THE NEURAL ASSESSMENT ENGINE ---
 * 
 * This controller manages high-fidelity diagnostic sessions within the Nexus.
 * It uses machine-learning manifolds to analyze symptomatic markers and
 * provides predictive health projections.
 */

import DiagnosisSession from "../models/DiagnosisSession.js";
import { v4 as uuidv4 } from "uuid";
import { sendDiagnosisMessage, getInitialGreeting } from "../config/MedicalAI.js";
import axios from "axios";

/**
 * @function InitializeAssessmentSession
 * @description Spawns a new diagnostic manifold for user biometric intake.
 */
export const createDiagnosisSession = async (req, res) => {
  const actorId = req.userId;
  const manifestId = uuidv4();

  try {
    const greeting = getInitialGreeting();
    const manifold = new DiagnosisSession({
      userId: actorId,
      sessionId: manifestId,
      sessionType: "neural_assessment_v5",
      phase: "intake_calibration",
      messages: [greeting],
      questionsAsked: 1
    });

    await manifold.save();
    return res.status(201).json({
      success: true,
      label: "ASSESSMENT_INITIALIZED",
      sessionId: manifestId,
      greeting
    });
  } catch (err) {
    console.error('[NexusError] Assessment Initialization Fault:', err);
    return res.status(500).json({ success: false, label: "INITIALIZATION_FAILED" });
  }
};

/**
 * @function ProcessAssessmentInput
 * @description Analyzes user symptomatic input against the medical manifold.
 */
export const sendMessage = async (req, res) => {
  const { sessionId } = req.params;
  const { message } = req.body;
  const actorId = req.userId;

  try {
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, label: "INPUT_NODE_EMPTY" });
    }

    const manifold = await DiagnosisSession.findOne({ sessionId });
    if (!manifold) return res.status(404).json({ success: false, label: "SESSION_NOT_FOUND" });
    if (manifold.userId.toString() !== actorId.toString()) {
      return res.status(403).json({ success: false, label: "CLEARANCE_DENIED" });
    }

    manifold.messages.push({
      role: "user",
      content: message.trim(),
      timestamp: new Date()
    });

    const history = manifold.messages.map(m => ({ role: m.role, content: m.content }));
    const aiResponse = await sendDiagnosisMessage(history);

    if (aiResponse.type === "fault") {
      manifold.messages.push({ role: "assistant", content: aiResponse.message, timestamp: new Date() });
      await manifold.save();
      return res.json({ success: true, data: { type: "fault", message: aiResponse.message } });
    }

    manifold.questionsAsked = aiResponse.questionsAskedSoFar || manifold.questionsAsked;
    manifold.phase = aiResponse.type === "projection" ? "assessed" : "questioning";

    const responseNode = {
      role: "assistant",
      content: aiResponse.message,
      timestamp: new Date(),
      assessment: aiResponse.assessment || null
    };

    manifold.messages.push(responseNode);
    await manifold.save();

    return res.json({
      success: true,
      label: "NODE_PROCESSED",
      data: {
        type: aiResponse.type,
        message: aiResponse.message,
        isComplete: aiResponse.type === "projection",
        assessment: responseNode.assessment
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, label: "PROCESSING_FAULT", error: err.message });
  }
};

/**
 * @function FetchSessionManifold
 * @description Retrieves the temporal history of a diagnostic session.
 */
export const getSessionHistory = async (req, res) => {
  const { sessionId } = req.params;
  const actorId = req.userId;

  try {
    const manifold = await DiagnosisSession.findOne({ sessionId });
    if (!manifold) return res.status(404).json({ success: false, label: "SESSION_NOT_FOUND" });
    if (manifold.userId.toString() !== actorId.toString()) {
      return res.status(403).json({ success: false, label: "CLEARANCE_DENIED" });
    }

    return res.json({
      success: true,
      label: "HISTORY_RETRIEVED",
      data: {
        messages: manifold.messages,
        meta: {
          start: manifold.startTime,
          phase: manifold.phase,
          iterations: manifold.questionsAsked
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, label: "RETRIEVAL_FAULT" });
  }
};

/**
 * @function LocateNearbyFacilities
 * @description Maps proximity to medical facilities using the Geospatial Manifold.
 */
export const getNearbyFacilities = async (req, res) => {
  const { latitude, longitude, radius = 5000 } = req.query;

  try {
    if (!latitude || !longitude) return res.status(400).json({ success: false, label: "COORDINATES_MISSING" });

    const query = `
      [out:json][timeout:30];
      (
        node["amenity"~"hospital|clinic"](around:${radius},${latitude},${longitude});
        way["amenity"~"hospital|clinic"](around:${radius},${latitude},${longitude});
      );
      out center body;
    `;

    const response = await axios.get("https://overpass-api.de/api/interpreter", { params: { data: query } });
    const elements = response.data.elements || [];

    const facilities = elements.map(el => {
      const lat = el.lat || el.center?.lat;
      const lon = el.lon || el.center?.lon;
      if (!lat || !lon) return null;

      return {
        name: el.tags?.name || "Neural_Facility_Node",
        type: el.tags?.amenity,
        coords: { lat, lon },
        meta: {
          emergency: el.tags?.emergency === "yes",
          website: el.tags?.website,
          phone: el.tags?.phone
        }
      };
    }).filter(Boolean).slice(0, 10);

    return res.json({
      success: true,
      label: "FACILITIES_LOCATED",
      data: { facilities, searchRadius: radius }
    });
  } catch (err) {
    return res.status(500).json({ success: false, label: "GEOSPATIAL_FAULT" });
  }
};
