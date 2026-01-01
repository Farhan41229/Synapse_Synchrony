// externalApis/geolocationService.js
// Geolocation service for resolving coordinates and finding nearby healthcare facilities

import { geoClient } from './axiosClient.js';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Reverse geocodes coordinates to get a human-readable address.
 * @param {number} lat
 * @param {number} lng
 * @returns {Promise<object>}
 */
export const reverseGeocode = async (lat, lng) => {
    if (!GOOGLE_MAPS_API_KEY) {
        console.warn('[GeoService] GOOGLE_MAPS_API_KEY not set. Returning mock data.');
        return { formatted_address: `${lat}, ${lng} (Geocoding unavailable)`, components: [] };
    }

    try {
        const response = await geoClient.get('/geocode/json', {
            params: { latlng: `${lat},${lng}`, key: GOOGLE_MAPS_API_KEY, language: 'en' },
        });

        const results = response.data.results;
        if (!results || results.length === 0) {
            return { formatted_address: 'Unknown location', components: [] };
        }

        const primaryResult = results[0];
        return {
            formatted_address: primaryResult.formatted_address,
            place_id: primaryResult.place_id,
            components: primaryResult.address_components,
        };
    } catch (error) {
        console.error('[GeoService] Reverse geocoding error:', error.message);
        throw new Error(`Geocoding failed: ${error.message}`);
    }
};

/**
 * Searches for nearby hospitals or clinics.
 * @param {number} lat
 * @param {number} lng
 * @param {number} radiusMeters
 * @returns {Promise<Array>}
 */
export const findNearbyHospitals = async (lat, lng, radiusMeters = 5000) => {
    if (!GOOGLE_MAPS_API_KEY) {
        console.warn('[GeoService] Google Maps API key not set.');
        return [];
    }

    try {
        const response = await geoClient.get('/place/nearbysearch/json', {
            params: {
                location: `${lat},${lng}`,
                radius: radiusMeters,
                type: 'hospital',
                key: GOOGLE_MAPS_API_KEY,
            },
        });

        return (response.data.results || []).map((place) => ({
            name: place.name,
            placeId: place.place_id,
            address: place.vicinity,
            rating: place.rating,
            location: place.geometry?.location,
            isOpen: place.opening_hours?.open_now,
        }));
    } catch (error) {
        console.error('[GeoService] Nearby hospitals search failed:', error.message);
        return [];
    }
};

/**
 * Validates coordinates are within Bangladesh's geographic boundaries.
 * @param {number} lat
 * @param {number} lng
 * @returns {boolean}
 */
export const isWithinBangladesh = (lat, lng) => {
    // Approximate bounding box for Bangladesh
    const BD_BOUNDS = { minLat: 20.3, maxLat: 26.7, minLng: 88.0, maxLng: 92.7 };
    return lat >= BD_BOUNDS.minLat && lat <= BD_BOUNDS.maxLat &&
        lng >= BD_BOUNDS.minLng && lng <= BD_BOUNDS.maxLng;
};

export default { reverseGeocode, findNearbyHospitals, isWithinBangladesh };
