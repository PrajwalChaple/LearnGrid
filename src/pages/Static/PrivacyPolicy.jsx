import React from 'react';

export function PrivacyPolicy() {
    return (
        <div>
            <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
                    <p className="text-gray-400 text-sm">Last updated: February 15, 2026</p>
                </div>
            </section>
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-6 prose prose-gray prose-sm">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold mb-3">1. Information We Collect</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">When you create an account, we collect your name, email address, and password. We also collect usage data such as pages visited, features used, and time spent on the platform to improve our services.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">2. How We Use Your Information</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">We use your information to provide and improve LearnGrid's services, personalize your experience, send important updates about your account, and provide customer support. We never sell your personal data to third parties.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">3. Data Security</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">We implement industry-standard security measures including encryption in transit and at rest, secure authentication via Firebase, and regular security audits. Your academic data is private and only accessible to you.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">4. Data Retention</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">We retain your data for as long as your account is active. You can request deletion of all your data at any time by contacting our support team or through the Settings page in your dashboard.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">5. Your Rights</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">You have the right to access, update, export, and delete your personal data. You can manage your data preferences from the Settings page. For any privacy concerns, contact us at privacy@learngrid.app.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">6. Changes to This Policy</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">We may update this Privacy Policy from time to time. We will notify you of any significant changes via email or through a notice on our platform. Continued use of LearnGrid after changes constitutes acceptance.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
