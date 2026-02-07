import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Wrench, Heart, Hammer } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mktoolnest.vercel.app'),
  title: "MK Tool Nest - Professional Blog Directory & Industry Resource Hub",
  description: "The ultimate directory for professional insights and industry-specific blogs. MK Tool Nest aggregates expert knowledge for Restaurateurs, Mechanics, Caretakers, Contractors, and Gamers, providing a central hub for career growth and specialized tools.",
  keywords: [
    "Professional Blog Directory",
    "Industry Resource Aggregator",
    "Restaurant Management Blog Hub",
    "Automotive Repair Insights",
    "Caregiver Support Directory",
    "Construction Business Growth",
    "Gaming Strategy Hub",
    "HubPlate Blog",
    "Baybolt Blog",
    "HugLoom Blog",
    "Day Labor on Demand",
    "Raid Generator Resources",
    "Expert Industry Insights 2025",
    "Career Growth for Skilled Trades",
    "Technical Resource Hub"
  ],
  authors: [{ name: "MK Tool Nest" }],
  creator: "MK Tool Nest",
  publisher: "MK Tool Nest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "wnwX0v0OGT7E25CuYA6r3_NjExggVU9PFITJXnpMp8U",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "MK Tool Nest - Professional Resource Hub & Gaming Strategy",
    description: "Empowering professionals and gamers with expert insights and actionable tools across restaurant management, automotive, healthcare, construction, and gaming industries.",
    url: 'https://mktoolnest.vercel.app',
    siteName: 'MK Tool Nest',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'MK Tool Nest Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: "summary_large_image",
    title: "MK Tool Nest - Professional & Gaming Resource Hub",
    description: "Expert insights for Mechanics, Caretakers, Contractors, and Gamers.",
    images: ['/icon.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="glass sticky top-0 z-50">
          <div className="container relative flex items-center justify-between min-h-[150px] py-8">
            <nav className="hidden md:flex gap-8 text-sm font-semibold">
              <Link href="/baybolt" className="flex items-center gap-2 hover:text-red-500 transition-colors group">
                <Wrench size={16} className="group-hover:rotate-12 transition-transform" />
                <span>Baybolt</span>
              </Link>
              <Link href="/hugloom" className="flex items-center gap-2 hover:text-emerald-500 transition-colors group">
                <Heart size={16} className="group-hover:scale-110 transition-transform" />
                <span>HugLoom</span>
              </Link>
              <Link href="/daylabor" className="flex items-center gap-2 hover:text-amber-500 transition-colors group">
                <Hammer size={16} className="group-hover:rotate-12 transition-transform" />
                <span>Day Labor</span>
              </Link>
            </nav>

            <Link href="/" className="absolute left-1/2 -translate-x-1/2 font-black tracking-tighter hover:opacity-80 transition-opacity gradient-text uppercase whitespace-nowrap" style={{ fontSize: '1.8rem', lineHeight: '1' }}>
              MK Tool Nest
            </Link>

            <div className="flex items-center gap-4 ml-auto">
              <Link href="/admin/dashboard" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </header>
        <main className="min-h-screen pb-20 relative z-10">
          {children}
        </main>
        <footer className="border-t border-white/5 py-16 mt-20 relative z-10 bg-[#0a0a0f]">
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              <div className="text-center md:text-left">
                <div className="text-2xl font-black mb-4 gradient-text">MK Tool Nest</div>
                <p className="text-sm text-gray-500 max-w-xs mx-auto md:mx-0">
                  Empowering professionals across industries with expert insights and specialized tools.
                </p>
              </div>

              <div className="flex flex-col gap-4 text-center md:text-left">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Platform</h3>
                <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</Link>
                <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog Hub</Link>
              </div>

              <div className="flex flex-col gap-4 text-center md:text-left">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Legal</h3>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              </div>

              <div className="flex flex-col gap-4 text-center md:text-left">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Connect</h3>
                <a href="https://x.com/MatthewKobilan" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">X (Twitter)</a>
                <a href="https://www.facebook.com/matthewkobilan" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Facebook</a>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
              <div>
                &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> MK Tool Nest. All rights reserved.
              </div>
              <div className="flex gap-6 italic">
                <span>By: Matthew Kobilan</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
