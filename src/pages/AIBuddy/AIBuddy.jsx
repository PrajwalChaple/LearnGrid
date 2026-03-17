// ============================================================
// 🤖 AI BUDDY — Full-Page ChatGPT-Style Interface
// ============================================================
// A full dashboard page with: chat history sidebar, main chat
// window, document upload, smart suggestions, and tool actions.
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Send, Bot, Sparkles, Trash2, CheckCircle, XCircle,
    Loader2, Zap, ArrowRight, Plus, MessageSquare,
    X, FileText, Paperclip, Clock, ChevronLeft, Copy, Check,
    ListTodo, User, Search, Megaphone, PieChart, CalendarDays
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sendMessage, getSmartSuggestions } from '../../lib/aiAgent';
import { executeTool, executeAnnouncement } from '../../lib/aiTools';
import { callGeminiWithRotation } from '../../config/apiKeys';

// ─── Chat History Manager (localStorage) ─────────────────────
const CHATS_KEY = 'aibuddy_chat_sessions';

function loadChatSessions() {
    try {
        const data = localStorage.getItem(CHATS_KEY);
        return data ? JSON.parse(data) : [];
    } catch { return []; }
}

function saveChatSessions(sessions) {
    try {
        localStorage.setItem(CHATS_KEY, JSON.stringify(sessions));
    } catch (e) { console.error('Failed to save chat sessions:', e); }
}

