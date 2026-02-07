import React from 'react';

export const metadata = {
    title: 'Terms of Service | MK Tool Nest',
    description: 'Terms and conditions for using the MK Tool Nest platform.',
};

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-gray-300 py-20 px-4">
            <div className="container max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black mb-12 gradient-text">Terms of Service</h1>

                <div className="space-y-8 text-lg leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using MK Tool Nest, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                        <p>
                            MK Tool Nest is a professional blog directory and resource hub providing industry-specific insights for restaurateurs, mechanics, caretakers, contractors, and gamers. We provide access to curated content, tools, and community resources.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Intellectual Property</h2>
                        <p>
                            All content on MK Tool Nest, including text, graphics, logos, and software, is the property of MK Tool Nest or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or create derivative works from this content without express written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. User Conduct</h2>
                        <p>
                            Users agree to use the site for lawful purposes only. You are prohibited from posting or transmitting any material that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                        <p>
                            MK Tool Nest shall not be liable for any damages arising out of the use or inability to use the materials on our platform. This includes, without limitation, damages for loss of data or profit, or due to business interruption.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which MK Tool Nest operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Changes to Terms</h2>
                        <p>
                            MK Tool Nest reserves the right to revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these Terms of Service.
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
