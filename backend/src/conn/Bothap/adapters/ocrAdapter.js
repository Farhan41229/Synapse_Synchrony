// adapters/ocrAdapter.js
// Image-to-text OCR helper for Synapse Synchrony Notes (via OpenAI Vision)

import OpenAI from 'openai';

let _client = null;

const getClient = () => {
    if (_client) return _client;
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('[OcrAdapter] OPENAI_API_KEY is not defined.');
    _client = new OpenAI({ apiKey });
    return _client;
};

/**
 * Extract text from an image URL using GPT-4 Vision.
 * @param {string} imageUrl - publicly accessible image URL
 * @param {string} [language] - ISO 639-1 code e.g. 'en'
 * @returns {Promise<string>} extracted text
 */
export const extractTextFromUrl = async (imageUrl, language = 'en') => {
    const client = getClient();

    const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `Extract all text from this image accurately. The text language is "${language}". Return only the extracted text, no commentary.`,
                    },
                    { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
                ],
            },
        ],
        max_tokens: 2000,
    });

    return response.choices[0]?.message?.content?.trim() ?? '';
};

/**
 * Extract text from a base64 image.
 * @param {string} base64DataUri - data:image/jpeg;base64,...
 * @param {string} [language]
 * @returns {Promise<string>}
 */
export const extractTextFromBase64 = async (base64DataUri, language = 'en') => {
    const client = getClient();

    const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `Extract all text from this image in language "${language}". Return only the raw extracted text.`,
                    },
                    { type: 'image_url', image_url: { url: base64DataUri, detail: 'auto' } },
                ],
            },
        ],
        max_tokens: 2000,
    });

    return response.choices[0]?.message?.content?.trim() ?? '';
};

/**
 * Post-process extracted OCR text: remove double spaces, normalise line breaks.
 * @param {string} text
 */
export const cleanOcrText = (text = '') =>
    text
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

export default { extractTextFromUrl, extractTextFromBase64, cleanOcrText };
