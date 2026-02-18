import React, { useState, useEffect } from 'react';
import { subscribeToNotifications } from '../lib/firestore';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCircle2, XCircle, Clock, Users } from 'lucide-react';

// Handles both Firestore Timestamp objects and ISO date strings
function formatTimestamp(ts) {
    if (!ts) return 'N/A';
    try {
        // Firestore Timestamp has a toDate() method
        if (ts.toDate) return ts.toDate().toLocaleDateString();
        // Firestore Timestamp can also be { seconds, nanoseconds }
        if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleDateString();
        // Plain ISO string or Date
        return new Date(ts).toLocaleDateString();
    } catch {
        return 'N/A';
    }
}

export function NotificationHistory() {
    const { user, userProfile } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !userProfile) return;

        const unsubscribe = subscribeToNotifications(user.uid, (data) => {
            setNotifications(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, userProfile]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit animate-pulse">
                <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-16 bg-gray-100 rounded-xl"></div>
                    <div className="h-16 bg-gray-100 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (notifications.length === 0) return null; // Or show empty state

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Bell size={20} className="text-indigo-600" />
                    Sent Notifications
                </h2>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {notifications.length} Total
                </span>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all group">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{notif.noteTitle}</h4>
                            <StatusBadge status={notif.status} />
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {formatTimestamp(notif.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Users size={12} />
                                {notif.recipientCount} Recipients
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded capitalize">
                                Scope: {notif.scope}
                            </span>
                            {notif.error && (
                                <span className="text-red-500 truncate max-w-[150px]" title={notif.error}>
                                    Error: {notif.error}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #e2e8f0;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
}

function StatusBadge({ status }) {
    if (status === 'sent') {
        return (
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                <CheckCircle2 size={10} /> Sent
            </span>
        );
    }
    if (status === 'failed') {
        return (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                <XCircle size={10} /> Failed
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            <Clock size={10} /> Pending
        </span>
    );
}
