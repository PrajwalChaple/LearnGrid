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
                <div className="max-w-3xl mx-auto px-6">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold mb-3">1. Information We Collect</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">When you create an account, we collect your name, email address, and institution details. We also collect usage data such as features accessed, assignments created, and notes uploaded to improve your experience.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">2. How We Use Your Information</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">Your information is used to provide and personalize the LearnGrid platform, sync your data across devices via Firebase, send notifications about assignments and announcements, and improve our services through aggregated analytics.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">3. Data Storage & Security</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">Your data is stored securely on Google Firebase infrastructure. We use industry-standard encryption for data in transit and at rest. Authentication is handled through Firebase Auth with support for Google Sign-In and email/password with email verification.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">4. Third-Party Services</h2>
                            <div className="space-y-3 mt-3">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-bold text-sm mb-1">Google Firebase</h4>
                                    <p className="text-sm text-gray-500">Used for authentication, database (Firestore), and hosting. Subject to Google's privacy policy.</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-bold text-sm mb-1">Cloudinary</h4>
                                    <p className="text-sm text-gray-500">Used for PDF file storage and delivery. Files are stored in your personal folder.</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-bold text-sm mb-1">Google Calendar API</h4>
                                    <p className="text-sm text-gray-500">Optional integration to sync assignments. Access is granted via OAuth and can be revoked any time.</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-bold text-sm mb-1">EmailJS</h4>
                                    <p className="text-sm text-gray-500">Used to send notification emails. Only recipient emails and notification content are shared.</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">5. Your Rights</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">You can access, update, or delete your personal data at any time from your Settings page. You may also request a complete data export. To delete your account and all associated data, contact us at privacy@learngrid.app.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">6. Data Sharing</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">We do not sell your personal data. Notes, assignments, and announcements you create are shared only with users in your configured scope (class, branch, or college). We may share aggregated, non-identifiable data for analytics purposes.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">7. Changes to This Policy</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">We may update this privacy policy from time to time. We will notify you of any significant changes through the platform or via email. Continued use of LearnGrid after changes constitutes acceptance of the updated policy.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">8. Contact</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">If you have questions about this privacy policy or your data, please contact us at privacy@learngrid.app.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
