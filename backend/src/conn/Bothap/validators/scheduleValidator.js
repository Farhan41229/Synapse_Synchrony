// validators/scheduleValidator.js
// Validation schemas for academic schedule management

import { z } from 'zod';
import { validateBody } from './authValidator.js';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const scheduleSlotSchema = z.object({
    subject: z
        .string({ required_error: 'Subject name is required.' })
        .min(2, 'Subject must be at least 2 characters.')
        .max(80, 'Subject must not exceed 80 characters.')
        .trim(),
    day: z.enum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], {
        required_error: 'Day of week is required.',
    }),
    startTime: z
        .string({ required_error: 'Start time is required.' })
        .regex(TIME_REGEX, 'Start time must be in HH:MM format.'),
    endTime: z
        .string({ required_error: 'End time is required.' })
        .regex(TIME_REGEX, 'End time must be in HH:MM format.'),
    room: z.string().max(50).optional(),
    instructor: z.string().max(80).optional(),
    courseCode: z.string().max(20).optional(),
    color: z
        .string()
        .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
        .optional(),
}).refine(
    (d) => d.startTime < d.endTime,
    { message: 'End time must be after start time.', path: ['endTime'] }
);

export const updateScheduleSlotSchema = scheduleSlotSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be updated.' }
);

export const scheduleUploadSchema = z.object({
    semester: z.string().trim().min(1, 'Semester is required.').max(30),
    slots: z
        .array(scheduleSlotSchema)
        .min(1, 'At least one schedule slot is required.')
        .max(50, 'Maximum 50 slots per schedule.'),
});

export const scheduleSlotMiddleware = validateBody(scheduleSlotSchema);
export const scheduleUploadMiddleware = validateBody(scheduleUploadSchema);

export default {
    scheduleSlotSchema,
    updateScheduleSlotSchema,
    scheduleUploadSchema,
    scheduleSlotMiddleware,
    scheduleUploadMiddleware,
};
