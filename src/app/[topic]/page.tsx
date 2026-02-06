import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Calendar, ArrowRight, Search } from "lucide-react";
import { notFound } from "next/navigation";

const topicConfig = {
    baybolt: {
        title: "Baybolt",
        subtitle: "Tips & Tools for Mechanics",
        gradient: "from-orange-500 via-orange-600 to-blue-900",
        textColor: "text-orange-500",
        bgColor: "bg-orange-500",
        cardClass: "baybolt-card",
    },
    hugloom: {
        title: "HugLoom",
        subtitle: "Tips & Tools for Caretakers",
        gradient: "from-pink-400 via-rose-400 to-red-400",
        textColor: "text-pink-400",
        bgColor: "bg-pink-400",
        cardClass: "hugloom-card",
    },
    daylabor: {
        title: "Day Labor on Demand",
        subtitle: "Tips & Tools for Contractors",
        gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
        textColor: "text-purple-500",
        bgColor: "bg-purple-500",
        cardClass: "daylabor-card",
    },
    raidmemegen: {
        title: "Raid Generator",
        subtitle: "Tips & Tools for Gamers",
        gradient: "from-[#00FF41] via-[#008F11] to-[#003B00]",
        textColor: "text-[#00FF41]",
        bgColor: "bg-[#00FF41]",
        cardClass: "raidmemegen-card",
    },
    hubplate: {
        title: "HubPlate",
        subtitle: "Tips & Tools for Restaurateurs",
        gradient: "from-red-600 via-orange-500 to-red-600",
        textColor: "text-red-500",
        bgColor: "bg-red-500",
        cardClass: "hubplate-card",
    },
    hangroom: {
        title: "Hangroom",
        subtitle: "Tips & Tools for Creators",
        gradient: "from-pink-500 via-fuchsia-500 to-purple-600",
        textColor: "text-pink-500",
        bgColor: "bg-pink-500",
        cardClass: "hangroom-card",
    },
};

export async function generateStaticParams() {
    return [
        { topic: 'baybolt' },
        { topic: 'hugloom' },
        { topic: 'daylabor' },
        { topic: 'raidmemegen' },
        { topic: 'hubplate' },
        { topic: 'hangroom' },
    ];
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
    const { topic } = await params;
    const config = topicConfig[topic as keyof typeof topicConfig];

    const baseUrl = 'https://mktoolnest.vercel.app';

    if (!config) {
        return {
            title: "Topic Not Found | MK Tool Nest",
        };
    }

    return {
        title: `${config.title} - ${config.subtitle} | MK Tool Nest`,
        description: `Explore expert guides, tips, and resources for ${config.title}. ${config.subtitle} at MK Tool Nest.`,
        alternates: {
            canonical: `${baseUrl}/${topic}`,
        },
        openGraph: {
            title: `${config.title} - ${config.subtitle} | MK Tool Nest`,
            description: `Explore expert guides, tips, and resources for ${config.title}. ${config.subtitle} at MK Tool Nest.`,
            url: `${baseUrl}/${topic}`,
            images: [
                {
                    url: `${baseUrl}/icon.png`,
                    width: 512,
                    height: 512,
                    alt: config.title,
                },
            ],
        },
    };
}


