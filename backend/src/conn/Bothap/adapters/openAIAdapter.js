// adapters/openAIAdapter.js
// Adapter for OpenAI API calls used in Synapse AI chat and summarisation

import OpenAI from 'openai';

let _openai = null;

const getClient = () => {
    if (_openai) return _openai;
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('[OpenAIAdapter] OPENAI_API_KEY is not defined.');
    _openai = new OpenAI({ apiKey });
    return _openai;
};

/**
 * Send a chat completion request to OpenAI.
 * @param {Array<{role: string, content: string}>} messages
 * @param {object} [options]
 * @returns {Promise<string>} model reply text
 */
export const chatCompletion = async (messages, options = {}) => {
    const client = getClient();
    const response = await client.chat.completions.create({
        model: options.model ?? 'gpt-4o-mini',
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 1024,
    });

    return response.choices[0]?.message?.content ?? '';
};

/**
 * Summarise a long text passage.
 * @param {string} text
 * @param {'blog'|'event'|'note'} [type]
 * @returns {Promise<string>}
 */
export const summariseText = async (text, type = 'blog') => {
    const systemPrompt = `You are a helpful assistant that summarises ${type} content for students. 
Be concise, accurate, and highlight key points in bullet form.`;

    return chatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Summarise the following:\n\n${text}` },
    ]);
};

/**
 * Transcribe audio to text using Whisper.
 * @param {Buffer} audioBuffer
 * @param {string} [filename]
 * @returns {Promise<string>}
 */
export const transcribeAudio = async (audioBuffer, filename = 'audio.webm') => {
    const client = getClient();
    const file = new File([audioBuffer], filename, { type: 'audio/webm' });

    const transcription = await client.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        language: 'en',
    });

    return transcription.text;
};

/**
 * Generate embedding vector for semantic search.
 * @param {string} input
 * @returns {Promise<number[]>}
 */
export const generateEmbedding = async (input) => {
    const client = getClient();
    const response = await client.embeddings.create({
        model: 'text-embedding-3-small',
        input,
    });
    return response.data[0].embedding;
};

export default { chatCompletion, summariseText, transcribeAudio, generateEmbedding };
