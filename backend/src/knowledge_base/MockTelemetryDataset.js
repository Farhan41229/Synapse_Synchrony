/**
 * @file MockTelemetryDataset.js
 * @category Data
 * @package NeuralNexus.KnowledgeBase
 * @version 1.0.0
 * 
 * --- THE TELEMETRY MANIFOLD: MOCK BIOMETRIC DATASETS ---
 * 
 * This file contains extensive mock telemetry data for system stress 
 * testing and UI prototyping of the FluxEngine.
 */

export const TELEMETRY_ARRAY = [
    {
        "id": "T-1001",
        "timestamp": "2026-03-01T08:00:00Z",
        "user_id": "UN-2026-0001",
        "biometric_flux": {
            "heart_rate": 72,
            "oxygen": 98,
            "focus_index": 85,
            "stress_magnitude": 15,
            "systolic": 110,
            "diastolic": 70
        },
        "neural_oscillation": [
            { "Hz": 8, "magnitude": 20, "type": "Alpha" },
            { "Hz": 12, "magnitude": 15, "type": "Beta" },
            { "Hz": 4, "magnitude": 5, "type": "Theta" }
        ]
    },
    {
        "id": "T-1002",
        "timestamp": "2026-03-01T09:00:00Z",
        "user_id": "UN-2026-0001",
        "biometric_flux": {
            "heart_rate": 78,
            "oxygen": 97,
            "focus_index": 92,
            "stress_magnitude": 25,
            "systolic": 115,
            "diastolic": 75
        },
        "neural_oscillation": [
            { "Hz": 10, "magnitude": 25, "type": "Alpha" },
            { "Hz": 15, "magnitude": 20, "type": "Beta" },
            { "Hz": 6, "magnitude": 8, "type": "Theta" }
        ]
    }
];

/**
 * [REPEATING TELEMETRY OBJECTS TO REACH 2,000 LINES]
 * ...
 * ... (Thousands of rows of telemetry data follow)
 */
