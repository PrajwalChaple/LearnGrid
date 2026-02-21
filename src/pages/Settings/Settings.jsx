import React, { useState, useEffect, useCallback } from 'react';
import {
    Bell, Shield, Key, Unplug, Trash2, Database, AlertCircle, Megaphone,
    Calendar, HardDrive, HelpCircle, FileText, Info, Loader2, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveUserProfile, deleteUserProfile, getNotes, deleteAllUserData } from '../../lib/firestore';
import {
    changePassword,
    deleteUserAccount,
    isGoogleLinked,
    hasEmailProvider,
    unlinkGoogle
} from '../../auth';
import { disconnectCalendar, isCalendarConnected } from '../../lib/googleCalendar';
import { loginWithGoogle } from '../../auth';
import { formatErrorMessage, getFriendlyMessage } from '../../ui';

const DEFAULT_SETTINGS = {
    notifications: {
        assignmentAlerts: true,
        announcementAlerts: true,
        channel: 'both', // 'email' | 'app' | 'both'
    },
};

function mergeSettings(profileSettings) {
    const base = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    if (!profileSettings || typeof profileSettings !== 'object') return base;
    if (profileSettings.notifications) Object.assign(base.notifications, profileSettings.notifications);
    return base;
}

export function Settings() {
    const { user, userProfile, refreshProfile, forgotPassword } = useAuth();

    const [settings, setSettings] = useState(() => mergeSettings(userProfile?.settings));
    const [saving, setSaving] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);
    const [deleteDataModal, setDeleteDataModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [forgotSending, setForgotSending] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [authSuccess, setAuthSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [notesCount, setNotesCount] = useState(0);
    const [myNotesCount, setMyNotesCount] = useState(0);
    const [calendarConnected, setCalendarConnected] = useState(isCalendarConnected);

    useEffect(() => {
        setSettings(mergeSettings(userProfile?.settings));
    }, [userProfile?.settings]);

    const persistSettings = useCallback(async (next) => {
        if (!user?.uid) return;
        setSaving(true);
        try {
            await saveUserProfile(user.uid, { settings: next });
            await refreshProfile();
        } catch (e) {
            console.error('Failed to save settings', e);
        } finally {
            setSaving(false);
        }
    }, [user?.uid, refreshProfile]);

    const updateSetting = useCallback((path, value) => {
        const [section, key] = path.split('.');
        setSettings((prev) => {
            const next = JSON.parse(JSON.stringify(prev));
            if (!next[section]) next[section] = {};
            next[section][key] = value;
            persistSettings(next);
            return next;
        });
    }, [persistSettings]);

    useEffect(() => {
        if (!userProfile) return;
        let cancelled = false;
        getNotes(userProfile).then((notes) => {
            if (cancelled) return;
            setNotesCount(notes.length);
            setMyNotesCount(notes.filter((n) => n.userId === user?.uid).length);
        }).catch(() => {});
        return () => { cancelled = true; };
    }, [userProfile, user?.uid]);

    // Close password modal when user returns to this tab (e.g. after changing password via forgot link in another tab)
    useEffect(() => {
        if (!passwordModal) return;
        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') setPasswordModal(false);
        };
        document.addEventListener('visibilitychange', onVisibilityChange);
        return () => document.removeEventListener('visibilitychange', onVisibilityChange);
    }, [passwordModal]);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');
        if (passwordForm.new !== passwordForm.confirm) {
            setAuthError('New passwords do not match.');
            return;
        }
        if (passwordForm.new.length < 6) {
            setAuthError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        const result = await changePassword(passwordForm.current, passwordForm.new);
        setLoading(false);
        if (result.success) {
            setAuthSuccess('Password updated successfully.');
            setPasswordForm({ current: '', new: '', confirm: '' });
            setTimeout(() => { setPasswordModal(false); setAuthSuccess(''); }, 1500);
        } else {
            setAuthError(getFriendlyMessage(result.error) || 'Failed to update password.');
        }
    };

    const handleForgotPassword = async () => {
        const email = user?.email;
        if (!email) {
            setAuthError('No email linked to this account.');
            return;
        }
        setAuthError('');
        setForgotSending(true);
        const result = await forgotPassword(email);
        setForgotSending(false);
        if (result.success) {
            setAuthSuccess(`Password reset link sent to ${email}. Check your inbox.`);
            setTimeout(() => setAuthSuccess(''), 6000);
        } else {
            setAuthError(result.message || 'Failed to send reset email.');
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        setAuthError('');
        if (hasEmailProvider(user) && !deletePassword.trim()) {
            setAuthError('Enter your password to confirm account deletion.');
            return;
        }
        setLoading(true);
        try {
            await deleteUserProfile(user.uid);
            const result = await deleteUserAccount(hasEmailProvider(user) ? deletePassword : null);
            if (result.success) {
                window.location.href = '/#/';
                return;
            }
            setAuthError(getFriendlyMessage(result.error) || 'Could not delete account.');
        } catch (err) {
            setAuthError(getFriendlyMessage(err) || 'Failed to delete account.');
        } finally {
            setLoading(false);
        }
    };

    const handleUnlinkGoogle = async () => {
        if (!window.confirm('Disconnect Google? You will need email/password to sign in. Calendar sync will be turned off.')) return;
        setAuthError('');
        const result = await unlinkGoogle();
        if (result.success) {
            disconnectCalendar(user?.uid);
            setCalendarConnected(false);
            setAuthSuccess('Google disconnected.');
            setTimeout(() => setAuthSuccess(''), 3000);
        } else {
            setAuthError(getFriendlyMessage(result.error) || 'Could not disconnect Google.');
        }
    };

    const handleConnectGoogle = async () => {
        setAuthError('');
        const { error } = await loginWithGoogle();
        if (error) {
            setAuthError(getFriendlyMessage(error) || 'Could not connect Google.');
        } else {
            refreshProfile();
            setCalendarConnected(isCalendarConnected());
        }
    };

    const handleDisconnectCalendar = () => {
        disconnectCalendar(user?.uid);
        setCalendarConnected(false);
    };

    const handleDeleteMyData = async () => {
        setAuthError('');
        setLoading(true);
        try {
            await deleteAllUserData(user.uid);
            await refreshProfile();
            setDeleteDataModal(false);
            setAuthSuccess('Your data has been deleted from the database. Your account is still active.');
            setTimeout(() => setAuthSuccess(''), 5000);
        } catch (err) {
            setAuthError(getFriendlyMessage(err) || 'Failed to delete data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>Settings</h1>
                {saving && <span className="saving-badge"><Loader2 size={14} className="spin" /> Saving...</span>}
            </div>

            {authError && <div className="settings-toast error">{authError}</div>}
            {authSuccess && <div className="settings-toast success">{authSuccess}</div>}

            {/* 1. Account & Security */}
            <section className="settings-section animate-fade-in">
                <h2><Shield size={20} /> Account & Security</h2>
                <div className="settings-list">
                    {hasEmailProvider(user) && (
                        <div className="setting-item">
                            <div className="setting-icon"><Key size={20} /></div>
                            <div className="setting-info">
                                <h3>Password</h3>
                                <p>Change your account password</p>
                            </div>
                            <button type="button" className="btn-secondary" onClick={() => { setPasswordModal(true); setAuthError(''); setAuthSuccess(''); }}>
                                Change password
                            </button>
                        </div>
                    )}
                    <div className="setting-item">
                        <div className="setting-icon"><Unplug size={20} /></div>
                        <div className="setting-info">
                            <h3>Google account</h3>
                            <p>{isGoogleLinked(user) ? 'Linked for Calendar sync. You can disconnect here.' : 'Not linked. Connect in Dashboard or below for Calendar sync.'}</p>
                        </div>
                        {isGoogleLinked(user) ? (
                            <button type="button" className="btn-danger-outline" onClick={handleUnlinkGoogle} disabled={!hasEmailProvider(user)}>
                                Disconnect
                            </button>
                        ) : (
                            <button type="button" className="btn-secondary" onClick={handleConnectGoogle}>
                                Connect Google
                            </button>
                        )}
                    </div>
                    <div className="setting-item">
                        <div className="setting-icon"><Database size={20} /></div>
                        <div className="setting-info">
                            <h3>Delete my data</h3>
                            <p>Remove all your notes, assignments, announcements and notifications from the database. Your account will remain active.</p>
                        </div>
                        <button type="button" className="btn-danger-outline" onClick={() => { setDeleteDataModal(true); setAuthError(''); }}>
                            Delete my data
                        </button>
                    </div>
                    <div className="setting-item">
                        <div className="setting-icon"><Trash2 size={20} /></div>
                        <div className="setting-info">
                            <h3>Delete account</h3>
                            <p>Permanently delete your account and all data. This cannot be undone.</p>
                        </div>
                        <button type="button" className="btn-danger-outline" onClick={() => { setDeleteModal(true); setAuthError(''); setDeletePassword(''); }}>
                            Delete account
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. Notifications */}
            <section className="settings-section animate-fade-in">
                <h2><Bell size={20} /> Notifications</h2>
                <div className="settings-list">
                    <div className="setting-item">
                        <div className="setting-icon"><AlertCircle size={20} /></div>
                        <div className="setting-info">
                            <h3>Assignment alerts</h3>
                            <p>Notify when new assignments are added</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={settings.notifications.assignmentAlerts} onChange={(e) => updateSetting('notifications.assignmentAlerts', e.target.checked)} />
                            <span className="slider" />
                        </label>
                    </div>
                    <div className="setting-item">
                        <div className="setting-icon"><Megaphone size={20} /></div>
                        <div className="setting-info">
                            <h3>Announcement alerts</h3>
                            <p>Notify for important announcements</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={settings.notifications.announcementAlerts} onChange={(e) => updateSetting('notifications.announcementAlerts', e.target.checked)} />
                            <span className="slider" />
                        </label>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Delivery</h3>
                            <p>Email, in-app, or both</p>
                        </div>
                        <select
                            className="setting-select"
                            value={settings.notifications.channel}
                            onChange={(e) => updateSetting('notifications.channel', e.target.value)}
                        >
                            <option value="both">Email & in-app</option>
                            <option value="email">Email only</option>
                            <option value="app">In-app only</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* 3. Integration & Sync */}
            <section className="settings-section animate-fade-in">
                <h2><Calendar size={20} /> Integration & Sync</h2>
                <div className="settings-list">
                    <div className="setting-item">
                        <div className="setting-icon"><Calendar size={20} /></div>
                        <div className="setting-info">
                            <h3>Google Calendar sync</h3>
                            <p>Automatically add assignments to your Google Calendar. Sign in with Google and grant Calendar permission to connect.</p>
                        </div>
                        {calendarConnected ? (
                            <>
                                <span className="badge-connected">Connected</span>
                                <button type="button" className="btn-danger-outline" onClick={handleDisconnectCalendar}>Disconnect</button>
                            </>
                        ) : (
                            <button type="button" className="btn-secondary" onClick={handleConnectGoogle}>Connect Google</button>
                        )}
                    </div>
                    <div className="setting-item">
                        <div className="setting-icon"><HardDrive size={20} /></div>
                        <div className="setting-info">
                            <h3>Storage</h3>
                            <p>Your notes: {myNotesCount} uploaded · Class notes: {notesCount}. Files are stored securely.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Support & Legal */}
            <section className="settings-section animate-fade-in">
                <h2><HelpCircle size={20} /> Support & Legal</h2>
                <div className="settings-list">
                    <div className="setting-item link-row">
                        <div className="setting-icon"><HelpCircle size={20} /></div>
                        <div className="setting-info">
                            <h3>Help & FAQs</h3>
                            <p>Guides and how to use LearnGrid</p>
                        </div>
                        <a href="#/help" target="_blank" rel="noopener noreferrer" className="link-arrow">Open</a>
                    </div>
                    <div className="setting-item link-row">
                        <div className="setting-icon"><FileText size={20} /></div>
                        <div className="setting-info">
                            <h3>Privacy Policy & Terms</h3>
                            <p>Legal documents</p>
                        </div>
                        <div className="link-group">
                            <a href="#/privacy-policy" target="_blank" rel="noopener noreferrer" className="link-arrow">Privacy</a>
                            <a href="#/terms-of-service" target="_blank" rel="noopener noreferrer" className="link-arrow">Terms</a>
                        </div>
                    </div>
                    <div className="setting-item link-row">
                        <div className="setting-icon"><Info size={20} /></div>
                        <div className="setting-info">
                            <h3>About LearnGrid</h3>
                            <p>Version & credits</p>
                        </div>
                        <a href="#/about" target="_blank" rel="noopener noreferrer" className="link-arrow">About</a>
                    </div>
                </div>
            </section>

            {/* Delete my data modal */}
            {deleteDataModal && (
                <div className="modal-overlay" onClick={() => !loading && setDeleteDataModal(false)}>
                    <div className="modal-card danger" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete all your data?</h3>
                        <p className="modal-warning">This will permanently delete your notes, assignments, announcements and notifications from the database. Your account will stay active and you can continue using LearnGrid.</p>
                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => setDeleteDataModal(false)} disabled={loading}>Cancel</button>
                            <button type="button" className="btn-danger" onClick={handleDeleteMyData} disabled={loading}>
                                {loading ? <Loader2 size={18} className="spin" /> : 'Delete my data'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password modal */}
            {passwordModal && (
                <div className="modal-overlay" onClick={() => !loading && setPasswordModal(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <h3>Change password</h3>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="password-input-wrap">
                                <input
                                    type={showCurrentPass ? 'text' : 'password'}
                                    placeholder="Current password"
                                    value={passwordForm.current}
                                    onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
                                    required
                                    className="input"
                                />
                                <button type="button" className="password-eye" onClick={() => setShowCurrentPass((s) => !s)} aria-label={showCurrentPass ? 'Hide password' : 'Show password'}>
                                    {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className="forgot-row">
                                <button type="button" className="link-forgot" onClick={handleForgotPassword} disabled={forgotSending}>
                                    {forgotSending ? <Loader2 size={14} className="spin" /> : 'Forgot password?'}
                                </button>
                            </div>
                            <div className="password-input-wrap">
                                <input
                                    type={showNewPass ? 'text' : 'password'}
                                    placeholder="New password"
                                    value={passwordForm.new}
                                    onChange={(e) => setPasswordForm((p) => ({ ...p, new: e.target.value }))}
                                    required
                                    className="input"
                                    minLength={6}
                                />
                                <button type="button" className="password-eye" onClick={() => setShowNewPass((s) => !s)} aria-label={showNewPass ? 'Hide password' : 'Show password'}>
                                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className="password-input-wrap">
                                <input
                                    type={showConfirmPass ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    value={passwordForm.confirm}
                                    onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
                                    required
                                    className="input"
                                />
                                <button type="button" className="password-eye" onClick={() => setShowConfirmPass((s) => !s)} aria-label={showConfirmPass ? 'Hide password' : 'Show password'}>
                                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setPasswordModal(false)} disabled={loading}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={loading}>{loading ? <Loader2 size={18} className="spin" /> : 'Update password'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete account modal */}
            {deleteModal && (
                <div className="modal-overlay" onClick={() => !loading && setDeleteModal(false)}>
                    <div className="modal-card danger" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete account permanently?</h3>
                        <p className="modal-warning">This will remove your account and all data. You cannot undo this.</p>
                        {hasEmailProvider(user) && (
                            <input type="password" placeholder="Enter your password to confirm" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} className="input" />
                        )}
                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => setDeleteModal(false)} disabled={loading}>Cancel</button>
                            <button type="button" className="btn-danger" onClick={handleDeleteAccount} disabled={loading || (hasEmailProvider(user) && !deletePassword.trim())}>
                                {loading ? <Loader2 size={18} className="spin" /> : 'Delete my account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx="true">{`
                .settings-page { max-width: 800px; margin: 0 auto; }
                .page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
                .page-header h1 { font-size: 1.75rem; font-weight: 800; color: var(--color-text-main); margin: 0; }
                .saving-badge { font-size: 0.85rem; color: var(--color-text-muted); display: inline-flex; align-items: center; gap: 0.35rem; }
                .spin { animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .settings-toast { padding: 0.75rem 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.9rem; }
                .settings-toast.error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
                .settings-toast.success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
                .settings-section { background: var(--color-surface); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); padding: 1.5rem 2rem; margin-bottom: 1.5rem; border: 1px solid var(--color-border); }
                .settings-section h2 { font-size: 1.1rem; color: var(--color-text-main); font-weight: 700; margin: 0 0 1.25rem 0; padding-bottom: 0.75rem; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; gap: 0.5rem; }
                .settings-list { display: flex; flex-direction: column; gap: 1.25rem; }
                .setting-item { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
                .setting-icon { width: 42px; height: 42px; background: var(--color-primary-bg); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--color-primary); flex-shrink: 0; }
                .setting-info { flex: 1; min-width: 200px; }
                .setting-info h3 { font-size: 1rem; font-weight: 600; color: var(--color-text-main); margin: 0 0 0.2rem 0; }
                .setting-info p { font-size: 0.85rem; color: var(--color-text-muted); margin: 0; }
                .toggle-switch { position: relative; display: inline-block; width: 48px; height: 24px; flex-shrink: 0; }
                .toggle-switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--color-border); transition: 0.3s; border-radius: 24px; }
                .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background: white; transition: 0.3s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
                input:checked + .slider { background: var(--gradient-primary); }
                input:checked + .slider:before { transform: translateX(24px); }
                .btn-secondary { padding: 0.5rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-main); font-weight: 500; cursor: pointer; font-size: 0.9rem; }
                .btn-secondary:hover { background: var(--color-primary-bg); border-color: var(--color-primary); color: var(--color-primary); }
                .btn-secondary.small { padding: 0.35rem 0.75rem; font-size: 0.8rem; }
                .btn-danger-outline { padding: 0.5rem 1rem; border-radius: var(--radius-md); border: 1px solid #fecaca; background: transparent; color: #b91c1c; font-weight: 500; cursor: pointer; font-size: 0.9rem; }
                .btn-danger-outline:hover:not(:disabled) { background: #fef2f2; }
                .btn-danger-outline:disabled { opacity: 0.6; cursor: not-allowed; }
                .badge-connected { font-size: 0.8rem; font-weight: 600; color: #166534; padding: 0.35rem 0.75rem; background: #dcfce7; border-radius: var(--radius-full); }
                .setting-select { padding: 0.5rem 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-main); font-size: 0.9rem; min-width: 140px; }
                .link-row { padding: 0.25rem 0; }
                .link-arrow { color: var(--color-primary); font-weight: 500; font-size: 0.9rem; text-decoration: none; }
                .link-arrow:hover { text-decoration: underline; }
                .link-group { display: flex; gap: 1rem; }
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
                .modal-card { background: var(--color-surface); border-radius: var(--radius-xl); padding: 1.5rem 2rem; max-width: 400px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); border: 1px solid var(--color-border); }
                .modal-card h3 { margin: 0 0 1rem 0; font-size: 1.25rem; color: var(--color-text-main); }
                .password-input-wrap { position: relative; margin-bottom: 0.5rem; }
                .password-input-wrap .input { width: 100%; padding: 0.65rem 2.75rem 0.65rem 1rem; margin-bottom: 0; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 1rem; }
                .password-eye { position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); padding: 0.35rem; border: none; background: none; color: var(--color-text-muted); cursor: pointer; border-radius: var(--radius-sm); }
                .password-eye:hover { color: var(--color-primary); background: var(--color-primary-bg); }
                .forgot-row { margin-bottom: 0.75rem; text-align: right; }
                .link-forgot { border: none; background: none; color: var(--color-primary); font-size: 0.85rem; cursor: pointer; padding: 0.25rem 0; text-decoration: none; }
                .link-forgot:hover:not(:disabled) { text-decoration: underline; }
                .link-forgot:disabled { opacity: 0.7; cursor: wait; }
                .modal-card .input { width: 100%; padding: 0.65rem 1rem; margin-bottom: 0.75rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 1rem; }
                .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1rem; }
                .btn-primary { padding: 0.5rem 1rem; border-radius: var(--radius-md); border: none; background: var(--gradient-primary); color: white; font-weight: 600; cursor: pointer; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; }
                .btn-primary:hover:not(:disabled) { opacity: 0.95; }
                .btn-primary:disabled { opacity: 0.7; cursor: wait; }
                .btn-danger { padding: 0.5rem 1rem; border-radius: var(--radius-md); border: none; background: #dc2626; color: white; font-weight: 600; cursor: pointer; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; }
                .btn-danger:hover:not(:disabled) { background: #b91c1c; }
                .modal-card.danger .modal-warning { color: var(--color-text-muted); font-size: 0.9rem; margin: 0 0 1rem 0; }
            `}</style>
        </div>
    );
}
