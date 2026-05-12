import React, { useState, useEffect } from 'react';
import { subscribeToNotifications } from '../lib/firestore';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCircle2, XCircle, Clock, Users } from 'lucide-react';

// Handles both Firestore Timestamp objects and ISO date strings
function formatTimestamp(ts) {
    if (!ts) return 'N/A';
    try {
        if (ts.toDate) return ts.toDate().toLocaleDateString();
        if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleDateString();
        return new Date(ts).toLocaleDateString();
    } catch {
        return 'N/A';
    }
}

export function NotificationHistory() {
    const { user, userProfile } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const hasAuth = !!user && !!userProfile;
    const [loading, setLoading] = useState(hasAuth);

    const isCollege = userProfile?.roleType === 'college';
    const collegeFilters = ['All', 'Branch', 'Year', 'Section'];
    const schoolFilters = ['All', 'Class', 'Section'];
    const filterOptions = isCollege ? collegeFilters : schoolFilters;
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        if (!user || !userProfile) {
            return;
        }


        const unsubscribe = subscribeToNotifications(user.uid, (data) => {
            setNotifications(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, userProfile]);

    // Don't render anything while loading or if no notifications
    if (loading) return null;
    if (notifications.length === 0) return null;

    // Filter notifications by scope
    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'All') return true;

        if (isCollege) {
            if (filter === 'Branch') return notif.scope === 'branch';
            if (filter === 'Year') return notif.scope === 'year';
            if (filter === 'Section') return notif.scope === 'class';
        } else {
            if (filter === 'Class') return notif.scope === 'class';
            if (filter === 'Section') return notif.scope === 'section';
        }
        return true;
    });

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col" style={{ maxHeight: '420px' }}>
            <div className="p-6 border-b border-slate-50">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Bell size={20} className="text-indigo-500" /> Sent Notifications
                    </h2>
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        {filteredNotifications.length} sent
                    </span>
                </div>

                {/* Filters */}
                <div className="flex gap-2 p-1 bg-slate-50 rounded-xl overflow-x-auto no-scrollbar">
                    {filterOptions.map(opt => (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filter === opt
                                ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notif) => (
                        <div key={notif.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all group">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">{notif.noteTitle}</h4>
                                <StatusBadge status={notif.status} />
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
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
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-semibold capitalize">
                                    Scope: {notif.scopeDesc || notif.scope}
                                </span>
                                {notif.error && (
                                    <span className="text-red-500 truncate max-w-[150px]" title={notif.error}>
                                        Error: {notif.error}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Bell className="mx-auto text-slate-300 mb-3" size={32} />
                        <p className="text-sm font-bold text-slate-500">No notifications found</p>
                        <p className="text-xs text-slate-400 font-medium">Try a different filter</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    if (status === 'sent' || status === 'skipped') {
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
        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            <Clock size={10} /> Pending
        </span>
    );
}
