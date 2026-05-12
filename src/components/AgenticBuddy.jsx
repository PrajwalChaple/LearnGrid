// ============================================================
// 🤖 AGENTIC BUDDY — Premium AI Assistant UI
// ============================================================
// A floating sidebar chat assistant that can perform actions
// within LearnGrid. Available on all dashboard pages.
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';
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
        if (isOpen && messages.length === 0 && userProfile) {
            const name = userProfile?.name?.split(' ')[0] || 'Bhai';
            setMessages([{
                id: Date.now(),
                role: 'assistant',
                content: `Hey ${name}! 👋 I am your AIBuddy — your personal LearnGrid assistant.\n\nYou can ask me about assignments, draft announcements, or get a dashboard summary. How can I help you today? 🚀`,
                timestamp: new Date()
            }]);
        }
    }, [isOpen, messages.length, userProfile]);

    // Don't render if not logged in or not onboarded
    if (!user || !userProfile?.roleType) return null;

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
            content: 'Alright, I cancelled the announcement. Let me know if there is anything else I can assist with! 😊',
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
                content: finalText || 'Hmm, I didn\'t quite catch that 🤔. Could you rephrase?',
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
                content: 'Oops! Something went wrong 😥. Please try again in a few moments.',
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

    // ─── Format Message (XSS-safe) ────────────────────────────
    const formatMessage = (text) => {
        if (!text) return '';
        // Sanitize first: strip ALL HTML tags from AI response
        const clean = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
        // Then apply safe markdown formatting
        return clean
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
                                    <p>Should I go ahead and post this announcement?</p>
                                    <div className="confirm-actions">
                                        <button onClick={handleConfirmAnnouncement} className="btn-confirm">
                                            <CheckCircle size={16} />
                                            Yes, Post it!
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
                                    placeholder="Ask anything..."
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
                    width: 420px;
                    max-width: calc(100vw - 32px);
                    height: 640px;
                    max-height: calc(100vh - 100px);
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border-radius: 24px;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 1) inset;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                /* ═══ Header ═══ */
                .aibuddy-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 24px;
                    background: rgba(248, 250, 252, 0.8);
                    border-bottom: 1px solid rgba(0,0,0,0.03);
                    color: #0f172a;
                }

                .aibuddy-header-left {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .aibuddy-avatar {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #0f172a, #334155);
                    color: white;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(15,23,42,0.15);
                }

                .aibuddy-header h3 {
                    font-size: 1.1rem;
                    font-weight: 800;
                    margin: 0;
                    letter-spacing: -0.3px;
                }

                .aibuddy-status {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.75rem;
                    color: #64748b;
                    font-weight: 500;
                    margin-top: 2px;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                    animation: blink 2.5s infinite ease-in-out;
                    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
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
                    padding: 8px;
                    border-radius: 12px;
                    color: #64748b;
                    cursor: pointer;
                    background: #f8fafc;
                    border: 1px solid #f1f5f9;
                    transition: all 0.2s;
                }

                .aibuddy-icon-btn:hover {
                    background: #f1f5f9;
                    color: #0f172a;
                    border-color: #e2e8f0;
                }

                /* ═══ Messages Area ═══ */
                .aibuddy-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0,0,0,0.1) transparent;
                }

                .aibuddy-messages::-webkit-scrollbar { width: 6px; }
                .aibuddy-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }

                .aibuddy-msg {
                    display: flex;
                    gap: 12px;
                    max-width: 90%;
                }

                .aibuddy-msg.user {
                    align-self: flex-end;
                    flex-direction: row-reverse;
                }

                .aibuddy-msg.assistant {
                    align-self: flex-start;
                }

                .msg-avatar {
                    width: 28px;
                    height: 28px;
                    min-width: 28px;
                    background: linear-gradient(135deg, #0f172a, #334155);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    margin-top: 4px;
                    font-size: 0.7rem;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                }

                .msg-bubble {
                    padding: 14px 18px;
                    border-radius: 20px;
                    font-size: 0.95rem;
                    line-height: 1.6;
                    position: relative;
                    word-break: break-word;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }

                .msg-bubble.assistant {
                    background: #ffffff;
                    color: #334155;
                    border: 1px solid rgba(0,0,0,0.05);
                    border-bottom-left-radius: 4px;
                }

                .msg-bubble.assistant.action {
                    background: #ffffff;
                    border: 1px solid #10b981;
                    box-shadow: 0 10px 30px rgba(16,185,129,0.1);
                    color: #065f46;
                }

                .msg-bubble.user {
                    background: #0f172a;
                    color: white;
                    border-bottom-right-radius: 4px;
                    box-shadow: 0 10px 25px rgba(15,23,42,0.15);
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
                    padding: 16px 20px;
                }

                .typing-dots {
                    display: flex;
                    gap: 6px;
                }

                .typing-dots span {
                    width: 8px;
                    height: 8px;
                    background: #cbd5e1;
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
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-left: 4px solid #f59e0b;
                    border-radius: 16px;
                    padding: 16px;
                    margin: 8px 0;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.03);
                }

                .aibuddy-confirm p {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0 0 12px 0;
                }

                .confirm-actions {
                    display: flex;
                    gap: 12px;
                }

                .btn-confirm, .btn-reject {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 16px;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    transition: all 0.2s;
                }

                .btn-confirm {
                    background: #0f172a;
                    color: white;
                }

                .btn-confirm:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 6px 12px rgba(15,23,42,0.15); }

                .btn-reject {
                    background: white;
                    color: #64748b;
                    border: 1px solid #e2e8f0;
                }

                .btn-reject:hover { background: #f8fafc; color: #0f172a; border-color: #cbd5e1; }

                /* ═══ Smart Suggestions ═══ */
                .aibuddy-suggestions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    padding: 0 24px 16px;
                }

                .suggestion-chip {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #475569;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .suggestion-chip:hover {
                    background: #f1f5f9;
                    color: #0f172a;
                    border-color: #cbd5e1;
                    transform: translateY(-1px);
                }

                /* ═══ Input Area ═══ */
                .aibuddy-input-area {
                    padding: 16px 24px 24px;
                    border-top: 1px solid rgba(0,0,0,0.05);
                    background: rgba(248, 250, 252, 0.9);
                    backdrop-filter: blur(10px);
                }

                .aibuddy-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: white;
                    border: 1px solid rgba(0,0,0,0.1);
                    border-radius: 20px;
                    padding: 8px 8px 8px 16px;
                    transition: all 0.3s;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }

                .aibuddy-input-wrapper:focus-within {
                    border-color: #0f172a;
                    box-shadow: 0 8px 24px rgba(15,23,42,0.1);
                }

                .aibuddy-input {
                    flex: 1;
                    border: none;
                    outline: none;
                    font-size: 0.95rem;
                    color: #0f172a;
                    background: transparent;
                    font-family: inherit;
                }

                .aibuddy-input::placeholder {
                    color: #94a3b8;
                    font-weight: 400;
                }

                .aibuddy-send-btn {
                    width: 42px;
                    height: 42px;
                    min-width: 42px;
                    border-radius: 14px;
                    background: #0f172a;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    border: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .aibuddy-send-btn:hover:not(:disabled) {
                    transform: scale(1.05);
                    background: #1e293b;
                    box-shadow: 0 8px 20px rgba(15,23,42,0.25);
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
