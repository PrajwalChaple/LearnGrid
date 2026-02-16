import React from 'react';

export function CookiePolicy() {
    return (
        <div>
            <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Cookie Policy</h1>
                    <p className="text-gray-400 text-sm">Last updated: February 15, 2026</p>
                </div>
            </section>
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold mb-3">1. What Are Cookies</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">Cookies are small text files stored on your device when you visit a website. They help us provide a better user experience by remembering your preferences and understanding how you use our platform.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">2. How We Use Cookies</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">We use cookies for authentication (keeping you logged in), preferences (remembering your theme and settings), and analytics (understanding which features are most popular so we can improve).</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">3. Types of Cookies We Use</h2>
                            <div className="space-y-3 mt-3">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-bold text-sm mb-1">Essential Cookies</h4>
                                    <p className="text-sm text-gray-500">Required for the platform to function. These handle authentication and security. Cannot be disabled.</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-bold text-sm mb-1">Functional Cookies</h4>
                                    <p className="text-sm text-gray-500">Remember your preferences like theme, language, and layout settings for a personalized experience.</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-bold text-sm mb-1">Analytics Cookies</h4>
                                    <p className="text-sm text-gray-500">Help us understand how users interact with LearnGrid so we can improve features and performance.</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">4. Managing Cookies</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">You can control cookies through your browser settings. Note that disabling essential cookies may prevent you from using some features. Most browsers allow you to view, manage, and delete cookies.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">5. Contact</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">If you have questions about our use of cookies, please contact us at privacy@learngrid.app.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
