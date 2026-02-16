import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        desc: 'Perfect for getting started with LearnGrid.',
        features: ['Up to 3 courses', 'Basic notes', 'Assignment tracking', 'Calendar view', 'Community support'],
        cta: 'Start Free',
        highlight: false,
    },
    {
        name: 'Pro',
        price: '$9',
        period: '/month',
        desc: 'For students who want the full experience.',
        features: ['Unlimited courses', 'Advanced analytics', 'Priority support', 'Cloud sync', 'Custom themes', 'Export to PDF'],
        cta: 'Upgrade to Pro',
        highlight: true,
    },
    {
        name: 'Team',
        price: '$19',
        period: '/month',
        desc: 'For study groups and student organizations.',
        features: ['Everything in Pro', 'Team dashboards', 'Shared notes', 'Group calendar', 'Admin controls', 'API access'],
        cta: 'Contact Sales',
        highlight: false,
    },
];

export function Pricing() {
    return (
        <div>
            <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-gray-500 text-lg">No hidden fees. Start free, upgrade when you're ready.</p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan, i) => (
                            <div key={i} className={`rounded-2xl p-7 border ${plan.highlight ? 'border-indigo-200 bg-indigo-50/30 shadow-xl shadow-indigo-100 ring-2 ring-indigo-500 relative' : 'border-gray-100 bg-white'} flex flex-col`}>
                                {plan.highlight && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">Most Popular</div>
                                )}
                                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-4xl font-extrabold">{plan.price}</span>
                                    <span className="text-gray-400 text-sm">{plan.period}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-6">{plan.desc}</p>
                                <div className="flex flex-col gap-3 mb-8 flex-1">
                                    {plan.features.map((f, j) => (
                                        <div key={j} className="flex items-center gap-2.5 text-sm text-gray-600">
                                            <Check size={16} className="text-emerald-500 flex-shrink-0" />
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <Link to="/register" className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all no-underline ${plan.highlight ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
