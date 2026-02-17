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
    TrendingUp,
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

// Helper for animated counters
function AnimatedCounter({ end, duration = 2000 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            if (progress < duration) {
                // Ease out quart function for smoother landing
                const percentage = 1 - Math.pow(1 - progress / duration, 4);
                setCount(Math.floor(end * percentage));
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <span>{count}</span>;
}

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
            <section className="relative pt-20 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                <div className="max-w-6xl mx-auto px-6 text-center relative z-10">

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 animate-fade-in-up animation-delay-100">
                        The Smart Learning<br />
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Dashboard for Students
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-200">
                        Manage your assignments, track your progress, and stay organized with the all-in-one platform designed for modern education.
                    </p>

                    {/* ─── INTERACTIVE MINI DASHBOARD PREVIEW ─── */}
                    <div className="relative max-w-4xl mx-auto animate-fade-in-up animation-delay-300">

                        {/* Micro Label */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 shadow-sm z-20">
                            Interactive Product Preview
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-indigo-200/50 overflow-hidden relative group transition-all duration-500 hover:shadow-indigo-300/50 hover:-translate-y-1">

                            {/* Browser chrome */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300 group-hover:bg-red-400 transition-colors duration-300" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300 group-hover:bg-yellow-400 transition-colors duration-300" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300 group-hover:bg-green-400 transition-colors duration-300" />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="bg-white border border-gray-200 rounded-md px-4 py-1 text-[10px] text-gray-400 font-medium w-64 text-center flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        app.learngrid.com/dashboard
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Body Preview */}
                            <div className="p-6 bg-slate-50/50">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    {/* Stat Card 1 */}
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group/card">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover/card:bg-indigo-600 group-hover/card:text-white transition-colors duration-300">
                                                <BookOpen size={16} />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-500">Notes Uploaded</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            <AnimatedCounter end={24} duration={2000} />
                                        </div>
                                    </div>

                                    {/* Stat Card 2 */}
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group/card">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover/card:bg-orange-600 group-hover/card:text-white transition-colors duration-300">
                                                <Clock size={16} />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-500">Assignments Pending</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            <AnimatedCounter end={12} duration={2500} />
                                        </div>
                                    </div>

                                    {/* Stat Card 3 */}
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group/card">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover/card:bg-emerald-600 group-hover/card:text-white transition-colors duration-300">
                                                <BarChart2 size={16} />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-500">Weekly Progress</span>
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-bold text-gray-900">
                                                <AnimatedCounter end={85} duration={3000} />%
                                            </span>
                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full mb-1.5 overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full animate-progress" style={{ width: '85%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Activity Graph Preview */}
                                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-bold text-gray-800">Study Activity</h4>
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between h-24 gap-2">
                                        {[40, 70, 45, 90, 65, 85, 50, 75, 60, 95].map((h, i) => (
                                            <div key={i} className="flex-1 bg-indigo-50 rounded-t-sm relative group/bar overflow-hidden">
                                                <div
                                                    className="absolute bottom-0 left-0 right-0 bg-indigo-500 opacity-80 group-hover/bar:opacity-100 transition-all duration-500 rounded-t-sm"
                                                    style={{ height: `${h}%`, transitionDelay: `${i * 50}ms` }}
                                                ></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Feature Tags */}
                        <div className="absolute -left-12 top-1/4 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-100 flex items-center gap-2 animate-float hidden md:flex">
                            <TrendingUp size={14} className="text-emerald-500" />
                            <span className="text-xs font-bold text-gray-700">Smart Analytics</span>
                        </div>
                        <div className="absolute -right-8 top-1/3 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-100 flex items-center gap-2 animate-float animation-delay-2000 hidden md:flex">
                            <ShieldCheck size={14} className="text-blue-500" />
                            <span className="text-xs font-bold text-gray-700">Secure & Private</span>
                        </div>
                        <div className="absolute -left-4 bottom-10 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-100 flex items-center gap-2 animate-float animation-delay-4000 hidden md:flex">
                            <Users size={14} className="text-purple-500" />
                            <span className="text-xs font-bold text-gray-700">Class-Based Access</span>
                        </div>

                    </div>
                </div>

                {/* Scroll Down Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Scroll to explore</span>
                    <ArrowRight size={14} className="text-gray-400 rotate-90" />
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
