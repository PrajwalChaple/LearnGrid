import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X, Sparkles, Zap, Shield, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { initiateRazorpayPayment } from '../../lib/razorpay';

export function Pricing() {
    const [annual, setAnnual] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'error' | null
    const [paymentMessage, setPaymentMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { user, userProfile } = useAuth();
    const navigate = useNavigate();

    const handleProUpgrade = () => {
        if (!user) {
            // Not logged in — redirect to register
            navigate('/register');
            return;
        }

        setIsProcessing(true);
        setPaymentStatus(null);
        setPaymentMessage('');

        const amount = annual ? 10 : 1;

        initiateRazorpayPayment({
            amount,
            planName: 'Pro Scholar',
            user,
            userProfile,
            onSuccess: (paymentId) => {
                setIsProcessing(false);
                setPaymentStatus('success');
                setPaymentMessage(`Payment successful! ID: ${paymentId}`);
                // Auto-hide after 8 seconds
                setTimeout(() => setPaymentStatus(null), 8000);
            },
            onError: (errorMsg) => {
                setIsProcessing(false);
                setPaymentStatus('error');
                setPaymentMessage(errorMsg || 'Payment failed. Please try again.');
                setTimeout(() => setPaymentStatus(null), 6000);
            },
        });
    };

    const plans = [
        {
            name: "Basic Student",
            desc: "Everything you need to start organizing your studies.",
            price: "₹0",
            period: "forever",
            badge: null,
            features: [
                { text: "Unlimited Notes & Assignments", included: true },
                { text: "Basic AI Buddy Queries (50/mo)", included: true },
                { text: "Classroom Announcements", included: true },
                { text: "Standard Support", included: true },
                { text: "Advanced AI Persona Modes", included: false },
                { text: "Unlimited Cloudinary Storage", included: false },
            ],
            cta: "Get Started Free",
            ctaAction: () => navigate('/register'),
            popular: false,
            isDarkHeader: false,
            color: "from-slate-100 to-slate-50",
            buttonColor: "bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
        },
        {
            name: "Pro Scholar",
            desc: "Supercharge your learning with advanced AI tools.",
            price: annual ? "₹10" : "₹1",
            period: "per month",
            badge: "Most Popular",
            features: [
                { text: "Unlimited Notes & Assignments", included: true },
                { text: "Unlimited AI Buddy Queries", included: true },
                { text: "Classroom Announcements", included: true },
                { text: "Priority 24/7 Support", included: true },
                { text: "Advanced AI Persona Modes", included: true },
                { text: "Unlimited Cloudinary Storage", included: true },
            ],
            cta: isProcessing ? "Processing..." : "Upgrade to Pro",
            ctaAction: handleProUpgrade,
            popular: true,
            isDarkHeader: true,
            color: "from-indigo-600 to-violet-600 text-white",
            buttonColor: "bg-white text-indigo-600 hover:bg-slate-50 border-transparent shadow-md",
        },
        {
            name: "Campus Partner",
            desc: "For institutions looking to deploy LearnGrid campus-wide.",
            price: "Custom",
            period: "contact us",
            badge: null,
            features: [
                { text: "Everything in Pro Scholar", included: true },
                { text: "Custom Domain & Branding", included: true },
                { text: "Admin Dashboard & Analytics", included: true },
                { text: "Dedicated Account Manager", included: true },
                { text: "Single Sign-On (SSO)", included: true },
                { text: "API Access", included: true },
            ],
            cta: "Contact Sales",
            ctaAction: () => navigate('/help'),
            popular: false,
            isDarkHeader: true,
            color: "from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700 text-white",
            buttonColor: "bg-indigo-500 text-white hover:bg-indigo-600 border-transparent shadow-md",
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100 selection:text-indigo-900">

            {/* Payment Status Toast */}
            {paymentStatus && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-[slideDown_0.4s_ease-out]">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl text-sm font-semibold
                        ${paymentStatus === 'success'
                            ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800'
                            : 'bg-red-50/95 border-red-200 text-red-800'
                        }`}
                    >
                        {paymentStatus === 'success'
                            ? <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                            : <AlertCircle size={20} className="text-red-600 shrink-0" />
                        }
                        <span>{paymentMessage}</span>
                        <button
                            onClick={() => setPaymentStatus(null)}
                            className="ml-2 text-current opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] bg-repeat pointer-events-none"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/20 to-transparent blur-3xl pointer-events-none rounded-full"></div>
                
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-6 shadow-sm">
                        <Sparkles size={16} />
                        <span>Simple, transparent pricing</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                        Invest in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Learning Journey</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
                        Whether you're a single student organizing your notes or a whole campus building a network, we have a plan for you.
                    </p>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-center gap-4 mb-16">
                        <span className={`text-sm font-semibold ${!annual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
                        <button 
                            onClick={() => setAnnual(!annual)}
                            className="relative w-14 h-7 rounded-full bg-slate-200 p-1 transition-colors duration-300 focus:outline-none"
                            style={{ backgroundColor: annual ? '#4f46e5' : '#e2e8f0' }}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${annual ? 'translate-x-7' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-sm font-semibold flex items-center gap-2 ${annual ? 'text-slate-900' : 'text-slate-500'}`}>
                            Annually <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Save 20%</span>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
                        {plans.map((plan, i) => (
                            <div 
                                key={i} 
                                className={`relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2
                                    ${plan.popular ? 'md:-mt-8 md:mb-8 shadow-2xl shadow-indigo-500/20 ring-4 ring-indigo-600/20' : 'shadow-xl shadow-slate-200/50 border border-slate-200/50 bg-white'}`}
                            >
                                {/* Card Header background gradient */}
                                <div className={`p-8 bg-gradient-to-br ${plan.color}`}>
                                    {plan.badge && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-b-lg shadow-sm">
                                            {plan.badge}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className={`text-xl font-bold ${plan.isDarkHeader ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                                    </div>
                                    <p className={`text-sm mb-6 ${plan.isDarkHeader ? 'text-slate-200' : 'text-slate-500'}`}>{plan.desc}</p>
                                    
                                    <div className="flex items-end gap-2">
                                        <span className={`text-4xl font-extrabold tracking-tight ${plan.isDarkHeader ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                                        <span className={`text-sm pb-1 font-medium ${plan.isDarkHeader ? 'text-slate-300' : 'text-slate-400'}`}>/{plan.period}</span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-8 bg-white">
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feat, j) => (
                                            <li key={j} className="flex items-start gap-3">
                                                <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${feat.included ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    {feat.included ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                                                </div>
                                                <span className={`text-sm ${feat.included ? 'text-slate-700 font-medium' : 'text-slate-400 line-through'}`}>{feat.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={plan.ctaAction}
                                        disabled={isProcessing && plan.popular}
                                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all border cursor-pointer
                                            ${plan.buttonColor}
                                            ${isProcessing && plan.popular ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    >
                                        {plan.cta}
                                        {!(isProcessing && plan.popular) && <ChevronRight size={18} />}
                                        {isProcessing && plan.popular && (
                                            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-slate-500 mb-10">Have questions about our pricing? We've got answers.</p>
                    
                    <div className="text-left space-y-6">
                        <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-100">
                            <h4 className="font-bold text-slate-800 mb-2">Can I switch plans later?</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">Absolutely. You can upgrade, downgrade, or cancel your Pro Scholar subscription at any time from your account settings.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-100">
                            <h4 className="font-bold text-slate-800 mb-2">What happens to my data if I cancel?</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">Your data remains safe. You will revert to the Basic Student plan and will still have access to your core notes and assignments.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-100">
                            <h4 className="font-bold text-slate-800 mb-2">Is the payment secure?</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">Yes! We use Razorpay, India's most trusted payment gateway. Your card details are never stored on our servers. All transactions are PCI-DSS compliant.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inline animation keyframe */}
            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translate(-50%, -20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </div>
    );
}
