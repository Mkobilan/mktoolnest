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
    },
    hugloom: {
        title: "HugLoom",
        subtitle: "Tips & Tools for Caretakers",
        gradient: "from-pink-400 via-rose-400 to-red-400",
        textColor: "text-pink-400",
        bgColor: "bg-pink-400",
    },
    daylabor: {
        title: "Day Labor on Demand",
        subtitle: "Tips & Tools for Contractors",
        gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
        textColor: "text-purple-500",
        bgColor: "bg-purple-500",
    },
    raidmemegen: {
        title: "Raid Generator",
        subtitle: "Tips & Tools for Gamers",
        gradient: "from-[#00FF41] via-[#008F11] to-[#003B00]",
        textColor: "text-[#00FF41]",
        bgColor: "bg-[#00FF41]",
    },
    hubplate: {
        title: "HubPlate",
        subtitle: "Tips & Tools for Restaurateurs",
        gradient: "from-red-600 via-orange-500 to-red-600",
        textColor: "text-red-500",
        bgColor: "bg-red-500",
    },
    hangroom: {
        title: "Hangroom",
        subtitle: "Tips & Tools for Creators",
        gradient: "from-pink-500 via-fuchsia-500 to-purple-600",
        textColor: "text-pink-500",
        bgColor: "bg-pink-500",
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
    const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .eq("topic", topic)
        .eq("published", true)
        .order("created_at", { ascending: false });

    const featuredPost = posts && posts.length > 0 ? posts[0] : null;
    const remainingPosts = posts && posts.length > 1 ? posts.slice(1) : [];

    return (
        <div className="min-h-screen">
            {/* Hero Section with Background */}
            <section className="relative h-[400px] overflow-hidden">
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-20`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>

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

            {/* Main Content */}
            <section className="py-12 px-4">
                <div className="container max-w-7xl">
                    {/* Featured Post */}
                    {featuredPost ? (
                        <Link href={`/blog/${featuredPost.slug}`} className="block mb-12">
                            <article className="grid md:grid-cols-2 gap-8 items-center group">
                                {/* Image */}
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800">
                                    {featuredPost.image_url ? (
                                        <img
                                            src={featuredPost.image_url}
                                            alt={featuredPost.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className={`w-full h-full bg-gradient-to-br ${config.gradient} opacity-30`}></div>
                                    )}
                                    <div className={`absolute top-4 left-4 px-3 py-1 ${config.bgColor} text-white text-xs font-bold rounded`}>
                                        FEATURED
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <div className={`flex items-center gap-2 text-sm ${config.textColor} mb-4`}>
                                        <span className="uppercase font-bold">General</span>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-gray-500 flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(featuredPost.created_at).toLocaleDateString('en-US', {
                                                month: 'numeric',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4 group-hover:text-gray-200 transition-colors">
                                        {featuredPost.title}
                                    </h3>
                                    <p className="text-gray-400 text-lg leading-relaxed mb-6 line-clamp-3">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className={`flex items-center gap-2 ${config.textColor} font-bold text-sm uppercase`}>
                                        <span>Read Full Story</span>
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ) : null}

                    {/* Remaining Posts Grid */}
                    {remainingPosts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {remainingPosts.map((post, index) => (
                                <Link href={`/blog/${post.slug}`} key={post.id}>
                                    <article className="group">
                                        {/* Image */}
                                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-800 mb-4">
                                            {post.image_url ? (
                                                <img
                                                    src={post.image_url}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className={`w-full h-full bg-gradient-to-br ${config.gradient} opacity-20`}></div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className={`flex items-center gap-2 text-xs ${config.textColor} mb-2`}>
                                            <span className="uppercase font-bold">General</span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-gray-500">
                                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                                    month: 'numeric',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-200 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    ) : null}

                    {/* Empty State */}
                    {(!posts || posts.length === 0) && (
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
