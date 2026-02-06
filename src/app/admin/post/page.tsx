"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Save, X, Upload, Image as ImageIcon,
    Bold, Italic, Heading1, Heading2, List, ListOrdered,
    Link as LinkIcon, Quote, Code, Eye, EyeOff, Columns
} from "lucide-react";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";

export const dynamic = 'force-dynamic';

function PostEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get('id');
    const supabase = createClient();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        topic: "baybolt",
        published: true,
        image_url: "",
        external_link: "",
    });

    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');

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
                external_link: data.external_link || "",
            });
            setIsEditing(true);
            setImagePreview(data.image_url || "");
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const postData = {
            title: formData.title,
            slug: formData.slug,
            content: formData.content,
            excerpt: formData.excerpt,
            topic: formData.topic,
            published: formData.published,
            image_url: formData.image_url,
            external_link: formData.external_link || null,
        };

        if (isEditing && postId) {
            const { error } = await supabase
                .from("posts")
                .update(postData)
                .eq("id", postId);

            if (error) {
                console.error('Update error:', error);
                alert(`Error updating post: ${error.message}`);
            } else {
                router.push("/admin/dashboard");
            }
        } else {
            const { error } = await supabase
                .from("posts")
                .insert([postData]);

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

    // Formatting toolbar with scroll preservation
    const applyFormatting = useCallback((prefix: string, suffix: string = '', placeholder: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const scrollTop = textarea.scrollTop;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = formData.content.substring(start, end);
        const textToInsert = selectedText || placeholder;

        const newContent =
            formData.content.substring(0, start) +
            prefix + textToInsert + suffix +
            formData.content.substring(end);

        setFormData({ ...formData, content: newContent });

        // Restore scroll position and focus after React re-render
        requestAnimationFrame(() => {
            if (textarea) {
                textarea.scrollTop = scrollTop;
                textarea.focus();
                const newCursorPos = start + prefix.length + textToInsert.length + suffix.length;
                textarea.setSelectionRange(
                    selectedText ? start + prefix.length : newCursorPos,
                    selectedText ? start + prefix.length + selectedText.length : newCursorPos
                );
            }
        });
    }, [formData]);

    const toolbarButtons = [
        { icon: Bold, action: () => applyFormatting('**', '**', 'bold text'), title: 'Bold' },
        { icon: Italic, action: () => applyFormatting('*', '*', 'italic text'), title: 'Italic' },
        { icon: Heading1, action: () => applyFormatting('# ', '', 'Heading 1'), title: 'Heading 1' },
        { icon: Heading2, action: () => applyFormatting('## ', '', 'Heading 2'), title: 'Heading 2' },
        { icon: List, action: () => applyFormatting('- ', '', ''), title: 'Bullet List' },
        { icon: ListOrdered, action: () => applyFormatting('1. ', '', ''), title: 'Numbered List' },
        { icon: LinkIcon, action: () => applyFormatting('[', '](url)', 'link text'), title: 'Link' },
        { icon: Quote, action: () => applyFormatting('> ', '', 'quote'), title: 'Quote' },
        { icon: Code, action: () => applyFormatting('`', '`', 'code'), title: 'Code' },
        { icon: ImageIcon, action: () => applyFormatting('![', '](image-url)', 'alt text'), title: 'Image' },
    ];

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data, error } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file);

            if (error) {
                console.error('Upload error:', error);
                alert('Failed to upload image');
                return;
            }

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

    // Scroll sync between editor and preview
    const handleEditorScroll = () => {
        if (viewMode !== 'split' || !textareaRef.current || !previewRef.current) return;

        const editor = textareaRef.current;
        const preview = previewRef.current;
        const scrollRatio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
        preview.scrollTop = scrollRatio * (preview.scrollHeight - preview.clientHeight);
    };

    if (loading && isEditing) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="py-8 px-4 min-h-screen">
            <div className="container max-w-7xl">
                <div className="card p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">
                            {isEditing ? "Edit Post" : "Create New Post"}
                        </h1>
                        <div className="flex items-center gap-2">
                            {/* View Mode Toggle */}
                            <div className="flex bg-slate-800 rounded-lg p-1 mr-4">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('edit')}
                                    className={`p-2 rounded ${viewMode === 'edit' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'}`}
                                    title="Edit only"
                                >
                                    <EyeOff size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('split')}
                                    className={`p-2 rounded ${viewMode === 'split' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'}`}
                                    title="Split view"
                                >
                                    <Columns size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('preview')}
                                    className={`p-2 rounded ${viewMode === 'preview' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'}`}
                                    title="Preview only"
                                >
                                    <Eye size={16} />
                                </button>
                            </div>
                            <button
                                onClick={() => router.push("/admin/dashboard")}
                                className="btn btn-outline flex items-center gap-2"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Top Row: Title, Slug, Topic */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => {
                                        const newTitle = e.target.value;
                                        setFormData({
                                            ...formData,
                                            title: newTitle,
                                            slug: !isEditing ? generateSlug(newTitle) : formData.slug
                                        });
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
                                    <option value="hangroom">Hangroom - Creators</option>
                                </select>
                            </div>
                        </div>

                        {/* External Link (for blog directory) */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                External Link <span className="text-gray-400">(optional - link to original blog post)</span>
                            </label>
                            <input
                                type="url"
                                value={formData.external_link}
                                onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                                placeholder="https://example.com/blog/original-post"
                                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Excerpt</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                rows={2}
                                required
                            />
                        </div>

                        {/* Content Editor with Toolbar */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Content (Markdown)</label>

                            {/* Formatting Toolbar */}
                            <div className="flex flex-wrap gap-1 p-2 bg-slate-800 rounded-t-lg border border-b-0 border-border">
                                {toolbarButtons.map((btn, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={btn.action}
                                        className="p-2 rounded hover:bg-slate-700 text-gray-300 hover:text-white transition-colors"
                                        title={btn.title}
                                    >
                                        <btn.icon size={16} />
                                    </button>
                                ))}
                            </div>

                            {/* Editor/Preview Area */}
                            <div className={`grid gap-4 ${viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {/* Editor */}
                                {(viewMode === 'edit' || viewMode === 'split') && (
                                    <textarea
                                        ref={textareaRef}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        onScroll={handleEditorScroll}
                                        className="w-full px-4 py-3 bg-slate-900 border border-border rounded-b-lg focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
                                        style={{
                                            minHeight: '400px',
                                            resize: 'vertical',
                                        }}
                                        placeholder="Write your content in Markdown..."
                                    />
                                )}

                                {/* Live Preview */}
                                {(viewMode === 'preview' || viewMode === 'split') && (
                                    <div
                                        ref={previewRef}
                                        className="px-4 py-3 bg-slate-900/50 border border-border rounded-lg overflow-y-auto"
                                        style={{ minHeight: '400px', maxHeight: '600px' }}
                                    >
                                        <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Preview</div>
                                        <MarkdownRenderer content={formData.content} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Featured Image (optional)</label>

                            {imagePreview && (
                                <div className="mb-4 relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full max-h-48 object-cover rounded-lg border border-border"
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

                        {/* Publish Toggle & Submit */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
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
                                    type="button"
                                    onClick={() => router.push("/admin/dashboard")}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    {loading ? "Saving..." : (isEditing ? "Update Post" : "Create Post")}
                                </button>
                            </div>
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
