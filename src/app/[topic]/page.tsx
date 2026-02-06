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
        <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500/30">
            {/* Hero Section - Clean & Immersive */}
            <section className="relative h-[450px] overflow-hidden">
                {heroImageUrl && (
                    <img
                        src={heroImageUrl}
                        alt={`${config.title} Hero`}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                {/* Subtle Overlays */}
                <div className={`absolute inset-0 bg-[#020617]/40`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent"></div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter">
                        <span className="text-white/20">THE </span>
                        <span className={config.textColor}>
                            {config.title.toUpperCase()}
                        </span>
                    </h1>
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-6">BLOG</h2>
                    <p className="text-slate-400 text-xl max-w-2xl font-medium leading-relaxed">
                        Expert insights, professional tools, and stories from the {config.title} community.
                    </p>
                </div>
            </section>

            {/* Filter Row - Slim & Clean */}
            <section className="py-12 px-4">
                <div className="container max-w-7xl flex flex-col items-center gap-8">
                    <div className="flex items-center gap-6">
                        <button className={`text-sm font-black tracking-[0.2em] border-b-2 ${config.textColor} border-current pb-1`}>
                            ALL
                        </button>
                        <button className="text-sm font-bold tracking-[0.2em] text-slate-500 hover:text-slate-300 transition-colors pb-1">
                            GENERAL
                        </button>
                    </div>

                    <div className="relative w-full max-w-xl">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full bg-transparent border-b border-slate-800 focus:border-slate-500 py-3 pl-8 text-sm focus:outline-none transition-colors placeholder:text-slate-700"
                        />
                    </div>
                </div>
            </section>

            {/* Posts Content */}
            <section className="pb-24 px-4">
                <div className="container max-w-7xl">
                    {posts && posts.length > 0 ? (
                        <div className="space-y-16">
                            {/* Featured Post - Layout from Reference */}
                            <Link href={`/blog/${posts[0].slug}`}>
                                <article className="group cursor-pointer bg-slate-900/20 rounded-[3rem] overflow-hidden transition-all duration-500 hover:bg-slate-900/30 border border-white/5 flex flex-col lg:flex-row min-h-[500px]">
                                    {/* Image Section */}
                                    {posts[0].image_url && (
                                        <div className="lg:w-[55%] relative overflow-hidden">
                                            <img
                                                src={posts[0].image_url}
                                                alt={posts[0].title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    )}
                                    {/* Content Section */}
                                    <div className="lg:w-[45%] p-12 lg:p-16 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-10">
                                            <span className={`${config.textColor} text-xs font-black uppercase tracking-[0.2em]`}>
                                                {posts[0].category || 'FEATURED'}
                                            </span>
                                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                                            <span className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
                                                {new Date(posts[0].created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                            </span>
                                        </div>
                                        <h2 className="text-4xl lg:text-6xl font-black text-white mb-10 leading-[1.05] tracking-tight group-hover:text-white/95">
                                            {posts[0].title}
                                        </h2>
                                        <p className="text-slate-400 text-lg mb-12 line-clamp-3 leading-relaxed">
                                            {posts[0].excerpt}
                                        </p>
                                        <div className="flex items-center justify-between mt-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 border border-white/5">
                                                    <Search size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold text-sm">Matthew Kobilan</div>
                                                    <div className="text-slate-500 text-xs font-semibold">Editorial Team</div>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-2 ${config.textColor} text-xs font-black uppercase tracking-[0.3em] group-hover:translate-x-1 transition-transform`}>
                                                <span>READ STORY</span>
                                                <ArrowRight size={16} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>

                            {/* Remaining Posts Grid */}
                            {posts.length > 1 && (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {posts.slice(1).map((post, index) => (
                                        <Link href={`/blog/${post.slug}`} key={post.id}>
                                            <article
                                                className="group cursor-pointer bg-slate-900/20 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:bg-slate-900/40 border border-white/5 flex flex-col h-full"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                {/* Image */}
                                                {post.image_url && (
                                                    <div className="aspect-video overflow-hidden">
                                                        <img
                                                            src={post.image_url}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                    </div>
                                                )}

                                                {/* Content */}
                                                <div className="p-10 flex flex-col flex-1">
                                                    <div className="flex items-center gap-2 mb-6">
                                                        <span className={`${config.textColor} text-[10px] font-black uppercase tracking-[0.2em]`}>
                                                            {post.category || 'ARTICLE'}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-2xl lg:text-3xl font-black text-white mb-6 leading-tight tracking-tight group-hover:text-white/95">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-slate-400 text-base mb-12 line-clamp-3 leading-relaxed">
                                                        {post.excerpt}
                                                    </p>

                                                    <div className="flex items-center justify-between mt-auto">
                                                        <div className="text-slate-500 text-[10px] font-bold tracking-[0.2em]">
                                                            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                                                        </div>
                                                        <div className="w-12 h-12 rounded-full bg-slate-800/30 border border-white/5 flex items-center justify-center text-slate-500 group-hover:bg-slate-800 group-hover:text-white transition-all transform group-hover:scale-110">
                                                            <ArrowRight size={20} strokeWidth={2.5} />
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
                        <div className="py-24 text-center">
                            <h3 className="text-2xl font-bold mb-3">No Articles Yet</h3>
                            <p className="text-slate-500 text-lg mb-8">Check back soon for expert insights!</p>
                            <Link href="/" className={`${config.textColor} font-black tracking-widest uppercase text-sm flex items-center justify-center gap-2 hover:opacity-80 transition-opacity`}>
                                <ArrowLeft size={16} />
                                Back to Home
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
