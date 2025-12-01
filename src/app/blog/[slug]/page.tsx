import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { notFound } from "next/navigation";

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const { slug } = params;

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
        baybolt: { name: "Baybolt", gradient: "from-red-500 to-orange-500" },
        hugloom: { name: "HugLoom", gradient: "from-emerald-500 to-teal-500" },
        daylabor: { name: "Day Labor on Demand", gradient: "from-amber-500 to-yellow-500" },
    };

    const config = topicConfig[post.topic as keyof typeof topicConfig];

    return (
        <div className="py-12 px-4">
            <div className="container max-w-4xl">
                {/* Back Button */}
                <Link
                    href={`/${post.topic}`}
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to {config.name}
                </Link>

                {/* Article Header */}
                <article>
                    <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${config.gradient} text-white text-sm font-medium mb-4`}>
                        {config.name}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <time>{new Date(post.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</time>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post.image_url && (
                        <div className="aspect-video overflow-hidden rounded-lg mb-12">
                            <img
                                src={post.image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-invert prose-lg max-w-none">
                        <div
                            className="blog-content"
                            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
                        />
                    </div>
                </article>
            </div>
        </div>
    );
}
