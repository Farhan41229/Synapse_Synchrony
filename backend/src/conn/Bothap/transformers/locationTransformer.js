// transformers/locationTransformer.js
// Shape raw GPS coordinates and location message data

/**
 * Normalize a location payload (from chat message or event).
 * @param {object} loc
 */
export const toLocationData = (loc = {}) => ({
    lat: parseFloat(loc.lat ?? loc.latitude ?? 0),
    lon: parseFloat(loc.lon ?? loc.longitude ?? 0),
    address: loc.address ?? null,
    placeName: loc.placeName ?? loc.place ?? null,
    accuracy: loc.accuracy ?? null,
});

/**
 * Build a Google Maps URL from lat/lon.
 * @param {number} lat
 * @param {number} lon
 * @param {string} [label]
 */
export const toGoogleMapsUrl = (lat, lon, label = '') => {
    const encoded = encodeURIComponent(label || `${lat},${lon}`);
    return `https://www.google.com/maps?q=${lat},${lon}&label=${encoded}`;
};

/**
 * Build an OpenStreetMap URL from lat/lon.
 * @param {number} lat
 * @param {number} lon
 * @param {number} [zoom]
 */
export const toOsmUrl = (lat, lon, zoom = 15) =>
    `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;

/**
 * Transform a location document for an API response.
 * @param {object} locationMsg - message document with location field
 */
export const toLocationMessageResponse = (locationMsg) => {
    const raw = locationMsg?.toObject ? locationMsg.toObject() : { ...locationMsg };
    const loc = raw.location ?? {};
    return {
        _id: raw._id?.toString(),
        lat: loc.lat,
        lon: loc.lon,
        address: loc.address ?? null,
        placeName: loc.placeName ?? null,
        googleMapsUrl: toGoogleMapsUrl(loc.lat, loc.lon, loc.placeName),
        osmUrl: toOsmUrl(loc.lat, loc.lon),
        createdAt: raw.createdAt,
    };
};

export default { toLocationData, toGoogleMapsUrl, toOsmUrl, toLocationMessageResponse };
