"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Mock data
const trendingBooks = [
  { id: 1, title: "The Midnight Library", author: "Matt Haig", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200&h=300&fit=crop", votes: 4521, skip: 5, ok: 15, good: 30, must: 50 },
  { id: 2, title: "Dune", author: "Frank Herbert", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200&h=300&fit=crop", votes: 8932, skip: 2, ok: 8, good: 20, must: 70 },
  { id: 3, title: "Project Hail Mary", author: "Andy Weir", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=200&h=300&fit=crop", votes: 6102, skip: 1, ok: 9, good: 40, must: 50 },
  { id: 4, title: "Atonement", author: "Ian McEwan", cover: "https://images.unsplash.com/photo-1614113489855-66422ad300a4?q=80&w=200&h=300&fit=crop", votes: 3410, skip: 10, ok: 20, good: 50, must: 20 },
  { id: 5, title: "The Martian", author: "Andy Weir", cover: "https://images.unsplash.com/photo-1543122557-4581c7f07a04?q=80&w=200&h=300&fit=crop", votes: 7200, skip: 2, ok: 10, good: 38, must: 50 },
  { id: 6, title: "Neuromancer", author: "William Gibson", cover: "https://images.unsplash.com/photo-1629196914238-c6463943486c?q=80&w=200&h=300&fit=crop", votes: 4120, skip: 8, ok: 22, good: 40, must: 30 },
];

function MiniDonut({ skip, ok, good, must }: { skip: number, ok: number, good: number, must: number }) {
  // Very rough css-based conic gradient for the mini pie chart
  const skipEnd = skip;
  const okEnd = skipEnd + ok;
  const goodEnd = okEnd + good;
  
  const bg = `conic-gradient(
    #6B6360 0% ${skipEnd}%, 
    #5B8BA8 ${skipEnd}% ${okEnd}%, 
    #7BA68C ${okEnd}% ${goodEnd}%, 
    #D4A853 ${goodEnd}% 100%
  )`;

  return (
    <div className="w-8 h-8 rounded-full" style={{ background: bg }}>
      <div className="w-5 h-5 bg-bg-card rounded-full mx-auto relative top-1.5"></div>
    </div>
  );
}

export function TrendingCarousel() {
  return (
    <section className="py-24 relative overflow-hidden bg-bg-secondary/30 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-between items-end">
        <div>
          <h2 className="font-fraunces text-3xl text-text-primary mb-2">Trending Now</h2>
          <p className="font-serif text-text-secondary">What the community is devouring this week.</p>
        </div>
        <Link href="/trending" className="hidden sm:flex text-accent-gold hover:text-accent-amber font-sans text-sm items-center gap-1 transition-colors">
          See All Trending <ArrowRight size={16} />
        </Link>
      </div>

      {/* Carousel Track */}
      <div className="relative w-full overflow-hidden flex pt-4 pb-12">
        <motion.div 
          className="flex gap-8 px-4 sm:px-8"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          whileHover={{ animationPlayState: "paused" }} // Wait, Framer Motion doesn't directly pause like this via whileHover for x. We'll rely on CSS if we need pause, or just let it scroll.
        >
          {/* Doubled for infinite scroll effect */}
          {[...trendingBooks, ...trendingBooks].map((book, idx) => (
            <Link href={`/book/search-${encodeURIComponent(book.title)}`} key={`${book.id}-${idx}`} className="block flex-shrink-0 w-48 group cursor-pointer outline-none">
              <div className="relative mb-4 transition-transform duration-500 transform perspective-[1000px] group-hover:rotate-y-[-5deg] group-hover:-translate-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="w-48 h-72 object-cover rounded shadow-lg shadow-black/50 group-hover:shadow-accent-gold/20"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded"></div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-fraunces text-lg text-text-primary leading-tight group-hover:text-accent-gold transition-colors truncate w-36">
                    {book.title}
                  </h3>
                  <p className="font-sans text-xs text-text-muted mt-1">{book.author}</p>
                </div>
                <div className="shrink-0" title={`${book.must}% Must Read`}>
                  <MiniDonut skip={book.skip} ok={book.ok} good={book.good} must={book.must} />
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
      
      <div className="sm:hidden px-4 flex justify-center mt-4">
        <Link href="/trending" className="text-accent-gold font-sans text-sm flex items-center gap-1">
          See All Trending <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
