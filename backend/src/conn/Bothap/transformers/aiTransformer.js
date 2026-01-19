// transformers/aiTransformer.js
// Shape AI chat messages and summary results for Synapse Synchrony frontend

/**
 * Build the message history array expected by OpenAI chat completions.
 * Pulls the last N messages from a chat to stay within token limits.
 *
 * @param {object[]} messages - raw message documents (oldest first)
 * @param {string}   aiUserId - _id of the AI participant
 * @param {number}   [maxContext] - maximum messages to include
 * @returns {Array<{role: 'user'|'assistant', content: string}>}
 */
export const buildOpenAIHistory = (messages = [], aiUserId, maxContext = 20) => {
    const recent = messages.slice(-maxContext);

    return recent.map((msg) => {
        const isAI = msg.sender?._id?.toString() === aiUserId || msg.sender?.isAI;
        return {
            role: isAI ? 'assistant' : 'user',
            content: msg.content ?? '',
        };
    });
};

/**
 * Build the system prompt for the Synapse AI chat assistant.
 * @param {string} [userName]
 */
export const buildSystemPrompt = (userName = 'the user') => `
You are Synapse AI, a friendly, knowledgeable assistant embedded inside the Synapse Synchrony 
platform — a student collaboration and wellness app. Your role is to assist ${userName} with 
academic questions, mental wellness tips, scheduling advice, and general knowledge.

Guidelines:
- Be concise and clear.
- Use Markdown formatting where appropriate.
- If unsure, say so — never fabricate facts.
- Keep all responses student-friendly.
`.trim();

/**
 * Transform a raw AI summary API response into a clean client-facing object.
 * @param {string} rawSummary
 * @param {'blog'|'event'|'note'} type
 * @param {string} [title]
 */
export const toSummaryResponse = (rawSummary, type = 'blog', title = '') => ({
    type,
    title,
    summary: rawSummary.trim(),
    generatedAt: new Date().toISOString(),
});

/**
 * Truncate a message array to avoid exceeding max token limits.
 * @param {string} text
 * @param {number} [maxChars]
 */
export const truncateForAI = (text = '', maxChars = 12000) =>
    text.length <= maxChars ? text : `${text.slice(0, maxChars - 3)}...`;

export default { buildOpenAIHistory, buildSystemPrompt, toSummaryResponse, truncateForAI };
