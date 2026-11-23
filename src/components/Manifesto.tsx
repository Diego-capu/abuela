import React from 'react';
import { motion } from 'framer-motion';
import { Scroll, Heart, Edit2 } from 'lucide-react';
import type { MANIFESTO_DATA } from '../data/abuelaData';

interface ManifestoProps {
  data: typeof MANIFESTO_DATA;
  editMode?: boolean;
  onEdit?: () => void;
}

export const Manifesto: React.FC<ManifestoProps> = ({ data, editMode, onEdit }) => {
  return (
    <section id="carta" className="py-20 sm:py-28 px-4 sm:px-6 max-w-4xl mx-auto relative">
      <div className="relative">
        {/* Glow behind card */}
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-b from-amber-400/10 via-amber-200/5 to-transparent blur-2xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="relative liquid-glass rounded-3xl p-6 sm:p-10 md:p-12 border border-amber-300/70 dark:border-amber-400/20 shadow-xl overflow-hidden"
        >
          {/* Header Tag */}
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-300/40 text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-widest">
              <Scroll className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{data.tag}</span>
            </div>

            {editMode && onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500 text-amber-700 hover:text-white transition-colors cursor-pointer"
                title="Editar Carta"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-slate-900 dark:text-white tracking-tight mb-8">
            {data.title}
          </h2>

          {/* Content Paragraphs */}
          <div className="space-y-5 text-base sm:text-lg text-slate-700 dark:text-slate-200 font-light leading-relaxed">
            {data.paragraphs.map((p, index) => (
              <p key={index} className="relative pl-3 sm:pl-4 border-l-2 border-amber-400/50 dark:border-amber-500/40">
                {p}
              </p>
            ))}
          </div>

          {/* Signature & Heart */}
          <div className="mt-10 pt-6 border-t border-amber-200/50 dark:border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <Heart className="w-4 h-4 fill-current animate-pulse" />
              <span className="font-hand text-lg sm:text-xl text-slate-900 dark:text-white font-medium">
                {data.signature}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