export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
    const { topic } = await params;

    if (!topicConfig[topic as keyof typeof topicConfig]) {
        notFound();
    }

    const config = topicConfig[topic as keyof typeof topicConfig];

    const supabase = await createClient();

    // Fetch posts
    const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .eq("topic", topic)
        .eq("published", true)
        .order("created_at", { ascending: false });

    // Fetch hero image from site_settings
    const { data: heroSetting } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", `hero_${topic}`)
        .single();

    const heroImageUrl = heroSetting?.setting_value || null;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-orange-500/30 font-sans">
            {/* Nuclear Confirmation Bar */}
            <div className="bg-red-600 text-white text-center py-2 font-black uppercase text-[10px] tracking-[0.3em] z-[100] relative">
                MK TOOL NEST BLOG REBOOT - STYLE FIX APPLIED
            </div>

            {/* Hero Section */}
            <section className="relative h-[400px] lg:h-[450px] overflow-hidden">
                {heroImageUrl && (
                    <div className="absolute inset-0">
                        <img
                            src={heroImageUrl}
                            alt={`${config.title} Hero`}
                            className="w-full h-full object-cover opacity-50 shadow-2xl"
                        />
                        <div className="absolute inset-0 bg-[#0a0a0f]/60 backdrop-blur-[2px]"></div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent"></div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pt-20">
                    <h1 className="text-6xl md:text-9xl font-black mb-4 tracking-tighter leading-none">
                        <span className="text-white/10">THE </span>
                        <span className={config.textColor}>
                            {config.title.toUpperCase()}
                        </span>
                    </h1>
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">BLOG</h2>
                </div>
            </section>

            {/* Filter Row */}
            <section className="py-12 border-b border-white/5">
                <div className="container max-w-7xl mx-auto px-4 flex flex-col items-center gap-12">
                    <div className="flex items-center gap-10">
                        <button className={`text-xs font-black tracking-[0.3em] pb-3 border-b-2 ${config.textColor} border-current`}>
                            ALL
                        </button>
                        <button className="text-xs font-bold tracking-[0.3em] pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-200 transition-colors">
                            GENERAL
                        </button>
                    </div>

                    <div className="relative w-full max-w-2xl group pb-2 border-b border-white/10 focus-within:border-white/30 transition-colors">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full bg-transparent py-2 pl-10 text-lg lg:text-xl focus:outline-none placeholder:text-slate-700"
                        />
                    </div>
                </div>
            </section>

            {/* Posts Content */}
            <section className="py-24 lg:py-32 px-4 relative z-10">
                <div className="container max-w-7xl mx-auto">
                    {posts && posts.length > 0 ? (
                        <div className="flex flex-col gap-24 lg:gap-32">
                            {/* Featured Post Card */}
                            <Link href={`/blog/${posts[0].slug}`}>
                                <article className={`card ${config.cardClass} group cursor-pointer overflow-hidden flex flex-col lg:flex-row min-h-[500px] lg:min-h-[600px] !bg-[#020617]`}>
                                    {/* Image Container */}
                                    {posts[0].image_url && (
                                        <div className="lg:w-1/2 relative h-[300px] lg:h-auto overflow-hidden">
                                            <img
                                                src={posts[0].image_url}
                                                alt={posts[0].title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#020617]/20 hidden lg:block" />
                                        </div>
                                    )}
                                    {/* Content Container */}
                                    <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
                                        <div className="flex items-center gap-4 mb-8">
                                            <span className={`${config.textColor} text-xs font-black uppercase tracking-[0.25em]`}>
                                                {posts[0].category || 'FEATURED'}
                                            </span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
                                                {new Date(posts[0].created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                            </span>
                                        </div>
                                        <h2 className="text-4xl lg:text-7xl font-black text-white mb-10 leading-[1.05] tracking-tighter group-hover:translate-x-1 transition-transform duration-500">
                                            {posts[0].title}
                                        </h2>
                                        <p className="text-slate-400 text-lg lg:text-xl mb-12 line-clamp-4 leading-relaxed font-medium">
                                            {posts[0].excerpt}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                                                    <Search size={22} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold text-base tracking-tight">Matthew Kobilan</div>
                                                    <div className="text-slate-500 text-xs font-semibold tracking-wider italic">Editorial Team</div>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-3 ${config.textColor} text-xs font-black uppercase tracking-[0.4em] group-hover:translate-x-2 transition-all duration-500`}>
                                                <span>READ STORY</span>
                                                <ArrowRight size={18} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>

                            {/* Remaining Posts Grid */}
                            {posts.length > 1 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20">
                                    {posts.slice(1).map((post, index) => (
                                        <Link href={`/blog/${post.slug}`} key={post.id}>
                                            <article
                                                className={`card ${config.cardClass} group cursor-pointer flex flex-col h-full !bg-[#020617]`}
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                {/* Image */}
                                                {post.image_url && (
                                                    <div className="aspect-[16/10] overflow-hidden">
                                                        <img
                                                            src={post.image_url}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                        />
                                                    </div>
                                                )}

                                                {/* Content */}
                                                <div className="p-10 flex flex-col flex-1">
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <span className={`${config.textColor} text-[10px] font-black uppercase tracking-[0.2em]`}>
                                                            {post.category || 'ARTICLE'}
                                                        </span>
                                                        <div className="w-1 h-1 rounded-full bg-white/5" />
                                                        <span className="text-slate-500 text-[10px] font-bold tracking-[0.1em]">
                                                            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-2xl lg:text-3xl font-black text-white mb-8 leading-[1.15] tracking-tight group-hover:translate-x-1 transition-transform">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-slate-400 text-base mb-12 line-clamp-3 leading-relaxed">
                                                        {post.excerpt}
                                                    </p>

                                                    <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                                                                <Search size={14} />
                                                            </div>
                                                            <span className="text-slate-500 text-[10px] font-bold tracking-widest italic uppercase">MATTHEW K.</span>
                                                        </div>
                                                        <div className={`w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center ${config.textColor} group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all shadow-sm`}>
                                                            <ArrowRight size={22} strokeWidth={2.5} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-40 text-center">
                            <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-widest">No Articles Found</h3>
                            <p className="text-slate-500 text-xl mb-16 max-w-lg mx-auto">We're currently preparing fresh content for this topic. Check back soon!</p>
                            <Link href="/" className={`${config.textColor} font-black tracking-[0.5em] uppercase text-xs flex items-center justify-center gap-4 hover:opacity-70 transition-opacity`}>
                                <ArrowLeft size={16} />
                                BACK TO HUB
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
