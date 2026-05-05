"use client";

import Link from "next/link";
import { Search, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-bg-primary/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="font-playfair text-2xl font-bold tracking-wide text-text-primary group-hover:text-glow transition-all">
              Readings &amp; Rambles
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/wishlist" className="text-sm font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors">
              Community
            </Link>
            <Link href="/book-clubs" className="text-sm font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors">
              Book Clubs
            </Link>
            <Link href="/search" className="text-sm font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors flex items-center gap-2">
              <Search size={16} /> Search
            </Link>
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-sans font-medium text-text-primary hover:text-accent-gold transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-sm font-sans font-medium text-text-secondary hover:text-accent-rose transition-colors"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-sans font-medium text-text-primary hover:text-accent-gold transition-colors">
                  Sign in
                </Link>
                <Link href="/signup" className="text-sm font-sans font-medium bg-accent-gold text-bg-primary px-5 py-2.5 rounded-full hover:bg-accent-amber transition-colors shadow-lg shadow-accent-gold/20 hover:shadow-accent-gold/40">
                  Join the Club
                </Link>
              </>
            )}
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
              <Link href="/wishlist" onClick={() => setIsOpen(false)} className="block text-base font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors">Community</Link>
              <Link href="/book-clubs" onClick={() => setIsOpen(false)} className="block text-base font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors">Book Clubs</Link>
              <Link href="/search" onClick={() => setIsOpen(false)} className="block text-base font-sans font-medium text-text-secondary hover:text-accent-gold transition-colors">Search</Link>

              <div className="pt-4 border-t border-white/5 space-y-4">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block text-base font-sans font-medium text-text-primary hover:text-accent-gold transition-colors">
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { setIsOpen(false); handleSignOut(); }}
                      className="block w-full text-left text-base font-sans font-medium text-text-secondary hover:text-accent-rose transition-colors"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="block text-base font-sans font-medium text-text-primary hover:text-accent-gold transition-colors">Sign in</Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)} className="block text-base font-sans font-medium bg-accent-gold text-bg-primary px-4 py-3 rounded-lg hover:bg-accent-amber transition-colors text-center shadow-lg shadow-accent-gold/20">
                      Join the Club
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
