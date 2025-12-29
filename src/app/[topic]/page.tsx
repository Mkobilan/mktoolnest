import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

const topicConfig = {
    baybolt: {
        title: "Baybolt",
        subtitle: "Tips & Tools for Mechanics",
        gradient: "from-orange-500 via-orange-600 to-blue-900",
        textColor: "text-orange-500",
    },
    hugloom: {
        title: "HugLoom",
        subtitle: "Tips & Tools for Caretakers",
        gradient: "from-pink-400 via-rose-400 to-red-400",
        textColor: "text-pink-400",
    },
    daylabor: {
        title: "Day Labor on Demand",
        subtitle: "Tips & Tools for Contractors",
        gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
        textColor: "text-purple-500",
    },
    raidmemegen: {
        title: "Raid Generator",
        subtitle: "Tips & Tools for Gamers",
        gradient: "from-[#00FF41] via-[#008F11] to-[#003B00]",
        textColor: "text-[#00FF41]",
    },
    hubplate: {
        title: "HubPlate",
        subtitle: "Tips & Tools for Restaurateurs",
        gradient: "from-red-600 via-orange-500 to-red-600",
        textColor: "text-red-500",
    },
};

export async function generateStaticParams() {
    return [
        { topic: 'baybolt' },
        { topic: 'hugloom' },
        { topic: 'daylabor' },
        { topic: 'raidmemegen' },
        { topic: 'hubplate' },
    ];
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
    const { topic } = await params;
    const config = topicConfig[topic as keyof typeof topicConfig];

    if (!config) {
        return {
            title: "Topic Not Found | MK Tool Nest",
        };
    }

    return {
        title: `${config.title} - ${config.subtitle} | MK Tool Nest`,
        description: `Explore expert guides, tips, and resources for ${config.title}. ${config.subtitle} at MK Tool Nest.`,
        openGraph: {
            title: `${config.title} - ${config.subtitle} | MK Tool Nest`,
            description: `Explore expert guides, tips, and resources for ${config.title}. ${config.subtitle} at MK Tool Nest.`,
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

    return (
        <div className="py-16 px-4">
            <div className="container max-w-7xl">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-foreground mb-12 transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="mb-16">
                    <div className={`inline-block px-5 py-2 rounded-full bg-gradient-to-r ${config.gradient} text-white text-sm font-bold mb-6 shadow-lg`}>
                        {config.subtitle}
                    </div>
                    <h1 className={`text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>{config.title}</h1>
                    <p className="text-xl text-gray-400 max-w-2xl">
                        Explore our latest articles, expert guides, and professional insights.
                    </p>
                </div>

                {/* Posts Grid */}
                {posts && posts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                            <Link href={`/blog/${post.slug}`} key={post.id}>
                                <article className={`card h-full group cursor-pointer ${topic}-card`} style={{ animationDelay: `${index * 50}ms` }}>
                                    <div className="p-6 text-center">
                                        {post.image_url && (
                                            <div style={{ marginBottom: '1rem' }}>
                                                <img
                                                    src={post.image_url}
                                                    alt={post.title}
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        display: 'block',
                                                        margin: '0 auto'
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className={`flex items-center justify-center gap-2 text-xs font-medium mb-4 ${config.textColor}`}>
                                            <Calendar size={14} />
                                            <time>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                                        </div>
                                        <h2 className={`text-xl font-bold mb-3 ${config.textColor} group-hover:brightness-110 transition-all leading-tight`}>
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-400 text-sm mb-5 line-clamp-3 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                        <div className={`flex items-center justify-center ${config.textColor} text-sm font-semibold group-hover:gap-3 transition-all`}>
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
                        <p className="text-gray-500 text-lg">Check back soon for expert insights and professional tips!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
