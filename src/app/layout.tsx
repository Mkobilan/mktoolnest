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
  title: "MK Tool Nest - Professional Resource Hub for Mechanics, Caretakers, Contractors & Gamers",
  description: "Your trusted resource hub for professional growth and gaming strategies. Expert insights, tools, and guides for Mechanics (Baybolt), Caretakers (HugLoom), Contractors (Day Labor), and Gamers (Raid Generator).",
  keywords: [
    "Professional Resource Hub",
    "Mechanic Tools",
    "Caregiver Support",
    "Contractor Guides",
    "Day Labor Resources",
    "Raid Generator",
    "Helldivers 2 Strategy",
    "Destiny 2 Raid Plans",
    "WoW Raid Strategy",
    "Automotive Repair",
    "Healthcare Tips",
    "Construction Management",
    "Career Growth for Trades",
    "Expert Industry Insights",
    "MMO Raid Tactics",
    "Gaming Strategy Hub",
    "Best Mechanic Tools 2024",
    "Auto Repair Guides",
    "ASE Certification Tips",
    "Caregiver Burnout Support",
    "Home Health Care Tips",
    "Patient Advocacy Resources",
    "Construction Project Management",
    "Day Labor Hiring Tips",
    "Contractor Business Growth"
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
  openGraph: {
    title: "MK Tool Nest - Professional Resource Hub & Gaming Strategy",
    description: "Empowering professionals and gamers with expert insights and actionable tools across automotive, healthcare, construction, and gaming industries.",
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

            <Link href="/" className="absolute left-1/2 -translate-x-1/2 font-black tracking-tight hover:opacity-80 transition-opacity gradient-text whitespace-nowrap" style={{ fontSize: '4rem', lineHeight: '1.1' }}>
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
        <footer className="border-t border-white/5 py-12 mt-20 relative z-10">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <div className="text-xl font-bold mb-2">mktoolnest</div>
                <p className="text-sm text-gray-500">Empowering professionals across industries</p>
              </div>
              <div className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} mktoolnest. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
