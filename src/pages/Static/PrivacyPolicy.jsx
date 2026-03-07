import React from 'react';
import { Link } from 'react-router-dom';

export function PrivacyPolicy() {
    return (
        <div className="bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 min-h-screen">
            <section className="relative pt-24 pb-16 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat border-b border-slate-200/50">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-4">Privacy Policy</h1>
                    <p className="text-slate-500 text-lg">Last updated: February 28, 2026</p>
                </div>
            </section>
            <section className="py-16 bg-white relative z-20">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="space-y-10">

                        {/* Introduction */}
                        <div>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">LearnGrid ("we," "our," or "us") operates the website <a href="https://www.learngrid.online" className="text-blue-600 hover:underline">www.learngrid.online</a> (the "Service"). This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our Service. By using LearnGrid, you consent to the practices described in this policy.</p>
                        </div>

                        {/* 1. Information We Collect */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">1. Information We Collect</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-4">We collect the following types of information:</p>
                            <div className="space-y-3">
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-4">
                                    <h4 className="font-bold text-slate-800 mb-1">Personal Information</h4>
                                    <p className="text-sm text-slate-500 font-medium">Name, email address, profile picture, institution name, department/branch, year/standard, division/section — provided during registration and onboarding.</p>
                                </div>
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-4">
                                    <h4 className="font-bold text-slate-800 mb-1">Authentication Data</h4>
                                    <p className="text-sm text-slate-500 font-medium">Login credentials (email/password or Google OAuth tokens). Passwords are never stored in plain text — they are handled securely by Firebase Authentication.</p>
                                </div>
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-4">
                                    <h4 className="font-bold text-slate-800 mb-1">User-Generated Content</h4>
                                    <p className="text-sm text-slate-500 font-medium">Notes (PDF files), assignments, announcements, and any other content you upload to the platform.</p>
                                </div>
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-4">
                                    <h4 className="font-bold text-slate-800 mb-1">Usage Data</h4>
                                    <p className="text-sm text-slate-500 font-medium">Features accessed, pages visited, actions taken (uploads, deletions), timestamps, device type, browser type, and IP address — collected automatically for analytics and improvement.</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. How We Use Your Information */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">2. How We Use Your Information</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">Your information is used for the following purposes:</p>
                            <ul className="list-disc list-inside space-y-2 text-base text-slate-600 font-medium">
                                <li>To provide, operate, and maintain the LearnGrid platform</li>
                                <li>To personalize your dashboard and match you with classmates in your institution, branch, and section</li>
                                <li>To sync your data across devices using Firebase Firestore</li>
                                <li>To send email notifications about new notes, assignments, and announcements uploaded by your classmates</li>
                                <li>To sync assignment deadlines with your Google Calendar (if you grant permission)</li>
                                <li>To improve our services through aggregated, anonymized analytics</li>
                                <li>To prevent abuse, fraud, and unauthorized access</li>
                            </ul>
                        </div>

                        {/* 3. Data Storage & Security */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">3. Data Storage & Security</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">We take data security seriously and implement multiple layers of protection:</p>
                            <ul className="list-disc list-inside space-y-2 text-base text-slate-600 font-medium">
                                <li>All data is stored on <strong>Google Firebase</strong> infrastructure with industry-standard encryption at rest and in transit (TLS/SSL)</li>
                                <li>Authentication is handled through <strong>Firebase Auth</strong> supporting Google Sign-In and email/password with mandatory email verification</li>
                                <li>PDF files are stored on <strong>Cloudinary</strong> with user-specific folders, ensuring data isolation</li>
                                <li>Access to user data is restricted by institution, branch, year, and section — you can only see content shared within your configured scope</li>
                                <li>We do not store passwords — Firebase Auth handles all credential management securely</li>
                            </ul>
                            <p className="text-sm text-slate-500 mt-3 font-medium">While we implement commercially reasonable security measures, no system is 100% secure. We cannot guarantee absolute security of your data.</p>
                        </div>

                        {/* 4. Third-Party Services */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">4. Third-Party Services</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-4">LearnGrid relies on the following third-party services to operate. Each has its own privacy policy:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-2">Google Firebase</h4>
                                    <p className="text-sm text-slate-500 font-medium">Authentication, Firestore database, and hosting. Data processed under <a href="https://firebase.google.com/support/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</p>
                                </div>
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-2">Cloudinary</h4>
                                    <p className="text-sm text-slate-500 font-medium">PDF file storage and delivery for notes, assignments, and profile pictures. Files are stored in user-specific folders.</p>
                                </div>
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-2">Google Calendar API</h4>
                                    <p className="text-sm text-slate-500 font-medium">Optional integration to auto-sync assignment deadlines. Access is granted via OAuth consent and can be revoked anytime from Settings.</p>
                                </div>
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-2">EmailJS</h4>
                                    <p className="text-sm text-slate-500 font-medium">Used to send notification emails when classmates upload content. Only recipient email and notification content are shared.</p>
                                </div>
                            </div>
                        </div>

                        {/* 5. Cookies & Local Storage */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">5. Cookies & Local Storage</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">We use cookies and browser local storage for the following purposes:</p>
                            <ul className="list-disc list-inside space-y-2 text-base text-slate-600 font-medium">
                                <li><strong>Essential:</strong> Firebase authentication tokens to keep you logged in securely</li>
                                <li><strong>Functional:</strong> Theme preferences (dark/light mode), cookie consent status</li>
                                <li><strong>Google OAuth:</strong> Access tokens for Google Calendar integration (stored locally, not on our servers)</li>
                            </ul>
                            <p className="text-sm text-slate-500 mt-3 font-medium">We do not use any third-party advertising or tracking cookies. For more details, see our <Link to="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link>.</p>
                        </div>

                        {/* 6. Data Sharing */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">6. Data Sharing & Disclosure</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">We do not sell, rent, or trade your personal data. Your information may be shared only in the following circumstances:</p>
                            <ul className="list-disc list-inside space-y-2 text-base text-slate-600 font-medium">
                                <li><strong>Within your scope:</strong> Notes, assignments, and announcements are shared with users in your configured audience (class, branch, year, or institution)</li>
                                <li><strong>Service providers:</strong> Third-party services listed above that help us operate the platform</li>
                                <li><strong>Legal requirements:</strong> If required by law, regulation, or legal process</li>
                                <li><strong>Safety:</strong> To protect the rights, safety, or property of LearnGrid, our users, or the public</li>
                            </ul>
                        </div>

                        {/* 7. Data Retention */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">7. Data Retention</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">We retain your personal data for as long as your account is active. You can delete your data at any time from the Settings page using "Clear All Data." Upon account deletion, your data will be removed from our systems within 30 days. Some data may be retained in backups for up to 90 days. Anonymized, aggregated analytics data may be retained indefinitely.</p>
                        </div>

                        {/* 8. Your Rights */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">8. Your Rights</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">You have the following rights regarding your personal data:</p>
                            <ul className="list-disc list-inside space-y-2 text-base text-slate-600 font-medium">
                                <li><strong>Access:</strong> View your personal data from your Profile and Settings pages</li>
                                <li><strong>Update:</strong> Edit your profile information, institution details, and preferences at any time</li>
                                <li><strong>Delete:</strong> Delete specific notes, assignments, or announcements. Use "Clear All Data" in Settings to delete all your content</li>
                                <li><strong>Withdraw consent:</strong> Revoke Google Calendar access from Settings, or stop using the platform</li>
                                <li><strong>Portability:</strong> Request a copy of your data by contacting us</li>
                            </ul>
                        </div>

                        {/* 9. Children's Privacy */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">9. Children's Privacy</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">LearnGrid is designed for students of all ages, including school students. We do not knowingly collect personal information from children under 13 without parental consent. If you are a parent or guardian and believe your child has provided personal information without your consent, please contact us at <span className="text-blue-600">learngrid.official@gmail.com</span> and we will take steps to remove that information.</p>
                        </div>

                        {/* 10. International Users */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">10. International Users</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">LearnGrid is operated from India. If you access the Service from outside India, your data may be transferred to and processed in India and other countries where our service providers (Google, Cloudinary) maintain servers. By using LearnGrid, you consent to the transfer of your data to these locations.</p>
                        </div>

                        {/* 11. Changes to This Policy */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">11. Changes to This Policy</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium">We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of significant changes through in-app notifications or via email. The "Last updated" date at the top of this page indicates when the policy was last revised. Continued use of LearnGrid after changes constitutes acceptance of the updated policy.</p>
                        </div>

                        {/* 12. Contact */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">12. Contact Us</h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-3">If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:</p>
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
