import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { linkify } from "@/utils/linkify";
import { Metadata } from "next";
import ShareModal from "./ShareModal";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: post } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

    if (!post) {
        return {
            title: 'Not Found',
        }
    }

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `/blog/${slug}`,
            images: post.image_url ? [post.image_url] : [],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: post.image_url ? [post.image_url] : [],
        },
    }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const supabase = await createClient();
    const { data: post } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

    if (!post) {
        notFound();
    }

    const topicConfig = {
        baybolt: {
            name: "Baybolt",
            gradient: "from-orange-500 via-orange-600 to-blue-900",
            textColor: "text-orange-500"
        },
        hugloom: {
            name: "HugLoom",
            gradient: "from-pink-400 via-rose-400 to-red-400",
            textColor: "text-pink-400"
        },
        daylabor: {
            name: "Day Labor on Demand",
            gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
            textColor: "text-purple-500"
        },
        raidmemegen: {
            name: "Raid Generator",
            gradient: "from-[#00FF41] via-[#008F11] to-[#003B00]",
            textColor: "text-[#00FF41]"
        },
        hubplate: {
            name: "HubPlate",
            gradient: "from-red-600 via-orange-500 to-red-600",
            textColor: "text-red-500"
        },
    };

    const config = topicConfig[post.topic as keyof typeof topicConfig];

    return (
        <div className="py-16 px-4">
            <div className="container max-w-4xl">
                {/* Back Button */}
                <Link
                    href={`/${post.topic}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-foreground mb-12 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to {config.name}
                </Link>

                {/* Article Header */}
                <article className={`fade-in-up blog-post-${post.topic}`}>
                    <div className={`inline-block px-5 py-2 rounded-full topic-badge text-white text-sm font-bold mb-6 shadow-lg`}>
                        {config.name}
                    </div>

                    <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                        {post.title}
                    </h1>

                    {/* Featured Image - Small Thumbnail */}
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
                                    display: 'block'
                                }}
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-6 text-sm metadata-text mb-12 font-medium">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <time>{new Date(post.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</time>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
                        </div>
                        <div className="ml-auto">
                            <ShareModal
                                title={post.title}
                                buttonClassName={`border border-white/20`}
                                gradientClass={config.gradient}
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="text-xl text-gray-300 leading-relaxed mb-12 p-6 border-l-4 border-primary bg-white/5 rounded-r-lg">
                        {post.excerpt}
                    </div>

                    {/* Content */}
                    <div className="blog-content prose-lg">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: linkify(post.content).replace(/\n/g, '<br />')
                            }}
                        />
                    </div>

                    {/* Back to Topic CTA */}
                    <div className="mt-16 pt-12 border-t border-white/10">
                        <Link
                            href={`/${post.topic}`}
                            className={`inline-flex items-center gap-2 ${config.textColor} font-semibold hover:gap-3 transition-all`}
                        >
                            <ArrowLeft size={18} />
                            <span>View More {config.name} Articles</span>
                        </Link>
                    </div>
                </article>
            </div>
        </div>
    );
}

