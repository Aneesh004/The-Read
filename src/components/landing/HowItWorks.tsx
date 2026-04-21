"use client";

import { motion } from "framer-motion";
import { Search, Star, MessageSquareHeart } from "lucide-react";

const steps = [
  {
    icon: <Search size={32} />,
    title: "Discover",
    description: "Search any book, from timeless classics to modern bestsellers, and see exactly what the community thinks.",
    color: "from-accent-sage/20 to-transparent",
    iconColor: "text-accent-sage",
  },
  {
    icon: <Star size={32} />,
    title: "Rate & React",
    description: "Vote with your gut. Skip it, Okish, Good Read, or Must Read. No more bloated 5-star rating systems.",
    color: "from-accent-gold/20 to-transparent",
    iconColor: "text-accent-gold",
  },
  {
    icon: <MessageSquareHeart size={32} />,
    title: "Connect",
    description: "Comment, debate, and join exclusive reading clubs with your book tribe. Shared reading is better reading.",
    color: "from-accent-lavender/20 to-transparent",
    iconColor: "text-accent-lavender",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  },
};

export function HowItWorks() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="font-fraunces text-4xl md:text-5xl text-text-primary mb-6">How It Works</h2>
        <p className="font-serif text-text-secondary max-w-2xl mx-auto text-lg">
          We stripped away the noise so you can focus on what matters, finding great books and talking about them with people who care.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            className="group relative bg-bg-card rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-colors"
          >
            {/* Ambient Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none`}></div>

            <div className={`w-16 h-16 rounded-2xl bg-bg-secondary flex items-center justify-center mb-8 shadow-inner border border-white/5 ${step.iconColor} group-hover:scale-110 transition-transform duration-500`}>
              {step.icon}
            </div>

            <h3 className="font-fraunces text-2xl text-text-primary mb-4">{step.title}</h3>
            <p className="font-sans text-text-secondary leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
