import type { GenerationParameters, PostProcessingParameters } from './components/MusicGenerator/types';

// ==================================================================================
// 🎵 GLOBAL CONFIGURATION
// ==================================================================================

/**
 * API Configuration
 * 
 * Replace the BASE_URL with your specific Lightning AI or backend URL.
 * Ensure there is NO trailing slash.
 */
export const API_CONFIG = {
    // ⚡ CHANGE THIS URL TO YOUR SPECIFIC LIGHTNING AI ENDPOINT ⚡
    BASE_URL: "https://8000-01k3t9ggdeegcaqcpmfwpc5a3k.cloudspaces.litng.ai",

    // Endpoints (usually these don't need changing)
    ENDPOINTS: {
        GENERATE: "/generate",
        POST_PROCESS: "/postprocess",
    },
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
    HISTORY: 'musicGenerationHistory',
};

/**
 * Default Music Generation Parameters
 */
export const DEFAULT_GENERATION_PARAMS: GenerationParameters = {
    prompt: "",
    duration: 20,
};

/**
 * Default Post-Processing / Advanced Parameters
 */
export const DEFAULT_POST_PROCESSING_PARAMS: PostProcessingParameters = {
    reverb: 0,
    bassBoost: 0,
    treble: 0,
    speed: 1.0,
    temperature: 1.0,
    cfgCoef: 8.0,
    topK: 250,
    topP: 0.0,
    useSampling: true,
};
