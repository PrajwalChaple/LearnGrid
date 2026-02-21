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
        <div>
            {/* ─── HERO ─── */}
            <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        About <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">LearnGrid</span>
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        A smarter way for students to manage their academic life — built with passion, designed with purpose.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Version 1.0.0</p>
                </div>
            </section>

            {/* ─── MISSION ─── */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {[
                            { icon: GraduationCap, title: 'Our Mission', desc: 'To give every student access to intuitive tools that simplify learning, boost productivity, and help them achieve academic excellence.' },
                            { icon: Lightbulb, title: 'Our Vision', desc: 'A world where technology empowers students to focus on what truly matters — learning, growing, and building their future.' },
                            { icon: Heart, title: 'Our Values', desc: 'Simplicity, accessibility, and student-first design. We believe great tools should be beautiful, fast, and free for everyone.' },
                        ].map((item, i) => (
                            <div key={i} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300">
                                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                                    <item.icon size={22} />
                                </div>
                                <h3 className="font-bold text-base mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* ─── FOUNDER ─── */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-extrabold tracking-tight text-center mb-10">Meet the Founder</h2>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-indigo-50/50 overflow-hidden">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 md:p-10">
                                {/* Profile image */}
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                                        <span className="text-white text-4xl font-extrabold">PC</span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl font-extrabold mb-1">Prajwal Chaple</h3>
                                    <p className="text-sm font-medium text-indigo-600 mb-4">Founder & Developer</p>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-2">
                                        Passionate developer and student focused on building smart, accessible tools that make academic life easier. LearnGrid was born from a belief that every student deserves a clean, powerful dashboard to organize their studies.
                                    </p>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                        When not coding, you'll find him exploring new technologies, contributing to open source, and mentoring fellow students in tech.
                                    </p>

                                    {/* Social icons */}
                                    <div className="flex items-center gap-3 justify-center md:justify-start">
                                        {socials.map((s, i) => (
                                            <a
                                                key={i}
                                                href={s.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={s.label}
                                                className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 no-underline"
                                            >
                                                <s.icon size={16} />
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
            <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-extrabold text-white mb-4">Join the LearnGrid community</h2>
                    <p className="text-indigo-100 mb-8">Start organizing your academic life today — it's free.</p>
                    <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-full hover:shadow-xl transition-all hover:-translate-y-0.5 no-underline">
                        Get Started Free <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
