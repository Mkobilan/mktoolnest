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
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[400px] overflow-hidden">
                {/* Background Image */}
                {heroImageUrl && (
                    <img
                        src={heroImageUrl}
                        alt={`${config.title} Hero`}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} ${heroImageUrl ? 'opacity-60' : 'opacity-30'}`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4">
                        <span className="text-white">THE </span>
                        {/* Changed from gradient text to solid color for better visibility */}
                        <span className={config.textColor}>
                            {config.title.toUpperCase()}
                        </span>
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">BLOG</h2>
                    <p className="text-gray-300 text-lg max-w-xl font-medium">
                        Insights, updates, and stories from the {config.title} community.
                    </p>
                </div>
            </section>

            {/* Filters & Search */}
            <section className="py-8 px-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 transition-all">
                <div className="container max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Filter Pills */}
                    <div className="flex items-center gap-3">
                        <button className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-all ${config.bgColor} text-white`}>
                            ALL
                        </button>
                        <button className="px-6 py-2.5 rounded-full text-sm font-semibold bg-slate-800 border border-slate-700 text-gray-300 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all shadow-sm">
                            GENERAL
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full md:w-80 pl-12 pr-6 py-3 bg-slate-950/50 border border-slate-800 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent focus:bg-slate-950 transition-all shadow-inner"
                        />
                    </div>
                </div>
            </section>

            {/* Posts Content */}
            <section className="py-12 px-4 bg-[#020617]">
                <div className="container max-w-7xl">
                    {posts && posts.length > 0 ? (
                        <div className="space-y-12">
                            {/* Featured Post */}
                            <Link href={`/blog/${posts[0].slug}`}>
                                <article className="group cursor-pointer bg-slate-900/40 border border-slate-800/40 rounded-[2.5rem] overflow-hidden hover:bg-slate-900/60 transition-all duration-500 shadow-2xl flex flex-col lg:flex-row h-full">
                                    {/* Image Section */}
                                    {posts[0].image_url && (
                                        <div className="lg:w-1/2 h-[350px] lg:h-auto overflow-hidden">
                                            <img
                                                src={posts[0].image_url}
                                                alt={posts[0].title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    )}
                                    {/* Content Section */}
                                    <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col">
                                        <div className="flex items-center gap-3 mb-8">
                                            <span className={`${config.textColor} text-xs font-black uppercase tracking-widest`}>
                                                {posts[0].category || 'FEATURED'}
                                            </span>
                                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                                            <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                                                {new Date(posts[0].created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                            </span>
                                        </div>
                                        <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-[1.1] transition-colors group-hover:text-white/95">
                                            {posts[0].title}
                                        </h2>
                                        <p className="text-slate-400 text-lg mb-12 line-clamp-3 leading-relaxed font-medium">
                                            {posts[0].excerpt}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400">
                                                    <Search size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold text-sm">Matthew Kobilan</div>
                                                    <div className="text-slate-500 text-xs font-semibold">Editorial Team</div>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-2 ${config.textColor} text-[10px] font-black uppercase tracking-[0.2em]`}>
                                                <span>READ STORY</span>
                                                <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
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
                                                className="group cursor-pointer bg-slate-900/40 border border-slate-800/40 rounded-[2.5rem] overflow-hidden hover:bg-slate-900/60 transition-all duration-500 flex flex-col h-full shadow-lg"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                {/* Image */}
                                                {post.image_url && (
                                                    <div className="aspect-[16/10] overflow-hidden">
                                                        <img
                                                            src={post.image_url}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                        />
                                                    </div>
                                                )}

                                                {/* Content */}
                                                <div className="p-10 flex flex-col flex-1">
                                                    <div className="flex items-center gap-2 mb-6">
                                                        <span className={`${config.textColor} text-[10px] font-black uppercase tracking-widest`}>
                                                            {post.category || 'ARTICLE'}
                                                        </span>
                                                        <div className="w-1 h-1 rounded-full bg-slate-700" />
                                                        <span className="text-slate-500 text-[10px] font-bold">
                                                            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-2xl lg:text-3xl font-black text-white mb-6 leading-tight group-hover:text-white/95">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-slate-400 text-base mb-10 line-clamp-3 leading-relaxed font-medium">
                                                        {post.excerpt}
                                                    </p>

                                                    <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-800/50">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400">
                                                                <Search size={16} />
                                                            </div>
                                                            <div>
                                                                <div className="text-white font-bold text-xs">Matthew Kobilan</div>
                                                            </div>
                                                        </div>
                                                        <div className={`${config.textColor} group-hover:scale-110 transition-transform`}>
                                                            <ArrowRight size={18} strokeWidth={3} />
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
                        <div className="card p-20 text-center">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-2xl font-bold mb-3">No Articles Yet</h3>
                            <p className="text-gray-500 text-lg mb-6">Check back soon for expert insights and professional tips!</p>
                            <Link href="/" className={`inline-flex items-center gap-2 ${config.textColor} font-semibold`}>
                                <ArrowLeft size={18} />
                                Back to Home
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
