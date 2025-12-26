// aiClients/huggingfaceClient.js
// HuggingFace Inference client for NLP-based mental health features

import { HfInference } from '@huggingface/inference';

let hfInstance = null;

/**
 * Returns the HuggingFace Inference client singleton.
 */
export const getHfClient = () => {
    if (hfInstance) return hfInstance;

    if (!process.env.HUGGINGFACE_API_KEY) {
        console.warn('[HuggingFaceClient] HUGGINGFACE_API_KEY not set. Using public rate-limited API.');
        hfInstance = new HfInference();
    } else {
        hfInstance = new HfInference(process.env.HUGGINGFACE_API_KEY);
    }

    console.log('[HuggingFaceClient] HuggingFace Inference client initialized.');
    return hfInstance;
};

const MODELS = {
    SENTIMENT: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
    EMOTION: 'j-hartmann/emotion-english-distilroberta-base',
    SUMMARIZE: 'facebook/bart-large-cnn',
    ZERO_SHOT: 'facebook/bart-large-mnli',
    TEXT_GENERATION: 'mistralai/Mistral-7B-Instruct-v0.1',
};

/**
 * Classifies the sentiment of a text string.
 * @param {string} text
 * @returns {Promise<Array<{label: string, score: number}>>}
 */
export const analyzeSentiment = async (text) => {
    const hf = getHfClient();
    try {
        const result = await hf.textClassification({
            model: MODELS.SENTIMENT,
            inputs: text,
        });
        return result;
    } catch (error) {
        console.error('[HuggingFaceClient] Sentiment analysis error:', error.message);
        throw error;
    }
};

/**
 * Detects the primary emotion expressed in a text.
 * @param {string} text
 * @returns {Promise<Array<{label: string, score: number}>>}
 */
export const detectEmotion = async (text) => {
    const hf = getHfClient();
    try {
        const result = await hf.textClassification({
            model: MODELS.EMOTION,
            inputs: text,
        });
        return result;
    } catch (error) {
        console.error('[HuggingFaceClient] Emotion detection error:', error.message);
        throw error;
    }
};

/**
 * Summarizes a long text passage (e.g., session notes or blog post).
 * @param {string} text
 * @param {number} maxLength
 * @returns {Promise<string>}
 */
export const summarizeText = async (text, maxLength = 150) => {
    const hf = getHfClient();
    try {
        const result = await hf.summarization({
            model: MODELS.SUMMARIZE,
            inputs: text,
            parameters: { max_length: maxLength, min_length: 30 },
        });
        return result.summary_text;
    } catch (error) {
        console.error('[HuggingFaceClient] Summarization error:', error.message);
        throw error;
    }
};

/**
 * Classifies text into one of the given candidate labels (zero-shot).
 * @param {string} text
 * @param {string[]} candidateLabels
 * @returns {Promise<object>}
 */
export const classifyZeroShot = async (text, candidateLabels) => {
    const hf = getHfClient();
    try {
        const result = await hf.zeroShotClassification({
            model: MODELS.ZERO_SHOT,
            inputs: text,
            parameters: { candidate_labels: candidateLabels },
        });
        return result;
    } catch (error) {
        console.error('[HuggingFaceClient] Zero-shot classification error:', error.message);
        throw error;
    }
};

export default { getHfClient, analyzeSentiment, detectEmotion, summarizeText, classifyZeroShot };
