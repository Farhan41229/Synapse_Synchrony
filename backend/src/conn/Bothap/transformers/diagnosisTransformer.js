// transformers/diagnosisTransformer.js
// Shape AI medical diagnosis results for API responses

/**
 * Confidence label from numeric score.
 * @param {number} score - 0-1
 * @returns {'high'|'moderate'|'low'}
 */
export const confidenceLabel = (score) => {
    if (score >= 0.75) return 'high';
    if (score >= 0.4) return 'moderate';
    return 'low';
};

/**
 * Transform a raw diagnosis result from the AI into a clean API response.
 * @param {string} rawAiText - full AI response text
 * @param {string[]} symptoms - original symptom list
 * @param {object} [userContext] - age, gender, etc.
 */
export const toDiagnosisResponse = (rawAiText, symptoms, userContext = {}) => ({
    symptoms,
    userContext,
    assessment: rawAiText.trim(),
    disclaimer:
        'This is an AI-generated assessment for informational purposes only. ' +
        'It is NOT a substitute for professional medical advice. ' +
        'Always consult a qualified healthcare professional.',
    generatedAt: new Date().toISOString(),
});

/**
 * Build a structured prompt for the AI diagnosis.
 * @param {string[]} symptoms
 * @param {object} context
 */
export const buildDiagnosisPrompt = (symptoms, context = {}) => {
    const lines = [`Symptoms: ${symptoms.join(', ')}`];
    if (context.age) lines.push(`Patient age: ${context.age}`);
    if (context.gender) lines.push(`Gender: ${context.gender}`);
    if (context.existingConditions?.length) {
        lines.push(`Existing conditions: ${context.existingConditions.join(', ')}`);
    }
    if (context.durationDays != null) lines.push(`Duration: ${context.durationDays} day(s)`);
    if (context.severity) lines.push(`Severity: ${context.severity}`);

    return (
        lines.join('\n') +
        '\n\nProvide a clear, structured health assessment with possible conditions, urgency level, and recommended next steps. ' +
        'Always include the disclaimer that this is not medical advice.'
    );
};

/**
 * Parse a saved diagnosis document for the history list.
 * @param {object} doc
 */
export const toHistoryEntry = (doc) => {
    const raw = doc?.toObject ? doc.toObject() : { ...doc };
    return {
        _id: raw._id?.toString(),
        symptoms: raw.symptoms ?? [],
        assessment: (raw.assessment ?? '').slice(0, 200) + '…',
        isFavourite: raw.isFavourite ?? false,
        createdAt: raw.createdAt,
    };
};

export default { confidenceLabel, toDiagnosisResponse, buildDiagnosisPrompt, toHistoryEntry };
