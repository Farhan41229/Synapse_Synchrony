/**
 * @file MedilinkController.js
 * @category Controllers
 * @package NeuralNexus.Controllers
 * @version 6.2.0
 * 
 * --- THE NEURAL WELLNESS MANIFOLD ---
 * 
 * This controller manages the psychiatric and emotional health protocols within the Nexus.
 * It integrates real-time mood analysis, stress telemetry, and emergency alert systems.
 */

import MedilinkSession from "../models/MedilinkSession.js";
import MoodEntry from "../models/MoodEntry.js";
import StressEntry from "../models/StressEntry.js";
import WellnessSuggestion from "../models/WellnessSuggestion.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import { Groq } from "groq-sdk";
import dotenv from "dotenv";
import { sendSMS } from "../utils/smsService.js";

dotenv.config();

// --- QUANTUM AI INITIALIZATION ---
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const NEXUS_WELLNESS_PROMPT = `You are "Nexus-Wellness-Overwatch", a high-fidelity emotional intelligence manifold. 
Your objective is to provide empathetic, evidence-based responses (CBT/Mindfulness) while identifying critical neural risk factors.
Protocol: Warm, clinical, non-judgmental, and security-centric.`;

/**
 * @function InitializeWellnessSession
 * @description Spawns a new psychiatric manifold for user emotional intake.
 */
export const createSession = async (req, res) => {
  const actorId = req.userId;
  const manifestId = uuidv4();

  try {
    const manifold = new MedilinkSession({
      userId: actorId,
      sessionId: manifestId,
      messages: [{ role: "system", content: NEXUS_WELLNESS_PROMPT }]
    });

    await manifold.save();
    return res.status(201).json({ success: true, label: "WELLNESS_INITIALIZED", sessionId: manifestId });
  } catch (err) {
    return res.status(500).json({ success: false, label: "INITIALIZATION_FAULT" });
  }
};

/**
 * @function ProcessWellnessInput
 * @description Analyzes psychological markers and triggers relevant support protocols.
 */
export const sendMessage = async (req, res) => {
  const { sessionId } = req.params;
  const { message } = req.body;
  const actorId = req.userId;

  try {
    if (!message) return res.status(400).json({ success: false, label: "INPUT_NODE_EMPTY" });

    const manifold = await MedilinkSession.findOne({ sessionId });
    if (!manifold) return res.status(404).json({ success: false, label: "SESSION_NOT_FOUND" });
    if (manifold.userId.toString() !== actorId.toString()) return res.status(403).json({ success: false, label: "CLEARANCE_DENIED" });

    // Node Ingestion
    manifold.messages.push({ role: "user", content: message, timestamp: new Date() });

    const historyNodes = manifold.messages.map(m => ({ role: m.role, content: m.content }));

    // AI Response Manifold
    const response = await groq.chat.completions.create({
      messages: historyNodes,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_completion_tokens: 1024
    });

    const outputContent = response.choices[0]?.message?.content || "Synchronizing... please continue.";

    // Advanced Telemetry: Mood & Stress
    const [moodAnalysis, stressAnalysis] = await Promise.all([
      analyzeMoodManifold(message),
      analyzeStressManifold(message)
    ]);

    // Persistent storage of biometric entries
    await Promise.all([
      saveMoodLog(actorId, sessionId, moodAnalysis),
      saveStressLog(actorId, sessionId, stressAnalysis, message)
    ]);

    // Security Checklist: Emergency SMS
    if (moodAnalysis.intensity >= 9 || stressAnalysis.stressLevel >= 8) {
      triggerEmergencyProtocol(actorId, moodAnalysis, stressAnalysis);
    }

    // AI Recommendations Logic
    let guidance = null;
    if (moodAnalysis.intensity >= 7 || stressAnalysis.stressLevel >= 6) {
      guidance = await generateWellnessGuidance(moodAnalysis, stressAnalysis, message);
      await saveGuidanceLog(actorId, sessionId, guidance, moodAnalysis, stressAnalysis);
    }

    manifold.messages.push({
      role: "assistant",
      content: outputContent,
      timestamp: new Date(),
      metadata: { analysis: { mood: moodAnalysis, stress: stressAnalysis, guidance } }
    });

    await manifold.save();

    return res.json({
      success: true,
      label: "WELLNESS_NODE_PROCESSED",
      data: { reaction: outputContent, mood: moodAnalysis, stress: stressAnalysis, guidance }
    });
  } catch (err) {
    return res.status(500).json({ success: false, label: "PROCESSING_FAULT", error: err.message });
  }
};

