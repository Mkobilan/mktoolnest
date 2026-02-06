"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { PlusCircle, Edit, Trash2, LogOut, ChevronDown } from "lucide-react";
import styles from "../admin.module.css";

export const dynamic = 'force-dynamic';

type Post = {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    topic: string;
    published: boolean;
    created_at: string;
    image_url?: string;
};

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const [filterTopic, setFilterTopic] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");

    useEffect(() => {
        checkUser();
        loadPosts();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/admin/login");
        } else {
            setUser(user);
        }
        setLoading(false);
    };

    const loadPosts = async () => {
        const { data } = await supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setPosts(data);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    const handleEdit = (postId: string) => {
        router.push(`/admin/post?id=${postId}`);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this post?")) {
            await supabase.from("posts").delete().eq("id", id);
            loadPosts();
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    const filteredPosts = posts
        .filter(post => filterTopic === "all" || post.topic === filterTopic)
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className="py-12 px-4">
            <div className="container max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-gray-400">Manage your blog posts</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/admin/settings")}
                            className="btn btn-outline flex items-center gap-2"
                        >
                            Hero Settings
                        </button>
                        <button
                            onClick={() => router.push("/admin/post")}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <PlusCircle size={18} />
                            New Post
                        </button>
                        <button
                            onClick={handleLogout}
                            className="btn btn-outline flex items-center gap-2"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-6" style={{ marginBottom: '5rem' }}>
                    <div className="relative">
                        <select
                            value={filterTopic}
                            onChange={(e) => setFilterTopic(e.target.value)}
                            className="appearance-none btn btn-outline pl-4 pr-10 py-3 bg-card border-primary/30 hover:border-primary text-foreground min-w-[160px]"
                        >
                            <option value="all">All Topics</option>
                            <option value="hubplate">HubPlate</option>
                            <option value="hangroom">Hangroom</option>
                            <option value="baybolt">Baybolt</option>
                            <option value="hugloom">HugLoom</option>
                            <option value="daylabor">Day Labor</option>
                            <option value="raidmemegen">Raid Generator</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" size={18} />
                    </div>

                    <div className="relative">
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="appearance-none btn btn-outline pl-4 pr-10 py-3 bg-card border-primary/30 hover:border-primary text-foreground min-w-[160px]"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" size={18} />
                    </div>
                </div>

                {/* Posts List */}
                <div className="space-y-4">
                    {filteredPosts.length === 0 ? (
                        <div className={`p-12 text-center border border-white/10 rounded-xl bg-white/5`}>
                            <p className="text-gray-400">No posts found matching your filters.</p>
                        </div>
                    ) : (
                        filteredPosts.map((post) => {
                            // Map topic to style class
                            const topicCardClass = styles[`${post.topic}Card`] || '';
                            const badgeClass = styles[`${post.topic}Badge`] || '';

                            return (
                                <div key={post.id} className={`${styles.adminCard} ${topicCardClass} flex items-center justify-between`}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">{post.title}</h3>
                                            {!post.published && (
                                                <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-yellow-500/20 text-yellow-500 rounded tracking-wider">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 mb-4 line-clamp-1">{post.excerpt}</p>

                                        <div className="flex items-center gap-4 text-xs font-medium">
                                            <span className={`${styles.topicBadge} ${badgeClass}`}>
                                                {post.topic}
                                            </span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-6">
                                        <button
                                            onClick={() => handleEdit(post.id)}
                                            className="btn btn-outline p-3 hover:bg-white/10 border-white/10"
                                            title="Edit Post"
                                        >
                                            <Edit size={18} className="text-blue-400" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="btn btn-outline p-3 hover:bg-red-500/10 border-white/10"
                                            title="Delete Post"
                                        >
                                            <Trash2 size={18} className="text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
