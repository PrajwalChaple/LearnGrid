import React from 'react';
import { Link } from 'react-router-dom';

export function TermsOfService() {
    return (
        <div className="bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 min-h-screen">
            <section className="relative pt-24 pb-16 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat border-b border-slate-200/50">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-4">Terms of Service</h1>
                    <p className="text-slate-500 text-lg">Last updated: February 28, 2026</p>
                </div>
            </section>
            <section className="py-16 bg-white relative z-20">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="space-y-10">

                        {/* Introduction */}
                        <div>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">These Terms of Service ("Terms") govern your access to and use of LearnGrid, operated by Prajwal Chaple ("we," "our," or "us"), available at <a href="https://www.learngrid.online" className="text-blue-600 hover:underline">www.learngrid.online</a>. By creating an account or using LearnGrid, you agree to be bound by these Terms. If you do not agree, please do not use the platform.</p>
                        </div>

                        {/* 1. Eligibility */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">1. Eligibility</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">LearnGrid is available to students of all ages, including school and college students. If you are under 13 years of age, you must have parental or guardian consent to use the platform. By using LearnGrid, you represent that you have the legal capacity to enter into these Terms or have obtained the necessary consent.</p>
                        </div>

                        {/* 2. Account Registration */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">2. Account Registration</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">To use LearnGrid, you must create an account. You agree to:</p>
                            <ul className="list-disc list-inside space-y-2 text-base text-slate-600 font-medium">
                                <li>Provide accurate and truthful information during registration (name, email, institution details)</li>
                                <li>Verify your email address before accessing the platform</li>
                                <li>Keep your login credentials secure and confidential</li>
                                <li>Notify us immediately if you suspect unauthorized access to your account</li>
                                <li>Not create multiple accounts for the same person</li>
                            </ul>
                            <p className="text-sm text-slate-500 mt-3 font-medium">You may sign in using Google or email/password authentication. You are responsible for all activity that occurs under your account.</p>
                        </div>

                        {/* 3. Acceptable Use */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">3. Acceptable Use</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">You agree to use LearnGrid only for lawful, educational purposes. You may not:</p>
                            <ul className="list-disc list-inside space-y-2 text-base text-slate-600 font-medium">
                                <li>Upload malicious, offensive, or inappropriate content</li>
                                <li>Spam other users with unnecessary announcements or notifications</li>
                                <li>Impersonate other users, educators, or administrators</li>
                                <li>Attempt to access data outside your authorized scope (class, branch, or institution)</li>
                                <li>Reverse-engineer, decompile, or attempt to extract the source code of the platform</li>
                                <li>Use automated bots, scrapers, or tools to access or interact with the platform</li>
                                <li>Upload copyrighted material without proper authorization</li>
                                <li>Interfere with the platform's operation, security, or infrastructure</li>
                            </ul>
                        </div>

                        {/* 4. Content & Uploads */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">4. Content & Uploads</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">Regarding content you create or upload on LearnGrid:</p>
                            <ul className="list-disc list-inside space-y-2 text-base text-slate-600 font-medium">
                                <li><strong>Ownership:</strong> You retain full ownership of all notes, assignments, and announcements you create</li>
                                <li><strong>License:</strong> By uploading content, you grant LearnGrid a limited, non-exclusive license to store, process, and distribute it to users within your configured notification scope</li>
                                <li><strong>Responsibility:</strong> You are solely responsible for ensuring you have the right to share any content you upload, including PDFs and academic materials</li>
                                <li><strong>Removal:</strong> You can delete your content at any time. We may also remove content that violates these Terms</li>
                            </ul>
                        </div>

                        {/* 5. Intellectual Property */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">5. Intellectual Property</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">The LearnGrid platform, including its design, codebase, branding, logos, UI components, and documentation, is the intellectual property of Prajwal Chaple and is protected by applicable copyright and trademark laws. You may not copy, modify, distribute, or create derivative works based on the platform without prior written permission. User-generated content (notes, assignments, announcements) remains the property of the respective user.</p>
                        </div>

                        {/* 6. Third-Party Services */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">6. Third-Party Services & Integrations</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">LearnGrid integrates with third-party services to provide its features:</p>
                            <ul className="list-disc list-inside space-y-2 text-base text-slate-600 font-medium">
                                <li><strong>Google Firebase:</strong> Authentication, database, and hosting</li>
                                <li><strong>Cloudinary:</strong> PDF and image storage</li>
                                <li><strong>Google Calendar API:</strong> Optional assignment deadline sync (requires user consent)</li>
                                <li><strong>EmailJS:</strong> Email notifications for new content</li>
                            </ul>
                            <p className="text-sm text-slate-500 mt-3 font-medium">These services have their own terms and privacy policies. We are not responsible for their practices or any issues arising from their services.</p>
                        </div>

                        {/* 7. Service Availability */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">7. Service Availability</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">We strive to keep LearnGrid available 24/7 but do not guarantee uninterrupted access. The platform may experience downtime due to maintenance, updates, or issues with third-party providers (Firebase, Cloudinary, Google APIs). We will make reasonable efforts to provide advance notice of scheduled maintenance. We are not liable for any data loss, missed deadlines, or inconvenience caused by service interruptions.</p>
                        </div>

                        {/* 8. Free Tier & Limitations */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">8. Pricing & Free Tier</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">LearnGrid is currently free to use with no hidden charges. We reserve the right to introduce paid plans, premium features, or usage limits in the future. Any pricing changes will be communicated at least 30 days in advance through the platform. Existing free-tier functionality available at the time of any pricing change will remain accessible to existing users.</p>
                        </div>

                        {/* 9. Termination */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">9. Termination & Suspension</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">We may suspend or terminate your account if:</p>
                            <ul className="list-disc list-inside space-y-2 text-base text-slate-600 font-medium">
                                <li>You violate any provision of these Terms</li>
                                <li>Your account has been inactive for an extended period (12+ months)</li>
                                <li>We are required to do so by law or legal process</li>
                                <li>We believe your use poses a security risk to other users</li>
                            </ul>
                            <p className="text-sm text-slate-500 mt-3 font-medium">You may delete your account at any time from the Settings page. Upon termination, your data will be removed within 30 days, except as required by law or for legitimate backup purposes.</p>
                        </div>

                        {/* 10. Limitation of Liability */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">10. Limitation of Liability</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">LearnGrid is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, missed deadlines, academic consequences, or loss of profits arising from your use or inability to use the platform.</p>
                        </div>

                        {/* 11. Indemnification */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">11. Indemnification</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">You agree to indemnify, defend, and hold harmless LearnGrid and its developer (Prajwal Chaple) from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the platform, your violation of these Terms, your content, or your infringement of any third-party rights.</p>
                        </div>

                        {/* 12. Governing Law */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">12. Governing Law & Dispute Resolution</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">These Terms are governed by the laws of India. Any disputes arising from these Terms or your use of LearnGrid shall be resolved through good-faith negotiation first. If negotiations fail, disputes shall be subject to the exclusive jurisdiction of the courts in Nagpur, Maharashtra, India.</p>
                        </div>

                        {/* 13. Changes to Terms */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">13. Changes to These Terms</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">We may update these Terms at any time. Material changes will be communicated through in-app notifications or via email at least 15 days before taking effect. The "Last updated" date at the top indicates when these Terms were last revised. Your continued use of LearnGrid after changes constitutes acceptance of the updated Terms.</p>
                        </div>

                        {/* 14. Contact */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">14. Contact Us</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">For questions about these Terms of Service, please contact us:</p>
                            <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 shadow-sm">
                                <p className="text-sm text-slate-600 font-medium"><strong>Email:</strong> learngrid.official@gmail.com</p>
                                <p className="text-sm text-slate-600 font-medium mt-1"><strong>Website:</strong> <a href="https://www.learngrid.online" className="text-blue-600 hover:underline">www.learngrid.online</a></p>
                                <p className="text-sm text-slate-600 font-medium mt-1"><strong>Developer:</strong> Prajwal Chaple</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