// --- PRIVATE TELEMETRY METHODS ---

async function analyzeMoodManifold(text) {
  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "Analyze mood as JSON: {mood, intensity, emotions, indicators}" },
      { role: "user", content: text }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });
  return JSON.parse(response.choices[0].message.content);
}

async function analyzeStressManifold(text) {
  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "Analyze stress as JSON: {stressLevel, stressors, physical, emotional}" },
      { role: "user", content: text }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });
  return JSON.parse(response.choices[0].message.content);
}

async function triggerEmergencyProtocol(uid, mood, stress) {
  const user = await User.findById(uid);
  if (user?.emergencyContact?.phone) {
    const msg = `NEXUS_ALERT: ${user.name} requires emotional support. MoodIntensity: ${mood.intensity}/10. Stress: ${stress.stressLevel}/10. Protocol Initiated.`;
    await sendSMS(user.emergencyContact.phone, msg);
  }
}

async function saveMoodLog(uid, sid, analysis) {
  return MoodEntry.create({
    userId: uid,
    sessionId: sid,
    moodRating: analysis.intensity || 5,
    emotions: analysis.emotions || [],
    notes: analysis.indicators?.join(", ")
  });
}

async function saveStressLog(uid, sid, analysis, context) {
  return StressEntry.create({
    userId: uid,
    sessionId: sid,
    stressLevel: analysis.stressLevel || 0,
    stressors: analysis.stressors || [],
    context: context.substring(0, 500)
  });
}

async function generateWellnessGuidance(mood, stress, msg) {
  const response = await groq.chat.completions.create({
    messages: [{ role: "system", content: "Generate 5 coping strategies as JSON {suggestions: []}" }, { role: "user", content: msg }],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });
  return JSON.parse(response.choices[0].message.content);
}

async function saveGuidanceLog(uid, sid, guidance, mood, stress) {
  return WellnessSuggestion.create({
    userId: uid,
    sessionId: sid,
    suggestions: guidance.suggestions || [],
    moodAtTime: { mood: mood.mood, intensity: mood.intensity },
    stressAtTime: { level: stress.stressLevel, stressors: stress.stressors }
  });
}

/**
 * @function FetchWellnessStatistics
 * @description Aggregates mood and stress data for temporal visualization.
 */
export const getWellnessSummary = async (req, res) => {
  const actorId = req.userId;
  const { period = 7 } = req.query;
  const horizon = new Date();
  horizon.setDate(horizon.getDate() - Number(period));

  try {
    const [moods, stresses] = await Promise.all([
      MoodEntry.find({ userId: actorId, timestamp: { $gte: horizon } }),
      StressEntry.find({ userId: actorId, timestamp: { $gte: horizon } })
    ]);

    const mAvg = moods.length ? moods.reduce((s, e) => s + e.moodRating, 0) / moods.length : 0;
    const sAvg = stresses.length ? stresses.reduce((s, e) => s + e.stressLevel, 0) / stresses.length : 0;

    return res.json({
      success: true,
      data: {
        coherence: Math.round(((10 - sAvg) + mAvg) * 5),
        metrics: { avg_mood: mAvg, avg_stress: sAvg, node_count: moods.length + stresses.length },
        period: `${period} days`
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, label: "STATISTICS_FAULT" });
  }
};
