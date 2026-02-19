import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToMyNotifications, markNotificationRead, markAllNotificationsRead } from '../lib/firestore';
import { BookOpen, AlertCircle, MessageSquare, CheckCheck, Bell, X } from 'lucide-react';

const TYPE_CONFIG = {
    note: { icon: BookOpen, color: '#6366f1', bg: '#eef2ff', label: 'Note' },
    assignment: { icon: AlertCircle, color: '#f59e0b', bg: '#fffbeb', label: 'Assignment' },
    announcement: { icon: MessageSquare, color: '#8b5cf6', bg: '#f5f3ff', label: 'Announcement' },
};

function timeAgo(ts) {
    if (!ts) return '';
    try {
        const date = ts.toDate ? ts.toDate() : ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
        const diff = Math.floor((Date.now() - date.getTime()) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return date.toLocaleDateString();
    } catch { return ''; }
}

export function NotificationDropdown({ isOpen, onClose }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!user) return;
        const unsub = subscribeToMyNotifications(user.uid, (data) => {
            setNotifications(data);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                onClose();
            }
        };
        // Delay to avoid the click that opened it
        const timer = setTimeout(() => document.addEventListener('mousedown', handleClick), 50);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClick);
        };
    }, [isOpen, onClose]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAllRead = async () => {
        if (user && unreadCount > 0) {
            await markAllNotificationsRead(user.uid);
        }
    };

    const handleNotifClick = async (notif) => {
        if (!notif.read) {
            await markNotificationRead(notif.id);
        }
    };

    if (!isOpen) return null;

    return (
        <div ref={dropdownRef} className="notif-dropdown">
            {/* Header */}
            <div className="notif-header">
                <div className="notif-header-left">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="notif-unread-pill">{unreadCount} new</span>
                    )}
                </div>
                <div className="notif-header-right">
                    {unreadCount > 0 && (
                        <button className="notif-mark-all" onClick={handleMarkAllRead} title="Mark all as read">
                            <CheckCheck size={16} />
                        </button>
                    )}
                    <button className="notif-close" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="notif-list">
                {loading ? (
                    <div className="notif-empty">
                        <div className="notif-spinner"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="notif-empty">
                        <Bell size={32} style={{ color: '#d1d5db', marginBottom: 8 }} />
                        <p className="notif-empty-title">No notifications yet</p>
                        <p className="notif-empty-sub">When someone shares notes or assignments, you'll see them here.</p>
                    </div>
                ) : (
                    notifications.slice(0, 20).map((notif) => {
                        const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.note;
                        const Icon = config.icon;
                        return (
                            <div
                                key={notif.id}
                                className={`notif-item ${!notif.read ? 'notif-unread' : ''}`}
                                onClick={() => handleNotifClick(notif)}
                            >
                                <div className="notif-icon" style={{ background: config.bg, color: config.color }}>
                                    <Icon size={18} />
                                </div>
                                <div className="notif-content">
                                    <p className="notif-text">
                                        <strong>{notif.senderName}</strong> {notif.message}
                                    </p>
                                    <div className="notif-meta">
                                        <span className="notif-type-badge" style={{ background: config.bg, color: config.color }}>
                                            {config.label}
                                        </span>
                                        <span className="notif-time">{timeAgo(notif.createdAt)}</span>
                                    </div>
                                </div>
                                {!notif.read && <div className="notif-dot"></div>}
                            </div>
                        );
                    })
                )}
            </div>

            <style>{`
                .notif-dropdown {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    width: 380px;
                    max-height: 480px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 16px;
                    border: 1px solid rgba(229, 231, 235, 0.8);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
                    z-index: 100;
                    display: flex;
                    flex-direction: column;
                    animation: notif-slide-in 0.2s ease-out;
                    overflow: hidden;
                }

                @keyframes notif-slide-in {
                    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                .notif-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    border-bottom: 1px solid #f3f4f6;
                }
                .notif-header-left {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .notif-header h3 {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #111827;
                    margin: 0;
                }
                .notif-unread-pill {
                    font-size: 0.65rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    padding: 2px 8px;
                    border-radius: 20px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .notif-header-right {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .notif-mark-all, .notif-close {
                    background: none;
                    border: none;
                    padding: 6px;
                    border-radius: 8px;
                    color: #6b7280;
                    cursor: pointer;
                    transition: all 0.15s;
                    display: flex;
                    align-items: center;
                }
                .notif-mark-all:hover {
                    background: #eef2ff;
                    color: #6366f1;
                }
                .notif-close:hover {
                    background: #f3f4f6;
                    color: #374151;
                }

                .notif-list {
                    flex: 1;
                    overflow-y: auto;
                    max-height: 400px;
                }
                .notif-list::-webkit-scrollbar {
                    width: 4px;
                }
                .notif-list::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 20px;
                }

                .notif-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 14px 20px;
                    cursor: pointer;
                    transition: background 0.15s;
                    position: relative;
                    border-bottom: 1px solid #f9fafb;
                }
                .notif-item:hover {
                    background: #f9fafb;
                }
                .notif-unread {
                    background: #fafaff;
                }
                .notif-unread:hover {
                    background: #f0f0ff;
                }

                .notif-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .notif-content {
                    flex: 1;
                    min-width: 0;
                }
                .notif-text {
                    font-size: 0.85rem;
                    color: #374151;
                    line-height: 1.4;
                    margin: 0 0 6px 0;
                }
                .notif-text strong {
                    color: #111827;
                    font-weight: 600;
                }
                .notif-meta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .notif-type-badge {
                    font-size: 0.65rem;
                    font-weight: 600;
                    padding: 1px 6px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }
                .notif-time {
                    font-size: 0.7rem;
                    color: #9ca3af;
                }

                .notif-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #6366f1;
                    flex-shrink: 0;
                    margin-top: 8px;
                }

                .notif-empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    text-align: center;
                }
                .notif-empty-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #6b7280;
                    margin: 0;
                }
                .notif-empty-sub {
                    font-size: 0.75rem;
                    color: #9ca3af;
                    margin: 4px 0 0 0;
                }

                .notif-spinner {
                    width: 24px;
                    height: 24px;
                    border: 3px solid #e5e7eb;
                    border-top-color: #6366f1;
                    border-radius: 50%;
                    animation: spin 0.6s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 480px) {
                    .notif-dropdown {
                        width: calc(100vw - 24px);
                        right: -12px;
                    }
                }
            `}</style>
        </div>
    );
}

// Export unread count hook for Navbar
export function useUnreadCount() {
    const { user } = useAuth();
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        const unsub = subscribeToMyNotifications(user.uid, (data) => {
            setCount(data.filter(n => !n.read).length);
        });
        return () => unsub();
    }, [user]);

    return count;
}
