import React from 'react';
import { Clock } from 'lucide-react';

const posts = [
    { title: '5 Study Techniques Backed by Science', excerpt: 'Discover proven methods like spaced repetition and active recall that can dramatically improve your retention and exam scores.', date: 'Feb 10, 2026', tag: 'Study Tips', tagColor: 'bg-emerald-50 text-emerald-600' },
    { title: 'How to Build a Consistent Study Routine', excerpt: 'Consistency beats intensity. Learn how to design a daily routine that sticks — even during the busiest weeks of the semester.', date: 'Feb 5, 2026', tag: 'Productivity', tagColor: 'bg-indigo-50 text-indigo-600' },
    { title: 'Why Every Student Needs a Dashboard', excerpt: 'From tracking assignments to visualizing grades, a personal dashboard is the secret weapon of top-performing students.', date: 'Jan 28, 2026', tag: 'LearnGrid', tagColor: 'bg-purple-50 text-purple-600' },
    { title: 'Managing Exam Stress: A Practical Guide', excerpt: 'Feeling overwhelmed? Here are actionable strategies to manage anxiety and perform at your best when it matters most.', date: 'Jan 20, 2026', tag: 'Wellness', tagColor: 'bg-pink-50 text-pink-600' },
    { title: 'The Power of Note-Taking: Digital vs Paper', excerpt: 'We compare the benefits and trade-offs of digital and handwritten notes based on the latest cognitive science research.', date: 'Jan 15, 2026', tag: 'Study Tips', tagColor: 'bg-emerald-50 text-emerald-600' },
    { title: 'LearnGrid v2.0: What\'s New', excerpt: 'A deep dive into the latest features including the redesigned dashboard, Firebase authentication, and new integrations.', date: 'Jan 10, 2026', tag: 'Updates', tagColor: 'bg-amber-50 text-amber-600' },
];

export function Blog() {
    return (
        <div>
            <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Blog</h1>
                    <p className="text-gray-500 text-lg">Tips, insights, and updates to help you learn smarter.</p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, i) => (
                            <article key={i} className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-indigo-50 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                <div className="h-36 bg-gradient-to-br from-indigo-100 to-purple-50 flex items-center justify-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${post.tagColor}`}>{post.tag}</span>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-base mb-2 leading-snug">{post.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">{post.excerpt}</p>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <Clock size={12} />
                                        {post.date}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
