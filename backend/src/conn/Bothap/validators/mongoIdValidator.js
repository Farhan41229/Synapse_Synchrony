// validators/mongoIdValidator.js
// Reusable MongoDB ObjectId validators for route params

import { z } from 'zod';

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

/**
 * Zod schema for a single Mongo ObjectId string.
 * @param {string} [fieldName] - used in error messages
 */
export const mongoIdSchema = (fieldName = 'id') =>
    z
        .string({ required_error: `${fieldName} is required.` })
        .regex(OBJECT_ID_REGEX, `${fieldName} must be a valid 24-character ObjectId.`);

/**
 * Validate a single :id route param.
 */
export const validateMongoId = (paramName = 'id') => (req, res, next) => {
    const value = req.params[paramName];
    if (!value || !OBJECT_ID_REGEX.test(value)) {
        return res.status(400).json({
            success: false,
            message: `Invalid ${paramName}: must be a valid 24-character MongoDB ObjectId.`,
        });
    }
    next();
};

/**
 * Validate multiple param names simultaneously.
 * @param {string[]} paramNames
 */
export const validateMultipleIds = (...paramNames) => (req, res, next) => {
    for (const name of paramNames) {
        const val = req.params[name];
        if (!val || !OBJECT_ID_REGEX.test(val)) {
            return res.status(400).json({
                success: false,
                message: `Invalid ${name}: expected a valid MongoDB ObjectId.`,
            });
        }
    }
    next();
};

/**
 * Validate a list of ObjectId strings (e.g. from JSON body array).
 * @param {string[]} ids
 * @throws {Error} if any id is invalid
 */
export const assertValidIds = (ids) => {
    const invalid = ids.filter((id) => !OBJECT_ID_REGEX.test(id));
    if (invalid.length > 0) {
        throw new Error(`Invalid ObjectId(s): ${invalid.join(', ')}`);
    }
};

export default { mongoIdSchema, validateMongoId, validateMultipleIds, assertValidIds };