export function AIBuddy() {
    const { user, userProfile } = useAuth();
    const navigate = useNavigate();

    // ─── State ───────────────────────────────────────────────
    const [sessions, setSessions] = useState(() => loadChatSessions());
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [pendingDraft, setPendingDraft] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const chatHistoryRef = useRef([]);

    // ─── User Context ────────────────────────────────────────
    const userContext = {
        userName: userProfile?.name || user?.displayName || '',
        institutionName: userProfile?.institutionName || '',
        roleType: userProfile?.roleType || 'college',
        department: userProfile?.department || '',
        standard: userProfile?.standard || '',
        year: userProfile?.year || '',
        section: userProfile?.section || '',
    };

    const suggestions = getSmartSuggestions(userContext);
    const firstName = userProfile?.name?.split(' ')[0] || 'Student';

    // ─── Effects ─────────────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [activeSessionId]);

    // Save sessions to localStorage
    useEffect(() => {
        saveChatSessions(sessions);
    }, [sessions]);

    // ─── Session Management ──────────────────────────────────
    const createNewSession = () => {
        const id = `chat_${Date.now()}`;
        const newSession = {
            id,
            title: 'New Chat',
            createdAt: new Date().toISOString(),
            messages: []
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(id);
        setMessages([]);
        chatHistoryRef.current = [];
        setPendingDraft(null);
        setUploadedFile(null);
    };

    const loadSession = (session) => {
        setActiveSessionId(session.id);
        setMessages(session.messages || []);
        chatHistoryRef.current = (session.messages || [])
            .filter(m => m.role !== 'system')
            .map(m => ({ role: m.role, content: m.content }));
        setPendingDraft(null);
        setUploadedFile(null);
    };

    const deleteSession = (id, e) => {
        e.stopPropagation();
        setSessions(prev => prev.filter(s => s.id !== id));
        if (activeSessionId === id) {
            setActiveSessionId(null);
            setMessages([]);
            chatHistoryRef.current = [];
        };
    };

    const updateSessionMessages = (sessionId, newMessages) => {
        setSessions(prev => prev.map(s => {
            if (s.id !== sessionId) return s;
            const title = newMessages.find(m => m.role === 'user')?.content?.slice(0, 40) || s.title;
            return { ...s, messages: newMessages, title: title !== s.title ? title + '...' : s.title };
        }));
    };

    // ─── File Upload ─────────────────────────────────────────
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert('File size must be under 10MB');
            return;
        }

        setUploadedFile({
            file,
            name: file.name,
            type: file.type,
            size: (file.size / 1024).toFixed(1) + ' KB'
        });
    };

    const removeFile = () => {
        setUploadedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ─── Read file as base64 for Gemini ──────────────────────
    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // ─── Handle Tool Execution ──────────────────────────────
    const handleToolResult = async (toolCall) => {
        const result = await executeTool(toolCall, userProfile, user);
        if (!result.success) return result.message || 'Tool execution failed 😥';

        switch (toolCall.tool) {
            case 'draft_announcement':
                setPendingDraft(result.draft);
                return result.message;
            case 'navigate_to':
                if (result.path) setTimeout(() => navigate(result.path), 1000);
                return result.message;
            default:
                return result.message;
        }
    };

    // ─── Confirm/Reject Announcement ────────────────────────
    const handleConfirmAnnouncement = async () => {
        if (!pendingDraft) return;
        setIsTyping(true);
        const result = await executeAnnouncement(pendingDraft, userProfile, user);
        setPendingDraft(null);
        const newMsg = {
            id: Date.now(), role: 'assistant',
            content: result.message, timestamp: new Date().toISOString(), isAction: true
        };
        const updated = [...messages, newMsg];
        setMessages(updated);
        if (activeSessionId) updateSessionMessages(activeSessionId, updated);
        setIsTyping(false);
    };

    const handleRejectAnnouncement = () => {
        setPendingDraft(null);
        const newMsg = {
            id: Date.now(), role: 'assistant',
            content: 'Alright, I cancelled the announcement. Let me know if there is anything else I can assist with! 😊',
            timestamp: new Date().toISOString()
        };
        const updated = [...messages, newMsg];
        setMessages(updated);
        if (activeSessionId) updateSessionMessages(activeSessionId, updated);
    };

    // ─── Copy Message ────────────────────────────────────────
    const copyMessage = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // ─── Send Message ────────────────────────────────────────
    const handleSend = async (text = null) => {
        const messageText = text || inputValue.trim();
        if (!messageText || isTyping) return;

        // Auto-create session if none active
        let currentSessionId = activeSessionId;
        if (!currentSessionId) {
            const id = `chat_${Date.now()}`;
            const newSession = { id, title: messageText.slice(0, 40) + '...', createdAt: new Date().toISOString(), messages: [] };
            setSessions(prev => [newSession, ...prev]);
            setActiveSessionId(id);
            currentSessionId = id;
        }

        // Build user message
        const userMsg = {
            id: Date.now(), role: 'user', content: messageText,
            timestamp: new Date().toISOString(),
            fileName: uploadedFile?.name || null
        };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInputValue('');
        setIsTyping(true);

        chatHistoryRef.current.push({ role: 'user', content: messageText });

        try {
            let finalText = '';

            // Handle file upload with Gemini (multimodal)
            if (uploadedFile) {
                try {
                    const base64 = await readFileAsBase64(uploadedFile.file);
                    const mimeType = uploadedFile.file.type;

                    const filePrompt = `The user has uploaded a file named "${uploadedFile.name}" (${uploadedFile.type}).

User's question about this file: "${messageText}"

Analyze the file content and answer the user's question. Respond in clear, professional English. Keep it concise and helpful.`;

                    // Use Gemini for multimodal (file analysis)
                    const geminiResponse = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY_1}`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [{
                                    parts: [
                                        { text: filePrompt },
                                        { inline_data: { mime_type: mimeType, data: base64 } }
                                    ]
                                }],
                                generationConfig: { temperature: 0.7 }
                            })
                        }
                    );

                    const data = await geminiResponse.json();
                    finalText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'There was an issue analyzing your file 😥';
                } catch (err) {
                    console.error('[AIBuddy] File analysis error:', err);
                    finalText = 'An error occurred while processing the file. Please make sure the file is a valid document or image.';
                }
                removeFile();
            } else {
                // Normal text chat
                const response = await sendMessage(chatHistoryRef.current, messageText, userContext);
                finalText = response.text;

                if (response.toolCall) {
                    const toolResult = await handleToolResult(response.toolCall);
                    finalText = finalText ? `${finalText}\n\n${toolResult}` : toolResult;
                }
            }

            const assistantMsg = {
                id: Date.now() + 1, role: 'assistant',
                content: finalText || 'Hmm, I didn\'t quite catch that. Could you rephrase? 🤔',
                timestamp: new Date().toISOString(),
                hasToolAction: false
            };
            const updatedMessages = [...newMessages, assistantMsg];
            setMessages(updatedMessages);
            updateSessionMessages(currentSessionId, updatedMessages);

            chatHistoryRef.current.push({ role: 'assistant', content: finalText });
            if (chatHistoryRef.current.length > 20) {
                chatHistoryRef.current = chatHistoryRef.current.slice(-14);
            }

        } catch (error) {
            console.error('[AIBuddy] Error:', error);
            const errMsg = {
                id: Date.now() + 1, role: 'assistant',
                content: 'Oops! Something went wrong 😥. Please try again in a few moments.',
                timestamp: new Date().toISOString()
            };
            const updatedMessages = [...newMessages, errMsg];
            setMessages(updatedMessages);
            updateSessionMessages(currentSessionId, updatedMessages);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ─── Format Message ──────────────────────────────────────
    const formatMessage = (text) => {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br/>');
    };

    const formatTime = (ts) => {
        try {
            return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch { return ''; }
    };

    // ═══════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════
    return (
        <div className="ab-container">
            {/* ─── Chat History Sidebar ──────────────────────── */}
            <AnimatePresence>
                {showSidebar && (
                    <motion.aside
                        initial={{ x: -280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="ab-history"
                    >
                        <div className="ab-history-header">
                            <h3>Chat History</h3>
                            <button onClick={createNewSession} className="ab-new-chat-btn" title="New Chat">
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="ab-history-list">
                            {sessions.length === 0 ? (
                                <div className="ab-history-empty">
                                    <MessageSquare size={24} />
                                    <p>No chats yet</p>
                                </div>
                            ) : (
                                sessions.map((s) => (
                                    <div
                                        key={s.id}
                                        className={`ab-history-item ${s.id === activeSessionId ? 'active' : ''}`}
                                        onClick={() => loadSession(s)}
                                    >
                                        <MessageSquare size={14} />
                                        <span className="ab-history-title">{s.title || 'New Chat'}</span>
                                        <button
                                            className="ab-history-delete"
                                            onClick={(e) => deleteSession(s.id, e)}
                                            title="Delete"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ─── Main Chat Area ────────────────────────────── */}
            <div className="ab-main">
                {/* Top Bar */}
                <div className="ab-topbar">
                    <div className="ab-topbar-left">
                        <button onClick={() => setShowSidebar(!showSidebar)} className="ab-toggle-sidebar">
                            <ChevronLeft size={18} style={{ transform: showSidebar ? 'rotate(0deg)' : 'rotate(180deg)', transition: '0.3s' }} />
                        </button>
                        <div className="ab-topbar-info">
                            <div className="ab-topbar-avatar">
                                <Bot size={18} />
                            </div>
                            <div>
                                <h2>AIBuddy</h2>
                                <span className="ab-topbar-status">
                                    <span className="ab-status-dot" /> {isTyping ? 'Thinking...' : 'Online'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages or Welcome Screen */}
                <div className="ab-messages">
                    {messages.length === 0 ? (
                        /* ─── Welcome Screen (ChatGPT-style) ─── */
                        <div className="ab-welcome">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="ab-welcome-content"
                            >
                                <h1>Welcome, {firstName}! 👋</h1>
                                <p>I am your AIBuddy — your personal LearnGrid assistant.<br/>Ask me about assignments, announcements, or summarize your dashboard.</p>

                                <div className="ab-welcome-grid">
                                    {suggestions.map((s, i) => {
                                        let Icon = Sparkles;
                                        if (s.icon === 'ListTodo') Icon = ListTodo;
                                        if (s.icon === 'Megaphone') Icon = Megaphone;
                                        if (s.icon === 'PieChart') Icon = PieChart;
                                        if (s.icon === 'CalendarDays') Icon = CalendarDays;

                                        return (
                                            <motion.button
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="ab-welcome-card"
                                                onClick={() => setInputValue(s.message)}
                                            >
                                                <Icon size={18} className="ab-card-icon" />
                                                <span className="ab-card-label">{s.label}</span>
                                                <ArrowRight size={14} />
                                            </motion.button>
                                        );
                                    })}
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="ab-welcome-card"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            fileInputRef.current?.click();
                                        }}
                                    >
                                        <FileText size={18} className="ab-card-icon" />
                                        <span className="ab-card-label">Upload & Analyze Document</span>
                                        <ArrowRight size={14} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        /* ─── Chat Messages ─── */
                        <>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`ab-msg ${msg.role}`}
                                >
                                    <div className="ab-msg-row">
                                        <div className={`ab-msg-avatar ${msg.role}`}>
                                            {msg.role === 'assistant' ? <Bot size={16} /> : (
                                                userProfile?.photoURL
                                                    ? <img src={userProfile.photoURL} alt="" />
                                                    : <span>{firstName[0]}</span>
                                            )}
                                        </div>
                                        <div className="ab-msg-content">
                                            <div className="ab-msg-header">
                                                <span className="ab-msg-name">
                                                    {msg.role === 'assistant' ? 'AIBuddy' : firstName}
                                                </span>
                                                <span className="ab-msg-time">{formatTime(msg.timestamp)}</span>
                                            </div>
                                            {msg.fileName && (
                                                <div className="ab-msg-file">
                                                    <FileText size={14} />
                                                    <span>{msg.fileName}</span>
                                                </div>
                                            )}
                                            <div
                                                className={`ab-msg-text ${msg.isAction ? 'action' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                                            />
                                            {msg.role === 'assistant' && (
                                                <button
                                                    className="ab-msg-copy"
                                                    onClick={() => copyMessage(msg.content, msg.id)}
                                                    title="Copy"
                                                >
                                                    {copiedId === msg.id ? <Check size={13} /> : <Copy size={13} />}
                                                    {copiedId === msg.id ? 'Copied' : 'Copy'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {pendingDraft && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ab-confirm">
                                    <p>🔔 Should I go ahead and post this announcement?</p>
                                    <div className="ab-confirm-btns">
                                        <button onClick={handleConfirmAnnouncement} className="ab-btn-yes">
                                            <CheckCircle size={16} /> Yes, Post it!
                                        </button>
                                        <button onClick={handleRejectAnnouncement} className="ab-btn-no">
                                            <XCircle size={16} /> Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Typing */}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ab-msg assistant">
                                    <div className="ab-msg-row">
                                        <div className="ab-msg-avatar assistant"><Bot size={16} /></div>
                                        <div className="ab-msg-content">
                                            <div className="ab-typing-dots"><span /><span /><span /></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* ─── Input Area ────────────────────────────── */}
                <div className="ab-input-area">
                    {/* File Preview */}
                    {uploadedFile && (
                        <div className="ab-file-preview">
                            <FileText size={16} />
                            <div>
                                <span className="ab-file-name">{uploadedFile.name}</span>
                                <span className="ab-file-size">{uploadedFile.size}</span>
                            </div>
                            <button onClick={removeFile} className="ab-file-remove"><X size={14} /></button>
                        </div>
                    )}

                    <div className="ab-input-row">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="ab-attach-btn"
                            title="Upload Document"
                        >
                            <Paperclip size={20} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
                            style={{ display: 'none' }}
                        />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={uploadedFile ? 'Ask a question about this document...' : 'Ask AIBuddy anything...'}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={isTyping}
                            className="ab-input"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!inputValue.trim() || isTyping}
                            className="ab-send-btn"
                        >
                            {isTyping ? <Loader2 size={20} className="ab-spin" /> : <Send size={20} />}
                        </button>
                    </div>
                    <span className="ab-footer-text">
                        <Zap size={10} /> AIBuddy can make mistakes. Verify important info.
                    </span>
                </div>
            </div>

            {/* ═══ Styles ═══ */}
            <style>{`
                .ab-container {
                    display: flex;
                    height: calc(100vh - 64px);
                    margin: -2rem;
                    margin-top: -1rem;
                    background: #f8fafc;
                    overflow: hidden;
                    border-radius: 0;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                /* ═══ History Sidebar ═══ */
                .ab-history {
                    width: 300px;
                    min-width: 300px;
                    background: #ffffff;
                    border-right: 1px solid rgba(0,0,0,0.05);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 4px 0 24px rgba(0,0,0,0.02);
                    z-index: 10;
                }

                .ab-history-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px 20px 16px;
                    background: #ffffff;
                }

                .ab-history-header h3 {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #64748b;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                }

                .ab-new-chat-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: #0f172a;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    border: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .ab-new-chat-btn:hover { 
                    transform: translateY(-2px); 
                    box-shadow: 0 8px 16px rgba(15,23,42,0.2); 
                    background: #1e293b;
                }

                .ab-history-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 12px;
                    scrollbar-width: none;
                }
                .ab-history-list::-webkit-scrollbar { display: none; }

                .ab-history-empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    padding: 60px 20px;
                    color: #cbd5e1;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .ab-history-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 16px;
                    border-radius: 14px;
                    cursor: pointer;
                    color: #64748b;
                    font-size: 0.88rem;
                    font-weight: 500;
                    transition: all 0.2s;
                    position: relative;
                    margin-bottom: 4px;
                    border: 1px solid transparent;
                }
                .ab-history-item:hover { 
                    background: #f8fafc; 
                    color: #0f172a; 
                    border-color: #f1f5f9;
                }
                .ab-history-item.active { 
                    background: #f1f5f9; 
                    color: #0f172a; 
                    font-weight: 600; 
                    border-color: #e2e8f0;
                }

                .ab-history-title {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .ab-history-delete {
                    opacity: 0;
                    padding: 6px;
                    border-radius: 8px;
                    color: #cbd5e1;
                    cursor: pointer;
                    border: none;
                    background: transparent;
                    transition: 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .ab-history-item:hover .ab-history-delete { opacity: 1; }
                .ab-history-delete:hover { color: #ef4444; background: #fee2e2; }

                /* ═══ Main Chat ═══ */
                .ab-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    background: #f8fafc;
                    position: relative;
                }

                /* Top Bar */
                .ab-topbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 24px;
                    background: rgba(248, 250, 252, 0.8);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    z-index: 20;
                    border-bottom: 1px solid rgba(0,0,0,0.03);
                }

                .ab-topbar-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .ab-toggle-sidebar {
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: #64748b;
                    transition: all 0.2s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .ab-toggle-sidebar:hover { background: #f1f5f9; color: #0f172a; }

                .ab-topbar-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .ab-topbar-avatar {
                    width: 40px; height: 40px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #0f172a, #334155);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(15,23,42,0.15);
                }

                .ab-topbar h2 {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                    letter-spacing: -0.3px;
                }

                .ab-topbar-status {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.75rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .ab-status-dot {
                    width: 8px; height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                    animation: abBlink 2.5s infinite ease-in-out;
                    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
                }
                @keyframes abBlink { 0%,100%{opacity:1} 50%{opacity:0.3} }

                /* ═══ Messages ═══ */
                .ab-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px 40px 20px;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0,0,0,0.1) transparent;
                }
                .ab-messages::-webkit-scrollbar { width: 6px; }
                .ab-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }

                /* ═══ Welcome Screen ═══ */
                .ab-welcome {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    padding: 10px 40px;
                }

                .ab-welcome-content {
                    text-align: center;
                    max-width: 640px;
                }

                .ab-welcome-content h1 {
                    margin-bottom: 0.5rem;
                }

                .ab-welcome-content p {
                    margin-bottom: 1.5rem;
                }

                .ab-welcome-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                }

                @media (max-width: 768px) {
                    .ab-welcome-grid { grid-template-columns: 1fr; }
                }

                .ab-welcome-card {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 20px 24px;
                    background: #ffffff;
                    border: 1px solid rgba(0,0,0,0.06);
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-align: left;
                    font-size: 0.95rem;
                    color: #0f172a;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }
                .ab-welcome-card:hover {
                    background: #0f172a;
                    border-color: #0f172a;
                    color: #ffffff;
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(15,23,42,0.15);
                }
                
                .ab-card-icon {
                    color: #6366f1;
                    transition: 0.3s;
                }
                .ab-welcome-card:hover .ab-card-icon {
                    color: #a5b4fc;
                }

                .ab-card-label { flex: 1; }

                /* ═══ Chat Messages ═══ */
                .ab-msg {
                    margin-bottom: 8px;
                }

                .ab-msg.user { margin-bottom: 32px; }
                .ab-msg.assistant { margin-bottom: 24px; }

                .ab-msg-row {
                    display: flex;
                    gap: 16px;
                    max-width: 860px;
                    margin: 0 auto;
                }

                .ab-msg.user .ab-msg-row {
                    flex-direction: row-reverse;
                }

                .ab-msg-avatar {
                    width: 36px; height: 36px; min-width: 36px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    font-weight: 700;
                    margin-top: 4px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .ab-msg-avatar.assistant {
                    background: linear-gradient(135deg, #0f172a, #334155);
                    color: white;
                }
                .ab-msg-avatar.user {
                    background: #ffffff;
                    color: #0f172a;
                    border: 1px solid #e2e8f0;
                }
                .ab-msg-avatar img {
                    width: 100%; height: 100%;
                    border-radius: 12px;
                    object-fit: cover;
                }

                .ab-msg-content {
                    flex: 1;
                    min-width: 0;
                }

                .ab-msg.user .ab-msg-content {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }

                .ab-msg-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 8px;
                }
                .ab-msg.user .ab-msg-header { flex-direction: row-reverse; }

                .ab-msg-name {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: #0f172a;
                }

                .ab-msg-time {
                    font-size: 0.75rem;
                    color: #94a3b8;
                    font-weight: 500;
                }

                .ab-msg-file {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 14px;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 0.8rem;
                    color: #0f172a;
                    font-weight: 500;
                    margin-bottom: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                }

                .ab-msg-text {
                    font-size: 1rem;
                    line-height: 1.8;
                    color: #334155;
                    word-break: break-word;
                }

                .ab-msg-text.action {
                    background: #ffffff;
                    border: 1px solid #10b981;
                    padding: 16px 20px;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(16,185,129,0.1);
                    color: #065f46;
                }

                .ab-msg-text strong { font-weight: 700; color: #0f172a; }
                .ab-msg-text code {
                    background: rgba(0,0,0,0.05);
                    padding: 2px 8px;
                    border-radius: 6px;
                    font-size: 0.85em;
                    font-family: 'JetBrains Mono', Consolas, monospace;
                    color: #db2777;
                }

                .ab-msg.user .ab-msg-text {
                    background: #0f172a;
                    color: white;
                    padding: 14px 20px;
                    border-radius: 20px 20px 4px 20px;
                    display: inline-block;
                    box-shadow: 0 10px 25px rgba(15,23,42,0.15);
                }

                .ab-msg-copy {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #64748b;
                    cursor: pointer;
                    border: 1px solid #e2e8f0;
                    background: #ffffff;
                    margin-top: 12px;
                    transition: all 0.2s;
                }
                .ab-msg-copy:hover { 
                    background: #f8fafc; 
                    color: #0f172a; 
                    border-color: #cbd5e1;
                }

                /* Typing Indicator */
                .ab-typing-dots {
                    display: flex; gap: 6px; padding: 12px 0;
                }
                .ab-typing-dots span {
                    width: 8px; height: 8px;
                    background: #cbd5e1; border-radius: 50%;
                    animation: abTyping 1.4s infinite ease-in-out;
                }
                .ab-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
                .ab-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes abTyping { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px); background: #0f172a;} }

                /* ═══ Call to Action Confirmation ═══ */
                .ab-confirm {
                    max-width: 860px;
                    margin: 24px auto;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-left: 4px solid #f59e0b;
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }
                .ab-confirm p { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 16px; }
                .ab-confirm-btns { display: flex; gap: 12px; }

                .ab-btn-yes, .ab-btn-no {
                    display: flex; align-items: center; gap: 8px;
                    padding: 10px 20px; border-radius: 12px;
                    font-size: 0.9rem; font-weight: 600;
                    cursor: pointer; border: none; transition: all 0.2s;
                }
                .ab-btn-yes { background: #0f172a; color: white; }
                .ab-btn-yes:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(15,23,42,0.2); }
                .ab-btn-no { background: white; color: #64748b; border: 1px solid #e2e8f0; }
                .ab-btn-no:hover { background: #f8fafc; color: #0f172a; border-color: #cbd5e1; }

                /* ═══ Input Area ═══ */
                .ab-input-area {
                    padding: 20px 40px 32px;
                    max-width: 940px;
                    margin: 0 auto;
                    width: 100%;
                    background: linear-gradient(0deg, #f8fafc 80%, rgba(248, 250, 252, 0) 100%);
                    position: relative;
                    z-index: 20;
                }

                .ab-file-preview {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 16px;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    font-size: 0.85rem;
                    color: #0f172a;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                }
                .ab-file-name { font-weight: 600; }
                .ab-file-size { color: #64748b; font-size: 0.75rem; margin-left: 6px; }
                .ab-file-remove {
                    margin-left: 8px;
                    padding: 6px; border-radius: 8px;
                    cursor: pointer; border: none; background: #f8fafc;
                    color: #64748b; transition: 0.2s;
                }
                .ab-file-remove:hover { color: #ef4444; background: #fee2e2; }

                .ab-input-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #ffffff;
                    border: 1px solid rgba(0,0,0,0.1);
                    border-radius: 24px;
                    padding: 10px 10px 10px 20px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }
                .ab-input-row:focus-within {
                    border-color: #0f172a;
                    box-shadow: 0 10px 40px rgba(15,23,42,0.1);
                }

                .ab-attach-btn {
                    width: 44px; height: 44px; min-width: 44px;
                    border-radius: 16px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; border: none;
                    background: #f8fafc; color: #64748b; transition: all 0.2s;
                }
                .ab-attach-btn:hover { color: #0f172a; background: #f1f5f9; }

                .ab-input {
                    flex: 1; border: none; outline: none;
                    font-size: 1.05rem; color: #0f172a;
                    background: transparent; font-family: inherit;
                    padding: 12px 0;
                    resize: none;
                }
                .ab-input::placeholder { color: #94a3b8; font-weight: 400; }

                .ab-send-btn {
                    width: 48px; height: 48px; min-width: 48px;
                    border-radius: 16px;
                    background: #0f172a;
                    color: white;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; border: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .ab-send-btn:hover:not(:disabled) { 
                    transform: scale(1.05); 
                    box-shadow: 0 8px 24px rgba(15,23,42,0.3);
                    background: #1e293b;
                }
                .ab-send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

                .ab-footer-text {
                    display: flex; align-items: center; justify-content: center;
                    gap: 6px; font-size: 0.75rem; color: #94a3b8; margin-top: 16px;
                    font-weight: 500;
                }

                .ab-spin { animation: abSpin 1s linear infinite; }
                @keyframes abSpin { to { transform: rotate(360deg); } }

                /* ═══ Dark Mode ═══ */
                [data-theme="dark"] .ab-container { background: #0f172a; }
                [data-theme="dark"] .ab-history { background: #0f172a; border-color: #1e293b; }
                [data-theme="dark"] .ab-history-header { border-color: #1e293b; }
                [data-theme="dark"] .ab-history-header h3 { color: #94a3b8; }
                [data-theme="dark"] .ab-history-item { color: #94a3b8; }
                [data-theme="dark"] .ab-history-item:hover { background: #1e293b; color: #e2e8f0; }
                [data-theme="dark"] .ab-history-item.active { background: #312e81; color: #a5b4fc; }
                [data-theme="dark"] .ab-main { background: #0f172a; }
                [data-theme="dark"] .ab-topbar { background: rgba(15,23,42,0.8); border-color: #1e293b; }
                [data-theme="dark"] .ab-topbar h2 { color: #e2e8f0; }
                [data-theme="dark"] .ab-welcome h1 { color: #f1f5f9; }
                [data-theme="dark"] .ab-welcome p  { color: #94a3b8; }
                [data-theme="dark"] .ab-welcome-icon { background: linear-gradient(135deg, #1e1b4b, #312e81); }
                [data-theme="dark"] .ab-welcome-card { background: #1e293b; border-color: #334155; color: #94a3b8; }
                [data-theme="dark"] .ab-welcome-card:hover { background: #312e81; border-color: #4338ca; color: #c7d2fe; }
                [data-theme="dark"] .ab-msg-name { color: #e2e8f0; }
                [data-theme="dark"] .ab-msg-text { color: #cbd5e1; }
                [data-theme="dark"] .ab-msg-text strong { color: #f1f5f9; }
                [data-theme="dark"] .ab-msg-text code { background: #1e293b; color: #a5b4fc; }
                [data-theme="dark"] .ab-msg-text.action { background: linear-gradient(135deg, #064e3b, #065f46); border-color: #047857; color: #d1fae5; }
                [data-theme="dark"] .ab-input-row { background: #1e293b; border-color: #334155; }
                [data-theme="dark"] .ab-input-row:focus-within { border-color: #6366f1; background: #0f172a; }
                [data-theme="dark"] .ab-input { color: #e2e8f0; }
                [data-theme="dark"] .ab-file-preview { background: #1e1b4b; border-color: #4338ca; color: #a5b4fc; }
                [data-theme="dark"] .ab-confirm { background: linear-gradient(135deg, #422006, #451a03); border-color: #92400e; }
                [data-theme="dark"] .ab-confirm p { color: #fbbf24; }
                [data-theme="dark"] .ab-history-empty { color: #475569; }

                /* ═══ Mobile ═══ */
                @media (max-width: 768px) {
                    .ab-history { display: none; }
                    .ab-toggle-sidebar { display: none; }
                    .ab-container { margin: -1rem; }
                    .ab-welcome h1 { font-size: 1.4rem; }
                    .ab-welcome-grid { grid-template-columns: 1fr; }
                    .ab-input-area { padding: 12px; }
                }
            `}</style>
        </div>
    );
}
