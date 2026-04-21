"use client";

import { motion } from "framer-motion";
import { Users, Info } from "lucide-react";

// Mock clubs
const clubs = [
  {
    id: 1,
    name: "Midnight Sci-Fi Readers",
    members: 89,
    book: "Dune",
    banner: "from-purple-900/50 to-bg-card",
    avatars: ["https://api.dicebear.com/8.x/avataaars/svg?seed=Felix", "https://api.dicebear.com/8.x/avataaars/svg?seed=Aneka", "https://api.dicebear.com/8.x/avataaars/svg?seed=Alex"]
  },
  {
    id: 2,
    name: "Cozy Mystery Corner",
    members: 42,
    book: "The Maid",
    banner: "from-amber-900/50 to-bg-card",
    avatars: ["https://api.dicebear.com/8.x/avataaars/svg?seed=Sarah", "https://api.dicebear.com/8.x/avataaars/svg?seed=John", "https://api.dicebear.com/8.x/avataaars/svg?seed=Mia"]
  },
  {
    id: 3,
    name: "Philosopher's Hub",
    members: 100,
    book: "Meditations",
    banner: "from-slate-800/50 to-bg-card",
    avatars: ["https://api.dicebear.com/8.x/avataaars/svg?seed=Marcus", "https://api.dicebear.com/8.x/avataaars/svg?seed=Lucy", "https://api.dicebear.com/8.x/avataaars/svg?seed=Leo"]
  }
];

export function CommunitySpotlight() {
  return (
    <section className="py-24 relative bg-bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Featured Clubs */}
          <div className="lg:col-span-7">
            <h2 className="font-fraunces text-4xl text-text-primary mb-4">Find Your Tribe</h2>
            <p className="font-sans text-text-secondary mb-12 max-w-xl text-lg">
              Reading doesn't have to be a solitary act. Join clubs, host virtual reading sessions, and deep-dive into your favorite genres with readers around the globe.
            </p>

            <div className="space-y-6">
              {clubs.map((club, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  key={club.id} 
                  className="bg-bg-card rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all group overflow-hidden relative cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${club.banner} opacity-30 group-hover:opacity-60 transition-opacity`}></div>
                  <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-fraunces text-xl text-text-primary group-hover:text-accent-gold transition-colors">{club.name}</h3>
                      <p className="font-sans text-sm text-text-muted mt-1 flex items-center gap-2">
                        <BookIcon /> Currently reading: <span className="text-text-secondary italic">{club.book}</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {club.avatars.map((url, idx) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={idx} src={url} alt="member" className="w-8 h-8 rounded-full ring-2 ring-bg-card bg-bg-secondary object-cover" />
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-sans font-medium text-text-secondary bg-bg-secondary px-2 py-1 rounded-full">
                        <Users size={14} /> {club.members}/100
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Handwritten Quote Note */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div 
              initial={{ rotate: 0, scale: 0.9, opacity: 0 }}
              whileInView={{ rotate: 3, scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring" }}
              className="bg-[#EBE2D5] text-[#2C2825] p-8 pb-12 rounded-sm shadow-2xl relative max-w-sm"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #D4A85340 27px, #D4A85340 28px)',
                backgroundPositionY: '34px'
              }}
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 outline outline-offset-4 outline-bg-secondary bg-red-400 rounded-full shadow-md flex items-center justify-center opacity-80">
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              </div>
              
              <p className="font-literata text-lg leading-[28px] mt-6 italic font-medium">
                "I completely missed the foreshadowing in chapter 4! Did anyone else catch how Herbert describes the water discipline here? It completely changes the context of Jessica’s decision."
              </p>
              
              <div className="mt-8 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://api.dicebear.com/8.x/avataaars/svg?seed=Bella" alt="Bella" className="w-10 h-10 rounded-full border border-[#2C2825]" />
                <div>
                  <p className="font-sans font-bold text-sm">@bookish_bella</p>
                  <p className="font-sans text-xs opacity-70">Midnight Sci-Fi Readers club</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
    </svg>
  );
}
