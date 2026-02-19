import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen,
    BarChart2,
    CheckCircle2,
    Clock,
    ShieldCheck,
    ArrowRight,
    Menu,
    X,
    GraduationCap,
    Sparkles,
    TrendingUp,
    Users,
    Github,
    Linkedin,
    Instagram,
    Mail,
    Calendar,
    Bell,
    Cloud,
    Cpu,
    Zap,
    Database,
    Activity,
    Upload,
    BrainCircuit,
    ArrowDown,
    ArrowUp,
    FileText,
    Settings,
    Rocket
} from 'lucide-react';

const stepsData = [
    { n: '01', t: 'Create your account', d: "Sign up with your email. It's free and always will be for students.", icon: Settings },
    { n: '02', t: 'Add your courses', d: 'Personalize your dashboard with subjects, timetable, and goals.', icon: FileText },
    { n: '03', t: 'Start tracking', d: 'Log assignments, take notes, and watch your grades improve over time.', icon: Rocket },
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
        <div ref={containerRef} className="relative flex flex-col gap-10">
            {stepsData.map((s, i) => (
                <div key={i} className="relative">
                    {/* Vertical connecting line with traveling pulse */}
                    {i < stepsData.length - 1 && (
                        <div className="absolute left-5 top-12 bottom-[-40px] w-[3px] z-0 overflow-hidden rounded-full"
                            style={{ visibility: visible[i] ? 'visible' : 'hidden' }}>
                            {/* Static gradient line */}
                            <div className="absolute inset-0 bg-gradient-to-b from-indigo-400/30 via-purple-400/20 to-indigo-400/30 rounded-full" />
                            {/* Traveling pulse dot */}
                            <div
                                className="absolute left-0 w-full h-8 rounded-full"
                                style={{
                                    background: 'linear-gradient(to bottom, transparent, #818cf8, #a78bfa, transparent)',
                                    animation: `pulseDown 2s ease-in-out ${i * 0.4}s infinite`,
                                    boxShadow: '0 0 12px 3px rgba(129, 140, 248, 0.5)',
                                }}
                            />
                        </div>
                    )}

                    <div
                        className="flex gap-6 items-start relative z-10"
                        style={{
                            opacity: visible[i] ? 1 : 0,
                            transform: visible[i] ? 'translateX(0)' : 'translateX(-20px)',
                            transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.15}s`,
                        }}
                    >
                        {/* Step Icon Circle */}
                        <div className="relative group">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0 text-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${visible[i] ? 'animate-feature-pulse' : ''
                                }`}
                                style={{
                                    background: `linear-gradient(135deg, ${['#6366f1', '#8b5cf6', '#a855f7'][i]} 0%, ${['#818cf8', '#a78bfa', '#c084fc'][i]} 100%)`,
                                }}>
                                <s.icon size={22} className="text-white/90" />
                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-white text-indigo-600 rounded-lg text-[10px] flex items-center justify-center border shadow-sm border-indigo-100">{s.n}</div>
                            </div>
                        </div>

                        {/* Step card */}
                        <div
                            className="glass-premium rounded-2xl p-5 flex-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-100 border border-white/40"
                        >
                            <h4 className="font-bold text-lg mb-1 text-gray-900">{s.t}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">{s.d}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Dynamic greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };


    // Bento Grid feature cards data
    const bentoCards = [
        {
            icon: Upload, title: 'PDF Upload & Parse',
            desc: 'Upload your syllabus or assignment PDFs and let AI extract key details automatically.',
            color: 'from-indigo-500 to-blue-600', status: 'Live',
            details: 'Drag & drop any PDF — Gemini AI reads your document, extracts subject names, due dates, and task descriptions. Parsed assignments are saved to Firebase and appear on your dashboard instantly. Supports batch uploads.'
        },
        {
            icon: Calendar, title: 'Google Calendar Sync',
            desc: 'Assignments auto-sync to your Google Calendar with smart reminders.',
            color: 'from-purple-500 to-pink-600',
            details: 'One-click Google Calendar integration. Every assignment you add gets created as a calendar event with the due date and a reminder. Uses Google Calendar API with OAuth 2.0 so your data stays private.'
        },
        {
            icon: Cloud, title: 'Firebase Cloud Sync',
            desc: 'All your data lives in Firestore — access from any device, always in sync.',
            color: 'from-violet-500 to-purple-600',
            details: 'Powered by Firebase Firestore with real-time listeners. Your assignments, announcements, and profile data sync across all devices instantly. Includes Google Sign-In authentication for secure access.'
        },
        {
            icon: Activity, title: 'Announcements',
            desc: 'Post and receive class announcements scoped to your class, branch, or entire college.',
            color: 'from-cyan-500 to-blue-500',
            details: 'Create announcements with a scope selector — choose to broadcast to your class only, your branch, or the whole college. Includes notification preferences so users only see what matters to them. All data stored in Firestore.'
        },
    ];

    // Platform pulse stats
    const pulseStats = [
        { value: 12847, label: 'Assignments Synced', icon: CheckCircle2, color: 'text-emerald-500', suffix: '+' },
        { value: 3420, label: 'Study Hours Tracked', icon: Clock, color: 'text-indigo-500', suffix: 'h' },
        { value: 8956, label: 'PDFs Processed by AI', icon: Cpu, color: 'text-purple-500', suffix: '+' },
        { value: 2150, label: 'Active Students', icon: Users, color: 'text-orange-500', suffix: '+' },
    ];



    // Tech Architecture nodes
    const archNodes = [
        { icon: Upload, label: 'Upload PDF', desc: 'Drag & drop your documents', color: 'from-blue-500 to-indigo-600' },
        { icon: BrainCircuit, label: 'AI Parser', desc: 'Extracts dates, subjects & tasks', color: 'from-purple-500 to-violet-600' },
        { icon: Database, label: 'Firebase Sync', desc: 'Real-time cloud database', color: 'from-orange-500 to-amber-600' },
        { icon: Calendar, label: 'Calendar Event', desc: 'Auto-created with reminders', color: 'from-emerald-500 to-green-600' },
    ];

    // IntersectionObserver for scroll animations
    const [visibleSections, setVisibleSections] = useState({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.15 }
        );

        ['bento-grid', 'platform-pulse', 'tech-arch'].forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Hovered architecture node
    const [hoveredNode, setHoveredNode] = useState(null);
    const [expandedCard, setExpandedCard] = useState(null);

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {/* ─── NAVBAR ─── */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2.5 no-underline group">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                            <GraduationCap size={20} />
                        </div>
                        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            LearnGrid
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#showcase" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors no-underline">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors no-underline">How it Works</a>
                        <a href="#tech-arch" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors no-underline">Tech Stack</a>
                        <Link to="/about" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors no-underline">About</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors no-underline">Log in</Link>
                        <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-full hover:shadow-xl hover:shadow-indigo-200 transition-all hover:-translate-y-0.5 no-underline">
                            Get Started
                        </Link>
                    </div>

                    <button className="md:hidden text-gray-500" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-3">
                        <a href="#showcase" className="text-gray-600 font-medium py-1 no-underline" onClick={toggleMenu}>Features</a>
                        <a href="#how-it-works" className="text-gray-600 font-medium py-1 no-underline" onClick={toggleMenu}>How it Works</a>
                        <a href="#tech-arch" className="text-gray-600 font-medium py-1 no-underline" onClick={toggleMenu}>Tech Stack</a>
                        <Link to="/about" className="text-gray-600 font-medium py-1 no-underline" onClick={toggleMenu}>About</Link>
                        <hr className="border-gray-100" />
                        <Link to="/login" className="text-gray-600 font-medium py-1 no-underline" onClick={toggleMenu}>Log in</Link>
                        <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center rounded-full font-semibold no-underline" onClick={toggleMenu}>Get Started</Link>
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
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-shift">
                            Dashboard for Students
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-200">
                        Manage your assignments, track your progress, and stay organized with the all-in-one platform designed for modern education.
                    </p>

                    {/* Single Premium CTA */}
                    <div className="flex flex-col items-center gap-5 animate-fade-in-up animation-delay-300">
                        <Link to="/register" className="group relative px-10 py-4.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-indigo-300/40 transition-all duration-500 hover:-translate-y-1.5 no-underline flex items-center gap-3 overflow-hidden">
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <span className="relative z-10">Get Started Free</span>
                            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
                        </Link>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="flex -space-x-2">
                                {['bg-indigo-400', 'bg-purple-400', 'bg-emerald-400', 'bg-orange-400'].map((c, i) => (
                                    <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-[9px] font-bold`}>
                                        {['P', 'A', 'S', 'R'][i]}
                                    </div>
                                ))}
                            </div>
                            <span className="font-medium">2,150+ students already learning</span>
                        </div>
                    </div>

                    {/* ─── INTERACTIVE DASHBOARD PREVIEW ─── */}
                    <div className="relative w-full max-w-4xl mx-auto mt-16 animate-fade-in-up animation-delay-500">
                        {/* Background glow effects */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-[2.5rem] blur-2xl animate-glow-pulse" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[2rem] opacity-60 animate-gradient-shift" />

                        {/* Main Dashboard Card */}
                        <div className="relative bg-white/90 backdrop-blur-xl rounded-[1.75rem] border border-white/60 shadow-2xl shadow-indigo-200/30 overflow-hidden">
                            {/* Top bar */}
                            <div className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                                    </div>
                                    <div className="hidden sm:flex items-center gap-2 ml-3 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                                        <div className="w-3 h-3 rounded bg-indigo-500 flex items-center justify-center">
                                            <GraduationCap size={8} className="text-white" />
                                        </div>
                                        <span className="text-[11px] text-white/50 font-medium">learngrid.app/dashboard</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-wider">Live</span>
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-5 sm:p-7">
                                {/* Dashboard Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Welcome back</p>
                                        <h3 className="text-xl font-extrabold text-gray-900">{getGreeting()}, Student</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-1.5">
                                            <Sparkles size={12} className="text-indigo-500" />
                                            <span className="text-[11px] font-bold text-indigo-600">AI Insights Ready</span>
                                        </div>
                                        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center relative cursor-default">
                                            <Bell size={16} className="text-gray-500" />
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] text-white font-bold flex items-center justify-center border-2 border-white">3</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                    {[
                                        { label: 'Total Assignments', value: '24', icon: FileText, change: '+3 this week', color: 'from-indigo-500 to-blue-600', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600', changeColor: 'text-indigo-500' },
                                        { label: 'Completed', value: '18', icon: CheckCircle2, change: '75% done', color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', changeColor: 'text-emerald-500' },
                                        { label: 'Due Soon', value: '4', icon: Clock, change: 'Next 48h', color: 'from-orange-500 to-amber-600', bgColor: 'bg-orange-50', textColor: 'text-orange-600', changeColor: 'text-orange-500' },
                                        { label: 'Notes', value: '15', icon: BookOpen, change: '+2 new', color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-50', textColor: 'text-purple-600', changeColor: 'text-purple-500' },
                                    ].map((stat, i) => (
                                        <div key={i}
                                            className={`rounded-2xl p-3.5 ${stat.bgColor} border border-white/60 group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default`}
                                            style={{ animation: `fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${0.6 + i * 0.1}s both` }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                                    <stat.icon size={14} className="text-white" />
                                                </div>
                                                <span className={`text-[10px] font-bold ${stat.changeColor}`}>{stat.change}</span>
                                            </div>
                                            <p className="text-2xl font-extrabold text-gray-900 leading-none mb-0.5">{stat.value}</p>
                                            <p className={`text-[10px] font-semibold uppercase tracking-wider ${stat.textColor} opacity-60`}>{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom Row: Activity Feed + Upcoming */}
                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                                    {/* Recent Activity Feed */}
                                    <div className="sm:col-span-3 rounded-2xl bg-gray-50/80 border border-gray-100 p-4" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 1s both' }}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-extrabold text-gray-800">Recent Activity</h4>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Today</span>
                                        </div>
                                        <div className="space-y-2.5">
                                            {[
                                                { icon: Upload, text: 'New DSA Unit-3 Notes uploaded', time: '2 min ago', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', tag: 'PDF', tagColor: 'bg-indigo-50 text-indigo-500' },
                                                { icon: Bell, text: 'New Announcement: Lab exam rescheduled to Monday', time: '15 min ago', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', tag: 'Announcement', tagColor: 'bg-orange-50 text-orange-500' },
                                                { icon: Clock, text: 'Reminder: OS Assignment due in 24 hours', time: '1 hr ago', iconBg: 'bg-red-100', iconColor: 'text-red-600', tag: 'Reminder', tagColor: 'bg-red-50 text-red-500' },
                                                { icon: BookOpen, text: 'DBMS ER Diagram notes shared', time: '3 hr ago', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', tag: 'Notes', tagColor: 'bg-emerald-50 text-emerald-500' },
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 cursor-default"
                                                    style={{ animation: `fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${1.1 + idx * 0.12}s both` }}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                                                        <item.icon size={14} className={item.iconColor} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[11px] font-semibold text-gray-700 truncate">{item.text}</p>
                                                        <p className="text-[9px] text-gray-400 font-medium">{item.time}</p>
                                                    </div>
                                                    <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${item.tagColor} flex-shrink-0 hidden sm:inline`}>{item.tag}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Upcoming Section */}
                                    <div className="sm:col-span-2 rounded-2xl bg-gray-50/80 border border-gray-100 p-4" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 1.1s both' }}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-extrabold text-gray-800">Upcoming</h4>
                                            <Calendar size={14} className="text-gray-400" />
                                        </div>
                                        <div className="space-y-2.5">
                                            {[
                                                { title: 'Math Assignment 4', due: 'Tomorrow, 11:59 PM', tag: 'Urgent', tagColor: 'bg-red-100 text-red-600' },
                                                { title: 'Physics Lab Viva', due: 'Thu, 22 Feb', tag: 'Prepare', tagColor: 'bg-yellow-100 text-yellow-700' },
                                                { title: 'Mini Project Review', due: 'Next Monday', tag: 'Team', tagColor: 'bg-indigo-100 text-indigo-600' },
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 cursor-default">
                                                    <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[12px] font-bold text-gray-800 truncate">{item.title}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium">{item.due}</p>
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${item.tagColor} flex-shrink-0`}>{item.tag}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badges around the card */}
                        <div className="absolute -top-4 right-8 sm:right-16 bg-white px-3.5 py-2 rounded-xl shadow-xl border border-indigo-100 flex items-center gap-2 animate-float z-30">
                            <div className="w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center">
                                <BrainCircuit size={12} className="text-white" />
                            </div>
                            <span className="text-[11px] font-bold text-gray-700">AI Powered</span>
                        </div>
                        <div className="absolute -bottom-4 left-8 sm:left-16 bg-white px-3.5 py-2 rounded-xl shadow-xl border border-emerald-100 flex items-center gap-2 animate-float animation-delay-1000 z-30">
                            <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center">
                                <Cloud size={12} className="text-white" />
                            </div>
                            <span className="text-[11px] font-bold text-gray-700">Real-time Sync</span>
                        </div>
                        <div className="absolute top-1/3 -left-2 sm:-left-4 bg-white px-3 py-1.5 rounded-xl shadow-xl border border-indigo-100 flex items-center gap-2 animate-float animation-delay-2000 z-30 hidden md:flex">
                            <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center">
                                <ShieldCheck size={12} className="text-white" />
                            </div>
                            <span className="text-[11px] font-bold text-gray-700">Secure</span>
                        </div>
                        <div className="absolute top-1/2 -right-2 sm:-right-4 bg-white px-3 py-1.5 rounded-xl shadow-xl border border-orange-100 flex items-center gap-2 animate-float animation-delay-4000 z-30 hidden md:flex">
                            <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center">
                                <Zap size={12} className="text-white" />
                            </div>
                            <span className="text-[11px] font-bold text-gray-700">Blazing Fast</span>
                        </div>
                    </div>
                </div>

                {/* Scroll Down Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-20">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Scroll to explore</span>
                    <ArrowDown size={14} className="text-gray-400" />
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

                        {/* Right side — Feature Orbit */}
                        <div className="hidden lg:flex items-center justify-center relative">
                            <div className="relative w-[420px] h-[420px]">

                                {/* Outer orbit ring */}
                                <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-200/40" />
                                {/* Middle orbit ring */}
                                <div className="absolute inset-12 rounded-full border-2 border-dashed border-purple-200/30" />
                                {/* Background glow */}
                                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 blur-2xl opacity-40" />

                                {/* Central Core */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                    <div className="relative group">
                                        <div className="absolute -inset-3 bg-indigo-500/20 rounded-3xl blur-2xl animate-glow-pulse" />
                                        <div className="relative w-24 h-24 bg-white rounded-3xl shadow-2xl border border-indigo-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                            <div className="p-3.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                                                <GraduationCap size={36} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">LearnGrid</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Orbiting Feature Nodes — uses inline keyframe via style tag */}
                                <style>{`
                                    @keyframes orbitCW {
                                        from { transform: rotate(var(--start)) translateX(var(--radius)) rotate(calc(-1 * var(--start))); }
                                        to   { transform: rotate(calc(var(--start) + 360deg)) translateX(var(--radius)) rotate(calc(-1 * (var(--start) + 360deg))); }
                                    }
                                `}</style>

                                {[
                                    { icon: BrainCircuit, label: 'AI Engine', color: 'from-purple-500 to-violet-600', borderColor: 'border-purple-100', startDeg: 0, duration: 18, radius: 185 },
                                    { icon: Calendar, label: 'Smart Sync', color: 'from-emerald-500 to-teal-600', borderColor: 'border-emerald-100', startDeg: 72, duration: 22, radius: 185 },
                                    { icon: FileText, label: 'Assignments', color: 'from-indigo-500 to-blue-600', borderColor: 'border-indigo-100', startDeg: 144, duration: 20, radius: 185 },
                                    { icon: BarChart2, label: 'Analytics', color: 'from-orange-500 to-amber-600', borderColor: 'border-orange-100', startDeg: 216, duration: 24, radius: 185 },
                                    { icon: Bell, label: 'Alerts', color: 'from-red-500 to-pink-600', borderColor: 'border-red-100', startDeg: 288, duration: 19, radius: 185 },
                                ].map((node, i) => (
                                    <div
                                        key={node.label}
                                        className="absolute left-1/2 top-1/2 z-10"
                                        style={{
                                            marginLeft: '-24px',
                                            marginTop: '-24px',
                                            '--start': `${node.startDeg}deg`,
                                            '--radius': `${node.radius}px`,
                                            animation: `orbitCW ${node.duration}s linear infinite`,
                                        }}
                                    >
                                        <div className="group relative flex flex-col items-center cursor-default">
                                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${node.color} shadow-lg flex items-center justify-center ring-4 ring-white group-hover:scale-110 transition-transform duration-300`}>
                                                <node.icon size={20} className="text-white" />
                                            </div>
                                            <div className={`mt-2 bg-white/90 backdrop-blur-md border ${node.borderColor} px-2.5 py-0.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200`}>
                                                <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">{node.label}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Floating status badges */}
                                <div className="absolute -top-2 right-4 bg-white px-3 py-1.5 rounded-full shadow-lg border border-emerald-100 flex items-center gap-1.5 animate-float z-30">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] font-bold text-gray-700">All synced</span>
                                </div>
                                <div className="absolute -bottom-2 left-4 bg-white px-3 py-1.5 rounded-full shadow-lg border border-purple-100 flex items-center gap-1.5 animate-float animation-delay-2000 z-30">
                                    <Sparkles size={12} className="text-purple-500" />
                                    <span className="text-[10px] font-bold text-gray-700">AI Powered</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ─── SECTION 1: BENTO GRID FEATURE SHOWCASE ─── */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section id="showcase" className="py-24 bg-gray-50 relative overflow-hidden">
                {/* Background accent blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="animate-fade-in-up animation-delay-100">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4">
                                <Sparkles size={12} />
                                Feature Showcase
                            </div>
                        </div>
                        <h2 className="animate-fade-in-up animation-delay-200 text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                            Power-packed with{' '}
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">everything you need</span>
                        </h2>
                        <p className="animate-fade-in-up animation-delay-300 text-gray-500 text-base max-w-xl mx-auto">Experience the tools that make LearnGrid the ultimate student companion.</p>
                    </div>

                    {/* Bento Grid */}
                    <div id="bento-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {bentoCards.map((card, i) => {
                            const isExpanded = expandedCard === i;
                            return (
                                <div
                                    key={i}
                                    className="relative group rounded-2xl border border-gray-200/60 overflow-hidden glass-premium transition-all duration-500 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50"
                                    style={{
                                        opacity: visibleSections['bento-grid'] ? 1 : 0,
                                        transform: visibleSections['bento-grid'] ? 'translateY(0)' : 'translateY(30px)',
                                        transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.12}s`,
                                    }}
                                >
                                    {/* Gradient background spot */}
                                    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${card.color} opacity-[0.06] group-hover:opacity-[0.14] blur-3xl transition-opacity duration-500`} />

                                    {/* Content */}
                                    <div className="relative z-10 p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                    <card.icon size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-base text-gray-900 leading-tight">{card.title}</h3>
                                                </div>
                                            </div>
                                            {card.status && (
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex-shrink-0 ${card.status === 'Live' ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 'bg-indigo-100 text-indigo-600'}`}>
                                                    {card.status}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-500 leading-relaxed mb-4">{card.desc}</p>

                                        {/* Expanded Details */}
                                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-40 opacity-100 mb-3' : 'max-h-0 opacity-0'}`}>
                                            <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/50">
                                                <p className="text-xs text-gray-600 leading-relaxed">{card.details}</p>
                                            </div>
                                        </div>

                                        {/* Learn More Button */}
                                        <button
                                            onClick={() => setExpandedCard(isExpanded ? null : i)}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer bg-transparent border-0 p-0"
                                        >
                                            {isExpanded ? 'Show less' : 'Learn more'}
                                            <ArrowRight size={12} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ─── SECTION 2: PLATFORM PULSE — LIVE STATS ─── */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-white relative overflow-hidden">
                {/* Subtle grid pattern background */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                }} />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4">
                            <Activity size={12} />
                            <span>Platform Pulse</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                            Built with real <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">impact</span>
                        </h2>
                        <p className="text-gray-500 text-base max-w-xl mx-auto">See what's happening on LearnGrid right now.</p>
                    </div>

                    {/* Stats Grid */}
                    <div id="platform-pulse" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {pulseStats.map((stat, i) => (
                            <div
                                key={i}
                                className="relative bg-white rounded-2xl p-6 border border-gray-100 text-center group hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-1 transition-all duration-400"
                                style={{
                                    opacity: visibleSections['platform-pulse'] ? 1 : 0,
                                    transform: visibleSections['platform-pulse'] ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                                    transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.12}s`,
                                }}
                            >
                                {/* Glow ring on hover */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-glow-pulse" style={{ pointerEvents: 'none' }} />

                                <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center`}
                                    style={{ backgroundColor: stat.color === 'text-emerald-500' ? '#ecfdf5' : stat.color === 'text-indigo-500' ? '#eef2ff' : stat.color === 'text-purple-500' ? '#faf5ff' : '#fff7ed' }}>
                                    <stat.icon size={20} className={stat.color} />
                                </div>

                                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1 tabular-nums">
                                    {visibleSections['platform-pulse'] ? <AnimatedCounter end={stat.value} duration={2500} /> : '0'}
                                    <span className="text-lg font-bold text-indigo-500">{stat.suffix}</span>
                                </p>
                                <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ─── SECTION 3: TECH ARCHITECTURE VISUALIZER ─── */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
                {/* Background particles */}
                <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-indigo-400/20 animate-float"
                            style={{
                                left: `${15 + i * 15}%`,
                                top: `${20 + (i * 23) % 60}%`,
                                animationDelay: `${i * 0.8}s`,
                                animationDuration: `${4 + i * 0.5}s`,
                            }}
                        />
                    ))}
                </div>

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4">
                            <Zap size={12} />
                            Under the Hood
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                            How the <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">magic</span> happens
                        </h2>
                        <p className="text-indigo-200/60 text-base max-w-xl mx-auto">From your PDF to a synced calendar event — powered by AI and real-time cloud infrastructure.</p>
                    </div>

                    {/* Architecture Flow Visualizer */}
                    <div id="tech-arch" className="relative">
                        {/* Desktop: Horizontal pipeline */}
                        <div className="hidden md:flex items-center justify-between gap-0 max-w-5xl mx-auto">
                            {archNodes.map((node, i) => (
                                <React.Fragment key={i}>
                                    {/* Node Card with Energy Pulse */}
                                    <div
                                        className="relative group cursor-default z-10"
                                        style={{
                                            opacity: visibleSections['tech-arch'] ? 1 : 0,
                                            transform: visibleSections['tech-arch'] ? 'translateY(0)' : 'translateY(30px)',
                                            transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.2}s`,
                                        }}
                                    >
                                        <div className={`relative w-48 rounded-2xl p-6 border transition-all duration-700 ${hoveredNode === i ? 'bg-indigo-500/10 border-indigo-400/50 scale-[1.02]' : 'bg-white/5 border-white/10'
                                            }`}>
                                            {/* Dynamic Border Glow */}
                                            <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            {/* Icon Cluster */}
                                            <div className="relative mb-4">
                                                <div className={`absolute inset-0 bg-gradient-to-br ${node.color} blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                                                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${node.color} flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                                    <node.icon size={28} className="text-white" />
                                                </div>
                                            </div>

                                            <h4 className="font-extrabold text-sm text-white mb-1.5 tracking-tight">{node.label}</h4>
                                            <p className="text-[11px] text-indigo-200/40 leading-relaxed font-medium">{node.desc}</p>

                                            {/* Order Indicator */}
                                            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-black text-indigo-400 shadow-xl group-hover:border-indigo-500/50 transition-colors">
                                                {i + 1}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Liquid Energy Connector */}
                                    {i < archNodes.length - 1 && (
                                        <div className="flex-1 h-20 -mx-4 relative flex items-center justify-center">
                                            {/* Pipe Background */}
                                            <div className="w-full h-[6px] bg-slate-800/50 rounded-full border border-white/5 overflow-hidden relative shadow-inner">
                                                {/* Flowing Energy Packets */}
                                                {[0, 1, 2].map((p) => (
                                                    <div
                                                        key={p}
                                                        className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-60 blur-[2px]"
                                                        style={{
                                                            animation: `flowRight 3s linear infinite`,
                                                            animationDelay: `${(i * 0.8) + (p * 1)}s`
                                                        }}
                                                    />
                                                ))}
                                                {/* High-velocity spark */}
                                                <div
                                                    className="absolute top-0 bottom-0 w-4 bg-white opacity-80 blur-[4px]"
                                                    style={{
                                                        animation: `flowRight 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                                                        animationDelay: `${i * 0.5}s`
                                                    }}
                                                />
                                            </div>

                                            {/* Ambient light glow */}
                                            <div className="absolute inset-x-8 h-4 bg-indigo-500/5 blur-2xl" />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Mobile: Vertical pipeline */}
                        <div className="md:hidden flex flex-col gap-4">
                            {archNodes.map((node, i) => (
                                <React.Fragment key={i}>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden group">
                                        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${node.color} flex items-center justify-center shadow-lg flex-shrink-0 z-10`}>
                                            <node.icon size={24} className="text-white" />
                                        </div>
                                        <div className="z-10">
                                            <h4 className="font-bold text-sm text-white mb-0.5">{node.label}</h4>
                                            <p className="text-[11px] text-indigo-200/40 font-medium">{node.desc}</p>
                                        </div>
                                        <div className="ml-auto w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-black text-indigo-400 flex-shrink-0 z-10">
                                            {i + 1}
                                        </div>
                                        {/* Subtle background glow */}
                                        <div className={`absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                                    </div>

                                    {/* Mobile Vertical Flow */}
                                    {i < archNodes.length - 1 && (
                                        <div className="h-10 w-[6px] bg-slate-800/50 mx-auto rounded-full border border-white/5 overflow-hidden relative">
                                            <div
                                                className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-indigo-400 to-transparent opacity-60 blur-[2px]"
                                                style={{
                                                    animation: `flowDown 2s linear infinite`,
                                                    animationDelay: `${i * 0.5}s`
                                                }}
                                            />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Summary Tagline */}
                        <div className="mt-16 text-center animate-fade-in-up animation-delay-500">
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((v) => (
                                        <div key={v} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                            <Zap size={10} className="text-indigo-400" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-indigo-100/70 tracking-tight">
                                    Data processed in <span className="text-indigo-400">0.8s</span> average
                                </span>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>
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
                            <p className="text-sm leading-relaxed mb-5">Empowering students with tools for success. Built for the modern learner.</p>
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
                            <span className="text-gray-400">Prajwal Chaple</span>
                        </p>
                    </div>
                </div>
            </footer >
        </div >
    );
};

export default LandingPage;
