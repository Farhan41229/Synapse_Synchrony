// transformers/tokenTransformer.js
// Shape authentication token responses for Synapse Synchrony login/refresh flows

/**
 * Build an auth token response payload for the frontend.
 * @param {string} accessToken
 * @param {object} user - sanitised public user object
 * @param {boolean} [rememberMe]
 */
export const toAuthResponse = (accessToken, user, rememberMe = false) => ({
    accessToken,
    tokenType: 'Bearer',
    user,
    rememberMe,
    issuedAt: new Date().toISOString(),
});

/**
 * Build a refresh-token success response.
 * @param {string} newAccessToken
 * @param {object} user
 */
export const toRefreshResponse = (newAccessToken, user) => ({
    accessToken: newAccessToken,
    tokenType: 'Bearer',
    user,
    refreshedAt: new Date().toISOString(),
});

/**
 * Build a token-for-stream-chat response.
 * @param {string} streamToken
 * @param {string} userId
 */
export const toStreamTokenResponse = (streamToken, userId) => ({
    token: streamToken,
    userId,
    generatedAt: new Date().toISOString(),
});

/**
 * Shape a session invalidation (logout) response.
 */
export const toLogoutResponse = () => ({
    success: true,
    message: 'You have been successfully logged out.',
    loggedOutAt: new Date().toISOString(),
});

export default { toAuthResponse, toRefreshResponse, toStreamTokenResponse, toLogoutResponse };
