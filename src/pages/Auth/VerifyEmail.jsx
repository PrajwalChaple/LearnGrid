import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowRight, ArrowLeft, RefreshCw, GraduationCap, CheckCircle } from 'lucide-react';

export function VerifyEmail() {
    const { user, resendVerification, logout } = useAuth();
    const navigate = useNavigate();
    const [resendMsg, setResendMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // If not signed in, go to register
    if (!user) {
        return <Navigate to="/register" replace />;
    }

    // If already verified, go to dashboard
    if (user.emailVerified) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleResend = async () => {
        setLoading(true);
        setResendMsg('');
        const result = await resendVerification();
        setLoading(false);
        if (result.success) {
            setResendMsg('Verification email sent! Check your inbox.');
        } else {
            setResendMsg(result.message || 'Failed to resend. Please try again later.');
        }
    };

    const handleRefresh = () => {
        // Force reload to re-check auth state with emailVerified
        window.location.reload();
    };

    const handleGoBack = async () => {
        // Sign out the unverified user and go back to register
        await logout();
        navigate('/register');
    };

    return (
        <div className="min-h-screen flex bg-white font-sans text-gray-900">
            {/* Left Column - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden flex-col justify-between p-12 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 opacity-90"></div>
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-500 opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="relative z-10">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-white/90 hover:text-white transition-colors w-fit bg-transparent border-none cursor-pointer"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Go Back</span>
                    </button>
                    <div className="mt-12">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                            <GraduationCap size={28} className="text-white" />
                        </div>
                        <h2 className="text-4xl font-bold mb-4">Almost there!</h2>
                        <p className="text-indigo-200 text-lg max-w-md">Just one more step to unlock your learning dashboard.</p>
                    </div>
                </div>

                <div className="relative z-10 mt-12 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                            <CheckCircle size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold">Account Created</h4>
                            <p className="text-sm text-indigo-200">Your account is ready to go</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                            <Mail size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold">Verify Email</h4>
                            <p className="text-sm text-indigo-200">Check your inbox and click the link</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center text-gray-400">
                            <GraduationCap size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-indigo-300">Setup Profile</h4>
                            <p className="text-sm text-indigo-200">Tell us about your institution</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-auto pt-8 border-t border-white/10">
                    <p className="text-sm text-indigo-300">© 2026 LearnGrid Inc.</p>
                </div>
            </div>

            {/* Right Column - Verification Prompt */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Back button for mobile */}
                    <button
                        onClick={handleGoBack}
                        className="lg:hidden flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6 bg-transparent border-none cursor-pointer font-medium"
                    >
                        <ArrowLeft size={20} />
                        <span>Go Back</span>
                    </button>

                    <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 animate-slide-in text-center">
                        {/* Mail icon */}
                        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6">
                            <Mail size={40} className="text-indigo-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-3">Verify your email</h1>
                        <p className="text-gray-500 mb-2">
                            We've sent a verification link to
                        </p>
                        <p className="text-indigo-600 font-semibold text-lg mb-6">{user.email}</p>
                        <p className="text-gray-400 text-sm mb-8">
                            Click the link in your email to verify your account. Once verified, click the button below to continue.
                        </p>

                        {resendMsg && (
                            <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${resendMsg.includes('sent') ? 'bg-green-50 border border-green-100 text-green-600' : 'bg-red-50 border border-red-100 text-red-600'}`}>
                                {resendMsg}
                            </div>
                        )}

                        {/* Primary: I've verified, continue */}
                        <button
                            onClick={handleRefresh}
                            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 mb-3"
                        >
                            I've verified my email <ArrowRight size={18} />
                        </button>

                        {/* Secondary: Resend */}
                        <button
                            onClick={handleResend}
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all disabled:opacity-50 mb-4"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <RefreshCw size={16} />
                                    Resend verification email
                                </>
                            )}
                        </button>


                    </div>
                </div>
            </div>
        </div>
    );
}
