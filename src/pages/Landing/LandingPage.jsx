import React, { useState, useEffect, useRef } from 'react';
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
    Users,
    Github,
    Linkedin,
    Instagram,
    Mail
} from 'lucide-react';

const stepsData = [
    { n: '01', t: 'Create your account', d: "Sign up with your email. It's free and always will be for students." },
    { n: '02', t: 'Add your courses', d: 'Personalize your dashboard with subjects, timetable, and goals.' },
    { n: '03', t: 'Start tracking', d: 'Log assignments, take notes, and watch your grades improve over time.' },
];

function StepsTimeline() {
    const containerRef = useRef(null);
    const [visible, setVisible] = useState([false, false, false]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    stepsData.forEach((_, i) => {
                        setTimeout(() => {
                            setVisible(prev => { const next = [...prev]; next[i] = true; return next; });
                        }, i * 300);
                    });
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="relative flex flex-col gap-8">
            {/* Vertical connecting line */}
            <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-indigo-200 via-purple-200 to-indigo-100 z-0" />

            {stepsData.map((s, i) => (
                <div
                    key={i}
                    className="flex gap-5 items-start relative z-10"
                    style={{
                        opacity: visible[i] ? 1 : 0,
                        transform: visible[i] ? 'translateY(0)' : 'translateY(24px)',
                        transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s`,
                    }}
                >
                    {/* Animated number circle */}
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 text-white shadow-lg"
                        style={{
                            background: `linear-gradient(135deg, ${['#6366f1', '#8b5cf6', '#a855f7'][i]} 0%, ${['#818cf8', '#a78bfa', '#c084fc'][i]} 100%)`,
                            boxShadow: visible[i] ? `0 4px 20px ${['rgba(99,102,241,0.4)', 'rgba(139,92,246,0.4)', 'rgba(168,85,247,0.4)'][i]}` : 'none',
                            transition: 'box-shadow 0.6s ease',
                        }}
                    >
                        {s.n}
                    </div>

                    {/* Step card */}
                    <div
                        className="bg-white rounded-xl border border-gray-100 p-4 flex-1"
                        style={{
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            transition: 'all 0.3s ease',
                            cursor: 'default',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.12)';
                            e.currentTarget.style.borderColor = '#c7d2fe';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                            e.currentTarget.style.borderColor = '#f3f4f6';
                        }}
                    >
                        <h4 className="font-bold text-base mb-0.5">{s.t}</h4>
                        <p className="text-sm text-gray-500">{s.d}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

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

                    {/* ─── PRODUCT PREVIEW ─── */}
                    <div className="max-w-4xl mx-auto" style={{ perspective: '1200px' }}>
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-indigo-100/50 overflow-hidden" style={{ transform: 'rotateX(2deg)' }}>
                            {/* Browser chrome */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="bg-gray-100 rounded-md px-4 py-1 text-xs text-gray-400 font-medium w-56 text-center">learngrid.app/dashboard</div>
                                </div>
                            </div>
                            {/* Dashboard body */}
                            <div className="flex" style={{ minHeight: '280px' }}>
                                {/* Sidebar */}
                                <div className="w-44 flex-shrink-0 bg-gradient-to-b from-indigo-950 to-indigo-900 p-4 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">L</span>
                                        </div>
                                        <span className="text-white/90 text-xs font-semibold">LearnGrid</span>
                                    </div>
                                    {['Dashboard', 'My Notes', 'Assignments', 'Calendar', 'Profile'].map((item, idx) => (
                                        <div key={idx} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium ${idx === 0 ? 'bg-white/10 text-white' : 'text-white/50'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-indigo-400' : 'bg-transparent'}`} />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                {/* Main content */}
                                <div className="flex-1 bg-slate-50 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Welcome back, Student 👋</p>
                                            <p className="text-xs text-gray-400">Here's your academic overview</p>
                                        </div>
                                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">S</div>
                                    </div>
                                    {/* Stat cards */}
                                    <div className="grid grid-cols-3 gap-2.5 mb-4">
                                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                                            <p className="text-xs text-gray-400 mb-1">Assignments</p>
                                            <p className="text-lg font-extrabold text-gray-800">12</p>
                                            <div className="w-full h-1 rounded-full bg-gray-100 mt-1.5"><div className="w-3/4 h-full rounded-full bg-indigo-500" /></div>
                                        </div>
                                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                                            <p className="text-xs text-gray-400 mb-1">Completed</p>
                                            <p className="text-lg font-extrabold text-emerald-600">8</p>
                                            <div className="w-full h-1 rounded-full bg-gray-100 mt-1.5"><div className="w-2/3 h-full rounded-full bg-emerald-500" /></div>
                                        </div>
                                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                                            <p className="text-xs text-gray-400 mb-1">Notes</p>
                                            <p className="text-lg font-extrabold text-gray-800">24</p>
                                            <div className="w-full h-1 rounded-full bg-gray-100 mt-1.5"><div className="w-1/2 h-full rounded-full bg-purple-500" /></div>
                                        </div>
                                    </div>
                                    {/* Chart area */}
                                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                                        <p className="text-xs font-semibold text-gray-500 mb-2">Weekly Progress</p>
                                        <div className="flex items-end gap-2 h-16">
                                            {[35, 55, 40, 70, 60, 85, 75].map((h, idx) => (
                                                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                                    <div className="w-full rounded-t-sm" style={{ height: `${h}%`, background: idx === 5 ? 'linear-gradient(to top, #6366f1, #a855f7)' : '#e0e7ff' }} />
                                                    <span className="text-gray-300" style={{ fontSize: '7px' }}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── QUICK BENEFITS ─── */}
            <section className="py-14 border-b border-gray-100 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50', title: 'Stay Organized', desc: 'Keep all your courses, notes, and deadlines in one centralized dashboard.' },
                            { icon: Clock, color: 'text-indigo-600 bg-indigo-50', title: 'Track Assignments', desc: 'Never miss a due date with smart progress tracking and calendar views.' },
                            { icon: BarChart2, color: 'text-purple-600 bg-purple-50', title: 'Boost Productivity', desc: 'Visualize habits, set goals, and build a consistent study routine.' },
                        ].map((b, i) => (
                            <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:shadow-md hover:shadow-indigo-50 transition-all duration-300 hover:-translate-y-0.5 bg-white">
                                <div className={`w-10 h-10 rounded-xl ${b.color} flex items-center justify-center flex-shrink-0`}>
                                    <b.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm mb-1">{b.title}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── STATS ─── */}
            <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50/30">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Built for students who take learning seriously</h2>
                        <p className="text-gray-500 text-sm">Our growing community proves that the right tools make all the difference.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { value: '10k+', label: 'Students organizing their studies', accent: 'text-indigo-600' },
                            { value: '95%', label: 'Reported improved productivity', accent: 'text-emerald-600' },
                            { value: '24/7', label: 'Access from any device, anywhere', accent: 'text-purple-600' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 text-center hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 hover:-translate-y-1">
                                <p className={`text-4xl font-extrabold ${stat.accent} mb-2`}>{stat.value}</p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                        ))}
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

                            <StepsTimeline />
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
                            <p className="text-sm leading-relaxed mb-5">Empowering students with tools for success. Built with ❤️ for the modern learner.</p>
                            <div className="flex items-center gap-2.5">
                                {[
                                    { icon: Linkedin, href: 'https://www.linkedin.com/in/prajwalchaple' },
                                    { icon: Github, href: 'https://github.com/PrajwalChaple' },
                                    { icon: Instagram, href: 'https://www.instagram.com/prajwal__14_' },
                                    { icon: Mail, href: 'https://mail.google.com/mail/?view=cm&to=prajwalchaple14@gmail.com' },
                                ].map((s, i) => (
                                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:bg-indigo-600 transition-all duration-200 no-underline">
                                        <s.icon size={14} />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white text-sm font-bold mb-4">Platform</h4>
                            <div className="flex flex-col gap-2.5">
                                <Link to="/features" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Features</Link>
                                <Link to="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Pricing</Link>
                                <Link to="/integrations" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Integrations</Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white text-sm font-bold mb-4">Resources</h4>
                            <div className="flex flex-col gap-2.5">
                                <Link to="/blog" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Blog</Link>
                                <Link to="/help" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Help Center</Link>
                                <Link to="/community" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Community</Link>
                                <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">About</Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white text-sm font-bold mb-4">Legal</h4>
                            <div className="flex flex-col gap-2.5">
                                <Link to="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Privacy Policy</Link>
                                <Link to="/terms-of-service" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Terms of Service</Link>
                                <Link to="/cookie-policy" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Cookie Policy</Link>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-gray-500">© {new Date().getFullYear()} LearnGrid. All rights reserved.</p>
                        <p className="text-xs text-gray-600">Designed & Developed by{' '}
                            <a href="https://www.linkedin.com/in/prajwalchaple" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors no-underline">Prajwal Chaple</a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
