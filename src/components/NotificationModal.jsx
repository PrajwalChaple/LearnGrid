import React, { useState, useEffect } from 'react';
import { X, Users, Check, BookOpen, School, Mail, Bell } from 'lucide-react';
import { getRecipientCount, getRecipients, createNotification, createUserNotifications } from '../lib/firestore';
import { sendEmailBatch } from '../lib/email';
import { useAuth } from '../context/AuthContext';

export function NotificationModal({ isOpen, onClose, noteData, userProfile, onConfirmSuccess, itemType = 'note' }) {
    const { user } = useAuth();
    const [scope, setScope] = useState('class'); // Default to class
    const [notifyMethod, setNotifyMethod] = useState('bell'); // 'email' = Email + In-App, 'bell' = In-App only
    const [loading, setLoading] = useState(false);
    const [recipientCount, setRecipientCount] = useState(0);
    const [calculating, setCalculating] = useState(false);

    // Hierarchy Logic
    // College > Branch > Class

    useEffect(() => {
        if (isOpen && userProfile) {
            calculateRecipients();
        }
    }, [isOpen, scope, userProfile, user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

    const calculateRecipients = async () => {
        setCalculating(true);
        try {
            const currentUid = user?.uid || '';
            const count = await getRecipientCount(userProfile, scope, currentUid);
            setRecipientCount(count);
        } catch (error) {
            console.error("Error calculating recipients:", error);
            setRecipientCount(0);
        } finally {
            setCalculating(false);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            if (scope !== 'none') {
                // 1. Fetch Recipients (excluding current user)
                const currentUid = user?.uid || '';
                const recipients = await getRecipients(userProfile, scope, currentUid);
                const count = recipients.length;
                console.log(`Sending to ${count} recipients...`);

                // 2. Send Emails (only if method is 'email')
                let emailStatus = notifyMethod === 'email' ? 'sent' : 'skipped';
                let emailError = '';

                if (notifyMethod === 'email') {
                    try {
                        const emailResult = await sendEmailBatch(recipients, noteData, userProfile, itemType);
                        if (!emailResult.success) {
                            emailStatus = 'failed';
                        }
                    } catch (err) {
                        console.error("Email sending error:", err);
                        emailStatus = 'failed';
                        emailError = err.message || 'Unknown error';
                    }
                }

                // 3. Save Notification Record (no undefined values!)
                const notificationData = {
                    senderId: user?.uid || '',
                    senderName: userProfile?.name || userProfile?.displayName || 'Unknown',
                    institutionName: userProfile?.institutionName || '',
                    department: userProfile?.department || '',
                    year: userProfile?.year || '',
                    section: userProfile?.section || userProfile?.sector || '',
                    scope: scope,
                    noteId: noteData?.id || '',
                    noteTitle: noteData?.title || '',
                    recipientCount: count,
                    status: emailStatus,
                    error: emailError
                };

                console.log('Creating notification:', notificationData);
                await createNotification(notificationData);

                // Create in-app notifications for each recipient
                const typeLabels = { note: 'note', assignment: 'assignment', announcement: 'announcement' };
                const label = typeLabels[itemType] || 'note';
                await createUserNotifications(recipients, {
                    senderName: userProfile?.name || userProfile?.displayName || 'Someone',
                    type: itemType || 'note',
                    title: noteData?.title || '',
                    message: `shared a new ${label}: "${noteData?.title || 'Untitled'}"`,
                    scope: scope,
                });
            }
            onConfirmSuccess();
            onClose();
        } catch (error) {
            console.error("Notification creation failed:", error);
            alert("Failed to create notification: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 bg-white/50">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Notify Students</h2>
                            <p className="text-sm text-gray-500 mt-1">Who should receive this update?</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">

                    {/* Options */}
                    <div className="space-y-3">
                        <Option
                            icon={<Users className="text-indigo-500" />}
                            title="My Class"
                            subtitle={`Notify students in ${userProfile?.year || userProfile?.standard}${userProfile?.section ? ' - ' + userProfile.section : userProfile?.sector ? ' - ' + userProfile.sector : ''}`}
                            selected={scope === 'class'}
                            onClick={() => setScope('class')}
                        />

                        <Option
                            icon={<BookOpen className="text-purple-500" />}
                            title="My Branch"
                            subtitle={`Notify all students in ${userProfile?.department}`}
                            selected={scope === 'branch'}
                            onClick={() => setScope('branch')}
                        />

                        <Option
                            icon={<School className="text-pink-500" />}
                            title="Entire College"
                            subtitle={`Notify everyone in ${userProfile?.institutionName}`}
                            selected={scope === 'college'}
                            onClick={() => setScope('college')}
                        />

                        <Option
                            icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                            title="Do Not Notify"
                            subtitle="Only upload the file without sending notifications"
                            selected={scope === 'none'}
                            onClick={() => setScope('none')}
                        />
                    </div>

                    {/* Notification Method Toggle */}
                    {scope !== 'none' && (
                        <div className="mt-2 animate-fade-in">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notification Method</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setNotifyMethod('email')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${notifyMethod === 'email'
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    <Mail size={16} />
                                    Email + In-App
                                </button>
                                <button
                                    onClick={() => setNotifyMethod('bell')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${notifyMethod === 'bell'
                                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    <Bell size={16} />
                                    In-App Only
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Dynamic Helper Text */}
                    {scope !== 'none' && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-start gap-3 animate-fade-in">
                            <div className="p-1 bg-indigo-100 rounded-full mt-0.5">
                                <Users size={14} className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-indigo-900 font-medium">
                                    Estimated Reach
                                </p>
                                <p className="text-xs text-indigo-700 mt-0.5">
                                    {calculating
                                        ? "Calculating..."
                                        : `~${recipientCount} students will be notified instantly.`}
                                </p>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-5 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors text-sm"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm flex items-center gap-2 disabled:opacity-70 disabled:transform-none"
                    >
                        {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                        Confirm Selection
                    </button>
                </div>

            </div>

            <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
        </div>
    );
}

function Option({ icon, title, subtitle, selected, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left group
        ${selected
                    ? 'bg-indigo-50/50 border-indigo-500 shadow-sm'
                    : 'bg-white border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                }
      `}
        >
            <div className={`p-2 rounded-lg transition-colors ${selected ? 'bg-white shadow-sm' : 'bg-gray-50 group-hover:bg-white'}`}>
                {icon}
            </div>
            <div className="flex-1">
                <h3 className={`font-semibold text-sm ${selected ? 'text-indigo-900' : 'text-gray-700'}`}>
                    {title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{subtitle}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
        ${selected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}
      `}>
                {selected && <Check size={12} className="text-white" />}
            </div>
        </button>
    );
}
