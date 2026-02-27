import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Mail, ArrowRight, GraduationCap, Code2, Lightbulb, Heart } from 'lucide-react';

const socials = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/prajwalchaple', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/PrajwalChaple', label: 'GitHub' },
    { icon: Instagram, href: 'https://instagram.com/prajwal__14_', label: 'Instagram' },
    { icon: Mail, href: 'https://mail.google.com/mail/?view=cm&to=prajwalchaple14@gmail.com', label: 'Email' },
];

export function About() {
    return (
        <div className="bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 min-h-screen">
            {/* ─── HERO ─── */}
            <section className="relative pt-24 pb-16 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat border-b border-slate-200/50">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-4">
                        About <span className="text-blue-600">LearnGrid</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium">
                        A smarter way for students to manage their academic life — built with passion, designed with purpose.
                    </p>
                    <p className="text-sm text-slate-400 mt-2 font-medium">Version 1.0.0</p>
                </div>
            </section>

            {/* ─── MISSION ─── */}
            <section className="py-20 bg-white relative z-20">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                        {[
                            { icon: GraduationCap, title: 'Our Mission', desc: 'To give every student access to intuitive tools that simplify learning, boost productivity, and help them achieve academic excellence.', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                            { icon: Lightbulb, title: 'Our Vision', desc: 'A world where technology empowers students to focus on what truly matters — learning, growing, and building their future.', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                            { icon: Heart, title: 'Our Values', desc: 'Simplicity, accessibility, and student-first design. We believe great tools should be beautiful, fast, and free for everyone.', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
                        ].map((item, i) => (
                            <div key={i} className="bg-[#f8fafc] p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} border ${item.border} flex items-center justify-center mb-6`}>
                                    <item.icon size={24} strokeWidth={2.5} />
                                </div>
                                <h3 className="font-bold text-xl text-slate-800 mb-3">{item.title}</h3>
                                <p className="text-base text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* ─── FOUNDER ─── */}
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold tracking-tight text-center text-slate-900 mb-12">Meet the Founder</h2>
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden group">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-10 md:p-12 relative overflow-hidden">
                                {/* Decorative background element */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -z-10 group-hover:bg-blue-50 transition-colors duration-500"></div>

                                {/* Profile image */}
                                <div className="flex-shrink-0 relative">
                                    <div className="w-36 h-36 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden border-2 border-slate-100 group-hover:border-blue-100 transition-colors">
                                        <img src="profilepicture.png" alt="Prajwal Chaple" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-blue-500 border border-slate-100">
                                        <Code2 size={20} strokeWidth={2.5} />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-center md:text-left z-10">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-1">Prajwal Chaple</h3>
                                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-5">Founder & Developer</p>
                                    <p className="text-base font-medium text-slate-600 leading-relaxed mb-4">
                                        I’m a student and self-taught developer focused on building practical, user-centric software. While navigating various academic tools, I realized many platforms were unnecessarily complex and distracting. That experience led me to build LearnGrid — a streamlined workspace designed to help students stay organized and focused.
                                    </p>
                                    <p className="text-base font-medium text-slate-600 leading-relaxed mb-4">
                                        I’m particularly interested in modern web technologies, product design, and creating systems that are simple yet scalable. I believe good software should feel intuitive, efficient, and purposeful.
                                    </p>
                                    <p className="text-base font-medium text-slate-600 leading-relaxed mb-8">
                                        Beyond development, I’m constantly learning, refining my skills, and working on projects that solve real-world problems. My aim is to build tools that genuinely improve how students manage their academic life.
                                    </p>

                                    {/* Social icons */}
                                    <div className="flex items-center gap-4 justify-center md:justify-start">
                                        {socials.map((s, i) => (
                                            <a
                                                key={i}
                                                href={s.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={s.label}
                                                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 hover:shadow-inner transition-all duration-200 no-underline"
                                            >
                                                <s.icon size={18} strokeWidth={2} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-24 bg-[#f8fafc] text-center border-t border-slate-200/50">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-medium text-slate-900 mb-6">Join the LearnGrid community</h2>
                    <p className="text-slate-500 font-medium text-lg mb-10">Start organizing your academic life today — it's free.</p>
                    <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-1 no-underline">
                        Get Started Free <ArrowRight size={18} strokeWidth={2.5} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
