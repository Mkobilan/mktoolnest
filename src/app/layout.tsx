import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Wrench, Heart, Hammer } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mktoolnest - Tips & Tools",
  description: "Expert advice for Mechanics, Caretakers, and Contractors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="glass sticky top-0 z-50">
          <div className="container flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold tracking-tighter hover:text-primary transition-colors">
              mktoolnest
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/baybolt" className="flex items-center gap-2 hover:text-red-500 transition-colors">
                <Wrench size={16} /> Baybolt
              </Link>
              <Link href="/hugloom" className="flex items-center gap-2 hover:text-emerald-500 transition-colors">
                <Heart size={16} /> HugLoom
              </Link>
              <Link href="/daylabor" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                <Hammer size={16} /> Day Labor
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                Admin
              </Link>
            </div>
          </div>
        </header>
        <main className="min-h-screen pb-20">
          {children}
        </main>
        <footer className="border-t border-border py-8 mt-12">
          <div className="container text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} mktoolnest. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
