// streamChat/streamTokenController.js
// Express controller for issuing Stream Chat user tokens

import { generateStreamToken } from './streamClient.js';
import { HttpResponse } from '../../utils/HttpResponse.js';

/**
 * GET /api/stream/token
 * Issues a Stream Chat token for the authenticated user.
 * Requires the authenticate middleware to be applied before this controller.
 */
export const getStreamToken = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return HttpResponse(res, 401, true, 'Authentication required.');
        }

        const token = generateStreamToken(userId);

        return HttpResponse(res, 200, false, 'Stream token issued successfully.', {
            token,
            userId: userId.toString(),
        });
    } catch (error) {
        console.error('[StreamTokenController] Error issuing Stream token:', error.message);
        return HttpResponse(res, 500, true, 'Failed to issue Stream Chat token.');
    }
};

export default { getStreamToken };
