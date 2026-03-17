// ============================================================
// 🧠 AI AGENT — Hybrid Groq + Gemini with Tool Execution
// ============================================================
// This is the "brain" of AIBuddy. It routes requests to the
// right AI model and handles tool calling for agentic actions.
// ============================================================

import { callGeminiWithRotation } from '../config/apiKeys';

// ─── Groq Configuration ─────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_FAST_MODEL = 'llama-3.1-8b-instant';

// ─── Tool Definitions (what AI can "do") ─────────────────────
const TOOL_DEFINITIONS = [
    {
        name: 'draft_announcement',
        description: 'Draft a professional announcement/notice for students. Use when user asks to create, write, or post any announcement, notice, or circular.',
        parameters: {
            title: 'Short title for the announcement',
            description: 'Full professional description/body of the announcement',
            type: 'One of: General, Urgent, Event, Update',
        }
    },
    {
        name: 'get_pending_assignments',
        description: 'Get the user\'s pending assignments and deadlines. Use when user asks about their homework, tasks, deadlines, or what is due.',
        parameters: {}
    },
    {
        name: 'navigate_to',
        description: 'Navigate the user to a specific page in the app. Use when user asks to go somewhere or wants to find a feature.',
        parameters: {
            page: 'One of: dashboard, notes, assignments, announcements, calendar, profile, settings'
        }
    },
    {
        name: 'summarize_dashboard',
        description: 'Get a summary of the user\'s current academic status including pending assignments, recent notes, and announcements.',
        parameters: {}
    }
];

// ─── System Prompt ───────────────────────────────────────────
function buildSystemPrompt(userContext) {
    const toolDescriptions = TOOL_DEFINITIONS.map(t =>
        `- ${t.name}: ${t.description}`
    ).join('\n');

    return `You are "AIBuddy", the smart AI assistant inside LearnGrid — a student academic dashboard.

PERSONALITY:
- You speak in casual Hinglish (Hindi words written in English letters, like WhatsApp chat with a friend).
- You are funny, supportive, and slightly teasing — like a best friend who helps with studies.
- When drafting official content (announcements, notices), switch to Professional English.
- Keep responses SHORT (2-4 sentences max for chat). Never write essays.

USER CONTEXT:
- Name: ${userContext.userName || 'Student'}
- Institution: ${userContext.institutionName || 'Unknown'}
- Role Type: ${userContext.roleType || 'college'}
- Department/Branch: ${userContext.department || userContext.standard || 'Unknown'}
- Year: ${userContext.year || 'Unknown'}
- Section: ${userContext.section || 'Unknown'}
${userContext.pendingCount !== undefined ? `- Pending Assignments: ${userContext.pendingCount}` : ''}
${userContext.assignmentDetails ? `- Assignment Details:\n${userContext.assignmentDetails}` : ''}

AVAILABLE TOOLS:
${toolDescriptions}

TOOL CALLING FORMAT:
When you need to use a tool, respond with EXACTLY this JSON format on a SEPARATE line:
[TOOL_CALL]{"tool": "tool_name", "params": {"param1": "value1"}}[/TOOL_CALL]

RULES:
1. For announcements: ALWAYS draft a professional title and description, then use draft_announcement tool. Ask user to confirm before any tool call that modifies data.
2. For questions about assignments/deadlines: Use get_pending_assignments tool.
3. For navigation: Use navigate_to tool.
4. For general chat: Just respond normally in Hinglish without any tool call.
5. NEVER make up data. If you don't know something, say "Mujhe nahi pata bhai, lekin check kar leta hu!"
6. When user wants to create an announcement, first draft it and show to the user, then ask for confirmation.`;
}

// ─── Groq API Call ───────────────────────────────────────────
async function callGroq(messages, model = GROQ_MODEL, temperature = 0.7) {
    if (!GROQ_API_KEY) {
        console.warn('[AIAgent] No Groq API key found, falling back to Gemini');
        return null;
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model,
                messages,
                temperature,
                max_tokens: 1024,
                stream: false
            })
        });

        if (response.status === 429) {
            console.warn('[AIAgent] Groq rate limited, falling back to Gemini');
            return null;
        }

        if (!response.ok) {
            console.warn(`[AIAgent] Groq error ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
    } catch (error) {
        console.error('[AIAgent] Groq call failed:', error.message);
        return null;
    }
}

// ─── Gemini Fallback ─────────────────────────────────────────
async function callGeminiFallback(prompt) {
    try {
        const data = await callGeminiWithRotation(prompt);
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }
        return null;
    } catch (error) {
        console.error('[AIAgent] Gemini fallback failed:', error.message);
        return null;
    }
}

// ─── Parse Tool Calls from AI Response ───────────────────────
export function parseToolCall(response) {
    const toolMatch = response.match(/\[TOOL_CALL\](.*?)\[\/TOOL_CALL\]/s);
    if (!toolMatch) return null;

    try {
        const parsed = JSON.parse(toolMatch[1].trim());
        return {
            tool: parsed.tool,
            params: parsed.params || {},
            // Remove the tool call from the display text
            displayText: response.replace(/\[TOOL_CALL\].*?\[\/TOOL_CALL\]/s, '').trim()
        };
    } catch (e) {
        console.error('[AIAgent] Failed to parse tool call:', e);
        return null;
    }
}

// ─── Main Chat Function ─────────────────────────────────────
/**
 * Send a message to AIBuddy and get a response.
 * @param {Array} chatHistory - Array of { role: 'user'|'assistant', content: string }
 * @param {string} userMessage - The new user message
 * @param {Object} userContext - User profile data for context
 * @returns {Promise<{text: string, toolCall: object|null}>}
 */
export async function sendMessage(chatHistory, userMessage, userContext = {}) {
    const systemPrompt = buildSystemPrompt(userContext);

    // Build messages array for Groq (OpenAI-compatible format)
    const messages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: userMessage }
    ];

    // Try Groq first (fast + high limits)
    let response = await callGroq(messages);

    // Fallback to Gemini if Groq fails
    if (!response) {
        const geminiPrompt = `${systemPrompt}\n\nConversation so far:\n${chatHistory.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n')}\n\nUser: ${userMessage}\n\nAssistant:`;
        response = await callGeminiFallback(geminiPrompt);
    }

    // Ultimate fallback: built-in response
    if (!response) {
        response = `Arey ${userContext.userName || 'bhai'}, abhi mera connection thoda weak hai 😅. Thodi der baad try kar, main yahan hu tere liye!`;
    }

    // Parse for tool calls
    const toolCall = parseToolCall(response);

    return {
        text: toolCall ? toolCall.displayText : response,
        toolCall: toolCall
    };
}

// ─── Quick Suggestion Chips ──────────────────────────────────
export function getSmartSuggestions(userContext = {}) {
    const suggestions = [];

    if (userContext.pendingCount > 0) {
        suggestions.push({
            label: `📋 ${userContext.pendingCount} Pending Tasks`,
            message: 'Meri pending assignments dikhao'
        });
    }

    suggestions.push(
        { label: '📢 Write Announcement', message: 'Ek announcement likh do' },
        { label: '📊 Dashboard Summary', message: 'Mera dashboard summary bata do' },
        { label: '📅 Next Deadline', message: 'Meri next deadline kab hai?' }
    );

    return suggestions.slice(0, 4); // Max 4 suggestions
}
