import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

const topicConfig = {
    baybolt: {
        title: "Baybolt",
        subtitle: "Tips & Tools for Mechanics",
        color: "red",
        gradient: "from-red-500 to-orange-500",
    },
    hugloom: {
        title: "HugLoom",
        subtitle: "Tips & Tools for Caretakers",
        color: "emerald",
        gradient: "from-emerald-500 to-teal-500",
    },
    daylabor: {
        title: "Day Labor on Demand",
        subtitle: "Tips & Tools for Contractors",
        color: "amber",
        gradient: "from-amber-500 to-yellow-500",
    },
};

export async function generateStaticParams() {
    return [
        { topic: 'baybolt' },
        { topic: 'hugloom' },
        { topic: 'daylabor' },
    ];
}

export default async function TopicPage({ params }: { params: { topic: string } }) {
    const { topic } = params;

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
        <div className="py-12 px-4">
            <div className="container">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${config.gradient} text-white text-sm font-medium mb-4`}>
                        {config.subtitle}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{config.title}</h1>
                    <p className="text-gray-400 text-lg">
                        Explore our latest articles, guides, and insights.
                    </p>
                </div>

                {/* Posts Grid */}
                {posts && posts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id}>
                                <article className="card h-full group cursor-pointer">
                                    {post.image_url && (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={post.image_url}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                            <Calendar size={14} />
                                            <time>{new Date(post.created_at).toLocaleDateString()}</time>
                                        </div>
                                        <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                                            <span>Read More</span>
                                            <ArrowRight size={16} className="ml-1" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No articles yet. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
