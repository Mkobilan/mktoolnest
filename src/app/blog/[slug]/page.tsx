import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { linkify } from "@/utils/linkify";
import { Metadata } from "next";
import ShareModal from "./ShareModal";
import styles from "./blog.module.css";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: post } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

    const baseUrl = 'https://mktoolnest.vercel.app';

    if (!post) {
        return { title: 'Not Found | MK Tool Nest' }
    }

    const imageUrl = post.image_url || `${baseUrl}/icon.png`;

    return {
        title: `${post.title} | MK Tool Nest`,
        description: post.excerpt,
        alternates: {
            canonical: post.external_link ? post.external_link : `${baseUrl}/blog/${slug}`
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `${baseUrl}/blog/${slug}`,
            images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
            type: 'article',
            publishedTime: post.created_at,
            authors: ['MK Tool Nest'],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [imageUrl],
        },
    }
}

const topicStyles: Record<string, { gradient: string; text: string; meta: string; badge: string }> = {
    hubplate: {
        gradient: styles.gradientHubplate,
        text: styles.textHubplate,
        meta: styles.metaHubplate,
        badge: 'topic-hubplate',
    },
    baybolt: {
        gradient: styles.gradientBaybolt,
        text: styles.textBaybolt,
        meta: styles.metaBaybolt,
        badge: 'topic-baybolt',
    },
    hugloom: {
        gradient: styles.gradientHugloom,
        text: styles.textHugloom,
        meta: styles.metaHugloom,
        badge: 'topic-hugloom',
    },
    daylabor: {
        gradient: styles.gradientDaylabor,
        text: styles.textDaylabor,
        meta: styles.metaDaylabor,
        badge: 'topic-daylabor',
    },
    raidmemegen: {
        gradient: styles.gradientRaidmemegen,
        text: styles.textRaidmemegen,
        meta: styles.metaRaidmemegen,
        badge: 'topic-raidmemegen',
    },
    hangroom: {
        gradient: styles.gradientHangroom,
        text: styles.textHangroom,
        meta: styles.metaHangroom,
        badge: 'topic-hangroom',
    },
};

const topicNames: Record<string, string> = {
    hubplate: 'HubPlate',
    baybolt: 'Baybolt',
    hugloom: 'HugLoom',
    daylabor: 'Day Labor on Demand',
    raidmemegen: 'Raid Generator',
    hangroom: 'Hangroom',
};

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

    const style = topicStyles[post.topic] || topicStyles.hubplate;
    const topicName = topicNames[post.topic] || 'Blog';

    return (
        <div className={styles.articleContainer}>
            {/* Hero Section */}
            <div
                className={styles.heroSection}
                style={{ backgroundImage: `url(${post.image_url || '/icon.png'})` }}
            >
                <div className={styles.heroOverlay} />

                <div className={styles.heroContent}>
                    {/* Back Button */}
                    <Link href={`/${post.topic}`} className={styles.backButton}>
                        <ArrowLeft size={16} />
                        Back to {topicName}
                    </Link>

                    {/* Article Header in Hero */}
                    <header className={styles.articleHeader}>
                        <div className={`${styles.topicBadge} ${style.badge}`}>
                            {topicName}
                        </div>

                        <h1 className={styles.articleTitle}>
                            {post.title}
                        </h1>

                        <div className={styles.metadata}>
                            <div className={styles.metadataItem}>
                                <Calendar size={16} />
                                <time>{new Date(post.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</time>
                            </div>
                            <div className={styles.metadataItem}>
                                <Clock size={16} />
                                <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
                            </div>
                            <div className="ml-auto">
                                <ShareModal
                                    title={post.title}
                                    buttonClassName="border border-white/20 text-white hover:bg-white/10"
                                    gradientClass={style.gradient}
                                />
                            </div>
                        </div>
                    </header>
                </div>
            </div>

            <div className={styles.articleInner}>
                {/* Excerpt */}
                <div className={styles.excerpt}>
                    {post.excerpt}
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <MarkdownRenderer content={post.content} />
                </div>

                {/* External Link Action */}
                {post.external_link && (
                    <div className="mt-12 p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <h3 className="text-xl font-bold mb-4 text-white">Continue Reading</h3>
                        <p className="text-gray-400 mb-8">This is an excerpt from a full article posted on our partner site.</p>
                        <Link
                            href={post.external_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-block px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95 ${style.gradient}`}
                        >
                            Read Full Article at {topicNames[post.topic]}
                        </Link>
                    </div>
                )}

                {/* Back to Topic CTA */}
                <div className={styles.bottomCta}>
                    <Link href={`/${post.topic}`} className={`${styles.bottomCtaLink} ${style.text}`}>
                        <ArrowLeft size={18} />
                        <span>View More {topicName} Articles</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
