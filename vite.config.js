import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ============================================================
// 🛠️ Local API Plugin — Mimics Vercel /api/* serverless functions
// ============================================================
// In production (Vercel), /api/gemini and /api/groq are handled
// by serverless functions in the /api folder. In local dev, this
// plugin intercepts those same routes and proxies them to the
// real APIs using the server-side keys from .env.
// Keys NEVER reach the browser — they stay in the Node.js process.
// ============================================================
function localApiPlugin() {
  let envVars = {}

  return {
    name: 'local-api-proxy',
    configResolved(config) {
      // Load ALL env vars (including non-VITE_ ones) for server-side use
      envVars = loadEnv(config.mode, config.root, '')
    },
    configureServer(server) {

      // ─── /api/gemini ───────────────────────────────────────
      server.middlewares.use('/api/gemini', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        // Read request body
        const body = await readBody(req)
        const { prompt, contents, model, temperature } = body

        const keys = [
          envVars.GEMINI_KEY_1,
          envVars.GEMINI_KEY_2,
          envVars.GEMINI_KEY_3,
          envVars.GEMINI_KEY_4,
          envVars.GEMINI_KEY_5,
        ].filter(Boolean)

        if (keys.length === 0) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'No Gemini API keys in .env' }))
          return
        }

        // Build request body
        let requestBody
        if (contents) {
          requestBody = {
            contents,
            generationConfig: { temperature: temperature ?? 0.7 }
          }
        } else if (prompt) {
          requestBody = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: temperature ?? 0.9 }
          }
        } else {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Missing "prompt" or "contents"' }))
          return
        }

        const geminiModel = model || 'gemini-2.5-flash'
        let lastError = null

        // Round-robin through keys
        for (const key of keys) {
          try {
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${key}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
              }
            )

            if (response.status === 429 || response.status >= 500) {
              lastError = `HTTP ${response.status}`
              continue
            }

            const data = await response.json()
            if (!data.candidates || !data.candidates[0]) {
              lastError = 'No candidates in response'
              continue
            }

            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify(data))
            return
          } catch (error) {
            lastError = error.message
            continue
          }
        }

        res.statusCode = 502
        res.end(JSON.stringify({ error: `All Gemini keys exhausted. Last: ${lastError}` }))
      })

      // ─── /api/groq ─────────────────────────────────────────
      server.middlewares.use('/api/groq', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        const apiKey = envVars.GROQ_API_KEY
        if (!apiKey) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'No GROQ_API_KEY in .env' }))
          return
        }

        const body = await readBody(req)
        const { messages, model, temperature, max_tokens } = body

        if (!messages || !Array.isArray(messages)) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Missing "messages" array' }))
          return
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
          })

          if (response.status === 429) {
            res.statusCode = 429
            res.end(JSON.stringify({ error: 'Groq rate limited' }))
            return
          }

          if (!response.ok) {
            res.statusCode = response.status
            res.end(JSON.stringify({ error: `Groq error: ${response.status}` }))
            return
          }

          const data = await response.json()
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          res.end(JSON.stringify(data))
        } catch (error) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: error.message }))
        }
      })
    }
  }
}

// Helper: read JSON body from incoming request
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'))
      } catch {
        resolve({})
      }
    })
    req.on('error', reject)
  })
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localApiPlugin(),
  ],
  base: '/',
})
