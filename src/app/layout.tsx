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
  title: "mktoolnest - Professional Tips & Tools",
  description: "Expert insights for Mechanics, Caretakers, and Contractors. Your trusted resource hub for professional growth.",
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
          <div className="container flex items-center justify-between h-20">
            <Link href="/" className="text-2xl font-black tracking-tight hover:text-primary transition-colors">
              mktoolnest
            </Link>
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
            <div className="flex items-center gap-4">
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
