import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import {
    CheckCircle2,
    Clock,
    ArrowRight,
    Menu,
    X,
    GraduationCap,
    Calendar,
    Bell,
    Cloud,
    LayoutDashboard,
    Activity,
    Upload,
    Users,
    MessageSquare,
    Settings,
    ShieldCheck,
    Zap,
    Github,
    Mail,
    FileText,
    BrainCircuit,
    ListTodo,
    Timer,
    Flag,
    Lightbulb,
    Database,
    BookOpen,
    ClipboardList,
    Eye,
    Sparkles,
    Bot,
    Heart,
    MessageCircle,
    Linkedin,
    Instagram
} from 'lucide-react';
import { motion } from 'framer-motion';

// Lazy load the heavy Spline 3D library — doesn't block page paint
const Spline = lazy(() => import('@splinetool/react-spline'));

import { useIsMobileDevice } from '../../hooks/useIsMobileDevice';

export const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobileDevice = useIsMobileDevice();
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Integrations setup with tooltips
    const integrations = [
        { icon: Cloud, name: 'Drive', color: 'text-blue-500', bg: 'bg-white' },
        { icon: Calendar, name: 'Calendar', color: 'text-emerald-500', bg: 'bg-white' },
        { icon: MessageSquare, name: 'Slack', color: 'text-indigo-500', bg: 'bg-white' },
        { icon: Github, name: 'GitHub', color: 'text-slate-800', bg: 'bg-white' },
        { icon: Mail, name: 'Gmail', color: 'text-red-500', bg: 'bg-white' },
        { icon: FileText, name: 'Notion', color: 'text-slate-700', bg: 'bg-white' },
        { icon: Users, name: 'Teams', color: 'text-purple-600', bg: 'bg-white' },
        { icon: Database, name: 'Database', color: 'text-orange-500', bg: 'bg-white' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* ─── NAVBAR ─── */}
            <nav className="fixed w-full top-0 z-50 bg-[#f8fafc]/80 backdrop-blur-xl border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center gap-1.5 no-underline group">
                        <img src={`${import.meta.env.BASE_URL}bookmark-25.svg`} alt="Logo" className="group-hover:scale-105 transition-transform duration-300" style={{ width: '28px', height: '28px' }} />
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            LearnGrid
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-10">
                        <Link to="/features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors no-underline">Features</Link>
                        <Link to="/help" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors no-underline">Help</Link>
                        <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors no-underline">About Us</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors no-underline px-4 py-2">Login</Link>
                        <Link to="/register" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm font-semibold rounded-full shadow-sm hover:shadow-md hover:border-slate-300 transition-all no-underline">
                            Sign in
                        </Link>
                    </div>

                    <button className="md:hidden text-slate-600 p-2" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 bg-white px-6 py-6 flex flex-col gap-4 absolute w-full shadow-2xl">
                        <Link to="/features" className="text-slate-600 font-medium py-2 text-lg no-underline" onClick={toggleMenu}>Features</Link>
                        <Link to="/help" className="text-slate-600 font-medium py-2 text-lg no-underline" onClick={toggleMenu}>Help</Link>
                        <Link to="/about" className="text-slate-600 font-medium py-2 text-lg no-underline" onClick={toggleMenu}>About Us</Link>
                        <hr className="border-slate-100 my-2" />
                        <Link to="/login" className="text-slate-600 font-medium py-2 text-lg no-underline" onClick={toggleMenu}>Login</Link>
                        <Link to="/register" className="px-6 py-3 bg-blue-600 text-white text-center rounded-xl font-semibold text-lg no-underline" onClick={toggleMenu}>Sign in</Link>
                    </div>
                )}
            </nav>

            {/* ─── HERO SECTION ─── */}
            <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-12 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">
                {/* Dotted Background overlay for texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                <div className="w-full max-w-6xl mx-auto px-6 text-center relative z-10">

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl sm:text-6xl md:text-8xl font-medium tracking-tight text-slate-900 mb-6 leading-[1.1]"
                    >
                        Think, plan, and track <br />
                        <span className="text-slate-400">all in one place</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-16 font-medium"
                    >
                        Efficiently manage your assignments, notes, and boost your college productivity.
                    </motion.p>

                    {/* Floating Hero UI Cards — placed BELOW the text in a flex row */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="flex flex-wrap items-start justify-center gap-6 md:gap-10 max-w-5xl mx-auto"
                    >
                        {/* Card 1: Sticky Note */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="hidden sm:block"
                        >
                            <div className="w-56 bg-yellow-100 p-5 shadow-md shadow-slate-200/50 text-left rotate-[-3deg] relative">
                                <div className="absolute top-[-5px] left-1/2 w-3 h-3 bg-red-500 rounded-full shadow-sm -translate-x-1/2"></div>
                                <p className="font-['Caveat',cursive] text-slate-800 text-xl leading-snug">
                                    Upload assignment PDFs to keep track of crucial details, and accomplish more tasks with ease.
                                </p>
                            </div>
                            {/* Blue Check float over sticky note */}
                            <div className="absolute -bottom-6 -right-4 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center rotate-12">
                                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <CheckCircle2 size={20} className="text-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 2: Today's Tasks */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="hidden md:block mt-8"
                        >
                            <div className="w-64 bg-white rounded-2xl p-5 shadow-md shadow-slate-200/50 border border-slate-100 text-left rotate-[2deg]">
                                <h4 className="font-bold text-slate-800 mb-4">Today's tasks</h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs font-semibold mb-1">
                                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Prepare DSA Notes</span>
                                            <span className="text-slate-500">80%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-[80%] rounded-full"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-semibold mb-1">
                                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Review DB Schema</span>
                                            <span className="text-slate-500">40%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-[40%] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 3: Reminders */}
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            className="hidden sm:block relative"
                        >
                            <div className="w-64 bg-slate-50 rounded-2xl p-4 shadow-md shadow-slate-200/60 border border-slate-200/60 rotate-[3deg] text-left">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-slate-800">Reminders</span>
                                    <span className="text-xs text-slate-400">Upcoming</span>
                                </div>
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <p className="text-sm font-semibold text-slate-800 mb-1">OS Lab Submission</p>
                                    <p className="text-xs text-slate-500 mb-3">Upload PDF to portal</p>
                                    <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 w-max px-2 py-1 rounded-md font-medium">
                                        <Clock size={12} /> 23:59 - Today
                                    </div>
                                </div>
                            </div>
                            {/* Clock float over reminders */}
                            <div className="absolute -left-8 top-8 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center -rotate-6">
                                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-200">
                                    <Timer size={18} className="text-slate-800" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ─── FEATURES: BENTO GRID ─── */}
            <section id="features" className="py-24 bg-white relative z-20">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-block px-4 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-full mb-6 border border-slate-200">
                            Features
                        </div>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-4">
                            Everything you actually need
                        </h2>
                        <p className="text-lg text-slate-500 pb-4">
                            No bloat. Just the tools that make your academic life easier.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* ── Card 1: Notes Management ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bento-card bg-[#f8fafc] overflow-hidden group flex flex-col"
                        >
                            <div className="p-8 pb-0 flex-1 relative min-h-[260px] flex items-center justify-center">
                                {/* Mock Notes UI */}
                                <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-100 p-5 group-hover:-translate-y-2 transition-all duration-500">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2 flex items-center gap-2 border border-slate-100">
                                            <div className="w-4 h-4 text-slate-400"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg></div>
                                            <span className="text-xs text-slate-400 font-medium">Search notes...</span>
                                        </div>
                                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                            <Upload size={16} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <motion.div whileHover={{ x: 4 }} className="flex items-center gap-3 p-2.5 bg-blue-50/80 rounded-lg border border-blue-100 cursor-pointer">
                                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0"><FileText size={14} className="text-red-600" /></div>
                                            <div className="flex-1 min-w-0"><p className="text-xs font-bold text-slate-800 truncate">DSA Unit 3 — Trees & Graphs</p><p className="text-[10px] text-slate-400 font-medium">Uploaded 2 hrs ago · PDF</p></div>
                                            <Eye size={14} className="text-slate-400 flex-shrink-0" />
                                        </motion.div>
                                        <motion.div whileHover={{ x: 4 }} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0"><FileText size={14} className="text-red-600" /></div>
                                            <div className="flex-1 min-w-0"><p className="text-xs font-bold text-slate-800 truncate">OS — Process Scheduling</p><p className="text-[10px] text-slate-400 font-medium">Yesterday · PDF</p></div>
                                            <Eye size={14} className="text-slate-400 flex-shrink-0" />
                                        </motion.div>
                                        <motion.div whileHover={{ x: 4 }} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0"><FileText size={14} className="text-red-600" /></div>
                                            <div className="flex-1 min-w-0"><p className="text-xs font-bold text-slate-800 truncate">DBMS — Normalization Notes</p><p className="text-[10px] text-slate-400 font-medium">3 days ago · PDF</p></div>
                                            <Eye size={14} className="text-slate-400 flex-shrink-0" />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-white border-t border-slate-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600"><FileText size={20} /></div>
                                    <h3 className="text-2xl font-bold text-slate-900">Notes Management</h3>
                                </div>
                                <p className="text-slate-500 font-medium">Upload, search, and view your PDF notes anytime. Keep all study materials organized in one cloud-backed library.</p>
                            </div>
                        </motion.div>

                        {/* ── Card 2: Assignment Tracking ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bento-card bg-[#f8fafc] overflow-hidden group flex flex-col"
                        >
                            <div className="p-8 pb-0 flex-1 relative min-h-[260px] flex items-center justify-center">
                                <div className="w-full max-w-sm space-y-3 group-hover:-translate-y-1 transition-all duration-500">
                                    {/* Assignment Item 1 */}
                                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-md border border-slate-100 p-4 cursor-pointer">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">React Project — Phase 1</p>
                                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Uploaded by Prajwal · 2 days ago</p>
                                            </div>
                                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100 flex items-center gap-1"><CheckCircle2 size={10} /> Done</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded-md font-medium"><Clock size={10} /> Due: Mar 15</div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-medium"><Calendar size={10} /> Synced</div>
                                        </div>
                                    </motion.div>
                                    {/* Assignment Item 2 */}
                                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-md border border-slate-100 p-4 cursor-pointer">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">OS Lab — Scheduling Algo</p>
                                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Uploaded by Rohan · 5 hrs ago</p>
                                            </div>
                                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-100 flex items-center gap-1"><Clock size={10} /> Pending</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-[10px] text-red-500 bg-red-50 px-2 py-1 rounded-md font-medium"><Clock size={10} /> Due: Today 11:59 PM</div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded-md font-medium"><FileText size={10} /> PDF attached</div>
                                        </div>
                                    </motion.div>
                                    {/* Assignment Item 3 - subtle */}
                                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white/60 rounded-xl shadow-sm border border-slate-100/50 p-4 cursor-pointer opacity-60">
                                        <div className="flex items-start justify-between">
                                            <p className="text-sm font-bold text-slate-600">DBMS ER Diagram</p>
                                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-100 flex items-center gap-1"><Clock size={10} /> Pending</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                            <div className="p-8 bg-white border-t border-slate-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600"><ClipboardList size={20} /></div>
                                    <h3 className="text-2xl font-bold text-slate-900">Assignment Tracking</h3>
                                </div>
                                <p className="text-slate-500 font-medium">Track every assignment with deadlines, status updates, PDF attachments, and automatic Google Calendar sync.</p>
                            </div>
                        </motion.div>

                        {/* ── Card 3: Announcements ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bento-card bg-[#f8fafc] overflow-hidden group flex flex-col"
                        >
                            <div className="p-8 bg-white border-b border-slate-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600"><Bell size={20} /></div>
                                    <h3 className="text-2xl font-bold text-slate-900">Announcements</h3>
                                </div>
                                <p className="text-slate-500 font-medium">Broadcast important updates to your entire class or specific sections instantly with smart audience targeting.</p>
                            </div>
                            <div className="p-8 flex-1 relative min-h-[260px] flex items-center justify-center overflow-hidden">
                                <div className="w-full max-w-sm group-hover:-translate-y-1 transition-all duration-500">
                                    {/* Mock announcement card */}
                                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-lg border border-slate-100 p-5 mb-3 cursor-pointer">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center"><Bell size={12} className="text-purple-600" /></div>
                                            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">New Announcement</span>
                                            <span className="text-[10px] text-slate-400 ml-auto font-medium">Just now</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 mb-1">Lab exam rescheduled to Friday</p>
                                        <p className="text-xs text-slate-500 mb-3">OS Lab practical exam moved from Wed to Fri. Prepare Scheduling algorithms.</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-semibold">📢 All Students</span>
                                            <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-md font-medium">Std 9th · Sec A</span>
                                        </div>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white/70 rounded-xl shadow-sm border border-slate-100/50 p-4 cursor-pointer opacity-50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center"><Bell size={10} className="text-indigo-600" /></div>
                                            <p className="text-xs font-bold text-slate-600">Holiday notice — Republic Day</p>
                                        </div>
                                        <p className="text-[10px] text-slate-400">No classes on 26th January...</p>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* ── Card 4: Calendar View ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bento-card bg-[#f8fafc] overflow-hidden group flex flex-col"
                        >
                            <div className="p-8 pb-0 flex-1 relative min-h-[260px] flex items-center justify-center">
                                {/* Mock Calendar */}
                                <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-100 p-5 group-hover:-translate-y-2 transition-all duration-500">
                                    <div className="flex items-center justify-between mb-5">
                                        <h4 className="font-bold text-slate-800">March 2026</h4>
                                        <div className="flex gap-1">
                                            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"><span className="text-slate-500 text-xs">‹</span></div>
                                            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"><span className="text-slate-500 text-xs">›</span></div>
                                        </div>
                                    </div>
                                    {/* Day headers */}
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="text-[10px] font-bold text-slate-400 text-center">{d}</span>)}
                                    </div>
                                    {/* Calendar grid */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {/* Empty cells for alignment */}
                                        {[...Array(6)].map((_, i) => <div key={`e${i}`} className="aspect-square" />)}
                                        {/* Days 1–28 */}
                                        {[...Array(28)].map((_, i) => {
                                            const day = i + 1;
                                            const isDeadline = [3, 8, 15, 22].includes(day);
                                            const isToday = day === 12;
                                            return (
                                                <motion.div key={day} whileHover={{ scale: 1.2 }} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold cursor-pointer transition-colors ${isToday ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:bg-slate-50'}`}>
                                                    {day}
                                                    {isDeadline && <div className={`w-1 h-1 rounded-full mt-0.5 ${isToday ? 'bg-white' : 'bg-red-500'}`} />}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                    {/* Legend */}
                                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[10px] text-slate-500 font-medium">Assignment Due</span></div>
                                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600" /><span className="text-[10px] text-slate-500 font-medium">Today</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-white border-t border-slate-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600"><Calendar size={20} /></div>
                                    <h3 className="text-2xl font-bold text-slate-900">Calendar View</h3>
                                </div>
                                <p className="text-slate-500 font-medium">Visual monthly calendar showing all your assignment deadlines at a glance. Never miss a submission date again.</p>
                            </div>
                        </motion.div>

                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-10 text-center"
                    >
                        <span className="text-slate-500 font-medium">and a lot more features...</span>
                    </motion.div>
                </div>
            </section>

            {/* ─── AI BUDDY SHOWCASE ─── */}
            {!isMobileDevice && (
                <section className="relative py-28 overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#eef2ff] to-[#f8fafc] border-t border-indigo-100/40">
                    {/* Subtle dot pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                    {/* Glowing orb */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full mb-6 border border-indigo-100">
                                <Sparkles size={14} /> AI-Powered
                            </div>
                            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-4">
                                Meet your AI study buddy
                            </h2>
                            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                                A 3D AI companion that lives on your dashboard — talks in both English and Hinglish, tracks your tasks, celebrates your wins, and keeps you motivated.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            {/* Left: Feature Highlights */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="space-y-5"
                            >
                                {/* Feature 1 */}
                                <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                                            <MessageCircle size={22} className="text-indigo-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 mb-1">Friendly Conversations</h4>
                                            <p className="text-sm text-slate-500 font-medium">Talks like your college friend. Natural, supportive, and conversational, not robotic.</p>
                                            <div className="mt-3 inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-100">
                                                "You have 3 assignments pending, let's get them done!"
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Feature 2 */}
                                <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-emerald-100 transition-all duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                                            <BrainCircuit size={22} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 mb-1">Context-Aware</h4>
                                            <p className="text-sm text-slate-500 font-medium">Knows your pending assignments, who assigned them, and when they're due — gives you task-specific nudges.</p>
                                            <div className="mt-3 inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-100">
                                                "Your DBMS Lab Record is due tomorrow, don't forget!"
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Feature 3 */}
                                <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-amber-100 transition-all duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                                            <Heart size={22} className="text-amber-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 mb-1">Mood Reactions</h4>
                                            <p className="text-sm text-slate-500 font-medium">Happy when tasks are done, sad when deadlines are piling up. The 3D character reacts to your progress in real-time.</p>
                                            <div className="mt-3 flex gap-2">
                                                <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-green-100">Happy</span>
                                                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-100">Focused</span>
                                                <span className="bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-100">Worried</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right: 3D Model Preview */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative flex items-center justify-center"
                            >
                                {/* Glow behind the model */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-purple-100/20 to-blue-100/30 rounded-[2rem] blur-xl"></div>

                                {/* 3D Model Container */}
                                <div className="relative w-full bg-white/60 backdrop-blur-sm rounded-[2rem] border border-slate-200/60 shadow-xl overflow-hidden" style={{ minHeight: '480px' }}>
                                    {/* Real Spline 3D Model */}
                                    <div className="w-full min-h-[480px] flex items-center justify-center relative pointer-events-none" style={{ overflow: 'hidden' }}>
                                        <Suspense fallback={
                                            <div style={{ width: '100%', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #f5f3ff 100%)' }}>
                                                <div style={{ width: '32px', height: '32px', border: '3px solid #e0e7ff', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                            </div>
                                        }>
                                            <div style={{ transform: 'scale(1.25) translateX(10px) translateY(15px)', width: '100%', height: '480px' }}>
                                                <Spline
                                                    scene="https://prod.spline.design/35aLT1F6pB6JrjyK/scene.splinecode"
                                                    className="w-full h-full !bg-transparent object-cover"
                                                />
                                            </div>
                                        </Suspense>
                                    </div>

                                    {/* Floating Speech Bubble */}
                                    <motion.div
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute top-8 right-6 max-w-[180px] z-10"
                                    >
                                        <div className="relative bg-white text-indigo-900 text-xs font-semibold p-3 rounded-2xl shadow-lg border border-indigo-100/50">
                                            Hey there! Ready to ace your studies today?
                                            <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white border-b border-l border-indigo-100/50 transform -rotate-45"></div>
                                        </div>
                                    </motion.div>


                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}

            {/* ─── HOW IT WORKS ─── */}
            <section className="py-28 bg-[#f8fafc] relative overflow-hidden border-t border-slate-200/60">
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-block px-4 py-1.5 bg-white text-slate-600 border border-slate-200 shadow-sm text-sm font-medium rounded-full mb-6">
                            How it works
                        </div>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-4">
                            Get started in minutes
                        </h2>
                        <p className="text-lg text-slate-500 font-medium">
                            Three simple steps to supercharge your academic life.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
                        {/* Connecting line (desktop only) */}
                        <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 z-0" />

                        {/* Step 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="relative z-10 text-center group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.08, rotate: 5 }}
                                className="w-32 h-32 mx-auto mb-6 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center cursor-pointer group-hover:shadow-xl group-hover:border-blue-100 transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                    <Mail size={28} className="text-blue-600" />
                                </div>
                            </motion.div>
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-3 border border-blue-100">Step 1</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Create Account</h3>
                            <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">Sign up with your email or Google account in seconds. No credit card needed.</p>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            className="relative z-10 text-center group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.08, rotate: -5 }}
                                className="w-32 h-32 mx-auto mb-6 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center cursor-pointer group-hover:shadow-xl group-hover:border-indigo-100 transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                    <GraduationCap size={28} className="text-indigo-600" />
                                </div>
                            </motion.div>
                            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full mb-3 border border-indigo-100">Step 2</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Setup Profile</h3>
                            <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">Choose your school or college, select your class, branch, and section to get started.</p>
                        </motion.div>

                        {/* Step 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="relative z-10 text-center group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.08, rotate: 5 }}
                                className="w-32 h-32 mx-auto mb-6 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center cursor-pointer group-hover:shadow-xl group-hover:border-purple-100 transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                    <Zap size={28} className="text-purple-600" />
                                </div>
                            </motion.div>
                            <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full mb-3 border border-purple-100">Step 3</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Start Learning</h3>
                            <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">Access your dashboard, upload notes, track assignments, and stay on top of everything.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <footer className="bg-white pt-24 pb-12 relative overflow-hidden border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-[#f8fafc] rounded-[2rem] p-10 md:p-16 relative overflow-hidden border border-slate-100">
                        {/* Dot pattern */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 w-full h-full">
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-1.5 mb-6 text-slate-900">
                                    <img src={`${import.meta.env.BASE_URL}bookmark-25.svg`} alt="Logo" style={{ width: '24px', height: '24px' }} />
                                    <span className="text-lg font-bold">LearnGrid</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-6 leading-tight">
                                    Stay organized and <br />boost your productivity
                                </h2>

                                {/* 3D Floating Elements Container (Desktop only for full effect) */}
                                <div className="relative h-48 mt-4 hidden sm:block pointer-events-none">
                                    <motion.div animate={{ y: [0, -10, 0], rotate: [10, 15, 10] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-0 left-0 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100">
                                        <span className="text-xl font-bold text-slate-700">20</span>
                                    </motion.div>
                                    <motion.div animate={{ y: [0, 10, 0], rotate: [-10, -5, -10] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="absolute bottom-4 left-24 w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100">
                                        <CheckCircle2 size={24} className="text-blue-500" />
                                    </motion.div>
                                    <motion.div animate={{ y: [0, -15, 0], rotate: [5, 0, 5] }} transition={{ duration: 6, repeat: Infinity, delay: 0.5 }} className="absolute top-10 left-48 w-[4.5rem] h-[4.5rem] bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-100">
                                        <Flag size={28} className="text-indigo-500 fill-indigo-100" />
                                    </motion.div>
                                    <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 2 }} className="absolute bottom-8 right-32 w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100">
                                        <Clock size={24} className="text-slate-800" />
                                    </motion.div>
                                    <motion.div animate={{ y: [0, -8, 0], rotate: [-15, -10, -15] }} transition={{ duration: 5.5, repeat: Infinity, delay: 1.5 }} className="absolute top-0 right-10 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100">
                                        <Lightbulb size={28} className="text-amber-500 fill-amber-100" />
                                    </motion.div>
                                </div>
                            </div>

                            <div className="flex flex-row justify-between md:justify-end gap-16 md:gap-24 items-start md:pt-10">
                                <ul className="space-y-4">
                                    <li><Link to="/about" className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 no-underline"><ArrowRight size={12} /> About Us</Link></li>
                                    <li><Link to="/help" className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 no-underline"><ArrowRight size={12} /> Contact</Link></li>
                                    <li><Link to="/help" className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 no-underline"><ArrowRight size={12} /> Help Center</Link></li>
                                </ul>
                                <ul className="space-y-4">
                                    <li><Link to="/features" className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 no-underline"><ArrowRight size={12} /> Features</Link></li>
                                    <li><Link to="/integrations" className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 no-underline"><ArrowRight size={12} /> Integrations</Link></li>
                                    <li><Link to="/register" className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 no-underline"><ArrowRight size={12} /> Get Started</Link></li>
                                </ul>
                            </div>

                            {/* Social Media Icons */}
                            <div className="flex items-center gap-3 mt-8 md:mt-0 md:col-span-2 justify-center md:justify-start">
                                <a href="https://www.linkedin.com/in/prajwalchaple" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all duration-300 no-underline">
                                    <Linkedin size={18} />
                                </a>
                                <a href="https://github.com/PrajwalChaple" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 hover:shadow-md transition-all duration-300 no-underline">
                                    <Github size={18} />
                                </a>
                                <a href="https://www.instagram.com/prajwal__14_" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-pink-600 hover:border-pink-200 hover:shadow-md transition-all duration-300 no-underline">
                                    <Instagram size={18} />
                                </a>
                                <a href="https://mail.google.com/mail/?view=cm&to=prajwalchaple14@gmail.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:shadow-md transition-all duration-300 no-underline">
                                    <Mail size={18} />
                                </a>
                            </div>
                        </div>

                        {/* AI Transparency Disclosure */}
                        <div className="mt-12 pt-8 border-t border-slate-200/50">
                            <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <BrainCircuit size={16} className="text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-700 mb-1">AI Transparency</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">LearnGrid uses <span className="font-semibold text-slate-600">Google Gemini</span> AI to power its AI Study Buddy feature, helping students with study assistance and academic queries.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-200/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
                            <p>© {new Date().getFullYear()} LearnGrid. All rights reserved.</p>
                            <p>Designed & Developed by <span className="font-bold text-slate-500">Prajwal Chaple</span></p>
                            <div className="flex gap-6">
                                <Link to="/privacy-policy" className="hover:text-slate-800 no-underline">Privacy Policy</Link>
                                <Link to="/terms-of-service" className="hover:text-slate-800 no-underline">Terms of Service</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
