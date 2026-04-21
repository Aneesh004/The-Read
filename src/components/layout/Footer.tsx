import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-white/5 py-12 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4 group inline-flex">
              <div className="text-accent-gold">
                <BookOpen size={24} />
              </div>
              <span className="font-playfair text-xl font-bold tracking-wide text-text-primary">
                Reading & Rambles
              </span>
            </Link>
            <p className="text-text-muted font-serif text-sm max-w-sm mb-6 leading-relaxed">
              Where every page turns into a conversation. Rate, discuss, discover, and join a community of readers who love books as much as you do.
            </p>
            <div className="flex space-x-4">
              {/* Dummy social links */}
              <a href="#" className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center text-text-muted hover:text-accent-gold hover:bg-bg-hover transition-colors">
                𝕏
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center text-text-muted hover:text-accent-gold hover:bg-bg-hover transition-colors">
                IG
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center text-text-muted hover:text-accent-gold hover:bg-bg-hover transition-colors">
                GH
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-fraunces text-lg text-text-primary mb-4">Explore</h4>
            <ul className="space-y-3">
              <li><Link href="/trending" className="text-sm font-sans text-text-secondary hover:text-accent-gold transition-colors">Trending</Link></li>
              <li><Link href="/search" className="text-sm font-sans text-text-secondary hover:text-accent-gold transition-colors">Search Books</Link></li>
              <li><Link href="/community" className="text-sm font-sans text-text-secondary hover:text-accent-gold transition-colors">Community</Link></li>
              <li><Link href="/challenges" className="text-sm font-sans text-text-secondary hover:text-accent-gold transition-colors">Challenges</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-fraunces text-lg text-text-primary mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm font-sans text-text-secondary hover:text-accent-gold transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="text-sm font-sans text-text-secondary hover:text-accent-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm font-sans text-text-secondary hover:text-accent-gold transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-sm font-sans text-text-secondary hover:text-accent-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-sans text-text-muted">
          <p>© {new Date().getFullYear()} Reading & Rambles. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ☕ and 📚 by readers, for readers.</p>
        </div>
      </div>
    </footer>
  );
}
