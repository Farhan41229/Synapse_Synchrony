// transformers/wellnessTransformer.js
// Shape mood/stress log documents and build wellness analytics

/**
 * Mood numeric mapping (higher = better).
 */
export const MOOD_VALUES = {
    very_happy: 5,
    happy: 4,
    neutral: 3,
    sad: 2,
    very_sad: 1,
};

/**
 * Transform a mood log document for API response.
 * @param {object} log
 */
export const toMoodLogResponse = (log) => {
    const raw = log?.toObject ? log.toObject() : { ...log };
    return {
        _id: raw._id?.toString(),
        mood: raw.mood,
        moodValue: MOOD_VALUES[raw.mood] ?? 3,
        note: raw.note ?? null,
        energy: raw.energy ?? null,
        loggedAt: raw.loggedAt ?? raw.createdAt,
        createdAt: raw.createdAt,
    };
};

/**
 * Transform a stress log document for API response.
 * @param {object} log
 */
export const toStressLogResponse = (log) => {
    const raw = log?.toObject ? log.toObject() : { ...log };
    return {
        _id: raw._id?.toString(),
        stressLevel: raw.stressLevel,
        triggers: raw.triggers ?? [],
        note: raw.note ?? null,
        loggedAt: raw.loggedAt ?? raw.createdAt,
        createdAt: raw.createdAt,
    };
};

/**
 * Compute a weekly summary from an array of mood logs.
 * @param {object[]} logs
 */
export const computeMoodSummary = (logs = []) => {
    if (logs.length === 0) return null;
    const values = logs.map((l) => MOOD_VALUES[l.mood] ?? 3);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    const distribution = Object.fromEntries(
        Object.keys(MOOD_VALUES).map((m) => [m, logs.filter((l) => l.mood === m).length])
    );

    return {
        averageMood: parseFloat(avg.toFixed(2)),
        totalLogs: logs.length,
        distribution,
        trend: values.length >= 2 ? (values[values.length - 1] - values[0] > 0 ? 'improving' : 'declining') : 'stable',
    };
};

/**
 * Compute a weekly summary from stress logs.
 * @param {object[]} logs
 */
export const computeStressSummary = (logs = []) => {
    if (logs.length === 0) return null;
    const levels = logs.map((l) => l.stressLevel);
    const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
    const allTriggers = logs.flatMap((l) => l.triggers ?? []);
    const topTriggers = [...new Set(allTriggers)].slice(0, 5);

    return {
        averageStress: parseFloat(avg.toFixed(2)),
        totalLogs: logs.length,
        topTriggers,
        peak: Math.max(...levels),
    };
};

export default {
    MOOD_VALUES,
    toMoodLogResponse,
    toStressLogResponse,
    computeMoodSummary,
    computeStressSummary,
};
