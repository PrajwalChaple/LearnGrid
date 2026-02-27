import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { saveUserProfile } from '../../lib/firestore';
import { GraduationCap, School, Building2, ArrowRight, Loader2 } from 'lucide-react';

const SCHOOL_STANDARDS = Array.from({ length: 12 }, (_, i) => `${i + 1}th`);
const COLLEGE_YEARS = ['1st', '2nd', '3rd', '4th'];

export function Onboarding() {
    const { user, isOnboarded, refreshProfile } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [roleType, setRoleType] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Form fields
    const [institutionName, setInstitutionName] = useState('');
    const [standard, setStandard] = useState('');
    const [section, setSection] = useState('');
    const [department, setDepartment] = useState('');
    const [year, setYear] = useState('');
    const [collegeSection, setCollegeSection] = useState('');
    const [rollNumber, setRollNumber] = useState('');

    // If already onboarded, go to dashboard
    if (isOnboarded) {
        navigate('/dashboard', { replace: true });
        return null;
    }

    if (!user) {
        navigate('/login', { replace: true });
        return null;
    }

    // Block unverified email/password users
    const isGoogleUser = user.providerData?.some(p => p.providerId === 'google.com');
    if (!user.emailVerified && !isGoogleUser) {
        return <Navigate to="/verify-email" replace />;
    }

    const handleRoleSelect = (type) => {
        setRoleType(type);
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const profileData = {
                name: user.displayName || '',
                email: user.email || '',
                roleType,
                institutionName: institutionName.toUpperCase().trim(),
                rollNumber: rollNumber.toUpperCase().trim(),
            };

            if (roleType === 'school') {
                profileData.standard = standard;
                profileData.section = section.toUpperCase().trim();
            } else {
                profileData.department = department.toUpperCase().trim();
                profileData.year = year;
                profileData.section = (collegeSection || '').toUpperCase().trim();
            }

            await saveUserProfile(user.uid, profileData);
            await refreshProfile();
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error('Onboarding error:', err);
            setError('Something went wrong. Please try again.');
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)' }}>
            {/* Decorative shapes */}
            <div className="fixed top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="fixed bottom-0 left-0 w-96 h-96 bg-indigo-400 opacity-15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            <div className="fixed inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="relative z-10 w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                        <img src={`${import.meta.env.BASE_URL}bookmark-25.svg`} alt="Logo" style={{ width: '36px', height: '36px', filter: 'brightness(0) invert(1)' }} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
                    <p className="text-indigo-200 text-lg">Tell us about your institution to get started</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/20 animate-slide-in">

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Step indicator */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
                        <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
                    </div>

                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Select Your Institution Type</h2>
                            <p className="text-gray-500 text-sm mb-6">Choose the type of institution you belong to</p>

                            <div className="grid grid-cols-2 gap-4">
                                {/* School Card */}
                                <button
                                    onClick={() => handleRoleSelect('school')}
                                    className="group relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/50 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer text-center"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <School size={28} />
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">School</span>
                                    <span className="text-xs text-gray-500">Class 1st – 12th</span>
                                </button>

                                {/* College Card */}
                                <button
                                    onClick={() => handleRoleSelect('college')}
                                    className="group relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-purple-500 hover:bg-purple-50/50 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer text-center"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <Building2 size={28} />
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">College</span>
                                    <span className="text-xs text-gray-500">UG / PG Programs</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && roleType === 'school' && (
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center gap-2 mb-6">
                                <button type="button" onClick={() => { setStep(1); setRoleType(''); }} className="text-gray-400 hover:text-gray-600 text-sm font-medium">← Back</button>
                                <span className="text-gray-300">|</span>
                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                    <School size={14} /> School
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">School Name *</label>
                                    <input
                                        type="text" required
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        value={institutionName}
                                        onChange={(e) => setInstitutionName(e.target.value.toUpperCase())}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Standard *</label>
                                        <select
                                            required
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                                            value={standard}
                                            onChange={(e) => setStandard(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            {SCHOOL_STANDARDS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Section *</label>
                                        <input
                                            type="text" required
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            value={section}
                                            onChange={(e) => setSection(e.target.value.toUpperCase())}
                                            style={{ textTransform: 'uppercase' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Class Roll Number *</label>
                                    <input
                                        type="text" required
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        value={rollNumber}
                                        onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={saving}
                                className="mt-6 w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 size={20} className="animate-spin" /> : <>Get Started <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    )}

                    {step === 2 && roleType === 'college' && (
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center gap-2 mb-6">
                                <button type="button" onClick={() => { setStep(1); setRoleType(''); }} className="text-gray-400 hover:text-gray-600 text-sm font-medium">← Back</button>
                                <span className="text-gray-300">|</span>
                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                                    <Building2 size={14} /> College
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">College Name *</label>
                                    <input
                                        type="text" required
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        value={institutionName}
                                        onChange={(e) => setInstitutionName(e.target.value.toUpperCase())}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Department *</label>
                                        <input
                                            type="text" required
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value.toUpperCase())}
                                            style={{ textTransform: 'uppercase' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Year *</label>
                                        <select
                                            required
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            {COLLEGE_YEARS.map(y => <option key={y} value={y}>{y} Year</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Section *</label>
                                    <input
                                        type="text" required
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        value={collegeSection}
                                        onChange={(e) => setCollegeSection(e.target.value.toUpperCase())}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Class Roll Number *</label>
                                    <input
                                        type="text" required
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        value={rollNumber}
                                        onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={saving}
                                className="mt-6 w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 size={20} className="animate-spin" /> : <>Get Started <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-indigo-200 text-xs mt-6">
                    Your data is securely stored and only shared with your class.
                </p>
            </div>
        </div>
    );
}
