// ============================================================
// 🔒 SECURE GEMINI API PROXY — Vercel Serverless Function
// ============================================================
// Keys stay on the server. Frontend calls /api/gemini instead
// of directly hitting the Google API with exposed keys.
// Auth: Only verified Firebase users can call this endpoint.
// ============================================================

import { verifyAuth } from './_verifyAuth.js';

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 🔐 Verify Firebase Auth token
    const user = await verifyAuth(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized — valid Firebase login required' });
    }

    // Load keys from server-side environment (NO VITE_ prefix)
    const keys = [
        process.env.GEMINI_KEY_1,
        process.env.GEMINI_KEY_2,
        process.env.GEMINI_KEY_3,
        process.env.GEMINI_KEY_4,
        process.env.GEMINI_KEY_5,
    ].filter(Boolean);

    if (keys.length === 0) {
        return res.status(500).json({ error: 'No Gemini API keys configured on server' });
    }

    const { prompt, contents, model, temperature } = req.body;

    // Build the request body for Gemini
    let requestBody;
    if (contents) {
        // Multimodal request (e.g. file upload with inline_data)
        requestBody = {
            contents,
            generationConfig: { temperature: temperature ?? 0.7 }
        };
    } else if (prompt) {
        // Simple text prompt
        requestBody = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: temperature ?? 0.9 }
        };
    } else {
        return res.status(400).json({ error: 'Missing "prompt" or "contents" in request body' });
    }

    const geminiModel = model || 'gemini-2.5-flash';
    let lastError = null;

    // Round-robin: try each key until one works
    for (const key of keys) {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${key}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                }
            );

            // Rate limited or server error → try next key
            if (response.status === 429 || response.status >= 500) {
                lastError = `HTTP ${response.status}`;
                continue;
            }

            const data = await response.json();

            // If the response has no candidates, try next key
            if (!data.candidates || !data.candidates[0]) {
                lastError = 'No candidates in response';
                continue;
            }

            return res.status(200).json(data);
        } catch (error) {
            lastError = error.message;
            continue;
        }
    }

    return res.status(502).json({ error: `All Gemini keys exhausted. Last error: ${lastError}` });
}
