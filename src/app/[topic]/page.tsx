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
                        <span className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                            {config.title.toUpperCase()}
                        </span>
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">BLOG</h2>
                    <p className="text-gray-400 text-lg max-w-xl">
                        Insights, updates, and stories from the {config.title} community.
                    </p>
                </div>
            </section>

            {/* Filters & Search */}
            <section className="py-8 px-4 border-b border-white/10">
                <div className="container max-w-7xl flex flex-wrap items-center justify-between gap-4">
                    {/* Filter Pills */}
                    <div className="flex items-center gap-2">
                        <button className={`px-4 py-2 rounded-full text-sm font-medium ${config.bgColor} text-white`}>
                            All
                        </button>
                        <button className="px-4 py-2 rounded-full text-sm font-medium bg-slate-800 text-gray-300 hover:bg-slate-700 transition-colors">
                            General
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-600 w-64"
                        />
                    </div>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="py-12 px-4">
                <div className="container max-w-7xl">
                    {posts && posts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post, index) => (
                                <Link href={`/blog/${post.slug}`} key={post.id}>
                                    <article className={`card h-full group cursor-pointer ${config.cardClass}`} style={{ animationDelay: `${index * 50}ms` }}>
                                        {/* Image */}
                                        {post.image_url && (
                                            <div className="aspect-[16/10] overflow-hidden">
                                                <img
                                                    src={post.image_url}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className={`flex items-center gap-2 text-xs font-medium mb-3 ${config.textColor}`}>
                                                <Calendar size={14} />
                                                <time>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                                            </div>
                                            <h3 className={`text-xl font-bold mb-3 ${config.textColor} group-hover:brightness-110 transition-all leading-tight`}>
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                            <div className={`flex items-center ${config.textColor} text-sm font-semibold group-hover:gap-3 transition-all`}>
                                                <span>Read Article</span>
                                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
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
