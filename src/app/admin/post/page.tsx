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
        category: "General",
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
                category: data.category || "General",
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
            // Send null if empty string to avoid "invalid input syntax for type text" or similar constraints if applicable
            image_url: formData.image_url.trim() === "" ? null : formData.image_url,
            external_link: formData.external_link.trim() === "" ? null : formData.external_link,
            category: formData.category,
        };

        try {
            if (isEditing && postId) {
                const { error } = await supabase
                    .from("posts")
                    .update(postData)
                    .eq("id", postId);

                if (error) {
                    console.error('Update error object:', error);
                    alert(`Error updating post: ${error.message || JSON.stringify(error)}`);
                } else {
                    router.push("/admin/dashboard");
                }
            } else {
                const { error } = await supabase
                    .from("posts")
                    .insert([postData]);

                if (error) {
                    console.error('Insert error object:', error);
                    alert(`Error creating post: ${error.message || JSON.stringify(error)}`);
                } else {
                    router.push("/admin/dashboard");
                }
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred. Check console for details.");
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

        let newContent = formData.content;
        let newSelectionStart = start;
        let newSelectionEnd = end;

        if (start !== end) {
            // Check for existing formatting covering the EXACT selection
            const beforeSelection = formData.content.substring(start - prefix.length, start);
            const afterSelection = formData.content.substring(end, end + suffix.length);

            if (beforeSelection === prefix && afterSelection === suffix) {
                // Remove formatting (toggle off)
                newContent =
                    formData.content.substring(0, start - prefix.length) +
                    selectedText +
                    formData.content.substring(end + suffix.length);

                newSelectionStart = start - prefix.length;
                newSelectionEnd = end - prefix.length;
            } else {
                // Apply formatting to selection (toggle on)
                newContent =
                    formData.content.substring(0, start) +
                    prefix + selectedText + suffix +
                    formData.content.substring(end);

                newSelectionStart = start + prefix.length;
                newSelectionEnd = newSelectionStart + selectedText.length;
            }
        } else {
            // No selection: Insert placeholder or just the tokens
            // If placeholder is provided, insert it. If empty string is passed as placeholder (like for lists), just insert prefix.
            const textToInsert = placeholder || "";
            newContent =
                formData.content.substring(0, start) +
                prefix + textToInsert + suffix +
                formData.content.substring(end);

            newSelectionStart = start + prefix.length;
            newSelectionEnd = newSelectionStart + textToInsert.length;
        }

        setFormData(prev => ({ ...prev, content: newContent }));

        requestAnimationFrame(() => {
            if (textarea) {
                textarea.scrollTop = scrollTop;
                textarea.focus();
                textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
            }
        });
    }, [formData.content]);

    const toolbarButtons = [
        { icon: Bold, action: () => applyFormatting('**', '**', 'bold text'), title: 'Bold' },
        { icon: Italic, action: () => applyFormatting('*', '*', 'italic text'), title: 'Italic' },
        { icon: Heading1, action: () => applyFormatting('# ', '', 'Heading 1'), title: 'H1' },
        { icon: Heading2, action: () => applyFormatting('## ', '', 'Heading 2'), title: 'H2' },
        { icon: List, action: () => applyFormatting('- ', '', ''), title: 'Bullets' },
        { icon: ListOrdered, action: () => applyFormatting('1. ', '', ''), title: 'Numbers' },
        { icon: LinkIcon, action: () => applyFormatting('[', '](url)', 'link text'), title: 'Link' },
        { icon: ImageIcon, action: () => applyFormatting('![', '](image-url)', 'alt text'), title: 'Image' },
        { icon: Code, action: () => applyFormatting('`', '`', 'code'), title: 'Code' },
        { icon: Quote, action: () => applyFormatting('> ', '', 'Quote'), title: 'Quote' },
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
        <div className="min-h-screen bg-[#0A0A0B] text-slate-200" style={{ backgroundColor: '#0A0A0B', color: '#e2e8f0' }}>
            {/* Top Toolbar */}
            <div className="sticky top-0 z-50 bg-[#0A0A0B]/95 backdrop-blur-xl border-b border-white/5 px-6 py-4" style={{ backgroundColor: 'rgba(10, 10, 11, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    {/* Formatting Buttons */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/[0.03] p-1.5 rounded-xl border border-white/5" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.05)' }}>
                            {toolbarButtons.map((btn, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={btn.action}
                                    className="p-2.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all active:scale-95 flex items-center justify-center group relative"
                                    style={{ color: '#9ca3af' }}
                                    title={btn.title}
                                >
                                    <btn.icon size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                                </button>
                            ))}
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2 bg-white/[0.03] p-1.5 rounded-xl border border-white/5" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.05)' }}>
                            <button
                                type="button"
                                onClick={() => setViewMode('edit')}
                                className={`p-2.5 rounded-lg transition-all flex items-center justify-center group ${viewMode === 'edit'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                style={viewMode === 'edit' ? { backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' } : { color: '#9ca3af' }}
                                title="Editor Only"
                            >
                                <Edit3 size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('split')}
                                className={`p-2.5 rounded-lg transition-all flex items-center justify-center group ${viewMode === 'split'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                style={viewMode === 'split' ? { backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' } : { color: '#9ca3af' }}
                                title="Split View"
                            >
                                <Columns size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('preview')}
                                className={`p-2.5 rounded-lg transition-all flex items-center justify-center group ${viewMode === 'preview'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                style={viewMode === 'preview' ? { backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' } : { color: '#9ca3af' }}
                                title="Preview Only"
                            >
                                <Eye size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold flex items-center gap-2.5 shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
                        style={{
                            background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                            color: 'white',
                            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)'
                        }}
                    >
                        <Save size={18} className="transition-transform group-hover:scale-110" />
                        {loading ? "Saving..." : "Save Article"}
                    </button>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className={`grid gap-10 ${viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {/* Left Column - Form */}
                    {(viewMode === 'edit' || viewMode === 'split') && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                                    placeholder="Article Title..."
                                    className="w-full text-4xl font-black bg-transparent border-none text-white placeholder-gray-600 focus:outline-none focus:ring-0 px-0 tracking-tight italic"
                                    style={{ backgroundColor: 'transparent', color: 'white', fontSize: '2.25rem', fontWeight: 900 }}
                                    required
                                />
                            </div>

                            {/* Slug, Application, Category, Status Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Slug</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="article-slug"
                                        className="w-full px-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all font-mono shadow-sm"
                                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Application</label>
                                    <div className="relative">
                                        <select
                                            value={formData.topic}
                                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all appearance-none cursor-pointer shadow-sm"
                                            style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                                        >
                                            <option value="hubplate" className="bg-slate-900 text-white" style={{ backgroundColor: '#0f172a' }}>HubPlate</option>
                                            <option value="hangroom" className="bg-slate-900 text-white" style={{ backgroundColor: '#0f172a' }}>Hangroom</option>
                                            <option value="baybolt" className="bg-slate-900 text-white" style={{ backgroundColor: '#0f172a' }}>Baybolt</option>
                                            <option value="hugloom" className="bg-slate-900 text-white" style={{ backgroundColor: '#0f172a' }}>HugLoom</option>
                                            <option value="daylabor" className="bg-slate-900 text-white" style={{ backgroundColor: '#0f172a' }}>Day Labor</option>
                                            <option value="raidmemegen" className="bg-slate-900 text-white" style={{ backgroundColor: '#0f172a' }}>Raid Generator</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                                    <div className="relative">
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all appearance-none cursor-pointer shadow-sm"
                                            style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                                        >
                                            <option value="General" className="bg-slate-900 text-white" style={{ backgroundColor: '#0f172a' }}>General</option>
                                            <option value="Strategy" className="bg-slate-900 text-white" style={{ backgroundColor: '#0f172a' }}>Strategy</option>
                                            <option value="Tips" className="bg-slate-900 text-white" style={{ backgroundColor: '#0f172a' }}>Tips</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</label>
                                    <div className="relative">
                                        <select
                                            value={formData.published ? "published" : "draft"}
                                            onChange={(e) => setFormData({ ...formData, published: e.target.value === "published" })}
                                            className="w-full px-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all appearance-none cursor-pointer shadow-sm"
                                            style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                                        >
                                            <option value="draft" className="bg-slate-900 text-white" style={{ backgroundColor: '#0f172a' }}>Draft</option>
                                            <option value="published" className="bg-slate-900 text-white" style={{ backgroundColor: '#0f172a' }}>Published</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image URL */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Featured Image URL</label>
                                <input
                                    type="url"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all shadow-sm"
                                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                                />
                            </div>

                            {/* Excerpt */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Excerpt</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="A brief summary for SEO and previews..."
                                    rows={3}
                                    className="w-full px-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none shadow-sm"
                                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                                    required
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Content (Markdown)</label>
                                <textarea
                                    ref={textareaRef}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    onScroll={handleEditorScroll}
                                    placeholder="Start writing your masterpiece..."
                                    className="w-full px-5 py-5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all font-mono text-sm leading-relaxed resize-none shadow-sm"
                                    style={{ minHeight: '500px', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                                />
                            </div>

                            {/* External Link */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">External Link <span className="text-gray-600">(optional)</span></label>
                                <input
                                    type="url"
                                    value={formData.external_link}
                                    onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                                    placeholder="https://example.com/original-post"
                                    className="w-full px-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all shadow-sm"
                                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                                />
                            </div>

                            {/* Cancel Button */}
                            <div className="pt-6">
                                <button
                                    type="button"
                                    onClick={() => router.push("/admin/dashboard")}
                                    className="px-4 py-2 text-gray-500 hover:text-white transition-colors text-sm font-medium"
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
                            className="bg-black/20 border border-white/5 rounded-2xl p-10 overflow-y-auto min-h-[500px] shadow-inner"
                            style={{ maxHeight: 'calc(100vh - 140px)', backgroundColor: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.05)' }}
                        >
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight" style={{ color: 'white' }}>
                                {formData.title || <span className="text-white/20" style={{ color: 'rgba(255,255,255,0.2)' }}>Untitled Article</span>}
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
