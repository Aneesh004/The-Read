"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// Dummy book covers for floating effect
const floatingBooks = [
  { url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&h=450&fit=crop", top: "10%", left: "10%", delay: 0 },
  { url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&h=450&fit=crop", top: "20%", left: "80%", delay: 1 },
  { url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=300&h=450&fit=crop", top: "60%", left: "5%", delay: 2 },
  { url: "https://images.unsplash.com/photo-1614113489855-66422ad300a4?q=80&w=300&h=450&fit=crop", top: "70%", left: "85%", delay: 1.5 },
];

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden">

      {/* Background Particles / Dust */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-accent-gold/20"
            style={{
              width: Math.random() * 4 + 1 + "px",
              height: Math.random() * 4 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating 3D Books */}
      <div className="absolute inset-0 pointer-events-none z-0 perspective-[1000px]">
        {mounted && floatingBooks.map((book, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-48 md:w-40 md:h-60 rounded-md shadow-2xl shadow-accent-gold/10 hidden md:block"
            style={{ top: book.top, left: book.left }}
            animate={{
              y: [-15, 15, -15],
              rotateY: [-10, 10, -10],
              rotateX: [5, -5, 5],
            }}
            transition={{
              duration: 8,
              delay: book.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.url}
              alt="Book cover"
              className="w-full h-full object-cover rounded-md opacity-40 mix-blend-luminosity hover:mix-blend-normal hover:opacity-100 transition-all duration-500 pointer-events-auto"
            />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-text-primary leading-tight mb-6">
            Where Every Page <br className="hidden md:block" />
            <span className="text-glow text-accent-gold italic">Turns Into a Conversation</span>
          </h1>
          <p className="font-serif text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Rate. Discuss. Discover. Join 50,000+ readers who turned reading into a shared adventure. Find your tribe in the ultimate social book platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-accent-gold text-bg-primary font-sans font-bold rounded-full hover:bg-accent-amber transition-all shadow-lg shadow-accent-gold/20 hover:shadow-accent-gold/40 hover:-translate-y-1">
              Join the Club
            </Link>
            <Link href="/explore" className="w-full sm:w-auto px-8 py-4 border border-white/10 text-text-primary font-sans font-medium rounded-full hover:bg-white/5 transition-all hover:border-white/20">
              Explore Books
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
      </div>
    </section>
  );
}
