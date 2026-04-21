import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Left side: Hero Image & Quote */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-bg-secondary p-12 overflow-hidden items-end">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&h=1600&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent"></div>
        
        {/* Logo */}
        <div className="absolute top-12 left-12 z-10 flex items-center space-x-2 group">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen size={28} className="text-accent-gold" />
            <span className="font-playfair text-2xl font-bold tracking-wide text-text-primary">
              Reading & Rambles
            </span>
          </Link>
        </div>

        {/* Quote */}
        <div className="relative z-10 max-w-lg">
          <blockquote className="font-playfair text-3xl font-bold text-text-primary leading-tight mb-4 text-glow">
            "A reader lives a thousand lives before he dies. The man who never reads lives only one."
          </blockquote>
          <cite className="font-sans text-sm tracking-widest uppercase text-accent-gold not-italic">
            — George R.R. Martin
          </cite>
        </div>
      </div>

      {/* Right side: Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden flex flex-col items-start gap-2">
           <Link href="/" className="flex items-center space-x-2">
            <BookOpen size={24} className="text-accent-gold" />
            <span className="font-playfair text-xl font-bold text-text-primary">
               R&R
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
