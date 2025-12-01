"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { PlusCircle, Edit, Trash2, LogOut, Save, X } from "lucide-react";

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
    const [showEditor, setShowEditor] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        topic: "baybolt",
        published: true,
        image_url: "",
    });

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingPost) {
            // Update existing post
            const { error } = await supabase
                .from("posts")
                .update(formData)
                .eq("id", editingPost.id);

            if (!error) {
                loadPosts();
                resetForm();
            }
        } else {
            // Create new post
            const { error } = await supabase
                .from("posts")
                .insert([formData]);

            if (!error) {
                loadPosts();
                resetForm();
            }
        }
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            topic: post.topic,
            published: post.published,
            image_url: post.image_url || "",
        });
        setShowEditor(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this post?")) {
            await supabase.from("posts").delete().eq("id", id);
            loadPosts();
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            topic: "baybolt",
            published: true,
            image_url: "",
        });
        setEditingPost(null);
        setShowEditor(false);
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="py-12 px-4">
            <div className="container max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-gray-400">Manage your blog posts</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowEditor(true)}
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

                {/* Editor Modal */}
                {showEditor && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="card p-8 max-w-3xl w-full my-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">
                                    {editingPost ? "Edit Post" : "Create New Post"}
                                </h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-foreground">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => {
                                            setFormData({ ...formData, title: e.target.value });
                                            if (!editingPost) {
                                                setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) });
                                            }
                                        }}
                                        className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Topic</label>
                                    <select
                                        value={formData.topic}
                                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                        className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="baybolt">Baybolt - Mechanics</option>
                                        <option value="hugloom">HugLoom - Caretakers</option>
                                        <option value="daylabor">Day Labor - Contractors</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Excerpt</label>
                                    <textarea
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Content</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
                                        rows={12}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Image URL (optional)</label>
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="published"
                                        checked={formData.published}
                                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="published" className="text-sm font-medium">
                                        Publish immediately
                                    </label>
                                </div>

                                <div className="flex gap-4">
                                    <button type="submit" className="btn btn-primary flex items-center gap-2 flex-1">
                                        <Save size={18} />
                                        {editingPost ? "Update Post" : "Create Post"}
                                    </button>
                                    <button type="button" onClick={resetForm} className="btn btn-outline">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Posts List */}
                <div className="space-y-4">
                    {posts.length === 0 ? (
                        <div className="card p-12 text-center">
                            <p className="text-gray-400">No posts yet. Create your first post!</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="card p-6 flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold">{post.title}</h3>
                                        {!post.published && (
                                            <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-500 rounded">
                                                Draft
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">{post.excerpt}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="capitalize">{post.topic}</span>
                                        <span>•</span>
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="btn btn-outline p-2"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="btn btn-outline p-2 text-red-500 hover:bg-red-500/10"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
