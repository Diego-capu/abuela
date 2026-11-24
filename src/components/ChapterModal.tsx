import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { Chapter } from '../data/abuelaData';
import { compressImage } from '../utils/imageCompressor';

interface ChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterToEdit?: Chapter | null;
  onSave: (chapter: Chapter, isEdit: boolean) => void;
}

export const ChapterModal: React.FC<ChapterModalProps> = ({
  isOpen,
  onClose,
  chapterToEdit,
  onSave,
}) => {
  const isEdit = Boolean(chapterToEdit);

  const [tag, setTag] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [quote, setQuote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (chapterToEdit) {
      setTag(chapterToEdit.tag || '');
      setLocation(chapterToEdit.location || '');
      setDate(chapterToEdit.date || '');
      setTitle(chapterToEdit.title || '');
      setStory(chapterToEdit.story || '');
      setQuote(chapterToEdit.quote || '');
      setImageUrl(chapterToEdit.imageUrl || '');
    } else {
      setTag('Estación 0X');
      setLocation('Lugar // Época');
      setDate('Año o Época');
      setTitle('');
      setStory('');
      setQuote('');
      setImageUrl('/images/abuela/20191103_184529.jpg');
    }
  }, [chapterToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !story.trim()) return;

    const newChapter: Chapter = {
      id: chapterToEdit?.id || `capitulo-${Date.now()}`,
      tag: tag.trim() || 'Estación Temporal',
      location: location.trim() || 'En el Corazón',
      date: date.trim() || 'Tiempo Inolvidable',
      title: title.trim(),
      story: story.trim(),
      quote: quote.trim() || '«Un momento eterno de la Abuela Kata.»',
      imageUrl: imageUrl.trim() || '/images/abuela/20191103_184529.jpg',
    };

    onSave(newChapter, isEdit);
    onClose();
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        const optimized = await compressImage(file, 1600, 1600, 0.82);
        setImageUrl(optimized);
      } catch (err) {
        console.error('Error optimizando imagen:', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-3xl liquid-glass border border-amber-300/80 dark:border-amber-400/30 p-5 sm:p-7 shadow-2xl my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-200/50 dark:border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-serif italic text-slate-900 dark:text-white">
                {isEdit ? 'Editar Estación del Tiempo' : 'Añadir Nueva Estación'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Etiqueta / Estación
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Ej. Estación 01"
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Fecha o Años
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Ej. 1970 - 1980"
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Lugar o Contexto
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej. Casa Familiar // Sala Principal"
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Título del Capítulo
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. La Mesa Donde Todos Cabían"
                required
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Historia / Anécdota
              </label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={3}
                placeholder="Escribe la historia o recuerdo de esta época..."
                required
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Frase Destacada (Opcional)
              </label>
              <input
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="«Una frase inolvidable de la abuela...»"
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Imagen o Foto (Ruta o subir archivo)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/abuela/..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                />
                <label className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-300/40 cursor-pointer flex items-center gap-1 shrink-0">
                  {isCompressing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                      <span>Optimizando...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Subir</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isCompressing}
                    onChange={handleImageFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isCompressing}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isEdit ? 'Guardar Cambios' : 'Añadir Estación'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
