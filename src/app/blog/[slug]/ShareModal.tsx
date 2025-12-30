"use client";

import React, { useState, useEffect } from "react";
import { X, Facebook, Linkedin, Link2, Share2, Check } from "lucide-react";

interface ShareModalProps {
    title: string;
    buttonClassName?: string;
    gradientClass?: string;
}

export default function ShareModal({ title, gradientClass = "" }: ShareModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUrl(window.location.href);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Map gradient classes to actual CSS gradients if possible, or use a neutral premium one
    // Baybolt: from-orange-500 to-blue-900 -> linear-gradient(to right, #f97316, #1e3a8a)
    // HugLoom: from-pink-400 to-red-400 -> linear-gradient(to right, #f472b6, #f87171)
    const getGradient = () => {
        if (gradientClass.includes("orange")) return "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #1e3a8a 100%)";
        if (gradientClass.includes("pink")) return "linear-gradient(135deg, #f472b6 0%, #fb7185 50%, #f43f5e 100%)";
        if (gradientClass.includes("purple")) return "linear-gradient(135deg, #a855f7 0%, #d946ef 50%, #ec4899 100%)";
        if (gradientClass.includes("FF41")) return "linear-gradient(135deg, #00FF41 0%, #008F11 50%, #003B00 100%)";
        if (gradientClass.includes("red-600")) return "linear-gradient(135deg, #dc2626 0%, #f97316 50%, #dc2626 100%)";
        return "linear-gradient(135deg, #27272a 0%, #09090b 100%)";
    };

    const handleShare = (platform: "twitter" | "facebook" | "linkedin" | "reddit") => {
        let shareUrl = "";
        switch (platform) {
            case "twitter":
                const maxTextLength = 245;
                const truncatedTitle = title.length > maxTextLength ? title.substring(0, maxTextLength - 3) + "..." : title;
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(truncatedTitle)}&url=${encodeURIComponent(url)}`;
                break;
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case "reddit":
                shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
                break;
        }
        if (typeof window !== 'undefined') {
            window.open(shareUrl, "_blank", "width=600,height=400");
            setIsOpen(false);
        }
    };

    if (!mounted) return (
        <div style={{ width: '100px', height: '40px', background: '#18181b', borderRadius: '100px', opacity: 0.5 }} />
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 24px',
                    borderRadius: '100px',
                    background: getGradient(),
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 20
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                }}
            >
                <Share2 size={18} color="white" />
                <span style={{ color: 'white' }}>Share</span>
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px'
                }}>
                    {/* Backdrop */}
                    <div
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            zIndex: -1
                        }}
                    />

                    {/* Modal */}
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '380px',
                        background: '#09090b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '24px',
                        padding: '32px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        color: 'white'
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'white', letterSpacing: '-0.02em', flex: 1 }}>
                                Share Article
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#9ca3af',
                                    transition: 'background 0.2s ease, color 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.color = '#9ca3af';
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Icons Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                            <SocialButtonInline onClick={() => handleShare("twitter")} label="X" icon={<XIcon />} />
                            <SocialButtonInline onClick={() => handleShare("facebook")} label="Facebook" icon={<Facebook size={22} color="white" />} />
                            <SocialButtonInline onClick={() => handleShare("linkedin")} label="LinkedIn" icon={<Linkedin size={22} color="white" />} />
                            <SocialButtonInline onClick={() => handleShare("reddit")} label="Reddit" icon={<RedditIcon />} />
                        </div>

                        {/* Copy Row */}
                        <div style={{
                            position: 'relative',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '16px',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <div style={{ padding: '0 12px', color: '#6b7280' }}>
                                <Link2 size={16} />
                            </div>
                            <input
                                readOnly
                                value={url}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '12px 0',
                                    color: '#9ca3af',
                                    fontSize: '14px',
                                    outline: 'none',
                                    minWidth: 0
                                }}
                            />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(url);
                                    setCopied(true);
                                }}
                                style={{
                                    background: copied ? '#059669' : '#27272a',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    marginLeft: '4px'
                                }}
                            >
                                {copied ? <Check size={16} /> : "Copy"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function SocialButtonInline({ onClick, label, icon }: { onClick: () => void, label: string, icon: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0
            }}
        >
            <div style={{
                width: '56px',
                height: '56px',
                background: '#18181b',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
            }}>
                {icon}
            </div>
            <span style={{ fontSize: '11px', fontWeight: '500', color: '#71717a' }}>{label}</span>
        </button>
    );
}

const XIcon = () => (
    <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'white' }}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
);

const RedditIcon = () => (
    <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: 'white' }}>
        <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.05)"></circle>
        <path d="M16.67,13.81c-0.34,0-0.61,0.27-0.61,0.61c0,0.34,0.27,0.61,0.61,0.61c0.34,0,0.61-0.27,0.61-0.61C17.28,14.09,17.01,13.81,16.67,13.81z M12,17.5c-1.63,0-3-0.87-3.72-2.18c-0.12-0.21,0.03-0.45,0.26-0.41c0.16,0.03,0.31,0.08,0.45,0.14c0.13,0.06,0.26,0.1,0.4,0.13C9.97,16.03,10.93,16.5,12,16.5c1.07,0,2.03-0.47,2.61-1.32c0.13-0.03,0.27-0.07,0.4-0.13c0.14-0.06,0.29-0.11,0.45-0.14c0.24-0.04,0.38,0.2,0.26,0.41C15,16.63,13.63,17.5,12,17.5z M7.33,13.81c-0.34,0-0.61,0.27-0.61,0.61c0,0.34,0.27,0.61,0.61,0.61c0.34,0,0.61-0.27,0.61-0.61C7.94,14.09,7.67,13.81,7.33,13.81z M19.46,10.3c-0.05-0.14-0.12-0.27-0.21-0.38c-0.23-0.28-0.58-0.46-0.97-0.46c-0.42,0-0.79,0.21-1.02,0.53c-1.37-0.97-3.23-1.61-5.26-1.66l0.9-4.21l2.93,0.63c0.03,0.59,0.52,1.06,1.12,1.06c0.62,0,1.12-0.5,1.12-1.12c0-0.62-0.5-1.12-1.12-1.12c-0.48,0-0.89,0.3-1.05,0.72l-3.2-0.69c-0.16-0.03-0.32,0.06-0.39,0.21L11.4,8.3c-2.05,0.03-3.93,0.67-5.31,1.66c-0.23-0.32-0.6-0.53-1.02-0.53c-0.39,0-0.74,0.18-0.97,0.46c-0.09,0.11-0.16,0.24-0.21,0.38C3.39,10.6,3,11.23,3,11.94c0,0.85,0.55,1.59,1.31,1.89c-0.03,0.23-0.05,0.47-0.05,0.71c0,3.61,3.47,6.54,7.74,6.54s7.74-2.93,7.74-6.54c0-0.24-0.02-0.48-0.05-0.71C20.45,13.52,21,12.79,21,11.94C21,11.23,20.61,10.6,19.46,10.3z" fill="white" />
    </svg>
);
