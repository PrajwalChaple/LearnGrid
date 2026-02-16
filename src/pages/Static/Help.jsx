import React from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, MessageCircle, FileText, ArrowRight } from 'lucide-react';

const categories = [
    { icon: BookOpen, title: 'Getting Started', desc: 'Learn the basics of setting up your LearnGrid account and dashboard.', articles: 8 },
    { icon: FileText, title: 'Notes & Assignments', desc: 'How to create, organize, and manage your notes and assignment tracking.', articles: 12 },
    { icon: MessageCircle, title: 'Account & Billing', desc: 'Manage your profile, subscription, and payment information.', articles: 6 },
];

const faqs = [
    { q: 'How do I reset my password?', a: 'Click "Forgot password?" on the login page. Enter your email and we\'ll send you a reset link.' },
    { q: 'Is LearnGrid free to use?', a: 'Yes! Our free plan gives you access to core features. Upgrade to Pro for advanced analytics and unlimited courses.' },
    { q: 'Can I export my data?', a: 'Absolutely. You can export your notes, assignments, and analytics data at any time from your Settings page.' },
    { q: 'Which browsers are supported?', a: 'LearnGrid works on all modern browsers including Chrome, Firefox, Safari, and Edge.' },
];

export function Help() {
    return (
        <div>
            <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Help Center</h1>
                    <p className="text-gray-500 text-lg mb-8">Find answers, guides, and resources to get the most out of LearnGrid.</p>
                    <div className="max-w-md mx-auto relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search for help..." className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-2xl font-extrabold mb-8 text-center">Browse by category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {categories.map((cat, i) => (
                            <div key={i} className="rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-indigo-50 hover:-translate-y-1 transition-all duration-300 text-center">
                                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                                    <cat.icon size={22} />
                                </div>
                                <h3 className="font-bold text-base mb-1">{cat.title}</h3>
                                <p className="text-sm text-gray-500 mb-3">{cat.desc}</p>
                                <p className="text-xs text-indigo-600 font-semibold">{cat.articles} articles</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-2xl font-extrabold mb-8 text-center">Frequently asked questions</h2>
                    <div className="flex flex-col gap-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                                <h3 className="font-bold text-sm mb-2">{faq.q}</h3>
                                <p className="text-sm text-gray-500">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
