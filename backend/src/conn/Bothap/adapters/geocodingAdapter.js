// adapters/geocodingAdapter.js
// Wrapper for reverse geocoding in Synapse location messages

const BASE_URL = 'https://nominatim.openstreetmap.org';

const HEADERS = {
    'User-Agent': 'SynapseSynchrony/1.0 (contact@synapse.app)',
    Accept: 'application/json',
};

/**
 * Reverse geocode lat/lon to a human-readable address.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<{address: string, placeName: string}>}
 */
export const reverseGeocode = async (lat, lon) => {
    const url = `${BASE_URL}/reverse?lat=${lat}&lon=${lon}&format=json`;

    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`[GeocodingAdapter] Nominatim error: ${res.status}`);

    const data = await res.json();

    const addr = data.address ?? {};
    const placeName =
        addr.amenity ?? addr.building ?? addr.road ?? addr.suburb ?? 'Unknown Place';
    const address = data.display_name ?? `${lat}, ${lon}`;

    return { address, placeName };
};

/**
 * Forward geocode: convert a search string to lat/lon.
 * @param {string} query
 * @returns {Promise<{lat: number, lon: number, displayName: string}|null>}
 */
export const forwardGeocode = async (query) => {
    const encoded = encodeURIComponent(query);
    const url = `${BASE_URL}/search?q=${encoded}&format=json&limit=1`;

    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`[GeocodingAdapter] Forward geocode error: ${res.status}`);

    const data = await res.json();
    if (!data.length) return null;

    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name,
    };
};

/**
 * Calculate distance in km between two lat/lon pairs (Haversine).
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance in km
 */
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default { reverseGeocode, forwardGeocode, haversineDistance };
