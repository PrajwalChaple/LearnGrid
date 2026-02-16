import React from 'react';

export function TermsOfService() {
    return (
        <div>
            <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Terms of Service</h1>
                    <p className="text-gray-400 text-sm">Last updated: February 15, 2026</p>
                </div>
            </section>
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">By accessing or using LearnGrid, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">2. Use of Service</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">LearnGrid is an academic management platform designed for students. You agree to use the service for lawful, educational purposes only. You are responsible for maintaining the confidentiality of your account credentials.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">3. User Content</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">You retain ownership of all content (notes, assignments, data) you create on LearnGrid. By using our platform, you grant us a limited license to store and process your content solely for providing the service.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">4. Account Termination</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">You may delete your account at any time. We reserve the right to suspend or terminate accounts that violate these terms or engage in abusive behavior. Upon termination, your data will be deleted within 30 days.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">5. Service Availability</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">We strive for 99.9% uptime but do not guarantee uninterrupted service. We may perform maintenance that temporarily affects availability, and we'll notify users in advance when possible.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">6. Limitation of Liability</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">LearnGrid is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">7. Contact</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">For questions about these Terms of Service, please contact us at legal@learngrid.app.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
