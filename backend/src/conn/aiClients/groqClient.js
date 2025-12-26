// aiClients/groqClient.js
// Groq AI client wrapper for fast LLM inference (Llama, Mixtral models)

import Groq from 'groq-sdk';

let groqInstance = null;

const DEFAULT_MODEL = 'llama3-70b-8192';
const FALLBACK_MODEL = 'mixtral-8x7b-32768';

/**
 * Initializes and returns the Groq client singleton.
 */
export const getGroqClient = () => {
    if (groqInstance) return groqInstance;

    if (!process.env.GROQ_API_KEY) {
        throw new Error('[GroqClient] GROQ_API_KEY is not defined in environment variables.');
    }

    groqInstance = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log('[GroqClient] Groq client initialized.');
    return groqInstance;
};

/**
 * Sends a completion request to Groq.
 * @param {Array<{role: string, content: string}>} messages
 * @param {object} options
 * @returns {Promise<string>} - The assistant's reply content
 */
export const groqCompletion = async (messages, options = {}) => {
    const client = getGroqClient();
    const {
        model = DEFAULT_MODEL,
        temperature = 0.7,
        maxTokens = 1024,
        systemPrompt = null,
    } = options;

    const fullMessages = systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages;

    try {
        const response = await client.chat.completions.create({
            model,
            messages: fullMessages,
            temperature,
            max_tokens: maxTokens,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('[GroqClient] Empty response from Groq API.');

        return content;
    } catch (error) {
        if (error.status === 429) {
            console.warn(`[GroqClient] Rate limited on model ${model}. Trying fallback: ${FALLBACK_MODEL}`);
            const fallbackResponse = await client.chat.completions.create({
                model: FALLBACK_MODEL,
                messages: fullMessages,
                temperature,
                max_tokens: maxTokens,
            });
            return fallbackResponse.choices[0]?.message?.content || '';
        }

        console.error('[GroqClient] Error calling Groq API:', error.message);
        throw new Error(`Groq API call failed: ${error.message}`);
    }
};

/**
 * Generates a mental health wellness tip from Groq.
 * @param {string} userContext - User's mood/stress data context
 * @returns {Promise<string>}
 */
export const generateWellnessTip = async (userContext) => {
    const systemPrompt = `You are Synapse, a compassionate mental health AI assistant. 
Provide a brief, actionable wellness tip (2-3 sentences max) based on the user's context. 
Always be empathetic, positive, and evidence-based.`;

    const messages = [{ role: 'user', content: userContext }];
    return groqCompletion(messages, { systemPrompt, maxTokens: 200, temperature: 0.8 });
};

/**
 * Analyzes symptoms and returns a preliminary assessment.
 * @param {object} symptoms
 * @returns {Promise<string>}
 */
export const analyzeSymptoms = async (symptoms) => {
    const systemPrompt = `You are a medical AI assistant for Synapse Synchrony. 
Analyze the provided symptoms and give a preliminary assessment. 
Always recommend professional medical consultation.`;

    const messages = [
        { role: 'user', content: `Symptoms: ${JSON.stringify(symptoms, null, 2)}` },
    ];

    return groqCompletion(messages, { systemPrompt, maxTokens: 512, temperature: 0.4 });
};

export default { getGroqClient, groqCompletion, generateWellnessTip, analyzeSymptoms };
