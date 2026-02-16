import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageCircle, BookOpen, ArrowRight } from 'lucide-react';

export function Community() {
    return (
        <div>
            <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        Join the LearnGrid Community
                    </h1>
                    <p className="text-gray-500 text-lg">Connect with students, share study tips, and grow together.</p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {[
                            { icon: Users, title: '10,000+', desc: 'Active members', color: 'text-indigo-600 bg-indigo-50' },
                            { icon: MessageCircle, title: '5,000+', desc: 'Discussions', color: 'text-emerald-600 bg-emerald-50' },
                            { icon: BookOpen, title: '1,200+', desc: 'Shared resources', color: 'text-purple-600 bg-purple-50' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-7 rounded-2xl border border-gray-100">
                                <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-4`}>
                                    <stat.icon size={22} />
                                </div>
                                <p className="text-3xl font-extrabold mb-1">{stat.title}</p>
                                <p className="text-sm text-gray-500">{stat.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 text-center">
                        <h2 className="text-2xl font-extrabold text-white mb-3">Ready to join?</h2>
                        <p className="text-indigo-100 mb-6">Create your free account and become part of a community of ambitious students.</p>
                        <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-full hover:shadow-xl transition-all hover:-translate-y-0.5 no-underline">
                            Get Started <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
