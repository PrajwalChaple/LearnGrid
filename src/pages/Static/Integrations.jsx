import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const integrations = [
    { name: 'Google Calendar', desc: 'Sync your assignment deadlines and class schedule automatically.', color: 'bg-red-50 text-red-600', letter: 'G' },
    { name: 'Google Drive', desc: 'Attach files from Drive directly to your notes and assignments.', color: 'bg-blue-50 text-blue-600', letter: 'D' },
    { name: 'Notion', desc: 'Import your existing Notion pages and databases seamlessly.', color: 'bg-gray-100 text-gray-800', letter: 'N' },
    { name: 'Slack', desc: 'Get assignment reminders and team updates in your Slack channels.', color: 'bg-purple-50 text-purple-600', letter: 'S' },
    { name: 'Zoom', desc: 'Join lectures directly from your LearnGrid calendar events.', color: 'bg-blue-50 text-blue-700', letter: 'Z' },
    { name: 'GitHub', desc: 'Link repos to CS assignments and track coding projects.', color: 'bg-gray-900 text-white', letter: 'G' },
];

export function Integrations() {
    return (
        <div>
            <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        Connects with tools you already use
                    </h1>
                    <p className="text-gray-500 text-lg">LearnGrid integrates with popular apps to fit into your existing workflow.</p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {integrations.map((app, i) => (
                            <div key={i} className="rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-indigo-50 hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
                                <div className={`w-11 h-11 rounded-xl ${app.color} flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                                    {app.letter}
                                </div>
                                <div>
                                    <h3 className="font-bold text-base mb-1">{app.name}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{app.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <p className="text-gray-400 text-sm mb-4">More integrations coming soon.</p>
                        <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-all no-underline text-sm">
                            Get Started <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
