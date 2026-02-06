import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import styles from "../[topic]/topic.module.css";

const topicConfig = {
    hubplate: {
        title: "HubPlate",
        subtitle: "Tips & Tools for Restaurateurs",
        colorClass: styles.hubplate,
    }
};

export default async function DebugPage() {
    const topic = 'hubplate';
    const config = topicConfig.hubplate;
    const supabase = await createClient();

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
            <div className="bg-red-600 text-white font-bold p-4 text-center fixed top-0 left-0 right-0 z-[9999]">
                DEBUG MODE: IF YOU SEE THIS, THE CODE IS WORKING
            </div>

            {/* Hero Section */}
            <section className={styles.heroSection}>
                {heroImageUrl && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={heroImageUrl}
                            alt={`${config.title} Hero`}
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent" />
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

            {/* SPACER DIV to force separation */}
            <div style={{ height: '100px', background: 'transparent' }} />

            {/* Posts Content */}
            <section className="pb-32 px-4">
                <div className="container max-w-6xl mx-auto">
                    {posts && posts.length > 0 ? (
                        <div className="flex flex-col gap-16">
                            {/* Featured Post Card - NO BORDERS */}
                            <Link href={`/blog/${posts[0].slug}`}>
                                <article
                                    className="bg-[#0f172a] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl mb-[100px]"
                                    style={{ display: 'flex', flexDirection: 'row', borderRadius: '50px' }}
                                >
                                    {/* LEFT: Image */}
                                    {posts[0].image_url && (
                                        <div
                                            style={{
                                                width: '45%',
                                                minWidth: '45%',
                                                maxWidth: '45%',
                                                height: '400px',
                                                flexShrink: 0,
                                                borderRadius: '50px 0 0 50px',
                                                overflow: 'hidden'
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
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                {new Date(posts[0].created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
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
                                                    <div className="text-white font-bold text-sm">Matthew Kobilan</div>
                                                    <div className="text-slate-500 text-[10px] font-semibold italic">Editorial Team</div>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] ${config.colorClass}`}>
                                                <span>READ STORY</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>

                            {/* Grid Cards - Removed borders to be safe */}
                            <div
                                className="grid grid-cols-2 lg:grid-cols-3 px-4"
                                style={{ gap: '100px' }}
                            >
                                {posts.slice(1).map((post) => (
                                    <Link href={`/blog/${post.slug}`} key={post.id}>
                                        <article className={styles.gridCard} style={{ border: 'none' }}>
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
                                                        <div className={styles.gridCardAuthorAvatar} />
                                                        <span className={styles.gridCardAuthorName}>MK</span>
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
                        <div className="text-center text-white p-20">No posts found</div>
                    )}
                </div>
            </section>
        </div>
    );
}
