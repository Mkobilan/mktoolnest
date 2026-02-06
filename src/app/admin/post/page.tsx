"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Save, X,
    Bold, Italic, Heading1, Heading2, List, ListOrdered,
    Link as LinkIcon, Quote, Code, Image as ImageIcon,
    Eye, Columns, Edit3
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
        category: "GENERAL",
    });

    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
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
                category: data.category || "GENERAL",
            });
            setIsEditing(true);
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
            category: formData.category,
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
        { icon: Heading1, action: () => applyFormatting('# ', '', 'Heading 1'), title: 'H1' },
        { icon: Heading2, action: () => applyFormatting('## ', '', 'Heading 2'), title: 'H2' },
        { icon: List, action: () => applyFormatting('- ', '', ''), title: 'Bullets' },
        { icon: ListOrdered, action: () => applyFormatting('1. ', '', ''), title: 'Numbers' },
        { icon: LinkIcon, action: () => applyFormatting('[', '](url)', 'link text'), title: 'Link' },
        { icon: ImageIcon, action: () => applyFormatting('![', '](image-url)', 'alt text'), title: 'Image' },
    ];

    // Scroll sync
    const handleEditorScroll = () => {
        if (viewMode !== 'split' || !textareaRef.current || !previewRef.current) return;
        const editor = textareaRef.current;
        const preview = previewRef.current;
        const scrollRatio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
        preview.scrollTop = scrollRatio * (preview.scrollHeight - preview.clientHeight);
    };

    if (loading && isEditing) {
        return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Top Toolbar */}
            <div className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 px-6 py-3">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    {/* Formatting Buttons */}
                    <div className="flex items-center gap-1">
                        {toolbarButtons.map((btn, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={btn.action}
                                className="p-2.5 rounded-lg hover:bg-slate-800 text-gray-400 hover:text-white transition-all"
                                title={btn.title}
                            >
                                <btn.icon size={18} />
                            </button>
                        ))}

                        {/* Separator */}
                        <div className="w-px h-6 bg-slate-700 mx-2"></div>

                        {/* View Mode Toggle */}
                        <div className="flex bg-slate-800 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => setViewMode('edit')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all ${viewMode === 'edit'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Edit3 size={14} />
                                Editor
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('split')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all ${viewMode === 'split'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Columns size={14} />
                                Split
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('preview')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all ${viewMode === 'preview'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Eye size={14} />
                                Preview
                            </button>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        <Save size={16} />
                        {loading ? "Saving..." : "Save Article"}
                    </button>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className={`grid gap-8 ${viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {/* Left Column - Form */}
                    {(viewMode === 'edit' || viewMode === 'split') && (
                        <div className="space-y-6">
                            {/* Title */}
                            <div>
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
                                    placeholder="Article Title"
                                    className="w-full text-3xl font-black bg-transparent border-none text-white placeholder-gray-600 focus:outline-none italic"
                                    required
                                />
                            </div>

                            {/* Slug, Application, Category, Status Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Slug</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="article-slug"
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-slate-700 font-mono text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Application</label>
                                    <select
                                        value={formData.topic}
                                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-slate-700 appearance-none cursor-pointer"
                                    >
                                        <option value="hubplate">HubPlate</option>
                                        <option value="hangroom">Hangroom</option>
                                        <option value="baybolt">Baybolt</option>
                                        <option value="hugloom">HugLoom</option>
                                        <option value="daylabor">Day Labor</option>
                                        <option value="raidmemegen">Raid Generator</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value.toUpperCase() })}
                                        placeholder="TIPS, STRATEGIES, etc."
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-slate-700 font-bold text-sm tracking-widest"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Status</label>
                                    <select
                                        value={formData.published ? "published" : "draft"}
                                        onChange={(e) => setFormData({ ...formData, published: e.target.value === "published" })}
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-slate-700 appearance-none cursor-pointer"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>
                            </div>

                            {/* Featured Image URL */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Featured Image URL</label>
                                <input
                                    type="url"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-slate-700"
                                />
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Excerpt</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="A brief summary for SEO and previews..."
                                    rows={2}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-slate-700 resize-none"
                                    required
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Content (Markdown)</label>
                                <textarea
                                    ref={textareaRef}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    onScroll={handleEditorScroll}
                                    placeholder="Start writing your masterpiece..."
                                    className="w-full px-4 py-4 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-slate-700 font-mono text-sm leading-relaxed resize-none"
                                    style={{ minHeight: '400px' }}
                                />
                            </div>

                            {/* External Link */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">External Link <span className="text-gray-600">(optional)</span></label>
                                <input
                                    type="url"
                                    value={formData.external_link}
                                    onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                                    placeholder="https://example.com/original-post"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-slate-700"
                                />
                            </div>

                            {/* Cancel Button */}
                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={() => router.push("/admin/dashboard")}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    ← Back to Dashboard
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Right Column - Preview */}
                    {(viewMode === 'preview' || viewMode === 'split') && (
                        <div
                            ref={previewRef}
                            className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 overflow-y-auto"
                            style={{ maxHeight: 'calc(100vh - 200px)' }}
                        >
                            <h1 className="text-4xl font-black text-white mb-6 uppercase italic">
                                {formData.title || 'Untitled Article'}
                            </h1>
                            <MarkdownRenderer content={formData.content} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function PostEditor() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>}>
            <PostEditorContent />
        </Suspense>
    );
}
