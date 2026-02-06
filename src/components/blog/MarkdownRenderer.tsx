'use client';

import { marked } from 'marked';
import { useState, useEffect } from 'react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    const [htmlContent, setHtmlContent] = useState<string>('');

    useEffect(() => {
        const parseMarkdown = async () => {
            if (!content) {
                setHtmlContent('');
                return;
            }
            try {
                // Configure marked options explicitly for stability
                const parsed = await marked.parse(content, {
                    async: true,
                    breaks: true, // Converts single Enter to <br>
                    gfm: true
                });
                setHtmlContent(parsed);
            } catch (error) {
                console.error("Markdown parsing error:", error);
                setHtmlContent("<p class='text-red-500'>Error rendering preview</p>");
            }
        };

        parseMarkdown();
    }, [content]);

    return (
        <div className={`blog-preview-container-final ${className}`} id="BLOG-PREVIEW-FIX">
            <style dangerouslySetInnerHTML={{
                __html: `
                /* 
                   THE ULTIMATE FIX:
                   We force every paragraph to have a undeniable margin.
                   We also force <br> tags to act like a space for single-enters.
                */
                #BLOG-PREVIEW-FIX .content-inner p {
                    margin-top: 0 !important;
                    margin-bottom: 2rem !important; /* LARGE paragraph space */
                    display: block !important;
                    line-height: 1.8 !important;
                }

                #BLOG-PREVIEW-FIX .content-inner h1,
                #BLOG-PREVIEW-FIX .content-inner h2,
                #BLOG-PREVIEW-FIX .content-inner h3 {
                    margin-top: 3.5rem !important;
                    margin-bottom: 1.5rem !important;
                    display: block !important;
                }

                /* FORCE <br> to behave like a vertical move */
                #BLOG-PREVIEW-FIX .content-inner br {
                    display: block !important;
                    content: "" !important;
                    margin-top: 1.5rem !important;
                }

                #BLOG-PREVIEW-FIX .content-inner img {
                    max-height: 400px !important;
                    width: auto !important;
                    margin: 2.5rem auto !important;
                    display: block !important;
                    border-radius: 1rem !important;
                }

                #BLOG-PREVIEW-FIX .content-inner ul,
                #BLOG-PREVIEW-FIX .content-inner ol {
                    margin-bottom: 2rem !important;
                    padding-left: 2rem !important;
                    display: block !important;
                }

                #BLOG-PREVIEW-FIX .content-inner li {
                    margin-bottom: 0.75rem !important;
                    display: list-item !important;
                }
            `}} />
            <div
                className="content-inner prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
}
