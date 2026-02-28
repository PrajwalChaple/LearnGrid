import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { Menu, X, Github, Linkedin, Instagram, Mail } from 'lucide-react';

const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/prajwalchaple' },
    { icon: Github, href: 'https://github.com/PrajwalChaple' },
    { icon: Instagram, href: 'https://www.instagram.com/prajwal__14_' },
    { icon: Mail, href: 'https://mail.google.com/mail/?view=cm&to=prajwalchaple14@gmail.com' },
];

export function StaticLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {/* ─── NAVBAR ─── */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-1.5 font-bold text-lg text-gray-900 no-underline">
                        <img src={`${import.meta.env.BASE_URL}bookmark-25.svg`} alt="Logo" style={{ width: '24px', height: '24px' }} />
                        <span>LearnGrid</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/features" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors no-underline">Features</Link>

                        <Link to="/help" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors no-underline">Help</Link>
                        <Link to="/about" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors no-underline">About</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors no-underline">Log in</Link>
                        <Link to="/register" className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition-all hover:-translate-y-0.5 shadow-md shadow-indigo-200 no-underline">
                            Get Started
                        </Link>
                    </div>

                    <button className="md:hidden text-gray-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-3">
                        <Link to="/features" className="text-gray-600 font-medium py-1 no-underline" onClick={() => setIsMenuOpen(false)}>Features</Link>

                        <Link to="/help" className="text-gray-600 font-medium py-1 no-underline" onClick={() => setIsMenuOpen(false)}>Help</Link>
                        <Link to="/about" className="text-gray-600 font-medium py-1 no-underline" onClick={() => setIsMenuOpen(false)}>About</Link>
                        <hr className="border-gray-100" />
                        <Link to="/login" className="text-gray-600 font-medium py-1 no-underline" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                        <Link to="/register" className="px-5 py-2.5 bg-indigo-600 text-white text-center rounded-full font-semibold no-underline" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                    </div>
                )}
            </nav>

            {/* ─── PAGE CONTENT ─── */}
            <main className="flex-1">
                <PageTransition><Outlet /></PageTransition>
            </main>

            {/* ─── FOOTER ─── */}
            <footer className="bg-gray-900 text-gray-400 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-1.5 text-white font-bold text-lg mb-3">
                                <img src={`${import.meta.env.BASE_URL}bookmark-25.svg`} alt="Logo" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
                                <span>LearnGrid</span>
                            </div>
                            <p className="text-sm leading-relaxed mb-5">Empowering students with tools for success. Built for the modern learner.</p>
                            <div className="flex items-center gap-2.5">
                                {socialLinks.map((s, i) => (
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
            </footer>
        </div>
    );
}
