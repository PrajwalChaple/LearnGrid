import React, { useState, useEffect } from 'react';
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
    BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
                    <Link to="/" className="flex items-center gap-3 no-underline group">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                            <GraduationCap size={22} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            LearnGrid
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-10">
                        <Link to="/features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors no-underline">Features</Link>
                        <Link to="/blog" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors no-underline">Blog</Link>
                        <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors no-underline">About Us</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors no-underline px-4 py-2">Sign in</Link>
                        <Link to="/register" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm font-semibold rounded-full shadow-sm hover:shadow-md hover:border-slate-300 transition-all no-underline">
                            Get Started
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
                        <Link to="/blog" className="text-slate-600 font-medium py-2 text-lg no-underline" onClick={toggleMenu}>Blog</Link>
                        <Link to="/about" className="text-slate-600 font-medium py-2 text-lg no-underline" onClick={toggleMenu}>About Us</Link>
                        <hr className="border-slate-100 my-2" />
                        <Link to="/login" className="text-slate-600 font-medium py-2 text-lg no-underline" onClick={toggleMenu}>Sign in</Link>
                        <Link to="/register" className="px-6 py-3 bg-blue-600 text-white text-center rounded-xl font-semibold text-lg no-underline" onClick={toggleMenu}>Get Started</Link>
                    </div>
                )}
            </nav>

            {/* ─── HERO SECTION ─── */}
            <section className="relative pt-40 pb-32 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">
                {/* Dotted Background overlay for texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                <div className="max-w-6xl mx-auto px-6 text-center relative z-10">

                    {/* Floating Center Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-wrap p-3 gap-1 mb-8"
                    >
                        <div className="w-[18px] h-[18px] bg-blue-500 rounded-full"></div>
                        <div className="w-[18px] h-[18px] bg-slate-800 rounded-full"></div>
                        <div className="w-[18px] h-[18px] bg-slate-800 rounded-full"></div>
                        <div className="w-[18px] h-[18px] bg-slate-800 rounded-full"></div>
                    </motion.div>

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
                        className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 font-medium"
                    >
                        Efficiently manage your assignments, notes, and boost your college productivity.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Link to="/register" className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-1 no-underline">
                            Get free demo
                        </Link>
                    </motion.div>

                    {/* Floating Hero UI Elements (Mockups) */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden max-w-7xl mx-auto -z-10">

                        {/* Left Float: Sticky Note */}
                        <motion.div
                            animate={{ y: [0, -15, 0], rotate: [-6, -4, -6] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-20 left-4 md:left-10 lg:left-0 hidden sm:block shadow-2xl"
                        >
                            <div className="w-56 bg-yellow-100 p-5 shadow-sm text-left rotate-[-5deg] relative">
                                <div className="absolute top-[-5px] left-1/2 w-3 h-3 bg-red-500 rounded-full shadow-sm -translate-x-1/2"></div>
                                <p className="font-['Caveat',cursive] text-slate-800 text-xl leading-snug">
                                    Upload assignment PDFs to keep track of crucial details, and accomplish more tasks with ease.
                                </p>
                            </div>
                            {/* Blue Check float over sticky note */}
                            <div className="absolute -bottom-8 -right-6 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center rotate-12">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <CheckCircle2 size={24} className="text-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Float: Reminders */}
                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 right-4 md:right-10 lg:-right-4 hidden lg:block"
                        >
                            <div className="w-64 bg-slate-50 rounded-2xl p-4 shadow-xl border border-slate-200/60 rotate-3 text-left">
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
                            <div className="absolute -left-10 top-10 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center -rotate-6">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-200">
                                    <Timer size={20} className="text-slate-800" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Bottom Left: Progress Card */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-10 left-[10%] hidden md:block"
                        >
                            <div className="w-64 bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 text-left -rotate-6">
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

                    </div>
                </div>
            </section>

            {/* ─── FEATURES: BENTO GRID ─── */}
            <section id="features" className="py-24 bg-white relative z-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-full mb-6 border border-slate-200">
                            Features
                        </div>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-4">
                            Keep everything in one place
                        </h2>
                        <p className="text-lg text-slate-500 pb-4">
                            Forget complex learning management systems.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Card 1: Study Collaboration */}
                        <div className="bento-card bg-[#f8fafc] overflow-hidden group flex flex-col">
                            <div className="p-8 pb-0 flex-1 relative min-h-[220px]">
                                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                                    alt="Collaboration"
                                    className="absolute right-0 bottom-0 w-[85%] h-full object-cover rounded-tl-2xl shadow-xl shadow-slate-300 opacity-90 group-hover:scale-105 transition-transform duration-700" />

                                {/* Overlay UI mock */}
                                <div className="absolute top-10 left-10 w-64 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">My Workspace</p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3"><div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-purple-600"><Users size={12} /></div><span className="text-sm font-bold text-slate-700">Study Group A</span></div>
                                        <div className="flex items-center gap-3"><div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center text-orange-600"><FileText size={12} /></div><span className="text-sm font-bold text-slate-700">Project Beta</span></div>
                                        <div className="flex items-center gap-3 opacity-60"><div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600"><Database size={12} /></div><span className="text-sm font-bold text-slate-700">DBMS Review</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-white border-t border-slate-100">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Seamless Sharing</h3>
                                <p className="text-slate-500 font-medium">Work together with your classmates effortlessly, share notes, and update assignments in real-time.</p>
                            </div>
                        </div>

                        {/* Card 2: Time Management */}
                        <div className="bento-card bg-[#f8fafc] overflow-hidden group flex flex-col">
                            <div className="p-8 pb-0 flex-1 relative min-h-[220px] flex items-center justify-center">
                                {/* Mock UI */}
                                <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-slate-100 p-5 group-hover:-translate-y-2 transition-transform duration-500">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-bold text-slate-800">Weekly schedule</h4>
                                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-semibold">This Week</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex gap-4">
                                            <div className="text-center w-10"><span className="text-xs font-bold text-slate-400 uppercase">Mon</span><br /><span className="font-bold text-slate-800">15</span></div>
                                            <div className="flex-1 bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 flex items-center justify-between">
                                                <div className="flex flex-col"><span className="text-xs font-bold text-indigo-900">OS Lecture</span><span className="text-[10px] text-indigo-500 flex items-center gap-1"><Clock size={10} /> 10:00 - 11:30</span></div>
                                                <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center"><BookOpen size={12} className="text-indigo-600" /></div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="text-center w-10"><span className="text-xs font-bold text-slate-400 uppercase">Tue</span><br /><span className="font-bold text-slate-800">16</span></div>
                                            <div className="flex-1 bg-red-50 border border-red-100 rounded-lg p-2.5 flex items-center justify-between">
                                                <div className="flex flex-col"><span className="text-xs font-bold text-red-900">Assignment Due</span><span className="text-[10px] text-red-500 flex items-center gap-1"><Clock size={10} /> 23:59</span></div>
                                                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center"><Upload size={12} className="text-red-600" /></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-white border-t border-slate-100">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Time Management Tools</h3>
                                <p className="text-slate-500 font-medium">Optimize your study time with integrated schedule views, calendar sync, and smart reminders.</p>
                            </div>
                        </div>

                        {/* Card 3: Advanced Task Tracking */}
                        <div className="bento-card bg-[#f8fafc] overflow-hidden group flex flex-col">
                            <div className="p-8 bg-white border-b border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-6">
                                    <ArrowRight size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Advanced task tracking</h3>
                                <p className="text-slate-500 font-medium">A bird's eye view of your entire semester productivity and pending assignments.</p>
                            </div>
                            <div className="p-8 flex-1 relative min-h-[220px] flex items-center justify-center overflow-hidden">
                                {/* Mock Timeline */}
                                <div className="absolute right-[-20%] w-[120%] bg-white rounded-xl shadow-xl border border-slate-100 p-5 rotate-3 group-hover:rotate-0 transition-all duration-500">
                                    <div className="flex justify-between mb-4 border-b border-slate-100 pb-3">
                                        <span className="font-bold text-slate-800">Semester Timeline</span>
                                        <span className="font-semibold text-slate-500 text-sm">Oct 2024</span>
                                    </div>
                                    <div className="relative pt-6 pb-2">
                                        <div className="absolute top-0 left-0 w-full flex justify-between text-[10px] font-bold text-slate-400">
                                            <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
                                        </div>
                                        {/* Bars */}
                                        <div className="w-[60%] h-8 bg-orange-100 rounded-lg border border-orange-200 mb-3 flex items-center px-3 relative left-[10%] shadow-sm">
                                            <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center border border-orange-100 -ml-1 mr-2"><span className="text-[10px] font-bold">PDF</span></div>
                                            <span className="text-xs font-bold text-orange-800">React Project Phase 1</span>
                                            <span className="ml-auto text-xs font-bold text-orange-500">68%</span>
                                        </div>
                                        <div className="w-[40%] h-8 bg-blue-100 rounded-lg border border-blue-200 mb-2 flex items-center px-3 relative left-[45%] shadow-sm">
                                            <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center border border-blue-100 -ml-1 mr-2"><span className="text-[10px] font-bold">Doc</span></div>
                                            <span className="text-xs font-bold text-blue-800">Network Topology Report</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 4: Customizable Workspaces */}
                        <div className="bento-card bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] bg-slate-50 overflow-hidden group flex flex-col relative border-dashed border-2 border-slate-300">
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10"></div>

                            <div className="relative z-0 h-full min-h-[300px] flex items-center justify-center p-8">
                                {/* Scattered Widgets */}
                                <div className="absolute top-8 left-8 w-24 h-24 bg-white rounded-2xl shadow-lg border border-slate-100 rotate-[-10deg] group-hover:rotate-[0deg] transition-all p-3">
                                    <div className="w-full h-2 bg-slate-100 rounded-full mb-3"></div>
                                    <div className="w-3/4 h-2 bg-slate-100 rounded-full mb-3"></div>
                                    <div className="w-1/2 h-2 bg-slate-100 rounded-full"></div>
                                </div>

                                <div className="absolute bottom-10 left-16 w-32 bg-white rounded-2xl shadow-xl border border-slate-100 rotate-[5deg] group-hover:rotate-[0deg] transition-all overflow-hidden z-20">
                                    <div className="bg-yellow-100 p-2"><span className="text-[10px] font-bold uppercase tracking-wider text-yellow-800">Timer</span></div>
                                    <div className="p-4 text-center">
                                        <span className="text-3xl font-bold tracking-tighter text-slate-800">04:21</span>
                                        <div className="mt-2 flex justify-center gap-2">
                                            <div className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center"><div className="w-2 h-2 bg-slate-800 rounded-sm"></div></div>
                                            <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center"><div className="w-2 h-2 bg-red-500 rounded-full"></div></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-16 right-8 w-24 bg-white rounded-2xl shadow-md border border-slate-100 rotate-[15deg] group-hover:rotate-[0deg] transition-all p-3 z-10">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="w-full aspect-square bg-slate-100 rounded-lg"></div>
                                        <div className="w-full aspect-square bg-slate-100 rounded-lg"></div>
                                        <div className="w-full aspect-square bg-blue-100 rounded-lg flex items-center justify-center"><ListTodo size={14} className="text-blue-600" /></div>
                                        <div className="w-full aspect-square bg-slate-100 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-20 p-8 pb-10 text-center">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Customizable Workspaces</h3>
                                <p className="text-slate-500 font-medium max-w-sm mx-auto">Build your perfect dashboard with widgets, themes, and personal task views.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 text-center">
                        <span className="text-slate-500 font-medium">and a lot more features...</span>
                    </div>
                </div>
            </section>

            {/* ─── INTEGRATIONS ─── */}
            <section className="py-24 bg-[#f8fafc] relative overflow-hidden border-t border-slate-200/60">
                <div className="absolute w-[100vw] h-[1px] bg-slate-200 top-1/2 left-0 -translate-y-1/2 z-0 hidden md:block"></div>
                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-block px-4 py-1.5 bg-white text-slate-600 border border-slate-200 shadow-sm text-sm font-medium rounded-full mb-6">
                        Integrations
                    </div>
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-16">
                        Connect integrations<br />you use every day
                    </h2>

                    <div className="relative">
                        {/* Center Hub */}
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-blue-500/10 border border-slate-100 flex flex-wrap p-3 gap-1 mx-auto relative z-20 mb-12">
                            <div className="w-[18px] h-[18px] bg-blue-500 rounded-full"></div>
                            <div className="w-[18px] h-[18px] bg-slate-800 rounded-full"></div>
                            <div className="w-[18px] h-[18px] bg-slate-800 rounded-full"></div>
                            <div className="w-[18px] h-[18px] bg-slate-800 rounded-full"></div>
                        </div>

                        {/* Web lines */}
                        <div className="absolute top-8 left-1/2 w-full h-[1px] bg-slate-200 -z-10 -translate-y-1/2"></div>
                        <div className="absolute top-8 left-1/2 w-[1px] h-full bg-slate-200 -z-10 -translate-x-1/2"></div>

                        {/* Integration Icons Grid */}
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-3xl mx-auto">
                            {integrations.map((app, i) => (
                                <div key={i} className="relative group">
                                    <motion.div
                                        whileHover={{ scale: 1.1, y: -5 }}
                                        className={`w-16 h-16 sm:w-20 sm:h-20 ${app.bg} rounded-2xl shadow-sm border border-slate-200/50 flex items-center justify-center hover:shadow-xl transition-all duration-300 cursor-pointer bg-white`}
                                    >
                                        <app.icon size={28} className={app.color} strokeWidth={2} />
                                    </motion.div>
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 scale-0 transition-transform duration-200 group-hover:scale-100 bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap z-50">
                                        {app.name}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER CTA & LINKS ─── */}
            <footer className="bg-white pt-24 pb-12 relative overflow-hidden border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-[#f8fafc] rounded-[2rem] p-10 md:p-16 relative overflow-hidden border border-slate-100">
                        {/* Dot pattern */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 w-full h-full">
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-6 text-slate-900">
                                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                                        <GraduationCap size={16} strokeWidth={2.5} />
                                    </div>
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
                                    <li><Link to="/blog" className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 no-underline"><ArrowRight size={12} /> Blog</Link></li>
                                </ul>
                                <ul className="space-y-4">
                                    <li><Link to="/features" className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 no-underline"><ArrowRight size={12} /> Features</Link></li>
                                    <li><Link to="/integrations" className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 no-underline"><ArrowRight size={12} /> Integrations</Link></li>
                                    <li><Link to="/register" className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 no-underline"><ArrowRight size={12} /> Get Started</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-16 pt-8 border-t border-slate-200/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
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
