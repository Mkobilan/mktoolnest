import React from 'react';
import { Twitter, Facebook, ExternalLink, Mail } from 'lucide-react';

export const metadata = {
    title: 'Contact Us | MK Tool Nest',
    description: 'Get in touch with Matthew Kobilan and the MK Tool Nest team. The best way to reach us is through social media on X and Facebook.',
};

export default function ContactPage() {
    const socials = [
        {
            name: 'X (formerly Twitter)',
            handle: '@MatthewKobilan',
            icon: <Twitter size={24} />,
            link: 'https://x.com/MatthewKobilan',
            color: 'hover:text-[#1DA1F2]'
        },
        {
            name: 'Facebook',
            handle: 'Matthew Kobilan',
            icon: <Facebook size={24} />,
            link: 'https://www.facebook.com/matthewkobilan',
            color: 'hover:text-[#4267B2]'
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-gray-300 py-20 px-4">
            <div className="container max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-black mb-8 gradient-text leading-tight">Contact Us</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed">
                    Have a question or want to collaborate? The best way to get ahold of me is through social media. I&apos;m active on X and Facebook and would love to hear from you.
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    {socials.map((social, idx) => (
                        <a
                            key={idx}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-10 rounded-[2.5rem] bg-white/5 border border-white/10 ${social.color} transition-all hover:bg-white/[0.07] hover:border-white/20 group text-center flex flex-col items-center`}
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                                {social.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{social.name}</h3>
                            <div className="flex items-center gap-2 text-gray-400 group-hover:text-inherit">
                                <span>{social.handle}</span>
                                <ExternalLink size={14} />
                            </div>
                        </a>
                    ))}
                </div>

                <div className="mt-24 p-12 rounded-[3rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5">
                    <Mail className="mx-auto text-gray-500 mb-6" size={32} />
                    <h2 className="text-2xl font-bold text-white mb-4">Building Together</h2>
                    <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
                        Whether you&apos;re a restauranteur, mechanic, contractor, or gamer, I&apos;m always looking for ways to bring more value to your industry. Reach out and let&apos;s talk about tools that matter.
                    </p>
                </div>
            </div>
        </div>
    );
}
