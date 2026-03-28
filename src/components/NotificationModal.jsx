import React, { useState, useEffect, useRef } from 'react';
import { X, Users, Check, Mail, Bell, ChevronDown, Loader2, School, Building2 } from 'lucide-react';
import {
    getDistinctInstitutions,
    getBranchesForCollege,
    getSectionsForSchool,
    getDivisionsForCollege,
    getDynamicRecipientCount,
    getDynamicRecipients,
    createNotification,
    createUserNotifications,
} from '../lib/firestore';
import { sendEmailBatch } from '../lib/email';
import { useAuth } from '../context/AuthContext';
import { getFriendlyMessage } from '../ui';

const SCHOOL_STANDARDS = Array.from({ length: 12 }, (_, i) => `${i + 1}th`);
const COLLEGE_YEARS = ['1st', '2nd', '3rd', '4th'];

export function NotificationModal({ isOpen, onClose, noteData, userProfile, onConfirmSuccess, onUpload, itemType = 'note' }) {
    const { user } = useAuth();
    const isCollege = userProfile?.roleType === 'college';

    // ── Audience state ──────────────────────────────────────────
    // School flow
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState('');
    const [selectedStandard, setSelectedStandard] = useState('');
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');

    // College flow
    const [colleges, setColleges] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState('');
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [divisions, setDivisions] = useState([]);
    const [selectedDivision, setSelectedDivision] = useState('');

    // Loading states
    const [loadingInstitutions, setLoadingInstitutions] = useState(false);
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingDivisions, setLoadingDivisions] = useState(false);

    // Delivery & misc
    const [sendInApp, setSendInApp] = useState(false);
    const [sendEmail, setSendEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recipientCount, setRecipientCount] = useState(0);
    const [calculating, setCalculating] = useState(false);

    // Recipient name preview
    const [recipientNames, setRecipientNames] = useState([]);
    const [loadingRecipients, setLoadingRecipients] = useState(false);

    // ── Dropdown open states ────────────────────────────────────
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownAreaRef = useRef(null);

    // ── Reset on open ───────────────────────────────────────────
    const prevIsOpenRef = useRef(false);
    useEffect(() => {
        if (isOpen && !prevIsOpenRef.current && userProfile) {
            resetAll();
            fetchInstitutions().then(() => {
                // Attempt to load last used settings
                try {
                    const saved = localStorage.getItem('learngrid_last_audience');
                    if (saved) {
                        const data = JSON.parse(saved);
                        
                        if (data.sendInApp !== undefined) setSendInApp(data.sendInApp);
                        if (data.sendEmail !== undefined) setSendEmail(data.sendEmail);

                        if (isCollege && data.roleType === 'college') {
                            setSelectedCollege(data.institutionName || '');
                            setSelectedBranch(data.department || '');
                            setSelectedYear(data.year || '');
                            setSelectedDivision(data.section || '');
                            
                            if (data.institutionName) fetchBranches(data.institutionName);
                            if (data.institutionName && data.department && data.year) {
                                fetchDivisions(data.institutionName, data.department, data.year);
                            }
                            if (data.institutionName && data.department && data.year && data.section) {
                                fetchRecipientsPreview(data);
                            }
                        } else if (!isCollege && data.roleType === 'school') {
                            setSelectedSchool(data.institutionName || '');
                            setSelectedStandard(data.standard || '');
                            setSelectedSection(data.section || '');
                            
                            if (data.institutionName && data.standard) fetchSections(data.institutionName, data.standard);
                            if (data.institutionName && data.standard && data.section) {
                                fetchRecipientsPreview(data);
                            }
                        }
                    }
                } catch(e) { console.error("Could not load last audience", e); }
            });
        }
        prevIsOpenRef.current = isOpen;
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // Close dropdown on outside click
    useEffect(() => {
        const handle = (e) => {
            if (dropdownAreaRef.current && !dropdownAreaRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    function resetAll() {
        setSelectedSchool(''); setSelectedStandard(''); setSelectedSection('');
        setSections([]); setSchools([]);
        setSelectedCollege(''); setSelectedBranch(''); setSelectedYear(''); setSelectedDivision('');
        setBranches([]); setDivisions([]); setColleges([]);
        setSendInApp(false); setSendEmail(false);
        setRecipientCount(0); setRecipientNames([]); setOpenDropdown(null);
    }

    // ── Fetch institutions on open ──────────────────────────────
    async function fetchInstitutions() {
        setLoadingInstitutions(true);
        try {
            const roleType = isCollege ? 'college' : 'school';
            const list = await getDistinctInstitutions(roleType);
            if (isCollege) setColleges(list);
            else setSchools(list);
        } catch (err) {
            console.error('Error fetching institutions:', err);
        } finally {
            setLoadingInstitutions(false);
        }
    }

    // ── Fetch & show recipient names + count ────────────────────
    async function fetchRecipientsPreview(params) {
        setLoadingRecipients(true);
        setCalculating(true);
        try {
            const currentUid = user?.uid || '';
            const recipients = await getDynamicRecipients(params, currentUid);
            setRecipientCount(recipients.length);
            setRecipientNames(
                recipients.map(r => ({
                    name: r.name || r.displayName || r.email || 'Unknown',
                    email: r.email || '',
                }))
            );
        } catch (err) {
            console.error('Error fetching recipients:', err);
            setRecipientCount(0);
            setRecipientNames([]);
        } finally {
            setLoadingRecipients(false);
            setCalculating(false);
        }
    }

    // ── School flow handlers ────────────────────────────────────
    function handleSchoolSelect(school) {
        setSelectedSchool(school);
        setSelectedStandard('');
        setSelectedSection('');
        setSections([]);
        setRecipientCount(0);
        setRecipientNames([]);
        setOpenDropdown(null);
    }

    function handleStandardSelect(std) {
        setSelectedStandard(std);
        setSelectedSection('');
        setRecipientCount(0);
        setRecipientNames([]);
        setOpenDropdown(null);
        fetchSections(selectedSchool, std);
    }

    async function fetchSections(school, standard) {
        setLoadingSections(true);
        try {
            const list = await getSectionsForSchool(school, standard);
            setSections(list);
        } catch (err) {
            console.error('Error fetching sections:', err);
        } finally {
            setLoadingSections(false);
        }
    }

    function handleSectionSelect(sec) {
        setSelectedSection(sec);
        setOpenDropdown(null);
        fetchRecipientsPreview({
            roleType: 'school',
            institutionName: selectedSchool,
            standard: selectedStandard,
            section: sec,
        });
    }

    // ── College flow handlers ───────────────────────────────────
    function handleCollegeSelect(college) {
        setSelectedCollege(college);
        setSelectedBranch('');
        setSelectedYear('');
        setSelectedDivision('');
        setBranches([]);
        setDivisions([]);
        setRecipientCount(0);
        setRecipientNames([]);
        setOpenDropdown(null);
        fetchBranches(college);
    }

    async function fetchBranches(college) {
        setLoadingBranches(true);
        try {
            const list = await getBranchesForCollege(college);
            setBranches(list);
        } catch (err) {
            console.error('Error fetching branches:', err);
        } finally {
            setLoadingBranches(false);
        }
    }

    function handleBranchSelect(branch) {
        setSelectedBranch(branch);
        setSelectedYear('');
        setSelectedDivision('');
        setDivisions([]);
        setRecipientCount(0);
        setRecipientNames([]);
        setOpenDropdown(null);
    }

    function handleYearSelect(yr) {
        setSelectedYear(yr);
        setSelectedDivision('');
        setRecipientCount(0);
        setRecipientNames([]);
        setOpenDropdown(null);
        fetchDivisions(selectedCollege, selectedBranch, yr);
    }

    async function fetchDivisions(college, branch, year) {
        setLoadingDivisions(true);
        try {
            const list = await getDivisionsForCollege(college, branch, year);
            setDivisions(list);
        } catch (err) {
            console.error('Error fetching divisions:', err);
        } finally {
            setLoadingDivisions(false);
        }
    }

    function handleDivisionSelect(div) {
        setSelectedDivision(div);
        setOpenDropdown(null);
        fetchRecipientsPreview({
            roleType: 'college',
            institutionName: selectedCollege,
            department: selectedBranch,
            year: selectedYear,
            section: div,
        });
    }

    // ── Validation ──────────────────────────────────────────────
    const isAudienceComplete = isCollege
        ? !!(selectedCollege && selectedBranch && selectedYear && selectedDivision)
        : !!(selectedSchool && selectedStandard && selectedSection);

    // ── Build audience params ───────────────────────────────────
    function buildAudienceParams() {
        if (isCollege) {
            return {
                roleType: 'college',
                institutionName: selectedCollege,
                department: selectedBranch,
                year: selectedYear,
                section: selectedDivision,
            };
        }
        return {
            roleType: 'school',
            institutionName: selectedSchool,
            standard: selectedStandard,
            section: selectedSection,
        };
    }

    // ── Confirm handler ─────────────────────────────────────────
    const handleConfirm = async () => {
        if (!isAudienceComplete) return;
        setLoading(true);
        try {
            // 1. Fetch recipients
            const params = buildAudienceParams();

            // Save to local storage for fast access next time
            try {
                localStorage.setItem('learngrid_last_audience', JSON.stringify({
                    ...params,
                    sendInApp,
                    sendEmail
                }));
            } catch (e) {
                console.warn('Failed to save audience settings', e);
            }

            const currentUid = user?.uid || '';
            const recipients = await getDynamicRecipients(params, currentUid);
            const totalRecipients = recipients.length;

            // 2. Upload/save if needed
            let savedData = noteData;
            if (onUpload) {
                // Pass audience parameters down so it can overwrite the uploader's class with the targeted audience
                savedData = await onUpload(params);
                if (!savedData) { setLoading(false); return; }
            }

            // Filter by preferences
            const wantsTypeAlert = (r) => {
                const prefs = r.settings?.notifications;
                if (!prefs) return true;
                if (itemType === 'assignment') return prefs.assignmentAlerts !== false;
                if (itemType === 'announcement') return prefs.announcementAlerts !== false;
                return true;
            };
            const wantsInApp = (r) => {
                const ch = r.settings?.notifications?.channel;
                return ch === 'app' || ch === 'both' || !ch;
            };
            const wantsEmail = (r) => {
                const ch = r.settings?.notifications?.channel;
                return ch === 'email' || ch === 'both' || !ch;
            };
            const recipientsInApp = sendInApp ? recipients.filter(r => wantsTypeAlert(r) && wantsInApp(r)) : [];
            const recipientsEmail = sendEmail ? recipients.filter(r => wantsTypeAlert(r) && wantsEmail(r)) : [];

            // 3. Send emails
            let emailStatus = sendEmail ? 'sent' : 'skipped';
            let emailError = '';
            if (sendEmail && recipientsEmail.length > 0) {
                try {
                    const emailResult = await sendEmailBatch(recipientsEmail, savedData, userProfile, itemType);
                    if (!emailResult.success) emailStatus = 'failed';
                } catch (err) {
                    console.error("Email sending error:", err);
                    emailStatus = 'failed';
                    emailError = getFriendlyMessage(err);
                }
            }

            // 4. Machine-readable scope for NotificationHistory filters
            const scope = isCollege ? 'class' : 'section';

            // 5. Save notification record
            const notificationData = {
                senderId: user?.uid || '',
                senderName: userProfile?.name || userProfile?.displayName || 'Unknown',
                institutionName: params.institutionName,
                department: params.department || '',
                year: params.year || '',
                section: params.section || '',
                standard: params.standard || '',
                scope: scope,
                scopeDesc: isCollege
                    ? `${selectedCollege} · ${selectedBranch} · ${selectedYear} Year · Div ${selectedDivision}`
                    : `${selectedSchool} · Std ${selectedStandard} · Sec ${selectedSection}`,
                noteId: savedData?.id || '',
                noteTitle: savedData?.title || '',
                recipientCount: totalRecipients,
                status: emailStatus,
                error: emailError,
            };

            await createNotification(notificationData);

            // 6. In-app notifications
            if (sendInApp && recipientsInApp.length > 0) {
                const typeLabels = { note: 'note', assignment: 'assignment', announcement: 'announcement' };
                const label = typeLabels[itemType] || 'note';
                await createUserNotifications(recipientsInApp, {
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
            alert(getFriendlyMessage(error));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // ── Custom dropdown renderer ────────────────────────────────
    const renderDropdown = ({ id, label, icon, value, options, onSelect, isLoading, disabled, emptyMsg, renderLabel }) => {
        const isOpenDd = openDropdown === id;
        const displayValue = value || '';
        const displayLabel = renderLabel ? renderLabel(displayValue) : displayValue;

        return (
            <div className={`nmodal-aud-field ${disabled ? 'nmodal-aud-field--disabled' : ''}`}>
                <label className="nmodal-aud-label">{label}</label>
                <button
                    type="button"
                    className={`nmodal-aud-select ${isOpenDd ? 'nmodal-aud-select--open' : ''} ${disabled ? 'nmodal-aud-select--disabled' : ''}`}
                    onClick={() => !disabled && setOpenDropdown(isOpenDd ? null : id)}
                    disabled={disabled}
                >
                    <div className="nmodal-aud-select-left">
                        <div className={`nmodal-aud-icon ${value ? 'nmodal-aud-icon--active' : ''}`}>
                            {isLoading ? <Loader2 size={14} className="nmodal-aud-spinner" /> : icon}
                        </div>
                        <span className={`nmodal-aud-select-text ${!value ? 'nmodal-aud-select-placeholder' : ''}`}>
                            {isLoading ? 'Loading...' : (displayLabel || `Select ${label}`)}
                        </span>
                    </div>
                    <ChevronDown size={14} className={`nmodal-aud-chevron ${isOpenDd ? 'nmodal-aud-chevron--open' : ''}`} />
                </button>

                {isOpenDd && !disabled && !isLoading && (
                    <div className="nmodal-aud-menu">
                        {options.length === 0 ? (
                            <div className="nmodal-aud-empty">{emptyMsg || 'No options found'}</div>
                        ) : (
                            options.map(opt => {
                                const optValue = typeof opt === 'string' ? opt : opt.value;
                                const optLabel = renderLabel ? renderLabel(optValue) : (typeof opt === 'string' ? opt : opt.label);
                                return (
                                    <button
                                        key={optValue}
                                        type="button"
                                        className={`nmodal-aud-menu-item ${value === optValue ? 'nmodal-aud-menu-item--active' : ''}`}
                                        onClick={() => onSelect(optValue)}
                                    >
                                        <span>{optLabel}</span>
                                        {value === optValue && (
                                            <div className="nmodal-aud-check"><Check size={10} className="text-white" /></div>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50" style={{ overflow: 'auto' }}>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-nmodal-fade"
                onClick={onClose}
            ></div>

            {/* Centering wrapper */}
            <div className="nmodal-center-wrap">
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

                        {/* LEFT: Dynamic Audience */}
                        <div className="nmodal-col-left" ref={dropdownAreaRef}>
                            <p className="nmodal-section-label">Audience</p>

                            {/* ── SCHOOL FLOW ── */}
                            {!isCollege && (
                                <div className="nmodal-aud-stack">
                                    {renderDropdown({
                                        id: 'school',
                                        label: 'School',
                                        icon: <School size={14} />,
                                        value: selectedSchool,
                                        options: schools,
                                        onSelect: handleSchoolSelect,
                                        isLoading: loadingInstitutions,
                                        disabled: false,
                                        emptyMsg: 'No schools found',
                                    })}

                                    {selectedSchool && renderDropdown({
                                        id: 'standard',
                                        label: 'Standard',
                                        icon: <Users size={14} />,
                                        value: selectedStandard,
                                        options: SCHOOL_STANDARDS,
                                        onSelect: handleStandardSelect,
                                        isLoading: false,
                                        disabled: !selectedSchool,
                                        emptyMsg: 'No standards',
                                        renderLabel: (v) => v ? `Class ${v}` : '',
                                    })}

                                    {selectedStandard && renderDropdown({
                                        id: 'section',
                                        label: 'Section',
                                        icon: <Users size={14} />,
                                        value: selectedSection,
                                        options: sections,
                                        onSelect: handleSectionSelect,
                                        isLoading: loadingSections,
                                        disabled: !selectedStandard,
                                        emptyMsg: 'No sections found',
                                        renderLabel: (v) => v ? `Section ${v}` : '',
                                    })}
                                </div>
                            )}

                            {/* ── COLLEGE FLOW ── */}
                            {isCollege && (
                                <div className="nmodal-aud-stack">
                                    {renderDropdown({
                                        id: 'college',
                                        label: 'College',
                                        icon: <Building2 size={14} />,
                                        value: selectedCollege,
                                        options: colleges,
                                        onSelect: handleCollegeSelect,
                                        isLoading: loadingInstitutions,
                                        disabled: false,
                                        emptyMsg: 'No colleges found',
                                    })}

                                    {selectedCollege && renderDropdown({
                                        id: 'branch',
                                        label: 'Branch',
                                        icon: <Users size={14} />,
                                        value: selectedBranch,
                                        options: branches,
                                        onSelect: handleBranchSelect,
                                        isLoading: loadingBranches,
                                        disabled: !selectedCollege,
                                        emptyMsg: 'No branches found',
                                    })}

                                    {selectedBranch && renderDropdown({
                                        id: 'year',
                                        label: 'Year',
                                        icon: <Users size={14} />,
                                        value: selectedYear,
                                        options: COLLEGE_YEARS,
                                        onSelect: handleYearSelect,
                                        isLoading: false,
                                        disabled: !selectedBranch,
                                        emptyMsg: 'No years',
                                        renderLabel: (v) => v ? `${v} Year` : '',
                                    })}

                                    {selectedYear && renderDropdown({
                                        id: 'division',
                                        label: 'Division',
                                        icon: <Users size={14} />,
                                        value: selectedDivision,
                                        options: divisions,
                                        onSelect: handleDivisionSelect,
                                        isLoading: loadingDivisions,
                                        disabled: !selectedYear,
                                        emptyMsg: 'No divisions found',
                                        renderLabel: (v) => v ? `Division ${v}` : '',
                                    })}
                                </div>
                            )}

                            {/* Estimated Reach + Recipient Names */}
                            <div className="nmodal-reach" style={{ marginTop: '0.75rem' }}>
                                <Users size={13} className="text-indigo-600" />
                                <span>
                                    {calculating || loadingRecipients
                                        ? 'Calculating...'
                                        : isAudienceComplete
                                            ? `~${recipientCount} students will be notified`
                                            : 'Complete selection to see count'}
                                </span>
                            </div>

                            {/* Recipient Name List */}
                            {isAudienceComplete && recipientNames.length > 0 && !loadingRecipients && (
                                <div className="nmodal-recipients-list">
                                    <p className="nmodal-recipients-title">Recipients</p>
                                    <div className="nmodal-recipients-scroll">
                                        {recipientNames.map((r, i) => (
                                            <div key={i} className="nmodal-recipient-item">
                                                <div className="nmodal-recipient-avatar">
                                                    {(r.name || '?')[0].toUpperCase()}
                                                </div>
                                                <div className="nmodal-recipient-info">
                                                    <span className="nmodal-recipient-name">{r.name}</span>
                                                    {r.email && <span className="nmodal-recipient-email">{r.email}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isAudienceComplete && recipientNames.length === 0 && !loadingRecipients && (
                                <div className="nmodal-recipients-empty">
                                    No students found for this selection
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Delivery toggles */}
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
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="nmodal-footer">
                        <button onClick={onClose} className="nmodal-btn-skip">Skip</button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading || !isAudienceComplete}
                            className="nmodal-btn-confirm"
                        >
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
                    width: 100%; max-width: 42rem;
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
                @media (max-width: 600px) {
                    .nmodal-body { grid-template-columns: 1fr; }
                }
                .nmodal-section-label {
                    font-size: .65rem; font-weight: 600; text-transform: uppercase;
                    letter-spacing: .06em; color: #9ca3af; margin: 0 0 .5rem 2px;
                }

                /* ── audience stack ── */
                .nmodal-aud-stack {
                    display: flex; flex-direction: column; gap: .5rem;
                }

                /* ── audience field ── */
                .nmodal-aud-field {
                    position: relative;
                    animation: nmodal-field-in .25s ease-out;
                }
                @keyframes nmodal-field-in {
                    from { opacity: 0; transform: translateY(-6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .nmodal-aud-field--disabled { opacity: .5; pointer-events: none; }
                .nmodal-aud-label {
                    display: block; font-size: .62rem; font-weight: 600;
                    color: #6b7280; margin-bottom: 3px; text-transform: uppercase;
                    letter-spacing: .04em;
                }

                /* ── select button ── */
                .nmodal-aud-select {
                    width: 100%;
                    display: flex; align-items: center; justify-content: space-between;
                    padding: .5rem .65rem; border-radius: .6rem;
                    border: 1.5px solid #e5e7eb; background: #fff;
                    cursor: pointer; transition: all .2s;
                    text-align: left; font-size: .78rem;
                }
                .nmodal-aud-select:hover { border-color: #c7d2fe; }
                .nmodal-aud-select--open { border-color: #818cf8; box-shadow: 0 0 0 3px rgba(99,102,241,.1); }
                .nmodal-aud-select--disabled { cursor: not-allowed; background: #f9fafb; }
                .nmodal-aud-select-left { display: flex; align-items: center; gap: .5rem; }
                .nmodal-aud-icon {
                    width: 28px; height: 28px; border-radius: .4rem;
                    display: flex; align-items: center; justify-content: center;
                    background: #f3f4f6; color: #9ca3af; flex-shrink: 0;
                    transition: all .2s;
                }
                .nmodal-aud-icon--active { background: #eef2ff; color: #6366f1; }
                .nmodal-aud-select-text { font-weight: 500; color: #1f2937; }
                .nmodal-aud-select-placeholder { color: #9ca3af; font-weight: 400; }
                .nmodal-aud-chevron { color: #9ca3af; transition: transform .2s; flex-shrink: 0; }
                .nmodal-aud-chevron--open { transform: rotate(180deg); }
                .nmodal-aud-spinner { animation: nmodal-spin .6s linear infinite; }

                /* ── dropdown menu ── */
                .nmodal-aud-menu {
                    position: absolute; top: calc(100% + 3px); left: 0; right: 0;
                    background: #fff; border: 1.5px solid #e5e7eb; border-radius: .6rem;
                    box-shadow: 0 8px 24px rgba(0,0,0,.10);
                    z-index: 20; overflow: hidden; max-height: 180px; overflow-y: auto;
                    animation: nmodal-dropdown-in .15s ease-out;
                }
                @keyframes nmodal-dropdown-in {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .nmodal-aud-menu-item {
                    width: 100%;
                    display: flex; align-items: center; justify-content: space-between;
                    padding: .45rem .65rem;
                    border: none; background: none;
                    cursor: pointer; transition: background .15s;
                    text-align: left; font-size: .76rem; color: #374151;
                }
                .nmodal-aud-menu-item:hover { background: #f8fafc; }
                .nmodal-aud-menu-item--active { background: #eef2ff; color: #312e81; font-weight: 600; }
                .nmodal-aud-menu-item + .nmodal-aud-menu-item { border-top: 1px solid #f3f4f6; }
                .nmodal-aud-check {
                    width: 16px; height: 16px; border-radius: 50%;
                    background: #6366f1; display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .nmodal-aud-empty {
                    padding: .6rem .65rem; font-size: .74rem; color: #9ca3af; text-align: center;
                }

                /* ── recipient list ── */
                .nmodal-recipients-list {
                    margin-top: .5rem;
                    border: 1px solid #e0e7ff;
                    border-radius: .6rem;
                    background: #fafbff;
                    overflow: hidden;
                    animation: nmodal-field-in .25s ease-out;
                }
                .nmodal-recipients-title {
                    font-size: .6rem; font-weight: 700; text-transform: uppercase;
                    letter-spacing: .05em; color: #6366f1;
                    padding: .4rem .6rem; margin: 0;
                    background: #eef2ff; border-bottom: 1px solid #e0e7ff;
                }
                .nmodal-recipients-scroll {
                    max-height: 120px; overflow-y: auto;
                    padding: .25rem 0;
                }
                .nmodal-recipient-item {
                    display: flex; align-items: center; gap: .45rem;
                    padding: .3rem .6rem;
                    transition: background .15s;
                }
                .nmodal-recipient-item:hover { background: #eef2ff; }
                .nmodal-recipient-avatar {
                    width: 24px; height: 24px; border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #7c3aed);
                    color: #fff; font-size: .6rem; font-weight: 700;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .nmodal-recipient-info {
                    display: flex; flex-direction: column; min-width: 0;
                }
                .nmodal-recipient-name {
                    font-size: .72rem; font-weight: 600; color: #1f2937;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .nmodal-recipient-email {
                    font-size: .58rem; color: #9ca3af;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .nmodal-recipients-empty {
                    margin-top: .5rem; padding: .5rem .6rem;
                    border: 1px dashed #e0e7ff; border-radius: .5rem;
                    font-size: .7rem; color: #9ca3af; text-align: center;
                    animation: nmodal-field-in .25s ease-out;
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
                    border-radius: .5rem; padding: .4rem .6rem;
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
