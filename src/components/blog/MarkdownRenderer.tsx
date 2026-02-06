'use client';

import { marked } from 'marked';
import { useMemo } from 'react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    const htmlContent = useMemo(() => {
        // Configure marked for safe rendering
        marked.setOptions({
            breaks: true,
            gfm: true,
        });

        return marked.parse(content) as string;
    }, [content]);

    return (
        <div
            className={`prose prose-invert prose-lg max-w-none 
                prose-headings:text-white prose-headings:font-black
                prose-h1:text-4xl prose-h1:mb-6
                prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
                prose-h3:text-2xl prose-h3:mb-3
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-bold
                prose-em:text-gray-200
                prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
                prose-li:text-gray-300
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
                prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-400
                prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-slate-900 prose-pre:p-4 prose-pre:rounded-lg
                prose-img:rounded-lg prose-img:shadow-lg
                ${className}`}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}
