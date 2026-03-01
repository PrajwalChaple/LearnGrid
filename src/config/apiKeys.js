// ============================================================
// 🔑 CENTRALIZED API KEYS CONFIGURATION
// ============================================================
// All API keys in one place for easy management.
// To add/remove keys, simply edit the arrays below.
// The system will automatically rotate through available keys.
// ============================================================

/**
 * Gemini API Keys - Round-robin rotation with automatic failover.
 * If one key hits rate limit, the next key is tried automatically.
 * Add or remove keys from this array as needed.
 */
export const GEMINI_API_KEYS = [
    'AIzaSyD8xTm2yiH57fj23PIchQtBcx5MyWRgL0k',  // Key 1 (Original)
    'AIzaSyCzjYiCJox-rVs_PoWgeuvz1RVcuWFGzzo',  // Key 2
    'AIzaSyBhAoyoiZIlCZGR8TZUvgls6ACM09m5fJw',  // Key 3
    'AIzaSyCdlCa9_KTcCSvAbJRn2z11lHG5Vrmr5Ns',  // Key 4
    'AIzaSyCv8aSAOY1_EmGlWW6cZhDecQY4YEyf8SI',  // Key 5
    'AIzaSyBrUGl0Kad3cFHuy6z98yHafRAe2PyO2_c',  // Key 6
    'AIzaSyD_V3Pzr_DrbrCxgkAUwGfKstoKYNC6vO8',  // Key 7
    'AIzaSyDIL64MSsWFrJTaNOglGYVUdFcyPYMZVY8',  // Key 8
];

/**
 * OpenAI API Key - Used as absolute last fallback if ALL Gemini keys fail.
 */
export const OPENAI_API_KEY = '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';

/**
 * Gemini Model to use for text generation.
 */
export const GEMINI_MODEL = 'gemini-2.5-flash';

// ============================================================
// 🔄 ROUND-ROBIN KEY ROTATION LOGIC
// ============================================================
// Tracks which key to use next. Persists across calls within the session.

let _currentKeyIndex = 0;

/**
 * Get the next Gemini API key in round-robin order.
 * @returns {string} The next API key
 */
export function getNextGeminiKey() {
    const key = GEMINI_API_KEYS[_currentKeyIndex];
    _currentKeyIndex = (_currentKeyIndex + 1) % GEMINI_API_KEYS.length;
    return key;
}

/**
 * Try a Gemini API call with automatic key rotation on failure.
 * Tries each key once. If all fail, returns null.
 * 
 * @param {string} prompt - The text prompt to send
 * @param {number} timeoutMs - Timeout in milliseconds (default 12000)
 * @returns {Promise<object|null>} - The API response data, or null if all keys failed
 */
export async function callGeminiWithRotation(prompt, timeoutMs = 12000) {
    const totalKeys = GEMINI_API_KEYS.length;
    let lastError = null;

    for (let attempt = 0; attempt < totalKeys; attempt++) {
        const apiKey = getNextGeminiKey();

        try {
            const fetchPromise = fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.9 }
                    })
                }
            );

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Gemini Timeout')), timeoutMs)
            );

            const response = await Promise.race([fetchPromise, timeoutPromise]);

            // If rate limited (429) or server error (5xx), try next key
            if (response.status === 429 || response.status >= 500) {
                console.warn(`Gemini key ...${apiKey.slice(-6)} hit limit (${response.status}), trying next key...`);
                lastError = new Error(`HTTP ${response.status}`);
                continue;
            }

            const data = await response.json();

            if (!data.candidates || !data.candidates[0]) {
                console.warn(`Gemini key ...${apiKey.slice(-6)} returned invalid response, trying next key...`);
                lastError = new Error('Invalid Gemini Response');
                continue;
            }

            // Success!
            return data;

        } catch (error) {
            console.warn(`Gemini key ...${apiKey.slice(-6)} failed: ${error.message}, trying next key...`);
            lastError = error;
            continue;
        }
    }

    console.error(`All ${totalKeys} Gemini keys exhausted. Last error:`, lastError?.message);
    return null;
}
