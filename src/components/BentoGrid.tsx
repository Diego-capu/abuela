import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Utensils, Sparkles, Users, Sun, Shield } from 'lucide-react';
import type { Pillar } from '../data/abuelaData';

interface BentoGridProps {
  pillars: Pillar[];
  editMode?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />,
  Utensils: <Utensils className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-yellow-500" />,
  Users: <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
  Sun: <Sun className="w-5 h-5 text-amber-500" />,
  Shield: <Shield className="w-5 h-5 text-emerald-500" />,
};

export const BentoGrid: React.FC<BentoGridProps> = ({ pillars }) => {
  return (
    <section id="pilares" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-slate-900 dark:text-white tracking-tight mb-3">
          Lo Que Sostiene a Nuestra Familia
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-light">
          Cuatro pilares inquebrantables que la Abuela Kata nos ha regalado con su ejemplo diario.
        </p>
      </div>

      {/* Grid of 4 liquid glass cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="liquid-glass rounded-3xl p-6 flex flex-col justify-between group transition-all duration-300 hover:border-amber-400 dark:hover:border-amber-400/40 hover:shadow-xl h-full border border-amber-300/70 dark:border-amber-400/20"
          >
            <div>
              {/* Badge & Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-white/10 group-hover:scale-110 transition-transform">
                  {iconMap[pillar.icon] || <Sparkles className="w-5 h-5 text-amber-500" />}
                </div>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  {pillar.badge}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-serif italic text-slate-900 dark:text-white mb-2.5">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                {pillar.description}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-amber-200/40 dark:border-white/10 flex items-center justify-between text-[11px] text-amber-600/80 dark:text-amber-400/80">
              <span>Legado Permanente</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
