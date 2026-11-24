import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ZoomIn,
} from 'lucide-react';
import type { Quote } from '../data/abuelaData';
import { QuoteModal } from './QuoteModal';
import { useImageViewer } from '../context/ImageViewerContext';

interface QuotesSectionProps {
  quotes: Quote[];
  editMode?: boolean;
  onUpdateQuotes?: (quotes: Quote[]) => void;
}

export const QuotesSection: React.FC<QuotesSectionProps> = ({
  quotes,
  editMode = false,
  onUpdateQuotes,
}) => {
  const { openImageViewer } = useImageViewer();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null);

  const handleOpenRealSize = (quote: Quote, e?: React.MouseEvent) => {
    e?.stopPropagation();
    openImageViewer({
      src: quote.imageUrl,
      alt: quote.author,
      title: quote.title,
      subtitle: `${quote.author} • ${quote.category}`,
      caption: `«${quote.quote}» — ${quote.context}`,
    });
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [quoteToEdit, setQuoteToEdit] = useState<Quote | null>(null);

  const categories = ['Todas', 'Bendición', 'Cocina', 'Consejo', 'Amor'];

  const filteredQuotes =
    selectedCategory === 'Todas'
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  const handleEdit = (q: Quote) => {
    setQuoteToEdit(q);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setQuoteToEdit(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('¿Deseas eliminar esta frase?')) return;
    const updated = quotes.filter((q) => q.id !== id);
    onUpdateQuotes?.(updated);
  };

  const handleSave = (quote: Quote, isEdit: boolean) => {
    let updated: Quote[];
    if (isEdit) {
      updated = quotes.map((q) => (q.id === quote.id ? quote : q));
    } else {
      updated = [...quotes, quote];
    }
    onUpdateQuotes?.(updated);
  };

  return (
    <section id="frases" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-slate-900 dark:text-white tracking-tight mb-3">
          Frases Célebres de Abuela Kata
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-light">
          Palabras, consejos y bendiciones que han quedado marcadas a fuego en nuestra memoria.
        </p>

        {/* Filter Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 font-medium'
                  : 'liquid-glass text-slate-700 dark:text-slate-300 hover:border-amber-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {editMode && (
          <button
            onClick={handleAdd}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Frase de la Abuela</span>
          </button>
        )}
      </div>

      {/* Quotes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {filteredQuotes.map((q, idx) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="liquid-glass rounded-3xl p-5 sm:p-6 border border-amber-300/70 dark:border-amber-400/20 shadow-md hover:shadow-xl transition-all duration-300 hover:border-amber-400 group flex flex-col justify-between"
          >
            <div>
              {/* Category & Action buttons */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-md bg-amber-500/10">
                  {q.category}
                </span>

                {editMode && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(q)}
                      className="p-1 rounded-md bg-amber-500/10 hover:bg-amber-500 text-amber-700 hover:text-white transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1 rounded-md bg-rose-500/10 hover:bg-rose-500 text-rose-700 hover:text-white transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-serif italic text-slate-900 dark:text-white mb-2">
                {q.title}
              </h3>

              {/* Quote Text */}
              <p className="text-sm sm:text-base font-serif italic text-amber-900 dark:text-amber-200 leading-relaxed pl-3 border-l-2 border-amber-400 my-3">
                {q.quote}
              </p>

              {/* Context */}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span className="font-medium text-slate-700 dark:text-slate-300">Contexto:</span> {q.context}
              </p>
            </div>

            {/* Photo & author thumbnail */}
            <div className="mt-5 pt-3 border-t border-amber-200/40 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  onClick={(e) => handleOpenRealSize(q, e)}
                  className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 border border-amber-300 cursor-zoom-in hover:scale-105 transition-transform"
                  title="Toca para ver la foto en tamaño real"
                >
                  <img src={q.imageUrl} alt={q.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {q.author}
                  </p>
                  <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                    Palabras para la eternidad
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveQuote(q)}
                className="text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 p-1.5 rounded-full hover:bg-amber-500/10 transition-colors cursor-pointer"
                title="Ver foto y frase en grande"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl liquid-glass border border-amber-300/80 dark:border-amber-400/30 p-5 sm:p-7 shadow-2xl"
            >
              <button
                onClick={() => setActiveQuote(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/10 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-black/20 cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div
                onClick={(e) => handleOpenRealSize(activeQuote, e)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-900 group cursor-zoom-in"
                title="Toca para ver la foto en tamaño real 100%"
              >
                <img
                  src={activeQuote.imageUrl}
                  alt={activeQuote.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3.5 py-1.5 rounded-full bg-black/75 text-white text-xs flex items-center gap-1.5 shadow-xl border border-white/20">
                    <ZoomIn className="w-4 h-4 text-amber-300" />
                    <span>Ver en tamaño real</span>
                  </span>
                </div>
              </div>

              <span className="text-xs uppercase font-semibold text-amber-600 dark:text-amber-400">
                {activeQuote.category}
              </span>
              <h3 className="text-xl font-serif italic text-slate-900 dark:text-white mt-1 mb-2">
                {activeQuote.title}
              </h3>
              <p className="text-base sm:text-lg italic font-serif text-amber-900 dark:text-amber-200 p-3 rounded-xl bg-amber-500/10 border border-amber-300/40 mb-3">
                {activeQuote.quote}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {activeQuote.context}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <QuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        quoteToEdit={quoteToEdit}
        onSave={handleSave}
      />
    </section>
  );
};
