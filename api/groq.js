// ============================================================
// 🔒 SECURE GROQ API PROXY — Vercel Serverless Function
// ============================================================
// The Groq API key stays on the server. Frontend calls /api/groq.
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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'No Groq API key configured on server' });
    }

    const { messages, model, temperature, max_tokens } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Missing "messages" array in request body' });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || 'llama-3.3-70b-versatile',
                messages,
                temperature: temperature ?? 0.7,
                max_tokens: max_tokens || 1024,
                stream: false
            })
        });

        if (response.status === 429) {
            return res.status(429).json({ error: 'Groq rate limited' });
        }

        if (!response.ok) {
            return res.status(response.status).json({ error: `Groq error: ${response.status}` });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
