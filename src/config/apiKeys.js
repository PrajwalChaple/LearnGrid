// ============================================================
// 🔑 CENTRALIZED API KEYS CONFIGURATION
// ============================================================
// All API keys are loaded from environment variables (.env file).
// To add/remove keys, edit the .env file and update this array.
// The system will automatically rotate through available keys.
// ============================================================

/**
 * Gemini API Keys - Round-robin rotation with automatic failover.
 * If one key hits rate limit, the next key is tried automatically.
 * Keys are loaded from .env (VITE_GEMINI_KEY_1, VITE_GEMINI_KEY_2, etc.)
 */
export const GEMINI_API_KEYS = [
    import.meta.env.VITE_GEMINI_KEY_1,
    import.meta.env.VITE_GEMINI_KEY_2,
    import.meta.env.VITE_GEMINI_KEY_3,
    import.meta.env.VITE_GEMINI_KEY_4,
    import.meta.env.VITE_GEMINI_KEY_5,
].filter(Boolean); // Remove any undefined keys

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
