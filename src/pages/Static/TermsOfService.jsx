import React from 'react';

export function TermsOfService() {
    return (
        <div className="bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 min-h-screen">
            <section className="relative pt-24 pb-16 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat border-b border-slate-200/50">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-4">Terms of Service</h1>
                    <p className="text-slate-500 text-lg">Last updated: February 15, 2026</p>
                </div>
            </section>
            <section className="py-16 bg-white relative z-20">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">1. Acceptance of Terms</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">By accessing or using LearnGrid, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform. These terms apply to all users, including students, educators, and administrators.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">2. Account Registration</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You must verify your email address before accessing the platform. You may sign in using Google or email/password authentication.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">3. Acceptable Use</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">You agree to use LearnGrid only for lawful, educational purposes. You may not upload malicious content, spam other users with announcements, impersonate others, or attempt to access data outside your authorized scope (class, branch, or college).</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">4. Content & Uploads</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">You retain ownership of all notes, assignments, and announcements you create. By uploading content, you grant LearnGrid a limited license to store and distribute it to users within your configured notification scope. You are responsible for ensuring you have the right to share any content you upload.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">5. Service Availability</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">We strive to keep LearnGrid available at all times but do not guarantee uninterrupted access. The platform depends on third-party services including Firebase, Cloudinary, and Google APIs. We are not liable for downtime caused by these providers.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">6. Free Tier & Limitations</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">LearnGrid is currently free to use. We reserve the right to introduce paid plans or usage limits in the future. Any changes will be communicated in advance. Existing free-tier functionality will remain accessible.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">7. Termination</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">We may suspend or terminate your account for violations of these terms. You may delete your account at any time. Upon termination, your data will be removed from our systems within 30 days, except as required by law.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">8. Limitation of Liability</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">LearnGrid is provided "as is" without warranties of any kind. We are not liable for any loss of data, missed deadlines, or academic consequences arising from the use or inability to use the platform.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">9. Changes to Terms</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">We may update these terms at any time. Material changes will be communicated through the platform. Your continued use after changes constitutes acceptance of the updated terms.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">10. Contact</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">For questions about these terms, please contact us at support@learngrid.app.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
