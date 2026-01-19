// transformers/scheduleTransformer.js
// Transform academic schedule documents for API responses

/**
 * Transform a single schedule slot document.
 * @param {object} slot
 */
export const toSlotResponse = (slot) => {
    const raw = slot?.toObject ? slot.toObject() : { ...slot };
    return {
        _id: raw._id?.toString(),
        subject: raw.subject,
        day: raw.day,
        startTime: raw.startTime,
        endTime: raw.endTime,
        room: raw.room ?? null,
        instructor: raw.instructor ?? null,
        courseCode: raw.courseCode ?? null,
        color: raw.color ?? null,
        durationMinutes: diffMinutes(raw.startTime, raw.endTime),
        owner: raw.owner?.toString(),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
    };
};

/**
 * Group slots by day of week.
 * @param {object[]} slots
 * @returns {Record<string, object[]>}
 */
export const groupByDay = (slots = []) => {
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const grouped = Object.fromEntries(DAYS.map((d) => [d, []]));

    for (const slot of slots) {
        const day = slot.day ?? 'Sunday';
        if (grouped[day]) {
            grouped[day].push(toSlotResponse(slot));
        }
    }

    for (const day of DAYS) {
        grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    return grouped;
};

/**
 * Calculate the duration in minutes between two HH:MM time strings.
 * @param {string} start - e.g. "09:00"
 * @param {string} end   - e.g. "10:30"
 * @returns {number}
 */
export const diffMinutes = (start, end) => {
    const [sh, sm] = (start ?? '00:00').split(':').map(Number);
    const [eh, em] = (end ?? '00:00').split(':').map(Number);
    return Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
};

/**
 * Detect any time conflicts in a list of slots for the same day.
 * @param {object[]} slots
 * @returns {Array<[object, object]>} pairs of conflicting slots
 */
export const detectConflicts = (slots = []) => {
    const conflicts = [];

    const toMinutes = (t) => {
        const [h, m] = (t ?? '00:00').split(':').map(Number);
        return h * 60 + m;
    };

    for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
            const a = slots[i];
            const b = slots[j];
            if (a.day !== b.day) continue;

            const aStart = toMinutes(a.startTime);
            const aEnd = toMinutes(a.endTime);
            const bStart = toMinutes(b.startTime);
            const bEnd = toMinutes(b.endTime);

            if (aStart < bEnd && bStart < aEnd) {
                conflicts.push([a, b]);
            }
        }
    }

    return conflicts;
};

export default { toSlotResponse, groupByDay, diffMinutes, detectConflicts };
