"use client";

import Link from "next/link";
import { BookOpen, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-bg-primary/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-accent-gold transition-transform group-hover:scale-110"> </div>
            <span className="font-playfair text-2xl font-bold tracking-wide text-text-primary group-hover:text-glow transition-all">
            Readings <span className="font-sans">&</span> Rambles </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/trending" className="text-sm font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors">
              Trending
            </Link>
            <Link href="/community" className="text-sm font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors">
              Community
            </Link>
            <Link href="/book-clubs" className="text-sm font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors">
              Book Clubs
            </Link>
            <Link href="/search" className="text-sm font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors flex items-center gap-2">
              <Search size={16} /> 
            </Link>
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-sm font-sans font-medium text-text-primary hover:text-accent-gold transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm font-sans font-medium bg-accent-gold text-bg-primary px-5 py-2.5 rounded-full hover:bg-accent-amber transition-colors shadow-lg shadow-accent-gold/20 hover:shadow-accent-gold/40">
              Join the Club
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-text-primary hover:text-accent-gold transition-colors">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-bg-secondary w-full border-b border-white/5 absolute top-20 left-0"
          >
            <div className="px-4 pt-4 pb-6 space-y-4 shadow-xl">
              <Link href="/trending" className="block text-base font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors">
                Trending
              </Link>
              <Link href="/community" className="block text-base font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors">
                Community
              </Link>
              <Link href="/book-clubs" className="block text-base font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors">
                Book Clubs
              </Link>
              <Link href="/search" className="block text-base font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors">
                Search
              </Link>
              <div className="pt-4 border-t border-white/5 space-y-4">
                <Link href="/login" className="block text-base font-sans font-medium text-text-primary hover:text-accent-gold transition-colors">
                  Sign in
                </Link>
                <Link href="/signup" className="block text-base font-sans font-medium bg-accent-gold text-bg-primary px-4 py-3 rounded-lg hover:bg-accent-amber transition-colors text-center shadow-lg shadow-accent-gold/20">
                  Join the Club
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
