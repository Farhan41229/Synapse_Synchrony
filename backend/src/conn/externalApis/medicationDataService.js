// externalApis/medicationDataService.js
// Service for fetching and caching medication data from external sources

import { httpClient } from './axiosClient.js';
import cache from '../cache/cacheManager.js';
import { CacheKeys, TTL } from '../cache/cacheKeys.js';

const OPENFDA_BASE = 'https://api.fda.gov/drug';

/**
 * Searches the OpenFDA API for drug information.
 * Falls back to mock BD medication data if unavailable.
 * @param {string} query - Drug name or active ingredient
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export const searchMedication = async (query, limit = 10) => {
    const cacheKey = CacheKeys.medication.search(query);
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await httpClient.get(`${OPENFDA_BASE}/label.json`, {
            params: {
                search: `openfda.brand_name:"${query}" OR openfda.generic_name:"${query}"`,
                limit,
            },
            timeout: 8000,
        });

        const results = (response.data.results || []).map((item) => ({
            brandName: item.openfda?.brand_name?.[0] || 'N/A',
            genericName: item.openfda?.generic_name?.[0] || 'N/A',
            manufacturer: item.openfda?.manufacturer_name?.[0] || 'N/A',
            indications: item.indications_and_usage?.[0]?.substring(0, 400) || 'See package insert.',
            warnings: item.warnings?.[0]?.substring(0, 300) || 'Consult your doctor.',
            dosage: item.dosage_and_administration?.[0]?.substring(0, 300) || 'As directed.',
            source: 'OpenFDA',
        }));

        cache.set(cacheKey, results, TTL.LONG);
        return results;
    } catch (error) {
        console.warn(`[MedDataService] OpenFDA search failed for "${query}". Using fallback.`);
        return getMockBDMedications(query);
    }
};

/**
 * Returns mock Bangladesh-specific medication data for common drugs.
 * Used as a fallback when external API is unavailable.
 * @param {string} query
 * @returns {Array}
 */
const getMockBDMedications = (query) => {
    const bdMeds = [
        { brandName: 'Napa', genericName: 'Paracetamol', manufacturer: 'Beximco', dosage: '500mg, 1-2 tablets every 4-6 hours' },
        { brandName: 'Ace', genericName: 'Paracetamol', manufacturer: 'Square', dosage: '500mg every 4-6 hours' },
        { brandName: 'Seclo', genericName: 'Omeprazole', manufacturer: 'Square', dosage: '20mg once daily before breakfast' },
        { brandName: 'Amdocal', genericName: 'Amlodipine', manufacturer: 'ACI', dosage: '5mg once daily' },
        { brandName: 'Calbo-D', genericName: 'Calcium + Vitamin D3', manufacturer: 'Renata', dosage: '1 tablet after meal' },
    ];

    const q = query.toLowerCase();
    return bdMeds.filter(
        (m) =>
            m.brandName.toLowerCase().includes(q) ||
            m.genericName.toLowerCase().includes(q)
    );
};

export default { searchMedication };
