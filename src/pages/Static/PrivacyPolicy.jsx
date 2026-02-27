import React from 'react';

export function PrivacyPolicy() {
    return (
        <div className="bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 min-h-screen">
            <section className="relative pt-24 pb-16 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat border-b border-slate-200/50">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-4">Privacy Policy</h1>
                    <p className="text-slate-500 text-lg">Last updated: February 15, 2026</p>
                </div>
            </section>
            <section className="py-16 bg-white relative z-20">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">1. Information We Collect</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">When you create an account, we collect your name, email address, and institution details. We also collect usage data such as features accessed, assignments created, and notes uploaded to improve your experience.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">2. How We Use Your Information</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">Your information is used to provide and personalize the LearnGrid platform, sync your data across devices via Firebase, send notifications about assignments and announcements, and improve our services through aggregated analytics.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">3. Data Storage & Security</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">Your data is stored securely on Google Firebase infrastructure. We use industry-standard encryption for data in transit and at rest. Authentication is handled through Firebase Auth with support for Google Sign-In and email/password with email verification.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">4. Third-Party Services</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-2">Google Firebase</h4>
                                    <p className="text-sm text-slate-500 font-medium">Used for authentication, database (Firestore), and hosting. Subject to Google's privacy policy.</p>
                                </div>
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-2">Cloudinary</h4>
                                    <p className="text-sm text-slate-500 font-medium">Used for PDF file storage and delivery. Files are stored in your personal folder.</p>
                                </div>
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-2">Google Calendar API</h4>
                                    <p className="text-sm text-slate-500 font-medium">Optional integration to sync assignments. Access is granted via OAuth and can be revoked any time.</p>
                                </div>
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-2">EmailJS</h4>
                                    <p className="text-sm text-slate-500 font-medium">Used to send notification emails. Only recipient emails and notification content are shared.</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">5. Your Rights</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">You can access, update, or delete your personal data at any time from your Settings page. You may also request a complete data export. To delete your account and all associated data, contact us at privacy@learngrid.app.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">6. Data Sharing</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">We do not sell your personal data. Notes, assignments, and announcements you create are shared only with users in your configured scope (class, branch, or college). We may share aggregated, non-identifiable data for analytics purposes.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">7. Changes to This Policy</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">We may update this privacy policy from time to time. We will notify you of any significant changes through the platform or via email. Continued use of LearnGrid after changes constitutes acceptance of the updated policy.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">8. Contact</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">If you have questions about this privacy policy or your data, please contact us at privacy@learngrid.app.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
