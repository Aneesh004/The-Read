"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Book } from "lucide-react";

const books = [
  { id: "comp-1", title: "Quantitative Aptitude", author: "R.S. Aggarwal", cover: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=400&fit=crop" },
  { id: "comp-2", title: "Objective General English", author: "S.P. Bakshi", cover: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=400&fit=crop" },
  { id: "comp-3", title: "Indian Polity", author: "M. Laxmikanth", cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&fit=crop" },
  { id: "comp-4", title: "Word Power Made Easy", author: "Norman Lewis", cover: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=400&fit=crop" },
];

export function CompetitionMayhem() {
  return (
    <section className="py-20 bg-bg-primary overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
          <div>
            <h2 className="font-playfair text-4xl font-bold text-text-primary mb-2">
              Competition Mayhem
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
          {books.map((book, idx) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link href={`/book/search-${encodeURIComponent(book.title)}`} className="group block space-y-3">
                <div className="w-full aspect-[2/3] bg-bg-secondary rounded-lg shadow-xl overflow-hidden relative border border-white/5 group-hover:border-accent-gold/50 transition-all duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-xs font-sans font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1"><Book size={14} /> View Book</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-fraunces font-bold text-text-primary line-clamp-1 group-hover:text-accent-gold transition-colors">
                    {book.title}
                  </h3>
                  <p className="font-sans text-xs text-text-secondary line-clamp-1">
                    {book.author}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
