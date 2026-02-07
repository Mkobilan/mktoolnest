import React from 'react';
import { Utensils, Wrench, Heart, Hammer, Gamepad2, Rocket } from 'lucide-react';

export const metadata = {
    title: 'Our Story - About Matthew Kobilan | MK Tool Nest',
    description: 'Learn about MK Tool Nest and the story of Matthew Kobilan. A professional blog directory built from industry experience to bring value to restaurateurs, mechanics, caretakers, and more.',
    keywords: [
        "About Matthew Kobilan",
        "MK Tool Nest Story",
        "Professional Blog Directory",
        "Industry Resource Aggregator",
        "Restaurant Management Blog Hub",
        "Automotive Repair Insights",
        "Caregiver Support Directory",
        "Construction Business Growth",
        "Gaming Strategy Hub",
        "Day Labor on Demand",
        "Career Growth for Skilled Trades"
    ],
};

export default function AboutPage() {
    const experiences = [
        {
            icon: <Utensils size={32} />,
            title: "The Service Industry",
            description: "Learning the grind from the ground up as a dishwasher, server, and cook.",
            color: "from-orange-500/20 to-red-600/20",
            border: "border-orange-500/30",
            glow: "bg-orange-500/10",
            iconColor: "text-orange-500"
        },
        {
            icon: <Wrench size={32} />,
            title: "Mechanic",
            description: "Mastering diagnostic tools and the fine art of professional automotive repair.",
            color: "from-blue-500/20 to-indigo-600/20",
            border: "border-blue-500/30",
            glow: "bg-blue-500/10",
            iconColor: "text-blue-500"
        },
        {
            icon: <Heart size={32} />,
            title: "Caretaker",
            description: "Providing compassionate support and advocacy for those in healthcare and beyond.",
            color: "from-emerald-500/20 to-teal-600/20",
            border: "border-emerald-500/30",
            glow: "bg-emerald-500/10",
            iconColor: "text-emerald-500"
        },
        {
            icon: <Hammer size={32} />,
            title: "Contractor",
            description: "Building the world around us. I have hired day laborers and worked as a day laborer myself.",
            color: "from-amber-500/20 to-yellow-600/20",
            border: "border-amber-500/30",
            glow: "bg-amber-500/10",
            iconColor: "text-amber-500"
        },
        {
            icon: <Gamepad2 size={32} />,
            title: "Gamer",
            description: "Strategizing raids and leading teams through high-stakes digital challenges.",
            color: "from-[#00FF41]/20 to-green-900/20",
            border: "border-[#00FF41]/30",
            glow: "bg-[#00FF41]/10",
            iconColor: "text-[#00FF41]"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-gray-300">
            {/* Hero Section */}
            <section className="relative py-32 px-4 overflow-hidden border-b border-white/5">
                <div className="container max-w-5xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-black mb-8 gradient-text leading-tight uppercase tracking-tighter">
                        MK Tool Nest Story
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Built from real-world grit, tailored for those who get the job done.
                    </p>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl -z-10 opacity-30"></div>
            </section>

            {/* Main Content */}
            <section className="py-24 px-4">
                <div className="container max-w-4xl mx-auto">
                    <div className="space-y-12">
                        <div className="prose prose-invert prose-lg max-w-none">
                            <h2 className="text-3xl font-bold text-white mb-6">Who is Matthew Kobilan?</h2>
                            <p className="text-lg leading-relaxed mb-6">
                                My name is <strong className="text-white uppercase">Matthew Kobilan</strong>, and MK Tool Nest is more than just a brand—it&apos;s my initials and my mission. I started building these apps and this <strong className="text-white">professional blog directory</strong> because I believe in the power of shared knowledge and specialized tools.
                            </p>
                            <p className="text-lg leading-relaxed mb-6">
                                Over the years, I&apos;ve walked many paths. I&apos;ve worked as a <strong className="text-white">dishwasher, server, and cook</strong>, understanding the intense pressure of the service industry. I&apos;ve been a <strong className="text-white">Mechanic</strong> solving complex engine puzzles, a <strong className="text-white">Caretaker</strong> offering essential support, and a <strong className="text-white">Contractor</strong> building tangible progress.
                            </p>
                            <p className="text-lg leading-relaxed mb-6">
                                In the contracting world, I&apos;ve seen both sides—I have hired day laborers to get jobs done, and I have worked as a day laborer myself to understand the grind first-hand.
                            </p>
                            <p className="text-lg leading-relaxed mb-12">
                                This diverse background is the foundation of <strong className="text-white">MK Tool Nest</strong>. I didn&apos;t just build these apps for the sake of it; I built them because I wanted to bring value to the industries I know and love. I wanted to build the apps <em className="text-gray-400 font-medium italic">I</em> always wanted but could never find.
                            </p>
                        </div>

                        {/* Values/Industries Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
                            {experiences.map((exp, idx) => (
                                <div
                                    key={idx}
                                    className={`relative p-8 rounded-[2.5rem] border-2 hover:scale-[1.02] transition-all duration-300 group overflow-hidden`}
                                    style={{
                                        background: `linear-gradient(135deg, ${exp.color.split(' ')[0].replace('from-', '').replace('/20', '')}1f, ${exp.color.split(' ')[1].replace('to-', '').replace('/20', '')}1f)`,
                                        borderColor: exp.border.replace('border-', '').replace('/30', '').replace('[#00FF41]', '#00FF41').includes('orange') ? 'rgba(249, 115, 22, 0.3)' :
                                            exp.border.replace('border-', '').replace('/30', '').replace('[#00FF41]', '#00FF41').includes('blue') ? 'rgba(59, 130, 246, 0.3)' :
                                                exp.border.replace('border-', '').replace('/30', '').replace('[#00FF41]', '#00FF41').includes('emerald') ? 'rgba(16, 185, 129, 0.3)' :
                                                    exp.border.replace('border-', '').replace('/30', '').replace('[#00FF41]', '#00FF41').includes('amber') ? 'rgba(245, 158, 11, 0.3)' :
                                                        'rgba(0, 255, 65, 0.3)'
                                    }}
                                >
                                    {/* Internal Glow Effect */}
                                    <div
                                        className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full transition-opacity group-hover:opacity-100 opacity-50`}
                                        style={{
                                            backgroundColor: exp.glow.replace('bg-', '').replace('/10', '').replace('[#00FF41]', '#00FF41').includes('orange') ? 'rgba(249, 115, 22, 0.1)' :
                                                exp.glow.replace('bg-', '').replace('/10', '').replace('[#00FF41]', '#00FF41').includes('blue') ? 'rgba(59, 130, 246, 0.1)' :
                                                    exp.glow.replace('bg-', '').replace('/10', '').replace('[#00FF41]', '#00FF41').includes('emerald') ? 'rgba(16, 185, 129, 0.1)' :
                                                        exp.glow.replace('bg-', '').replace('/10', '').replace('[#00FF41]', '#00FF41').includes('amber') ? 'rgba(245, 158, 11, 0.1)' :
                                                            'rgba(0, 255, 65, 0.1)'
                                        }}
                                    ></div>

                                    <div className={`mb-6 p-4 rounded-2xl bg-white/5 w-fit ${exp.iconColor} group-hover:scale-110 transition-transform relative z-10`}>
                                        {exp.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 relative z-10">{exp.title}</h3>
                                    <p className="text-gray-300 group-hover:text-white transition-colors relative z-10 text-sm leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-12 rounded-[3rem] border border-white/10 text-center mt-20">
                            <Rocket className="mx-auto text-blue-400 mb-6" size={48} />
                            <h2 className="text-3xl font-bold text-white mb-4">The Mission</h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                                MK Tool Nest serves as an <strong className="text-white">industry resource aggregator</strong>. Whether it&apos;s <strong className="text-white">restaurant management tips</strong>, <strong className="text-white">automotive repair insights</strong>, or <strong className="text-white">gaming strategy generators</strong>, my goal is to provide a central hub for career growth and expert industry insights.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
