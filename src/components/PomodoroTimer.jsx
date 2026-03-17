// ============================================================
// 🍅 POMODORO TIMER — Floating Study Session Timer
// ============================================================
// A draggable floating Pomodoro timer with premium design.
// Triggered by AiBuddy "Study Session" action or keyboard shortcut.
// Renders inside DashboardLayout and persists across pages.
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Coffee, BookOpen, Minimize2, Maximize2 } from 'lucide-react';

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

export function PomodoroTimer() {
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [timeLeft, setTimeLeft] = useState(WORK_TIME);
    const [sessions, setSessions] = useState(0);
    const intervalRef = useRef(null);

    // Listen for the custom event from AiBuddy
    useEffect(() => {
        const handleStartPomodoro = () => {
            setIsVisible(true);
            setIsMinimized(false);
            setTimeLeft(WORK_TIME);
            setIsBreak(false);
            setIsRunning(false);
        };

        window.addEventListener('start-pomodoro', handleStartPomodoro);
        return () => window.removeEventListener('start-pomodoro', handleStartPomodoro);
    }, []);

    // Timer logic
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer completed — play beep and switch mode
            playBeep();
            if (isBreak) {
                // Break over → back to work
                setTimeLeft(WORK_TIME);
                setIsBreak(false);
                setIsRunning(false);
            } else {
                // Work done → start break
                setSessions(prev => prev + 1);
                setTimeLeft(BREAK_TIME);
                setIsBreak(true);
                setIsRunning(false);
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, timeLeft, isBreak]);

    // Web Audio API beep notification
    const playBeep = useCallback(() => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.frequency.value = isBreak ? 440 : 880;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.5);
        } catch (e) { }
    }, [isBreak]);

    const toggleTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(isBreak ? BREAK_TIME : WORK_TIME);
    };
    const closeTimer = () => {
        setIsRunning(false);
        setIsVisible(false);
        setTimeLeft(WORK_TIME);
        setIsBreak(false);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const totalTime = isBreak ? BREAK_TIME : WORK_TIME;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="pomo-float"
                style={{
                    position: 'fixed',
                    bottom: isMinimized ? '20px' : '90px',
                    right: '24px',
                    zIndex: 9998,
                }}
            >
                {isMinimized ? (
                    /* ─── Minimized Pill ─── */
                    <motion.div
                        onClick={() => setIsMinimized(false)}
                        className="pomo-pill"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className={`pomo-pill-dot ${isRunning ? 'running' : ''} ${isBreak ? 'break' : ''}`} />
                        <span className="pomo-pill-time">{formatTime(timeLeft)}</span>
                        {isBreak ? <Coffee size={14} /> : <BookOpen size={14} />}
                    </motion.div>
                ) : (
                    /* ─── Full Timer ─── */
                    <div className={`pomo-card ${isBreak ? 'break' : 'work'}`}>
                        {/* Header */}
                        <div className="pomo-header">
                            <div className="pomo-header-left">
                                {isBreak ? <Coffee size={16} /> : <BookOpen size={16} />}
                                <span>{isBreak ? 'Break Time' : 'Focus Mode'}</span>
                            </div>
                            <div className="pomo-header-actions">
                                <button onClick={() => setIsMinimized(true)} className="pomo-icon-btn">
                                    <Minimize2 size={14} />
                                </button>
                                <button onClick={closeTimer} className="pomo-icon-btn">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Timer Ring */}
                        <div className="pomo-ring-container">
                            <svg className="pomo-ring" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
                                <circle
                                    cx="60" cy="60" r="52"
                                    fill="none"
                                    stroke={isBreak ? '#4ade80' : '#fff'}
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 52}`}
                                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                                    transform="rotate(-90 60 60)"
                                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                                />
                            </svg>
                            <div className="pomo-time-display">
                                <span className="pomo-time">{formatTime(timeLeft)}</span>
                                <span className="pomo-label">{isBreak ? '☕ Rest' : '🎯 Focus'}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="pomo-controls">
                            <button onClick={resetTimer} className="pomo-ctrl-btn secondary">
                                <RotateCcw size={16} />
                            </button>
                            <button onClick={toggleTimer} className="pomo-ctrl-btn primary">
                                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                            </button>
                        </div>

                        {/* Sessions Count */}
                        {sessions > 0 && (
                            <div className="pomo-sessions">
                                🍅 {sessions} session{sessions > 1 ? 's' : ''} completed
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Styles ─── */}
                <style>{`
                    .pomo-pill {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px 16px;
                        background: linear-gradient(135deg, #4f46e5, #7c3aed);
                        color: white;
                        border-radius: 50px;
                        cursor: pointer;
                        font-size: 0.8rem;
                        font-weight: 700;
                        box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
                        border: 1px solid rgba(255,255,255,0.15);
                    }

                    .pomo-pill-dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: #94a3b8;
                    }
                    .pomo-pill-dot.running { background: #4ade80; animation: pomoPulse 1.5s infinite; }
                    .pomo-pill-dot.break { background: #fbbf24; }

                    @keyframes pomoPulse { 0%,100%{ opacity: 1; } 50%{ opacity: 0.4; } }

                    .pomo-card {
                        width: 220px;
                        border-radius: 20px;
                        padding: 16px;
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        border: 1px solid rgba(255,255,255,0.15);
                    }

                    .pomo-card.work {
                        background: linear-gradient(145deg, #4f46e5, #6d28d9);
                        color: white;
                        box-shadow: 0 20px 50px rgba(79, 70, 229, 0.4);
                    }

                    .pomo-card.break {
                        background: linear-gradient(145deg, #059669, #047857);
                        color: white;
                        box-shadow: 0 20px 50px rgba(5, 150, 105, 0.4);
                    }

                    .pomo-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 12px;
                    }

                    .pomo-header-left {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 0.78rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        opacity: 0.9;
                    }

                    .pomo-header-actions {
                        display: flex;
                        gap: 2px;
                    }

                    .pomo-icon-btn {
                        width: 24px;
                        height: 24px;
                        border-radius: 6px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        background: rgba(255,255,255,0.1);
                        border: none;
                        color: rgba(255,255,255,0.7);
                        transition: 0.2s;
                    }
                    .pomo-icon-btn:hover { background: rgba(255,255,255,0.2); color: white; }

                    .pomo-ring-container {
                        position: relative;
                        width: 120px;
                        height: 120px;
                        margin: 0 auto 12px;
                    }

                    .pomo-ring {
                        width: 100%;
                        height: 100%;
                    }

                    .pomo-time-display {
                        position: absolute;
                        inset: 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }

                    .pomo-time {
                        font-size: 1.6rem;
                        font-weight: 800;
                        letter-spacing: 1px;
                        font-variant-numeric: tabular-nums;
                    }

                    .pomo-label {
                        font-size: 0.65rem;
                        opacity: 0.7;
                        font-weight: 600;
                        margin-top: 2px;
                    }

                    .pomo-controls {
                        display: flex;
                        justify-content: center;
                        gap: 12px;
                    }

                    .pomo-ctrl-btn {
                        border: none;
                        border-radius: 12px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s;
                    }

                    .pomo-ctrl-btn.primary {
                        width: 48px;
                        height: 48px;
                        background: rgba(255,255,255,0.2);
                        color: white;
                        border: 1px solid rgba(255,255,255,0.3);
                    }
                    .pomo-ctrl-btn.primary:hover { background: rgba(255,255,255,0.3); transform: scale(1.05); }

                    .pomo-ctrl-btn.secondary {
                        width: 40px;
                        height: 40px;
                        background: rgba(255,255,255,0.1);
                        color: rgba(255,255,255,0.7);
                        border: 1px solid rgba(255,255,255,0.1);
                    }
                    .pomo-ctrl-btn.secondary:hover { background: rgba(255,255,255,0.2); color: white; }

                    .pomo-sessions {
                        text-align: center;
                        font-size: 0.7rem;
                        margin-top: 10px;
                        opacity: 0.7;
                        font-weight: 600;
                    }
                `}</style>
            </motion.div>
        </AnimatePresence>
    );
}
