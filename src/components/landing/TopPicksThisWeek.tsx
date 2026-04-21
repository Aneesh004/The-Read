"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, ShoppingCart } from "lucide-react";

export function TopPicksThisWeek() {
  const topPicks = [
    {
      id: "mock-pick-1",
      title: "Tomorrow, and Tomorrow, and Tomorrow",
      author: "Gabrielle Zevin",
      cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&fit=crop",
      summary: "In this beautifully crafted novel, two childhood friends reunite and build a successful video game company, navigating love, tragedy, and creativity.",
      votes: { skip: 2, okish: 5, goodRead: 45, mustRead: 88 }
    },
    {
      id: "mock-pick-2",
      title: "Lessons in Chemistry",
      author: "Bonnie Garmus",
      cover: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600&fit=crop",
      summary: "A fierce, funny, and deeply unconventional heroine battles sexism in the 1960s scientific community while accidentally becoming the star of a beloved TV cooking show.",
      votes: { skip: 1, okish: 12, goodRead: 56, mustRead: 78 }
    },
    {
      id: "mock-pick-3",
      title: "A Court of Thorns and Roses",
      author: "Sarah J. Maas",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&fit=crop",
      summary: "When nineteen-year-old huntress Feyre kills a wolf in the woods, a beast-like creature arrives to demand retribution for it, pulling her into a magical realm.",
      votes: { skip: 15, okish: 20, goodRead: 60, mustRead: 112 }
    },
    {
      id: "mock-pick-4",
      title: "The Silent Patient",
      author: "Alex Michaelides",
      cover: "https://images.unsplash.com/photo-1614728423169-3f65fd722b05?q=80&w=600&fit=crop",
      summary: "Alicia Berenson’s life is seemingly perfect until she shoots her husband five times in the face and then never speaks another word.",
      votes: { skip: 5, okish: 10, goodRead: 30, mustRead: 95 }
    },
    {
      id: "mock-pick-5",
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&fit=crop",
      summary: "Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.",
      votes: { skip: 0, okish: 4, goodRead: 41, mustRead: 105 }
    }
  ];

  return (
    <section className="py-20 relative bg-[#09070A]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-16 flex items-center gap-4">
          <BookOpen className="text-accent-gold opacity-50" size={32} />
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-text-primary">
            Top Picks This Week
          </h2>
        </div>

        <div className="space-y-16">
          {topPicks.slice(0, 4).map((book, idx) => {
            const totalVotes = book.votes.skip + book.votes.okish + book.votes.goodRead + book.votes.mustRead;
            const mustReadPc = Math.round((book.votes.mustRead / totalVotes) * 100);

            return (
              <Link href={`/book/search-${encodeURIComponent(book.title)}`} key={book.id} className="block relative flex items-center py-16 overflow-hidden rounded-[2.5rem] border border-white/5 bg-bg-card/30 group hover:bg-bg-card/50 transition-colors">
                {/* Blurred Background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-3xl opacity-20 scale-110"
                  style={{ backgroundImage: `url(${book.cover})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-bg-primary/40"></div>

                <div className="relative z-10 w-full px-6 md:px-10 lg:px-16">
                  <div className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
                    
                    {/* Book Cover */}
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="shrink-0 group perspective-[1000px]"
                    >
                      <div className={`relative w-64 md:w-80 h-96 md:h-[30rem] rounded-md shadow-2xl shadow-accent-gold/20 transform transition-transform duration-700 hover:rotate-x-[5deg] ${idx % 2 === 0 ? 'hover:rotate-y-[-10deg]' : 'hover:rotate-y-[10deg]'}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={book.cover} 
                          alt={book.title} 
                          className="w-full h-full object-cover rounded-md"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-md"></div>
                        <div className="absolute -inset-4 bg-accent-gold/20 blur-2xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      </div>
                    </motion.div>

                    {/* Details */}
                    <motion.div 
                      initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="flex-1"
                    >

                      <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-2 leading-tight">
                        {book.title}
                      </h2>
                      <p className="font-sans text-xl text-text-secondary mb-8">by <span className="text-text-primary">{book.author}</span></p>
                      
                      <p className="font-serif text-lg text-text-muted leading-relaxed mb-8 max-w-2xl">
                        {book.summary}
                      </p>

                      {/* Social Proof */}
                      <div className="bg-bg-card border border-white/5 p-6 rounded-2xl flex items-center gap-6 max-w-md shadow-xl">
                        <div className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center relative bg-bg-secondary" 
                          style={{ background: `conic-gradient(#D4A853 0% ${mustReadPc}%, #6B6360 ${mustReadPc}% 100%)` }}>
                          <div className="w-12 h-12 bg-bg-card rounded-full flex items-center justify-center font-sans font-bold text-accent-gold text-sm shadow-inner">
                            {mustReadPc}%
                          </div>
                        </div>
                        <div>
                          <p className="font-sans font-bold text-text-primary text-lg">MUST READ</p>
                          <p className="font-sans text-sm text-text-muted">This week, {totalVotes.toLocaleString()} readers voted</p>
                        </div>
                      </div>
                    </motion.div>

                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
