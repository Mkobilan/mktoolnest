"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, X, Upload, Image as ImageIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

function PostEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get('id');
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

    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>("");

    useEffect(() => {
        if (postId) {
            loadPost(postId);
        }
    }, [postId]);

    const loadPost = async (id: string) => {
        setLoading(true);
        const { data } = await supabase
            .from("posts")
            .select("*")
            .eq("id", id)
            .single();

        if (data) {
            setFormData({
                title: data.title,
                slug: data.slug,
                content: data.content,
                excerpt: data.excerpt,
                topic: data.topic,
                published: data.published,
                image_url: data.image_url || "",
            });
            setIsEditing(true);
            setImagePreview(data.image_url || "");
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (isEditing && postId) {
            // Update existing post
            const { error } = await supabase
                .from("posts")
                .update(formData)
                .eq("id", postId);

            if (error) {
                console.error('Update error:', error);
                alert(`Error updating post: ${error.message}`);
            } else {
                router.push("/admin/dashboard");
            }
        } else {
            // Create new post
            const { error } = await supabase
                .from("posts")
                .insert([formData]);

            if (error) {
                console.error('Insert error:', error);
                alert(`Error creating post: ${error.message}`);
            } else {
                router.push("/admin/dashboard");
            }
        }
        setLoading(false);
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploading(true);

        try {
            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file);

            if (error) {
                console.error('Upload error:', error);
                alert('Failed to upload image');
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('blog-images')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image_url: publicUrl });
            setImagePreview(publicUrl);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    if (loading && isEditing) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="py-12 px-4 min-h-screen">
            <div className="container max-w-4xl">
                <div className="card p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold">
                            {isEditing ? "Edit Post" : "Create New Post"}
                        </h1>
                        <button
                            onClick={() => router.push("/admin/dashboard")}
                            className="btn btn-outline flex items-center gap-2"
                        >
                            <X size={18} />
                            Cancel
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
                                    if (!isEditing) {
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
                                <option value="hubplate">HubPlate - Restaurateurs</option>
                                <option value="baybolt">Baybolt - Mechanics</option>
                                <option value="hugloom">HugLoom - Caretakers</option>
                                <option value="daylabor">Day Labor - Contractors</option>
                                <option value="raidmemegen">Raid Generator - Gamers</option>
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
                                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[300px] overflow-y-auto prose-invert prose-sm max-w-none"
                                style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    outline: 'none',
                                    resize: 'vertical',
                                    maxWidth: '100%'
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Blog Image (optional)</label>

                            {imagePreview && (
                                <div className="mb-4 relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full max-h-64 object-cover rounded-lg border border-border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview("");
                                            setFormData({ ...formData, image_url: "" });
                                        }}
                                        className="absolute top-2 right-2 btn btn-outline p-2 bg-black/50 hover:bg-black/70"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <label className="btn btn-outline flex items-center gap-2 cursor-pointer">
                                    {uploading ? (
                                        <>
                                            <Upload size={18} className="animate-pulse" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon size={18} />
                                            {imagePreview ? 'Change Image' : 'Upload Image'}
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                </label>
                                {imagePreview && (
                                    <span className="text-sm text-gray-400">Image uploaded successfully</span>
                                )}
                            </div>
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
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary flex items-center gap-2 flex-1"
                            >
                                <Save size={18} />
                                {loading ? "Saving..." : (isEditing ? "Update Post" : "Create Post")}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/admin/dashboard")}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function PostEditor() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <PostEditorContent />
        </Suspense>
    );
}
