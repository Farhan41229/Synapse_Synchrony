// transformers/eventTransformer.js
// Shape event documents for API responses

import { toPublicUser } from './userTransformer.js';

/**
 * Full event response.
 * @param {object} event - populated Mongoose document
 * @param {string} [requestingUserId]
 */
export const toEventResponse = (event, requestingUserId) => {
    const raw = event?.toObject ? event.toObject() : { ...event };

    const isRegistered = requestingUserId
        ? (raw.registeredUsers ?? []).some((id) => id?.toString() === requestingUserId)
        : false;

    const isFull =
        raw.capacity != null
            ? (raw.registeredUsers ?? []).length >= raw.capacity
            : false;

    const isUpcoming = raw.startDate ? new Date(raw.startDate) > new Date() : false;
    const isCompleted = raw.endDate ? new Date(raw.endDate) < new Date() : false;

    return {
        _id: raw._id?.toString(),
        title: raw.title,
        description: raw.description,
        location: raw.location,
        startDate: raw.startDate,
        endDate: raw.endDate,
        capacity: raw.capacity ?? null,
        eventType: raw.eventType,
        isOnline: raw.isOnline ?? false,
        image: raw.image ?? null,
        organiser: raw.organiser ? toPublicUser(raw.organiser) : null,
        registeredCount: (raw.registeredUsers ?? []).length,
        isRegistered,
        isFull,
        isUpcoming,
        isCompleted,
        status: raw.status ?? (isCompleted ? 'completed' : isUpcoming ? 'upcoming' : 'ongoing'),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
    };
};

/**
 * Minimal event card for list views.
 * @param {object} event
 */
export const toEventCard = (event) => {
    const raw = event?.toObject ? event.toObject() : { ...event };
    return {
        _id: raw._id?.toString(),
        title: raw.title,
        location: raw.location,
        startDate: raw.startDate,
        eventType: raw.eventType,
        image: raw.image ?? null,
        registeredCount: (raw.registeredUsers ?? []).length,
        capacity: raw.capacity ?? null,
    };
};

export default { toEventResponse, toEventCard };
