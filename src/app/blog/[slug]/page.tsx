import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";

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
            gradient: "from-red-500 via-red-600 to-orange-600",
            textColor: "text-red-500"
        },
        hugloom: {
            name: "HugLoom",
            gradient: "from-emerald-500 via-emerald-600 to-teal-600",
            textColor: "text-emerald-500"
        },
        daylabor: {
            name: "Day Labor on Demand",
            gradient: "from-amber-500 via-amber-600 to-yellow-600",
            textColor: "text-amber-500"
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
                <article className="fade-in-up">
                    <div className={`inline-block px-5 py-2 rounded-full bg-gradient-to-r ${config.gradient} text-white text-sm font-bold mb-6 shadow-lg`}>
                        {config.name}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-12 font-medium">
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
                    </div>

                    {/* Featured Image */}
                    {post.image_url && (
                        <div className="aspect-video overflow-hidden rounded-2xl mb-16 shadow-2xl">
                            <img
                                src={post.image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Excerpt */}
                    <div className="text-xl text-gray-300 leading-relaxed mb-12 p-6 border-l-4 border-primary bg-white/5 rounded-r-lg">
                        {post.excerpt}
                    </div>

                    {/* Content */}
                    <div className="blog-content prose-lg">
                        <div
                            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
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
