import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  BookOpen,
  X,
  Pencil,
  Trash2,
  Plus,
} from 'lucide-react';
import type { Chapter } from '../data/abuelaData';
import { ChapterModal } from './ChapterModal';

interface ChaptersProps {
  chapters: Chapter[];
  editMode?: boolean;
  onUpdateChapters?: (chapters: Chapter[]) => void;
}

export const Chapters: React.FC<ChaptersProps> = ({
  chapters,
  editMode = false,
  onUpdateChapters,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [chapterToEdit, setChapterToEdit] = useState<Chapter | null>(null);

  const handleEdit = (chapter: Chapter) => {
    setChapterToEdit(chapter);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setChapterToEdit(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta estación?')) return;
    const updated = chapters.filter((c) => c.id !== id);
    onUpdateChapters?.(updated);
  };

  const handleSave = (chapter: Chapter, isEdit: boolean) => {
    let updated: Chapter[];
    if (isEdit) {
      updated = chapters.map((c) => (c.id === chapter.id ? chapter : c));
    } else {
      updated = [...chapters, chapter];
    }
    onUpdateChapters?.(updated);
  };

  return (
    <section id="estaciones" className="py-20 sm:py-28 px-4 sm:px-6 max-w-5xl mx-auto relative">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-slate-900 dark:text-white tracking-tight mb-3">
          Estaciones de una Vida Inolvidable
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-light">
          Un recorrido cronológico por las épocas, sacrificios y bendiciones sembradas por la Abuela Kata.
        </p>

        {editMode && (
          <button
            onClick={handleAdd}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Nueva Estación Temporal</span>
          </button>
        )}
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Central timeline line */}
        <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-amber-400 via-amber-500/50 to-transparent pointer-events-none" />

        <div className="space-y-10 sm:space-y-16">
          {chapters.map((chapter, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`relative flex flex-col sm:flex-row items-start ${
                  isEven ? 'sm:flex-row-reverse' : ''
                } gap-6 sm:gap-12 pl-10 sm:pl-0`}
              >
                {/* Timeline node icon */}
                <div className="absolute left-4 sm:left-1/2 top-4 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 z-10 border-2 border-white dark:border-slate-900">
                  <span className="text-[11px] font-bold">{index + 1}</span>
                </div>

                {/* Card Container (takes half width on desktop, full width on mobile) */}
                <div className="w-full sm:w-[calc(50%-2rem)]">
                  <div className="group liquid-glass rounded-3xl p-5 sm:p-6 border border-amber-300/70 dark:border-amber-400/20 shadow-md hover:shadow-xl transition-all duration-300 hover:border-amber-400">
                    {/* Chapter Header Meta */}
                    <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 font-semibold mb-2">
                      <span className="uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 dark:bg-amber-400/10">
                        {chapter.tag}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-normal">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>{chapter.date}</span>
                      </div>
                    </div>

                    {/* Image Preview */}
                    <div
                      onClick={() => setSelectedChapter(chapter)}
                      className="relative aspect-video sm:aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 my-3.5 cursor-pointer group-hover:brightness-105 transition-all"
                    >
                      <img
                        src={chapter.imageUrl}
                        alt={chapter.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-white text-xs flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          Toca para ver historia completa
                        </span>
                      </div>
                    </div>

                    {/* Title & Story Snippet */}
                    <h3 className="text-lg sm:text-xl font-serif italic text-slate-900 dark:text-white mb-2 leading-tight">
                      {chapter.title}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="line-clamp-1">{chapter.location}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light line-clamp-3 leading-relaxed mb-4">
                      {chapter.story}
                    </p>

                    {/* Quote snippet if any */}
                    {chapter.quote && (
                      <p className="text-xs italic text-amber-800/90 dark:text-amber-300/90 border-l-2 border-amber-400 pl-2.5 mb-4 line-clamp-2">
                        {chapter.quote}
                      </p>
                    )}

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-amber-200/40 dark:border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedChapter(chapter)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Leer Historia</span>
                      </button>

                      {editMode && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEdit(chapter)}
                            className="p-1 rounded-md bg-amber-500/10 hover:bg-amber-500 text-amber-700 hover:text-white transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(chapter.id)}
                            className="p-1 rounded-md bg-rose-500/10 hover:bg-rose-500 text-rose-700 hover:text-white transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Read Chapter Lightbox Modal */}
      <AnimatePresence>
        {selectedChapter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl rounded-3xl liquid-glass border border-amber-300/80 dark:border-amber-400/30 p-5 sm:p-8 shadow-2xl my-8 overflow-hidden"
            >
              <button
                onClick={() => setSelectedChapter(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/10 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-black/20 cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 bg-slate-900 shadow-md">
                <img
                  src={selectedChapter.imageUrl}
                  alt={selectedChapter.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-3 text-xs text-amber-700 dark:text-amber-300 font-semibold mb-2">
                <span>{selectedChapter.tag}</span>
                <span>•</span>
                <span>{selectedChapter.date}</span>
                <span>•</span>
                <span>{selectedChapter.location}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif italic text-slate-900 dark:text-white mb-4">
                {selectedChapter.title}
              </h3>

              <div className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-light leading-relaxed space-y-4 mb-6">
                <p>{selectedChapter.story}</p>
              </div>

              {selectedChapter.quote && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/40 text-amber-900 dark:text-amber-200 italic font-serif text-base sm:text-lg">
                  {selectedChapter.quote}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit/Add Modal */}
      <ChapterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        chapterToEdit={chapterToEdit}
        onSave={handleSave}
      />
    </section>
  );
};
