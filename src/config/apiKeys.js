// ============================================================
// 🔑 CENTRALIZED API KEYS CONFIGURATION
// ============================================================
// All AI API calls are now proxied through Vercel Serverless
// Functions (/api/gemini, /api/groq). API keys NEVER touch
// the browser — they live only on the server.
// Each request includes the Firebase Auth token for security.
// ============================================================

import { auth } from '../firebase';

/**
 * Gemini Model to use for text generation.
 */
export const GEMINI_MODEL = 'gemini-2.5-flash';

// ============================================================
// 🔐 AUTH TOKEN HELPER
// ============================================================

/**
 * Get the current user's Firebase ID token for API auth.
 * @returns {Promise<string|null>}
 */
async function getAuthToken() {
    try {
        const user = auth.currentUser;
        if (!user) return null;
        return await user.getIdToken();
    } catch (error) {
        console.error('[Auth] Failed to get ID token:', error.message);
        return null;
    }
}

/**
 * Build headers with auth token.
 * @returns {Promise<Record<string, string>>}
 */
async function getAuthHeaders() {
    const token = await getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// ============================================================
// 🔄 SECURE GEMINI CALL (via /api/gemini proxy)
// ============================================================

/**
 * Call Gemini via the secure server-side proxy.
 * Supports both simple text prompts and multimodal (file) requests.
 *
 * @param {string} prompt - The text prompt to send
 * @param {number} timeoutMs - Timeout in milliseconds (default 12000)
 * @returns {Promise<object|null>} - The API response data, or null on failure
 */
export async function callGeminiWithRotation(prompt, timeoutMs = 12000) {
    try {
        const headers = await getAuthHeaders();

        const fetchPromise = fetch('/api/gemini', {
            method: 'POST',
            headers,
            body: JSON.stringify({ prompt, model: GEMINI_MODEL, temperature: 0.9 })
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Gemini Timeout')), timeoutMs)
        );

        const response = await Promise.race([fetchPromise, timeoutPromise]);

        if (!response.ok) {
            console.warn(`[Gemini Proxy] Error: HTTP ${response.status}`);
            return null;
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0]) {
            console.warn('[Gemini Proxy] No candidates in response');
            return null;
        }

        return data;
    } catch (error) {
        console.error('[Gemini Proxy] Failed:', error.message);
        return null;
    }
}

/**
 * Call Gemini with multimodal content (e.g. file analysis).
 * Used for document/image uploads in AIBuddy.
 *
 * @param {Array} contents - Gemini contents array (with inline_data)
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<object|null>} - The API response data, or null on failure
 */
export async function callGeminiMultimodal(contents, timeoutMs = 30000) {
    try {
        const headers = await getAuthHeaders();

        const fetchPromise = fetch('/api/gemini', {
            method: 'POST',
            headers,
            body: JSON.stringify({ contents, model: GEMINI_MODEL, temperature: 0.7 })
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Gemini Timeout')), timeoutMs)
        );

        const response = await Promise.race([fetchPromise, timeoutPromise]);

        if (!response.ok) {
            console.warn(`[Gemini Proxy] Multimodal error: HTTP ${response.status}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('[Gemini Proxy] Multimodal failed:', error.message);
        return null;
    }
}
