import React from 'react';

export const metadata = {
    title: 'Privacy Policy | MK Tool Nest',
    description: 'Privacy policy for MK Tool Nest, explaining how we collect and use your data.',
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-gray-300 py-20 px-4">
            <div className="container max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black mb-12 gradient-text">Privacy Policy</h1>

                <div className="space-y-8 text-lg leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <p>
                            We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include your name, email address, and any other information you choose to provide.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Use of Information</h2>
                        <p>
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>Provide, maintain, and improve our services;</li>
                            <li>Send you technical notices, updates, and support messages;</li>
                            <li>Respond to your comments and questions;</li>
                            <li>Communicate with you about products, services, and events;</li>
                            <li>Monitor and analyze trends, usage, and activities.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Cookies and Analytics</h2>
                        <p>
                            We use cookies and similar technologies to collect information about your browsing activities and to distinguish you from other users of our site. We also use third-party analytics services to help us understand how users interact with our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Links</h2>
                        <p>
                            Our site may contain links to third-party websites. Please be aware that we are not responsible for the privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of each and every website that collects personally identifiable information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                        <p>
                            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
                        <p>
                            Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete the data we hold about you.
                        </p>
                    </section>

                    <div className="pt-12 border-t border-white/10 text-sm text-gray-500">
                        Last updated: February 7, 2026
                    </div>
                </div>
            </div>
        </div>
    );
}
