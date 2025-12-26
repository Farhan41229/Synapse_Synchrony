// aiClients/aiRouter.js
// Routes AI requests to the appropriate provider based on task type and availability

import { generateText, generateStructuredResponse } from './geminiClient.js';
import { groqCompletion, generateWellnessTip } from './groqClient.js';
import { analyzeSentiment, detectEmotion } from './huggingfaceClient.js';

/**
 * AI task categories mapped to their preferred providers.
 */
export const AI_TASK = {
    DIAGNOSIS: 'diagnosis',
    WELLNESS_TIP: 'wellness_tip',
    CHAT: 'chat',
    SENTIMENT: 'sentiment',
    EMOTION: 'emotion',
    SUMMARIZE: 'summarize',
    BLOG_ASSIST: 'blog_assist',
};

/**
 * Routes an AI request to the appropriate provider based on task type.
 * Falls back to alternative providers if primary fails.
 *
 * @param {string} task - One of the AI_TASK constants
 * @param {object} payload - Task-specific payload
 * @returns {Promise<any>}
 */
export const routeAIRequest = async (task, payload) => {
    console.log(`[AIRouter] Routing task: ${task}`);

    switch (task) {
        case AI_TASK.DIAGNOSIS: {
            // Prefer Gemini for structured medical diagnosis responses
            try {
                return await generateStructuredResponse(payload.prompt);
            } catch (err) {
                console.warn('[AIRouter] Gemini failed for diagnosis, falling back to Groq:', err.message);
                return await groqCompletion(
                    [{ role: 'user', content: payload.prompt }],
                    { systemPrompt: payload.systemPrompt }
                );
            }
        }

        case AI_TASK.WELLNESS_TIP: {
            try {
                return await generateWellnessTip(payload.context);
            } catch (err) {
                console.warn('[AIRouter] Groq failed for wellness, falling back to Gemini:', err.message);
                return await generateText(`Provide a wellness tip for: ${payload.context}`);
            }
        }

        case AI_TASK.CHAT: {
            // Use Groq for fast conversational responses
            return await groqCompletion(payload.messages, {
                systemPrompt: payload.systemPrompt,
                temperature: 0.75,
            });
        }

        case AI_TASK.SENTIMENT: {
            return await analyzeSentiment(payload.text);
        }

        case AI_TASK.EMOTION: {
            return await detectEmotion(payload.text);
        }

        case AI_TASK.BLOG_ASSIST: {
            return await generateText(payload.prompt);
        }

        default:
            throw new Error(`[AIRouter] Unknown AI task type: "${task}"`);
    }
};

export default { routeAIRequest, AI_TASK };
