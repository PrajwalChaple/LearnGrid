// ============================================================
// 🤖 AGENTIC BUDDY — Premium AI Assistant UI
// ============================================================
// A floating sidebar chat assistant that can perform actions
// within LearnGrid. Available on all dashboard pages.
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare, X, Send, Bot, User, Sparkles,
    ChevronDown, Trash2, CheckCircle, XCircle, Loader2,
    Zap, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendMessage, getSmartSuggestions, parseToolCall } from '../lib/aiAgent';
import { executeTool, executeAnnouncement } from '../lib/aiTools';

export function AgenticBuddy() {
    const { user, userProfile } = useAuth();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [pendingDraft, setPendingDraft] = useState(null); // For announcement confirmation
    const [hasUnread, setHasUnread] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatHistoryRef = useRef([]); // For AI context

    // Don't render if not logged in or not onboarded
    if (!user || !userProfile?.roleType) return null;

    // ─── User Context for AI ────────────────────────────────
    const userContext = {
        userName: userProfile?.name || user?.displayName || '',
        institutionName: userProfile?.institutionName || '',
        roleType: userProfile?.roleType || 'college',
        department: userProfile?.department || '',
        standard: userProfile?.standard || '',
        year: userProfile?.year || '',
        section: userProfile?.section || '',
    };

    // ─── Smart Suggestions ──────────────────────────────────
    const suggestions = getSmartSuggestions(userContext);

    // ─── Auto-scroll to bottom ──────────────────────────────
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // ─── Focus input when opened ────────────────────────────
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
            setHasUnread(false);
        }
    }, [isOpen]);

    // ─── Welcome message on first open ──────────────────────
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const name = userProfile?.name?.split(' ')[0] || 'Bhai';
            setMessages([{
                id: Date.now(),
                role: 'assistant',
                content: `Hey ${name}! 👋 Main hu tera AIBuddy — LearnGrid ka personal assistant.\n\nMujhse puch kuch bhi — assignments ke baare mein, announcements likhwao, ya dashboard ka summary lo. Bol kya karna hai? 🚀`,
                timestamp: new Date()
            }]);
        }
    }, [isOpen]);

    // ─── Handle Tool Execution ──────────────────────────────
    const handleToolResult = async (toolCall) => {
        const result = await executeTool(toolCall, userProfile, user);

        if (!result.success) {
            return result.message || 'Tool execution failed 😥';
        }

        // Special handling for different tools
        switch (toolCall.tool) {
            case 'draft_announcement':
                setPendingDraft(result.draft);
                return result.message;

            case 'navigate_to':
                if (result.path) {
                    setTimeout(() => navigate(result.path), 1000);
                }
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

        setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'assistant',
            content: result.message,
            timestamp: new Date(),
            isAction: true
        }]);
        setIsTyping(false);
    };

    const handleRejectAnnouncement = () => {
        setPendingDraft(null);
        setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'assistant',
            content: 'Thik hai bhai, announcement cancel kar diya. Kuch aur karna hai toh bata! 😊',
            timestamp: new Date()
        }]);
    };

    // ─── Send Message ───────────────────────────────────────
    const handleSend = async (text = null) => {
        const messageText = text || inputValue.trim();
        if (!messageText || isTyping) return;

        // Add user message
        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: messageText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Update chat history for context
        chatHistoryRef.current.push({ role: 'user', content: messageText });

        try {
            // Get AI response
            const response = await sendMessage(
                chatHistoryRef.current,
                messageText,
                userContext
            );

            let finalText = response.text;

            // If there's a tool call, execute it
            if (response.toolCall) {
                const toolResult = await handleToolResult(response.toolCall);
                finalText = finalText
                    ? `${finalText}\n\n${toolResult}`
                    : toolResult;
            }

            // Add assistant message
            const assistantMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: finalText || 'Hmm, kuch samajh nahi aaya 🤔. Dobara bol?',
                timestamp: new Date(),
                hasToolAction: !!response.toolCall
            };
            setMessages(prev => [...prev, assistantMsg]);

            // Update chat history
            chatHistoryRef.current.push({ role: 'assistant', content: finalText });

            // Keep history manageable
            if (chatHistoryRef.current.length > 20) {
                chatHistoryRef.current = chatHistoryRef.current.slice(-14);
            }

            // Show unread indicator if chat is closed
            if (!isOpen) setHasUnread(true);

        } catch (error) {
            console.error('[AgenticBuddy] Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: 'Oops! Kuch gadbad ho gayi 😥. Thodi der baad try karo.',
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    // ─── Handle Key Press ───────────────────────────────────
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ─── Clear Chat ─────────────────────────────────────────
    const clearChat = () => {
        setMessages([]);
        chatHistoryRef.current = [];
        setPendingDraft(null);
    };

    // ─── Format Message (basic markdown) ────────────────────
    const formatMessage = (text) => {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br/>');
    };

    // ═══════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════

    return (
        <>
            {/* ─── Floating Action Button ─────────────────────── */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="aibuddy-fab"
                        id="aibuddy-fab"
                        aria-label="Open AI Assistant"
                    >
                        <Sparkles size={24} />
                        {hasUnread && <span className="aibuddy-unread-dot" />}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ─── Chat Panel ─────────────────────────────────── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="aibuddy-panel"
                    >
                        {/* Header */}
                        <div className="aibuddy-header">
                            <div className="aibuddy-header-left">
                                <div className="aibuddy-avatar">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3>AIBuddy</h3>
                                    <span className="aibuddy-status">
                                        <span className="status-dot" />
                                        {isTyping ? 'Typing...' : 'Online'}
                                    </span>
                                </div>
                            </div>
                            <div className="aibuddy-header-actions">
                                <button onClick={clearChat} title="Clear chat" className="aibuddy-icon-btn">
                                    <Trash2 size={16} />
                                </button>
                                <button onClick={() => setIsOpen(false)} title="Close" className="aibuddy-icon-btn">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="aibuddy-messages">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`aibuddy-msg ${msg.role}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="msg-avatar">
                                            <Bot size={14} />
                                        </div>
                                    )}
                                    <div className={`msg-bubble ${msg.role} ${msg.isAction ? 'action' : ''}`}>
                                        <div
                                            className="msg-text"
                                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                                        />
                                        <span className="msg-time">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Announcement Confirmation */}
                            {pendingDraft && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="aibuddy-confirm"
                                >
                                    <p>Kya main ye announcement post karu?</p>
                                    <div className="confirm-actions">
                                        <button onClick={handleConfirmAnnouncement} className="btn-confirm">
                                            <CheckCircle size={16} />
                                            Haan, Post Karo!
                                        </button>
                                        <button onClick={handleRejectAnnouncement} className="btn-reject">
                                            <XCircle size={16} />
                                            Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="aibuddy-msg assistant"
                                >
                                    <div className="msg-avatar">
                                        <Bot size={14} />
                                    </div>
                                    <div className="msg-bubble assistant typing">
                                        <div className="typing-dots">
                                            <span /><span /><span />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Smart Suggestions */}
                        {messages.length <= 1 && (
                            <div className="aibuddy-suggestions">
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        className="suggestion-chip"
                                        onClick={() => handleSend(s.message)}
                                    >
                                        {s.label}
                                        <ArrowRight size={12} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="aibuddy-input-area">
                            <div className="aibuddy-input-wrapper">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Kuch bhi puch le..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    disabled={isTyping}
                                    className="aibuddy-input"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!inputValue.trim() || isTyping}
                                    className="aibuddy-send-btn"
                                >
                                    {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                            <span className="aibuddy-powered">
                                <Zap size={10} /> Powered by Groq + Gemini
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Styles ─────────────────────────────────────── */}
            <style>{`
                /* ═══ FAB Button ═══ */
                .aibuddy-fab {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9999;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4), 0 0 0 0 rgba(99, 102, 241, 0.3);
                    cursor: pointer;
                    border: none;
                    animation: fabPulse 2s ease-in-out infinite;
                }

                @keyframes fabPulse {
                    0%, 100% { box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4), 0 0 0 0 rgba(99, 102, 241, 0.3); }
                    50% { box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4), 0 0 0 12px rgba(99, 102, 241, 0); }
                }

                .aibuddy-unread-dot {
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 14px;
                    height: 14px;
                    background: #ef4444;
                    border-radius: 50%;
                    border: 2px solid white;
                }

                /* ═══ Chat Panel ═══ */
                .aibuddy-panel {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9999;
                    width: 400px;
                    max-width: calc(100vw - 32px);
                    height: 600px;
                    max-height: calc(100vh - 100px);
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 20px;
                    border: 1px solid rgba(99, 102, 241, 0.15);
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8) inset;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                /* ═══ Header ═══ */
                .aibuddy-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                }

                .aibuddy-header-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .aibuddy-avatar {
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .aibuddy-header h3 {
                    font-size: 1rem;
                    font-weight: 700;
                    margin: 0;
                    letter-spacing: 0.3px;
                }

                .aibuddy-status {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.7rem;
                    opacity: 0.85;
                }

                .status-dot {
                    width: 6px;
                    height: 6px;
                    background: #4ade80;
                    border-radius: 50%;
                    animation: blink 2s infinite;
                }

                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }

                .aibuddy-header-actions {
                    display: flex;
                    gap: 4px;
                }

                .aibuddy-icon-btn {
                    padding: 6px;
                    border-radius: 8px;
                    color: rgba(255, 255, 255, 0.8);
                    cursor: pointer;
                    background: transparent;
                    border: none;
                    transition: all 0.2s;
                }

                .aibuddy-icon-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                    color: white;
                }

                /* ═══ Messages Area ═══ */
                .aibuddy-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    scrollbar-width: thin;
                    scrollbar-color: #c7d2fe transparent;
                }

                .aibuddy-messages::-webkit-scrollbar { width: 4px; }
                .aibuddy-messages::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 4px; }

                .aibuddy-msg {
                    display: flex;
                    gap: 8px;
                    max-width: 88%;
                }

                .aibuddy-msg.user {
                    align-self: flex-end;
                    flex-direction: row-reverse;
                }

                .aibuddy-msg.assistant {
                    align-self: flex-start;
                }

                .msg-avatar {
                    width: 26px;
                    height: 26px;
                    min-width: 26px;
                    background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #4f46e5;
                    margin-top: 2px;
                }

                .msg-bubble {
                    padding: 10px 14px;
                    border-radius: 16px;
                    font-size: 0.85rem;
                    line-height: 1.5;
                    position: relative;
                    word-break: break-word;
                }

                .msg-bubble.assistant {
                    background: #f1f5f9;
                    color: #1e293b;
                    border-bottom-left-radius: 4px;
                }

                .msg-bubble.assistant.action {
                    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                    border: 1px solid #a7f3d0;
                }

                .msg-bubble.user {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    border-bottom-right-radius: 4px;
                }

                .msg-text strong {
                    font-weight: 700;
                }

                .msg-time {
                    display: block;
                    font-size: 0.6rem;
                    opacity: 0.5;
                    margin-top: 4px;
                    text-align: right;
                }

                /* ═══ Typing Indicator ═══ */
                .msg-bubble.typing {
                    padding: 14px 18px;
                }

                .typing-dots {
                    display: flex;
                    gap: 5px;
                }

                .typing-dots span {
                    width: 7px;
                    height: 7px;
                    background: #94a3b8;
                    border-radius: 50%;
                    animation: typingBounce 1.4s infinite ease-in-out;
                }

                .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
                .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typingBounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-8px); }
                }

                /* ═══ Confirmation Actions ═══ */
                .aibuddy-confirm {
                    background: linear-gradient(135deg, #fefce8, #fef3c7);
                    border: 1px solid #fde68a;
                    border-radius: 14px;
                    padding: 14px;
                    margin: 4px 0;
                }

                .aibuddy-confirm p {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #92400e;
                    margin: 0 0 10px 0;
                }

                .confirm-actions {
                    display: flex;
                    gap: 8px;
                }

                .btn-confirm, .btn-reject {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 7px 14px;
                    border-radius: 10px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    transition: all 0.2s;
                }

                .btn-confirm {
                    background: #059669;
                    color: white;
                }

                .btn-confirm:hover { background: #047857; transform: translateY(-1px); }

                .btn-reject {
                    background: white;
                    color: #dc2626;
                    border: 1px solid #fecaca;
                }

                .btn-reject:hover { background: #fef2f2; }

                /* ═══ Smart Suggestions ═══ */
                .aibuddy-suggestions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    padding: 0 16px 12px;
                }

                .suggestion-chip {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 6px 12px;
                    background: linear-gradient(135deg, #eef2ff, #e0e7ff);
                    border: 1px solid #c7d2fe;
                    border-radius: 20px;
                    font-size: 0.72rem;
                    font-weight: 600;
                    color: #4338ca;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .suggestion-chip:hover {
                    background: linear-gradient(135deg, #c7d2fe, #a5b4fc);
                    color: #3730a3;
                    transform: translateY(-1px);
                }

                /* ═══ Input Area ═══ */
                .aibuddy-input-area {
                    padding: 12px 16px 14px;
                    border-top: 1px solid #e2e8f0;
                    background: rgba(248, 250, 252, 0.8);
                }

                .aibuddy-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: white;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 14px;
                    padding: 4px 4px 4px 14px;
                    transition: border-color 0.2s;
                }

                .aibuddy-input-wrapper:focus-within {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }

                .aibuddy-input {
                    flex: 1;
                    border: none;
                    outline: none;
                    font-size: 0.85rem;
                    color: #1e293b;
                    background: transparent;
                    font-family: inherit;
                }

                .aibuddy-input::placeholder {
                    color: #94a3b8;
                }

                .aibuddy-send-btn {
                    width: 36px;
                    height: 36px;
                    min-width: 36px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    border: none;
                    transition: all 0.2s;
                }

                .aibuddy-send-btn:hover:not(:disabled) {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
                }

                .aibuddy-send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .aibuddy-powered {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 3px;
                    font-size: 0.6rem;
                    color: #94a3b8;
                    margin-top: 8px;
                }

                /* ═══ Dark Mode Support ═══ */
                [data-theme="dark"] .aibuddy-panel {
                    background: rgba(15, 23, 42, 0.95);
                    border-color: rgba(99, 102, 241, 0.25);
                }

                [data-theme="dark"] .msg-bubble.assistant {
                    background: #1e293b;
                    color: #e2e8f0;
                }

                [data-theme="dark"] .msg-bubble.assistant.action {
                    background: linear-gradient(135deg, #064e3b, #065f46);
                    border-color: #047857;
                    color: #d1fae5;
                }

                [data-theme="dark"] .aibuddy-input-wrapper {
                    background: #1e293b;
                    border-color: #334155;
                }

                [data-theme="dark"] .aibuddy-input {
                    color: #e2e8f0;
                }

                [data-theme="dark"] .aibuddy-input-area {
                    border-top-color: #334155;
                    background: rgba(15, 23, 42, 0.8);
                }

                [data-theme="dark"] .suggestion-chip {
                    background: linear-gradient(135deg, #1e1b4b, #312e81);
                    border-color: #4338ca;
                    color: #a5b4fc;
                }

                [data-theme="dark"] .suggestion-chip:hover {
                    background: linear-gradient(135deg, #312e81, #3730a3);
                    color: #c7d2fe;
                }

                [data-theme="dark"] .aibuddy-confirm {
                    background: linear-gradient(135deg, #422006, #451a03);
                    border-color: #92400e;
                }

                [data-theme="dark"] .aibuddy-confirm p {
                    color: #fbbf24;
                }

                /* ═══ Mobile Responsive ═══ */
                @media (max-width: 480px) {
                    .aibuddy-panel {
                        bottom: 0;
                        right: 0;
                        width: 100vw;
                        height: 100vh;
                        max-height: 100vh;
                        border-radius: 0;
                    }

                    .aibuddy-fab {
                        bottom: 16px;
                        right: 16px;
                        width: 50px;
                        height: 50px;
                    }
                }

                /* ═══ Animation for spin ═══ */
                .animate-spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}
