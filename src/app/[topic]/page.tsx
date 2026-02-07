import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import { notFound } from "next/navigation";
import styles from "./topic.module.css";

const topicConfig = {
    hugloom: {
        title: "HugLoom",
        subtitle: "Tips & Tools for Caretakers",
        colorClass: styles.hugloom,
        hoverClass: styles.hugloomHover,
        featuredHoverClass: styles.hugloomFeatured,
    },
    daylabor: {
        title: "Day Labor on Demand",
        subtitle: "Tips & Tools for Contractors",
        colorClass: styles.daylabor,
        hoverClass: styles.daylaborHover,
        featuredHoverClass: styles.daylaborFeatured,
    },
    raidmemegen: {
        title: "Raid Generator",
        subtitle: "Tips & Tools for Gamers",
        colorClass: styles.raidmemegen,
        hoverClass: styles.raidmemegenHover,
        featuredHoverClass: styles.raidmemegenFeatured,
    },
    hubplate: {
        title: "HubPlate",
        subtitle: "Tips & Tools for Restaurateurs",
        colorClass: styles.hubplate,
        hoverClass: styles.hubplateHover,
        featuredHoverClass: styles.hubplateFeatured,
    },
    hangroom: {
        title: "Hangroom",
        subtitle: "Tips & Tools for Creators",
        colorClass: styles.hangroom,
        hoverClass: styles.hangroomHover,
        featuredHoverClass: styles.hangroomFeatured,
    },
    baybolt: {
        title: "Baybolt",
        subtitle: "Tips & Tools for Mechanics",
        colorClass: styles.baybolt,
        hoverClass: styles.bayboltHover,
        featuredHoverClass: styles.bayboltFeatured,
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
        return { title: "Topic Not Found | MK Tool Nest" };
    }

    return {
        title: `${config.title} - ${config.subtitle} | MK Tool Nest`,
        description: `Explore expert guides, tips, and resources for ${config.title}. ${config.subtitle} at MK Tool Nest.`,
        alternates: { canonical: `${baseUrl}/${topic}` },
        openGraph: {
            title: `${config.title} - ${config.subtitle} | MK Tool Nest`,
            description: `Explore expert guides, tips, and resources for ${config.title}. ${config.subtitle} at MK Tool Nest.`,
            url: `${baseUrl}/${topic}`,
            images: [{ url: `${baseUrl}/icon.png`, width: 512, height: 512, alt: config.title }],
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

    // Fetch hero image for this topic
    const { data: heroSetting } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", `hero_${topic}`)
        .single();

    const heroImageUrl = heroSetting?.setting_value || null;

    const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .eq("topic", topic)
        .eq("published", true)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            {/* Hero Section */}
            <section className={styles.heroSection}>
                {/* Hero Background Image */}
                {heroImageUrl && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={heroImageUrl}
                            alt={`${config.title} Hero`}
                            className="w-full h-full object-cover opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/40 via-[#020617]/20 to-transparent" />
                    </div>
                )}
                <div className="text-center relative z-10">
                    <h1 className={styles.heroTitle}>
                        <span className={styles.heroTitleFaded}>THE </span>
                        <span className={config.colorClass}>{config.title.toUpperCase()}</span>
                    </h1>
                    <h2 className={styles.heroSubtitle}>BLOG</h2>
                </div>
            </section>

            {/* Posts Content - Added mt-24 for SPACIOUS SEPARATION - DEBUG MODE */}
            <section className="mt-24 pb-32 px-4">
                <div className="container max-w-6xl mx-auto">
                    {posts && posts.length > 0 ? (
                        <div className="flex flex-col gap-16">
                            {/* Featured Post Card - Pure inline styles */}
                            <Link href={`/blog/${posts[0].slug}`}>
                                <article
                                    className={`${styles.featuredCard} ${config.featuredHoverClass} overflow-hidden transition-all duration-300 hover:-translate-y-1 mb-[100px] border border-white/5`}
                                    style={{ display: 'flex', flexDirection: 'row', borderRadius: '50px' }}
                                >
                                    {/* LEFT: Image - Fixed width, contained */}
                                    {posts[0].image_url && (
                                        <div
                                            style={{
                                                width: '45%',
                                                minWidth: '45%',
                                                maxWidth: '45%',
                                                height: '400px',
                                                flexShrink: 0,
                                                overflow: 'hidden',
                                                borderRadius: '50px 0 0 50px'
                                            }}
                                        >
                                            <img
                                                src={posts[0].image_url}
                                                alt={posts[0].title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* RIGHT: Content - Centered */}
                                    <div
                                        className="flex-1 flex flex-col justify-center items-center text-center"
                                        style={{ padding: '80px' }}
                                    >

                                        <div className="flex items-center justify-center gap-3 mb-8">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${config.colorClass}`}>
                                                {posts[0].category || 'STRATEGIES'}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <span suppressHydrationWarning className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                {new Date(posts[0].created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                                            </span>
                                        </div>

                                        <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-6">
                                            {posts[0].title}
                                        </h2>

                                        <div className="text-slate-400 text-base lg:text-lg leading-relaxed mb-8 line-clamp-3 max-w-2xl mx-auto">
                                            {posts[0].excerpt}
                                        </div>

                                        <div className="flex items-center justify-between w-full pt-6 mt-auto border-t border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold text-sm">By Matthew Kobilan</div>
                                                    <div className="text-slate-500 text-[10px] font-semibold italic">Editorial Team</div>
                                                </div>
                                            </div>
                                            <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] ${config.colorClass}`}>
                                                <span>READ STORY</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>

                            {/* Grid Cards */}
                            <div
                                className="grid grid-cols-2 lg:grid-cols-3 px-4"
                                style={{ gap: '100px' }}
                            >
                                {posts.slice(1).map((post) => (
                                    <Link href={`/blog/${post.slug}`} key={post.id}>
                                        <article className={`${styles.gridCard} ${config.hoverClass}`}>
                                            {post.image_url && (
                                                <div className={styles.gridCardImageWrapper}>
                                                    <img src={post.image_url} alt={post.title} />
                                                </div>
                                            )}
                                            <div className={styles.gridCardContent}>
                                                <div className={styles.gridCardMeta}>
                                                    <span className={`${styles.gridCardCategory} ${config.colorClass}`}>
                                                        {post.category || 'ARTICLE'}
                                                    </span>
                                                    <span className={styles.gridCardDate}>
                                                        {new Date(post.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className={styles.gridCardTitle}>{post.title}</h3>
                                                <p className={`${styles.gridCardExcerpt} line-clamp-3`}>{post.excerpt}</p>
                                                <div className={styles.gridCardFooter}>
                                                    <div className={styles.gridCardAuthor}>
                                                        <span className={styles.gridCardAuthorName}>By Matthew Kobilan</span>
                                                    </div>
                                                    <div className={`${styles.gridCardArrow} ${config.colorClass}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-40 text-center">
                            <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-widest">No Articles Found</h3>
                            <p className="text-slate-500 text-xl mb-16 max-w-lg mx-auto">We&apos;re currently preparing fresh content for this topic. Check back soon!</p>
                            <Link href="/" className={`${config.colorClass} font-black tracking-[0.5em] uppercase text-xs flex items-center justify-center gap-4 hover:opacity-70 transition-opacity`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                                BACK TO HUB
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
