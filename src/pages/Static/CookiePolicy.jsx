import React from 'react';
import { Link } from 'react-router-dom';

export function CookiePolicy() {
    return (
        <div className="bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 min-h-screen">
            <section className="relative pt-24 pb-16 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat border-b border-slate-200/50">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-4">Cookie Policy</h1>
                    <p className="text-slate-500 text-lg">Last updated: February 28, 2026</p>
                </div>
            </section>
            <section className="py-16 bg-white relative z-20">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="space-y-10">

                        {/* Introduction */}
                        <div>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">This Cookie Policy explains how LearnGrid ("we," "our," or "us") uses cookies and similar technologies when you visit <a href="https://www.learngrid.online" className="text-blue-600 hover:underline">www.learngrid.online</a>. By using our platform, you consent to the use of cookies as described below. You can manage your cookie preferences at any time.</p>
                        </div>

                        {/* 1. What Are Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">1. What Are Cookies</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">Cookies are small text files stored on your device (computer, tablet, or smartphone) when you visit a website. They help us provide a better user experience by remembering your preferences, keeping you logged in, and understanding how you interact with our platform. Similar technologies include local storage (localStorage) and session storage, which function similarly to cookies.</p>
                        </div>

                        {/* 2. Types of Cookies We Use */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">2. Types of Cookies We Use</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-4">We use the following categories of cookies and local storage:</p>
                            <div className="space-y-3">
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">Required</span>
                                        <h4 className="font-bold text-slate-800">Essential Cookies</h4>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">These are strictly necessary for the platform to function. They handle authentication, security, and session management. Without these, you cannot log in or use LearnGrid. These cookies cannot be disabled.</p>
                                </div>
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">Functional</span>
                                        <h4 className="font-bold text-slate-800">Functional Cookies</h4>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">These remember your preferences such as theme (light/dark mode), layout settings, and cookie consent choices. They improve your experience but are not strictly required to use the platform.</p>
                                </div>
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">Integration</span>
                                        <h4 className="font-bold text-slate-800">Integration Cookies</h4>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">These store Google OAuth access tokens for the optional Google Calendar sync feature. These tokens are stored locally on your device and are used to create calendar events for assignment deadlines.</p>
                                </div>
                            </div>
                        </div>

                        {/* 3. Specific Cookies Used */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">3. Specific Data We Store</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-4">Below is a detailed breakdown of the cookies and localStorage items used by LearnGrid:</p>
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 font-bold text-slate-700">Name</th>
                                            <th className="px-4 py-3 font-bold text-slate-700">Type</th>
                                            <th className="px-4 py-3 font-bold text-slate-700">Purpose</th>
                                            <th className="px-4 py-3 font-bold text-slate-700">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="px-4 py-3 font-medium text-slate-700">Firebase Auth Token</td>
                                            <td className="px-4 py-3 text-slate-500">Essential</td>
                                            <td className="px-4 py-3 text-slate-500">Keeps you logged in securely</td>
                                            <td className="px-4 py-3 text-slate-500">Session</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium text-slate-700">cookieConsent</td>
                                            <td className="px-4 py-3 text-slate-500">Functional</td>
                                            <td className="px-4 py-3 text-slate-500">Stores your cookie consent choice</td>
                                            <td className="px-4 py-3 text-slate-500">Permanent</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium text-slate-700">theme</td>
                                            <td className="px-4 py-3 text-slate-500">Functional</td>
                                            <td className="px-4 py-3 text-slate-500">Remembers dark/light mode preference</td>
                                            <td className="px-4 py-3 text-slate-500">Permanent</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium text-slate-700">gcal_access_token</td>
                                            <td className="px-4 py-3 text-slate-500">Integration</td>
                                            <td className="px-4 py-3 text-slate-500">Google Calendar sync access</td>
                                            <td className="px-4 py-3 text-slate-500">Until revoked</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 4. Third-Party Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">4. Third-Party Cookies</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">Some third-party services we use may set their own cookies:</p>
                            <ul className="list-disc list-inside space-y-2 text-base text-slate-600 font-medium">
                                <li><strong>Firebase Authentication:</strong> May set cookies for secure session management and login verification</li>
                                <li><strong>Google OAuth:</strong> Sets cookies during the Google Sign-In process</li>
                            </ul>
                            <p className="text-sm text-slate-500 mt-3 font-medium">We do not use any third-party advertising, tracking, or analytics cookies. We do not partner with any ad networks or data brokers.</p>
                        </div>

                        {/* 5. Your Consent */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">5. Your Consent</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">When you first visit LearnGrid, you will see a cookie consent banner giving you the option to accept all cookies or only essential ones. Your choice is saved and respected throughout your usage. You can change your preference at any time by clearing your browser's cookies and localStorage for our site, which will reset your consent and show the banner again.</p>
                        </div>

                        {/* 6. Managing Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">6. Managing Cookies</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">You can control cookies through several methods:</p>
                            <ul className="list-disc list-inside space-y-2 text-base text-slate-600 font-medium">
                                <li><strong>Cookie consent banner:</strong> Choose "Only Essential" to limit cookies to those required for the platform to function</li>
                                <li><strong>Browser settings:</strong> Most browsers allow you to view, manage, and delete cookies. Refer to your browser's help documentation for instructions</li>
                                <li><strong>Clear site data:</strong> Use your browser's developer tools or settings to clear all data stored by learngrid.online</li>
                            </ul>
                            <p className="text-sm text-slate-500 mt-3 font-medium">Note: Disabling essential cookies will prevent you from logging in and using LearnGrid. Disabling functional cookies may result in a less personalized experience.</p>
                        </div>

                        {/* 7. Changes */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">7. Changes to This Policy</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">We may update this Cookie Policy from time to time. Changes will be reflected by updating the "Last updated" date at the top of this page. We encourage you to review this policy periodically. If we make significant changes that affect how we use cookies, we will notify you through the platform.</p>
                        </div>

                        {/* 8. Contact */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">8. Contact Us</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">If you have questions about our use of cookies, please contact us:</p>
                            <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 shadow-sm">
                                <p className="text-sm text-slate-600 font-medium"><strong>Email:</strong> learngrid.official@gmail.com</p>
                                <p className="text-sm text-slate-600 font-medium mt-1"><strong>Website:</strong> <a href="https://www.learngrid.online" className="text-blue-600 hover:underline">www.learngrid.online</a></p>
                                <p className="text-sm text-slate-600 font-medium mt-1"><strong>Developer:</strong> Prajwal Chaple</p>
                            </div>
                        </div>

                        {/* Related Policies */}
                        <div className="border-t border-slate-200 pt-8">
                            <p className="text-sm text-slate-500 font-medium">Related policies: <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> · <Link to="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</Link></p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
