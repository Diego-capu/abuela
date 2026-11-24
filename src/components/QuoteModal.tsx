import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareQuote, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { Quote } from '../data/abuelaData';
import { compressImage } from '../utils/imageCompressor';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteToEdit?: Quote | null;
  onSave: (quote: Quote, isEdit: boolean) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  quoteToEdit,
  onSave,
}) => {
  const isEdit = Boolean(quoteToEdit);

  const [title, setTitle] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [author, setAuthor] = useState('Abuela Kata');
  const [context, setContext] = useState('');
  const [category, setCategory] = useState<'Bendición' | 'Cocina' | 'Consejo' | 'Amor'>('Bendición');
  const [imageUrl, setImageUrl] = useState('/images/abuela/20191103_184529.jpg');
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (quoteToEdit) {
      setTitle(quoteToEdit.title || '');
      setQuoteText(quoteToEdit.quote || '');
      setAuthor(quoteToEdit.author || 'Abuela Kata');
      setContext(quoteToEdit.context || '');
      setCategory(quoteToEdit.category || 'Bendición');
      setImageUrl(quoteToEdit.imageUrl || '');
    } else {
      setTitle('');
      setQuoteText('');
      setAuthor('Abuela Kata');
      setContext('');
      setCategory('Bendición');
      setImageUrl('/images/abuela/20191103_184529.jpg');
    }
  }, [quoteToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !quoteText.trim()) return;

    const newQuote: Quote = {
      id: quoteToEdit?.id || `frase-${Date.now()}`,
      title: title.trim(),
      quote: quoteText.trim(),
      author: author.trim() || 'Abuela Kata',
      context: context.trim() || 'Dicho inolvidable en familia.',
      category,
      imageUrl: imageUrl.trim() || '/images/abuela/20191103_184529.jpg',
    };

    onSave(newQuote, isEdit);
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
        console.error('Error optimizando foto:', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-3xl liquid-glass border border-amber-300/80 dark:border-amber-400/30 p-5 sm:p-7 shadow-2xl my-8"
        >
          <div className="flex items-center justify-between pb-3 border-b border-amber-200/50 dark:border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-base font-serif italic text-slate-900 dark:text-white">
                {isEdit ? 'Editar Frase de la Abuela' : 'Añadir Frase o Dicho'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Título o Momento
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. La Bendición Diaria"
                required
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
              >
                <option value="Bendición">Bendición</option>
                <option value="Cocina">Cocina</option>
                <option value="Consejo">Consejo</option>
                <option value="Amor">Amor</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Frase Textual
              </label>
              <textarea
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                rows={3}
                placeholder="«Escribe aquí las palabras exactas de la abuela...»"
                required
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white leading-relaxed italic"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Contexto (¿Cuándo o cómo la dice?)
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Ej. Cada vez que salimos de visita..."
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Foto de Acompañamiento
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/abuela/..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
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

            <div className="pt-2 flex items-center justify-end gap-2">
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
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Guardar</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
