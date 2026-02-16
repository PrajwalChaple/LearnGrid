import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Clock, BarChart2, ShieldCheck, Sparkles, Zap, Globe, ArrowRight } from 'lucide-react';

const features = [
    { icon: LayoutDashboard, color: 'bg-indigo-50 text-indigo-600', title: 'Smart Dashboard', desc: "Get a bird's eye view of your academic performance with real-time analytics, progress tracking, and a personalized overview that adapts to your learning style." },
    { icon: BookOpen, color: 'bg-pink-50 text-pink-600', title: 'Notes Management', desc: 'Create, organize, and access your notes from anywhere. Rich text editing, tagging, and search make finding information effortless.' },
    { icon: Clock, color: 'bg-orange-50 text-orange-600', title: 'Assignment Tracking', desc: 'Never miss a deadline. Track every assignment with due dates, priority levels, and progress bars — all synced to your calendar.' },
    { icon: BarChart2, color: 'bg-emerald-50 text-emerald-600', title: 'Clean Analytics', desc: 'Visualize your grades, study hours, and academic trends with beautiful, intuitive charts that highlight what matters.' },
    { icon: ShieldCheck, color: 'bg-blue-50 text-blue-600', title: 'Secure & Private', desc: 'Your data is encrypted end-to-end. We never sell your information, and you stay in full control of your academic records.' },
    { icon: Sparkles, color: 'bg-amber-50 text-amber-600', title: 'Personalized Insights', desc: 'Receive tailored recommendations based on your study patterns. Focus on what matters most for your next exam.' },
    { icon: Zap, color: 'bg-violet-50 text-violet-600', title: 'Instant Sync', desc: 'Changes sync across all your devices in real time. Start on your laptop, continue on your phone — seamlessly.' },
    { icon: Globe, color: 'bg-cyan-50 text-cyan-600', title: 'Access Anywhere', desc: 'Cloud-based platform works on any device with a browser. No downloads, no installations — just open and learn.' },
];

export function Features() {
    return (
        <div>
            <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        Powerful features for{' '}
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">serious learners</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-6">
                        Everything you need to organize your academic life, track progress, and achieve your goals — in one beautiful platform.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-indigo-50 hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                                    <f.icon size={22} />
                                </div>
                                <h3 className="text-base font-bold mb-2">{f.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-extrabold text-white mb-4">Ready to experience all features?</h2>
                    <p className="text-indigo-100 mb-8">Start for free — no credit card required.</p>
                    <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-full hover:shadow-xl transition-all hover:-translate-y-0.5 no-underline">
                        Get Started Free <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
