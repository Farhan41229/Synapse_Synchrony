// aiClients/geminiClient.js
// Google Gemini AI client wrapper for diagnosis and wellness features

import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiInstance = null;
let geminiModel = null;

const DEFAULT_MODEL = 'gemini-1.5-flash';
const DEFAULT_CONFIG = {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 2048,
};

/**
 * Initializes the Google Gemini client.
 * @returns {GenerativeModel}
 */
export const initGemini = (modelName = DEFAULT_MODEL, generationConfig = DEFAULT_CONFIG) => {
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error('[GeminiClient] GOOGLE_API_KEY is not defined in environment variables.');
    }

    if (geminiModel) {
        return geminiModel;
    }

    geminiInstance = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    geminiModel = geminiInstance.getGenerativeModel({ model: modelName, generationConfig });

    console.log(`[GeminiClient] Initialized with model: ${modelName}`);
    return geminiModel;
};

/**
 * Generates a text response from a prompt string.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export const generateText = async (prompt) => {
    const model = initGemini();
    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error('[GeminiClient] Error generating text:', error.message);
        throw new Error(`Gemini text generation failed: ${error.message}`);
    }
};

/**
 * Generates a structured JSON response from a prompt.
 * Useful for symptom analysis and diagnosis sessions.
 * @param {string} prompt
 * @returns {Promise<object>}
 */
export const generateStructuredResponse = async (prompt) => {
    const jsonPrompt = `${prompt}\n\nRespond ONLY with valid JSON. Do not include any markdown formatting or code fences.`;
    const rawText = await generateText(jsonPrompt);

    try {
        return JSON.parse(rawText);
    } catch {
        // Attempt to extract JSON from response if it contains other text
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('[GeminiClient] Failed to parse structured JSON response from Gemini.');
    }
};

/**
 * Starts a multi-turn chat session with Gemini.
 * @param {Array<{role: string, parts: string}>} history
 * @returns {ChatSession}
 */
export const startGeminiChat = (history = []) => {
    const model = initGemini();
    return model.startChat({ history });
};

/**
 * Sends a message within an existing chat session.
 * @param {ChatSession} chatSession
 * @param {string} message
 * @returns {Promise<string>}
 */
export const sendChatMessage = async (chatSession, message) => {
    try {
        const result = await chatSession.sendMessage(message);
        return result.response.text();
    } catch (error) {
        console.error('[GeminiClient] Error sending chat message:', error.message);
        throw new Error(`Gemini chat message failed: ${error.message}`);
    }
};

/**
 * Counts the approximate token usage for a prompt.
 * @param {string} prompt
 * @returns {Promise<number>}
 */
export const countTokens = async (prompt) => {
    const model = initGemini();
    const result = await model.countTokens(prompt);
    return result.totalTokens;
};

export default { initGemini, generateText, generateStructuredResponse, startGeminiChat, sendChatMessage, countTokens };
