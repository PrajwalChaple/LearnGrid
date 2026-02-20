import React, { useState, useEffect } from 'react';
import { X, Users, Check, BookOpen, School, Mail, Bell } from 'lucide-react';
import { getRecipientCount, getRecipients, createNotification, createUserNotifications } from '../lib/firestore';
import { sendEmailBatch } from '../lib/email';
import { useAuth } from '../context/AuthContext';

export function NotificationModal({ isOpen, onClose, noteData, userProfile, onConfirmSuccess, onUpload, itemType = 'note' }) {
    const { user } = useAuth();
    const [scope, setScope] = useState('class');
    const [sendInApp, setSendInApp] = useState(false);
    const [sendEmail, setSendEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recipientCount, setRecipientCount] = useState(0);
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        if (isOpen && userProfile) {
            calculateRecipients();
            setSendInApp(false);
            setSendEmail(false);
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
            // 1. First, do the actual upload/save if onUpload is provided
            let savedData = noteData;
            if (onUpload) {
                savedData = await onUpload();
                if (!savedData) {
                    // Upload failed or was cancelled
                    setLoading(false);
                    return;
                }
            }

            // 2. Fetch Recipients (excluding current user)
            const currentUid = user?.uid || '';
            const recipients = await getRecipients(userProfile, scope, currentUid);
            const count = recipients.length;
            console.log(`Sending to ${count} recipients...`);

            // 3. Send Emails (only if toggle is ON)
            let emailStatus = sendEmail ? 'sent' : 'skipped';
            let emailError = '';

            if (sendEmail) {
                try {
                    const emailResult = await sendEmailBatch(recipients, savedData, userProfile, itemType);
                    if (!emailResult.success) {
                        emailStatus = 'failed';
                    }
                } catch (err) {
                    console.error("Email sending error:", err);
                    emailStatus = 'failed';
                    emailError = err.message || 'Unknown error';
                }
            }

            // 4. Save Notification Record
            const notificationData = {
                senderId: user?.uid || '',
                senderName: userProfile?.name || userProfile?.displayName || 'Unknown',
                institutionName: userProfile?.institutionName || '',
                department: userProfile?.department || '',
                year: userProfile?.year || '',
                section: userProfile?.section || userProfile?.sector || '',
                scope: scope,
                noteId: savedData?.id || '',
                noteTitle: savedData?.title || '',
                recipientCount: count,
                status: emailStatus,
                error: emailError
            };

            console.log('Creating notification:', notificationData);
            await createNotification(notificationData);

            // 5. Create in-app notifications only if toggle is ON
            if (sendInApp) {
                const typeLabels = { note: 'note', assignment: 'assignment', announcement: 'announcement' };
                const label = typeLabels[itemType] || 'note';
                await createUserNotifications(recipients, {
                    senderName: userProfile?.name || userProfile?.displayName || 'Someone',
                    type: itemType || 'note',
                    title: savedData?.title || '',
                    message: `shared a new ${label}: "${savedData?.title || 'Untitled'}"`,
                    scope: scope,
                });
            }

            onConfirmSuccess();
            onClose();
        } catch (error) {
            console.error("Notification creation failed:", error);
            alert("Failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50" style={{ overflow: 'auto' }}>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-nmodal-fade"
                onClick={onClose}
            ></div>

            {/* Centering wrapper */}
            <div className="nmodal-center-wrap">
                {/* Modal — wide & short */}
                <div className="nmodal-card animate-nmodal-scale">

                    {/* Header */}
                    <div className="nmodal-header">
                        <div>
                            <h2 className="nmodal-title">Notify Students</h2>
                            <p className="nmodal-subtitle">Choose audience & delivery channels</p>
                        </div>
                        <button onClick={onClose} className="nmodal-close-btn">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Body — two-column layout */}
                    <div className="nmodal-body">

                        {/* LEFT: Scope selection */}
                        <div className="nmodal-col-left">
                            <p className="nmodal-section-label">Audience</p>
                            <div className="nmodal-scope-grid">
                                <ScopeCard
                                    icon={<Users size={18} className="text-indigo-500" />}
                                    title="My Class"
                                    subtitle={`${userProfile?.year || userProfile?.standard || ''}${userProfile?.section ? ' – ' + userProfile.section : userProfile?.sector ? ' – ' + userProfile.sector : ''}`}
                                    selected={scope === 'class'}
                                    onClick={() => setScope('class')}
                                />
                                <ScopeCard
                                    icon={<BookOpen size={18} className="text-purple-500" />}
                                    title="My Branch"
                                    subtitle={userProfile?.department || ''}
                                    selected={scope === 'branch'}
                                    onClick={() => setScope('branch')}
                                />
                                <ScopeCard
                                    icon={<School size={18} className="text-pink-500" />}
                                    title="Entire College"
                                    subtitle={userProfile?.institutionName || ''}
                                    selected={scope === 'college'}
                                    onClick={() => setScope('college')}
                                />
                            </div>
                        </div>

                        {/* RIGHT: Delivery toggles + reach */}
                        <div className="nmodal-col-right">
                            <p className="nmodal-section-label">Delivery</p>

                            {/* In-App Toggle */}
                            <div className={`nmodal-toggle ${sendInApp ? 'nmodal-toggle--on' : ''}`} onClick={() => setSendInApp(!sendInApp)}>
                                <div className="nmodal-toggle-left">
                                    <div className={`nmodal-toggle-icon ${sendInApp ? 'nmodal-toggle-icon--on' : ''}`}>
                                        <Bell size={15} />
                                    </div>
                                    <div>
                                        <span className="nmodal-toggle-title">In-App Alerts</span>
                                        <span className="nmodal-toggle-desc">Notifications inside LearnGrid</span>
                                    </div>
                                </div>
                                <div className={`nmodal-switch ${sendInApp ? 'nmodal-switch--on' : ''}`}>
                                    <span className="nmodal-switch-knob" />
                                </div>
                            </div>

                            {/* Email Toggle */}
                            <div className={`nmodal-toggle ${sendEmail ? 'nmodal-toggle--on' : ''}`} onClick={() => setSendEmail(!sendEmail)}>
                                <div className="nmodal-toggle-left">
                                    <div className={`nmodal-toggle-icon ${sendEmail ? 'nmodal-toggle-icon--on' : ''}`}>
                                        <Mail size={15} />
                                    </div>
                                    <div>
                                        <span className="nmodal-toggle-title">Send Email</span>
                                        <span className="nmodal-toggle-desc">Deliver via email too</span>
                                    </div>
                                </div>
                                <div className={`nmodal-switch ${sendEmail ? 'nmodal-switch--on' : ''}`}>
                                    <span className="nmodal-switch-knob" />
                                </div>
                            </div>

                            {/* Estimated Reach */}
                            <div className="nmodal-reach">
                                <Users size={13} className="text-indigo-600" />
                                <span>
                                    {calculating
                                        ? 'Calculating...'
                                        : `~${recipientCount} students will be notified`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="nmodal-footer">
                        <button onClick={onClose} className="nmodal-btn-skip">Skip</button>
                        <button onClick={handleConfirm} disabled={loading} className="nmodal-btn-confirm">
                            {loading && <div className="nmodal-spinner"></div>}
                            Confirm
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                /* ── centering ── */
                .nmodal-center-wrap {
                    display: flex; align-items: center; justify-content: center;
                    min-height: 100%; padding: 1.25rem;
                    position: relative; z-index: 1;
                }

                /* ── card ── */
                .nmodal-card {
                    width: 100%; max-width: 38rem;
                    background: rgba(255,255,255,.88);
                    backdrop-filter: blur(16px);
                    border-radius: 1.125rem;
                    box-shadow: 0 20px 60px rgba(0,0,0,.12), 0 0 0 1px rgba(255,255,255,.5);
                    overflow: hidden;
                    display: flex; flex-direction: column;
                }

                /* ── header ── */
                .nmodal-header {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: .875rem 1.25rem;
                    border-bottom: 1px solid #f0f0f0;
                    background: rgba(255,255,255,.5);
                }
                .nmodal-title { font-size: 1rem; font-weight: 700; color: #1f2937; margin: 0; }
                .nmodal-subtitle { font-size: .7rem; color: #9ca3af; margin-top: 1px; }
                .nmodal-close-btn {
                    padding: 6px; border-radius: 50%; border: none; background: none;
                    color: #9ca3af; cursor: pointer; transition: background .15s;
                }
                .nmodal-close-btn:hover { background: #f3f4f6; }

                /* ── body two columns ── */
                .nmodal-body {
                    display: grid; grid-template-columns: 1fr 1fr;
                    gap: 1rem; padding: 1rem 1.25rem;
                }
                @media (max-width: 540px) {
                    .nmodal-body { grid-template-columns: 1fr; }
                }
                .nmodal-section-label {
                    font-size: .65rem; font-weight: 600; text-transform: uppercase;
                    letter-spacing: .06em; color: #9ca3af; margin: 0 0 .5rem 2px;
                }

                /* ── scope grid (left col) ── */
                .nmodal-col-left {}
                .nmodal-scope-grid { display: flex; flex-direction: column; gap: .4rem; }
                .nmodal-scope {
                    display: flex; align-items: center; gap: .6rem;
                    padding: .55rem .7rem; border-radius: .75rem;
                    border: 1.5px solid #e5e7eb; background: #fff;
                    cursor: pointer; transition: all .2s; width: 100%;
                    text-align: left;
                }
                .nmodal-scope:hover { border-color: #c7d2fe; background: #fafafe; }
                .nmodal-scope--selected {
                    border-color: #6366f1; background: rgba(99,102,241,.06);
                    box-shadow: 0 0 0 2px rgba(99,102,241,.1);
                }
                .nmodal-scope-icon {
                    width: 32px; height: 32px; border-radius: .5rem;
                    display: flex; align-items: center; justify-content: center;
                    background: #f5f5f5; flex-shrink: 0; transition: background .2s;
                }
                .nmodal-scope--selected .nmodal-scope-icon { background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
                .nmodal-scope-title { font-size: .8rem; font-weight: 600; color: #374151; display: block; }
                .nmodal-scope-sub { font-size: .65rem; color: #9ca3af; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
                .nmodal-scope--selected .nmodal-scope-title { color: #312e81; }
                .nmodal-scope-check {
                    width: 16px; height: 16px; border-radius: 50%; margin-left: auto;
                    border: 2px solid #d1d5db; display: flex; align-items: center;
                    justify-content: center; flex-shrink: 0; transition: all .2s;
                }
                .nmodal-scope--selected .nmodal-scope-check {
                    border-color: #6366f1; background: #6366f1;
                }

                /* ── right col ── */
                .nmodal-col-right { display: flex; flex-direction: column; gap: .4rem; }
                .nmodal-col-right .nmodal-section-label { margin-bottom: .35rem; }

                /* ── toggle rows ── */
                .nmodal-toggle {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: .5rem .65rem; border-radius: .7rem;
                    border: 1.5px solid #e5e7eb; background: #fff;
                    cursor: pointer; transition: all .2s;
                }
                .nmodal-toggle:hover { border-color: #c7d2fe; }
                .nmodal-toggle--on { background: rgba(99,102,241,.05); border-color: #c7d2fe; }
                .nmodal-toggle-left { display: flex; align-items: center; gap: .5rem; }
                .nmodal-toggle-icon {
                    width: 30px; height: 30px; border-radius: .5rem;
                    display: flex; align-items: center; justify-content: center;
                    background: #f3f4f6; color: #9ca3af; transition: all .2s; flex-shrink: 0;
                }
                .nmodal-toggle-icon--on { background: #e0e7ff; color: #4f46e5; }
                .nmodal-toggle-title { font-size: .78rem; font-weight: 600; color: #374151; display: block; }
                .nmodal-toggle-desc { font-size: .6rem; color: #b0b4bc; display: block; }

                /* ── switch ── */
                .nmodal-switch {
                    width: 34px; height: 19px; border-radius: 10px;
                    background: #d1d5db; position: relative; transition: background .2s;
                    flex-shrink: 0;
                }
                .nmodal-switch--on { background: #6366f1; }
                .nmodal-switch-knob {
                    position: absolute; top: 2.5px; left: 2.5px;
                    width: 14px; height: 14px; border-radius: 50%;
                    background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.15);
                    transition: transform .2s;
                }
                .nmodal-switch--on .nmodal-switch-knob { transform: translateX(15px); }

                /* ── reach badge ── */
                .nmodal-reach {
                    display: flex; align-items: center; gap: .4rem;
                    background: #eef2ff; border: 1px solid #e0e7ff;
                    border-radius: .5rem; padding: .4rem .6rem; margin-top: .25rem;
                    font-size: .68rem; color: #4338ca; font-weight: 500;
                }

                /* ── footer ── */
                .nmodal-footer {
                    display: flex; justify-content: flex-end; gap: .5rem;
                    padding: .65rem 1.25rem;
                    border-top: 1px solid #f0f0f0; background: rgba(249,250,251,.8);
                }
                .nmodal-btn-skip {
                    padding: .35rem .9rem; border-radius: .5rem; border: none;
                    background: none; color: #6b7280; font-weight: 500;
                    font-size: .8rem; cursor: pointer; transition: background .15s;
                }
                .nmodal-btn-skip:hover { background: #e5e7eb; }
                .nmodal-btn-confirm {
                    padding: .35rem 1.2rem; border-radius: .5rem; border: none;
                    background: linear-gradient(135deg, #6366f1, #7c3aed);
                    color: #fff; font-weight: 600; font-size: .8rem;
                    cursor: pointer; display: flex; align-items: center; gap: .4rem;
                    box-shadow: 0 2px 8px rgba(99,102,241,.3);
                    transition: all .2s;
                }
                .nmodal-btn-confirm:hover { box-shadow: 0 4px 14px rgba(99,102,241,.4); transform: translateY(-1px); }
                .nmodal-btn-confirm:disabled { opacity: .65; transform: none; cursor: not-allowed; }
                .nmodal-spinner {
                    width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3);
                    border-top-color: #fff; border-radius: 50%; animation: nmodal-spin .6s linear infinite;
                }

                /* ── animations ── */
                @keyframes nmodal-scale {
                    from { opacity: 0; transform: scale(.96); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes nmodal-fade {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes nmodal-spin { to { transform: rotate(360deg); } }
                .animate-nmodal-scale { animation: nmodal-scale .2s ease-out forwards; }
                .animate-nmodal-fade { animation: nmodal-fade .2s ease-out forwards; }
            `}</style>
        </div>
    );
}

/* ── Scope Card sub-component ── */
function ScopeCard({ icon, title, subtitle, selected, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`nmodal-scope ${selected ? 'nmodal-scope--selected' : ''}`}
        >
            <div className="nmodal-scope-icon">{icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <span className="nmodal-scope-title">{title}</span>
                <span className="nmodal-scope-sub">{subtitle}</span>
            </div>
            <div className="nmodal-scope-check">
                {selected && <Check size={10} className="text-white" />}
            </div>
        </button>
    );
}
