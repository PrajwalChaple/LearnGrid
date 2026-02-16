import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen,
    LayoutDashboard,
    BarChart2,
    CheckCircle2,
    Clock,
    ShieldCheck,
    ArrowRight,
    Star,
    Menu,
    X,
    GraduationCap,
    Sparkles,
    Users
} from 'lucide-react';

export const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const features = [
        { icon: LayoutDashboard, color: 'text-indigo-600 bg-indigo-50', title: 'Smart Dashboard', desc: "Get a bird's eye view of your academic performance with real-time analytics and progress tracking." },
        { icon: BookOpen, color: 'text-pink-600 bg-pink-50', title: 'Notes Management', desc: 'Create, organize, and share beautiful notes with rich text editing and seamless cloud sync.' },
        { icon: Clock, color: 'text-orange-600 bg-orange-50', title: 'Assignment Tracking', desc: 'Never miss a deadline again. Smart reminders and calendar integration keep you on track.' },
        { icon: BarChart2, color: 'text-emerald-600 bg-emerald-50', title: 'Clean Analytics', desc: 'Visualize your grades and study habits with intuitive charts that help you improve.' },
        { icon: ShieldCheck, color: 'text-blue-600 bg-blue-50', title: 'Secure & Private', desc: 'Your data is encrypted and safe. We prioritize your privacy so you can focus on learning.' },
        { icon: Sparkles, color: 'text-amber-600 bg-amber-50', title: 'Personalized Learning', desc: 'AI-driven recommendations to help you focus on what matters most for your exams.' },
    ];

    const testimonials = [
        { quote: "LearnGrid completely changed how I manage my coursework. I went from C's to A's in one semester.", author: 'Alex M.', role: 'Computer Science Student' },
        { quote: "The most intuitive study tool I've ever used. The UI is gorgeous and it just works.", author: 'Sarah K.', role: 'Medical Student' },
        { quote: 'I love the notes feature. Being able to link notes to assignments is a game changer.', author: 'James R.', role: 'High School Senior' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {/* ─── NAVBAR ─── */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-gray-900 no-underline">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                            <GraduationCap size={18} />
                        </div>
                        <span>LearnGrid</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors no-underline">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors no-underline">How it Works</a>
                        <a href="#testimonials" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors no-underline">Stories</a>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors no-underline">Log in</Link>
                        <Link to="/register" className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition-all hover:-translate-y-0.5 shadow-md shadow-indigo-200 no-underline">
                            Get Started
                        </Link>
                    </div>

                    <button className="md:hidden text-gray-500" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-3">
                        <a href="#features" className="text-gray-600 font-medium py-1 no-underline" onClick={toggleMenu}>Features</a>
                        <a href="#how-it-works" className="text-gray-600 font-medium py-1 no-underline" onClick={toggleMenu}>How it Works</a>
                        <a href="#testimonials" className="text-gray-600 font-medium py-1 no-underline" onClick={toggleMenu}>Stories</a>
                        <hr className="border-gray-100" />
                        <Link to="/login" className="text-gray-600 font-medium py-1 no-underline" onClick={toggleMenu}>Log in</Link>
                        <Link to="/register" className="px-5 py-2.5 bg-indigo-600 text-white text-center rounded-full font-semibold no-underline" onClick={toggleMenu}>Get Started</Link>
                    </div>
                )}
            </nav>

            {/* ─── HERO ─── */}
            <section className="relative pt-20 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />
                <div className="max-w-6xl mx-auto px-6 text-center">


                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                        The Smart Learning<br />
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Dashboard for Students
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
                        Manage your assignments, track your progress, and stay organized with the all-in-one platform designed for modern education.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link to="/register" className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-200 no-underline">
                            Start Learning Now <ArrowRight size={18} />
                        </Link>
                        <Link to="/login" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-600 font-semibold rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all no-underline">
                            View Demo
                        </Link>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="max-w-3xl mx-auto" style={{ perspective: '1200px' }}>
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-indigo-100 overflow-hidden" style={{ transform: 'rotateX(2deg)' }}>
                            <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 border-b border-gray-100">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
                            </div>
                            <div className="flex h-56">
                                <div className="w-40 bg-indigo-950 flex-shrink-0" />
                                <div className="flex-1 bg-gray-50 p-4 flex flex-col gap-3">
                                    <div className="flex gap-3">
                                        <div className="flex-1 h-14 bg-white rounded-lg border border-gray-100" />
                                        <div className="flex-1 h-14 bg-white rounded-lg border border-gray-100" />
                                        <div className="flex-1 h-14 bg-white rounded-lg border border-gray-100" />
                                    </div>
                                    <div className="flex-1 bg-white rounded-lg border border-gray-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── SOCIAL PROOF ─── */}
            <section className="py-10 border-b border-gray-100 text-center">
                <div className="max-w-6xl mx-auto px-6">
                    <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Trusted by students from</p>
                    <div className="flex items-center justify-center gap-10 flex-wrap text-gray-300 text-lg">
                        <span className="font-serif font-semibold">Stanford</span>
                        <span className="font-black tracking-tight">MIT</span>
                        <span className="font-mono font-bold">Berkeley</span>
                        <span className="font-serif italic font-semibold">Oxford</span>
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ─── */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                            Everything you need to{' '}
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">excel</span>
                        </h2>
                        <p className="text-gray-500 text-base leading-relaxed">
                            Stop juggling multiple apps. LearnGrid brings your entire academic life into one beautiful, intelligent dashboard.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg hover:shadow-indigo-50 hover:-translate-y-1 transition-all duration-300 group">
                                <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-5`}>
                                    <f.icon size={22} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─── */}
            <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-snug">
                                Effortless setup,<br />instant results.
                            </h2>
                            <p className="text-gray-500 text-base leading-relaxed mb-10">
                                Get started in less than 2 minutes. We've optimized every step to get you learning faster.
                            </p>

                            <div className="flex flex-col gap-7">
                                {[
                                    { n: '01', t: 'Create your account', d: "Sign up with your email. It's free and always will be for students." },
                                    { n: '02', t: 'Add your courses', d: 'Personalize your dashboard with subjects, timetable, and goals.' },
                                    { n: '03', t: 'Start tracking', d: 'Log assignments, take notes, and watch your grades improve over time.' },
                                ].map((s, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {s.n}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base mb-0.5">{s.t}</h4>
                                            <p className="text-sm text-gray-500">{s.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-10 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-50 -z-10" />
                            <div className="flex flex-col gap-5">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5 flex items-center gap-4" style={{ transform: 'rotate(1deg)' }}>
                                    <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 size={22} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Assignment Completed!</p>
                                        <p className="text-xs text-gray-400">Advanced Mathematics • Just now</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5 ml-10" style={{ transform: 'rotate(-1deg)' }}>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">GPA Trend</p>
                                            <p className="text-3xl font-extrabold text-indigo-600 leading-none">3.8</p>
                                        </div>
                                        <div className="flex gap-1 items-end h-12">
                                            {[40, 60, 50, 75, 90].map((h, i) => (
                                                <div key={i} className={`w-2.5 rounded-t-sm ${i === 4 ? 'bg-indigo-600' : 'bg-indigo-200'}`} style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── TESTIMONIALS ─── */}
            <section id="testimonials" className="py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Loved by students everywhere</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100">
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="#facc15" color="#facc15" />)}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed mb-6 italic">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                        {t.author[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{t.author}</p>
                                        <p className="text-xs text-gray-400">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                        Ready to upgrade your grades?
                    </h2>
                    <p className="text-base text-indigo-100 mb-10 max-w-lg mx-auto">
                        Join thousands of students who are learning smarter, not harder.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-full hover:shadow-xl transition-all hover:-translate-y-0.5 no-underline">
                            Get Started for Free
                        </Link>
                        <Link to="/login" className="px-8 py-3.5 text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/10 transition-all no-underline">
                            Log In
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="bg-gray-900 text-gray-400 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
                                <GraduationCap size={20} />
                                <span>LearnGrid</span>
                            </div>
                            <p className="text-sm leading-relaxed">Empowering students with tools for success. Built with ❤️ for the modern learner.</p>
                        </div>
                        <div>
                            <h4 className="text-white text-sm font-bold mb-4">Platform</h4>
                            <div className="flex flex-col gap-2.5">
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Features</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Pricing</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Integrations</a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white text-sm font-bold mb-4">Resources</h4>
                            <div className="flex flex-col gap-2.5">
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Blog</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Help Center</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Community</a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white text-sm font-bold mb-4">Legal</h4>
                            <div className="flex flex-col gap-2.5">
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Privacy Policy</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Terms of Service</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Cookie Policy</a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-6">
                        <p className="text-xs text-gray-500">© {new Date().getFullYear()} LearnGrid Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
