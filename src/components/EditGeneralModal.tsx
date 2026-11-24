import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { SITE_CONFIG, MANIFESTO_DATA } from '../data/abuelaData';
import { compressImage } from '../utils/imageCompressor';

interface EditGeneralModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteConfig: typeof SITE_CONFIG;
  manifesto: typeof MANIFESTO_DATA;
  onSave: (config: typeof SITE_CONFIG, manifesto: typeof MANIFESTO_DATA) => void;
}

export const EditGeneralModal: React.FC<EditGeneralModalProps> = ({
  isOpen,
  onClose,
  siteConfig,
  manifesto,
  onSave,
}) => {
  const [abuelaName, setAbuelaName] = useState(siteConfig.abuelaName);
  const [fullName, setFullName] = useState(siteConfig.fullName);
  const [heroSubheadline, setHeroSubheadline] = useState(siteConfig.heroSubheadline);
  const [heroPhoto, setHeroPhoto] = useState(siteConfig.heroPhoto);
  const [manifestoTitle, setManifestoTitle] = useState(manifesto.title);
  const [paragraphsText, setParagraphsText] = useState(manifesto.paragraphs.join('\n\n'));
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAbuelaName(siteConfig.abuelaName);
      setFullName(siteConfig.fullName);
      setHeroSubheadline(siteConfig.heroSubheadline);
      setHeroPhoto(siteConfig.heroPhoto);
      setManifestoTitle(manifesto.title);
      setParagraphsText(manifesto.paragraphs.join('\n\n'));
    }
  }, [isOpen, siteConfig, manifesto]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig = {
      ...siteConfig,
      abuelaName: abuelaName.trim(),
      fullName: fullName.trim(),
      heroSubheadline: heroSubheadline.trim(),
      heroPhoto: heroPhoto.trim(),
    };

    const newManifesto = {
      ...manifesto,
      title: manifestoTitle.trim(),
      paragraphs: paragraphsText
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean),
    };

    onSave(newConfig, newManifesto);
    onClose();
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        const optimized = await compressImage(file, 1600, 1600, 0.82);
        setHeroPhoto(optimized);
      } catch (err) {
        console.error('Error optimizando foto de portada:', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg rounded-3xl liquid-glass border border-amber-300/80 dark:border-amber-400/30 p-5 sm:p-7 shadow-2xl my-8"
        >
          <div className="flex items-center justify-between pb-3 border-b border-amber-200/50 dark:border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-base font-serif italic text-slate-900 dark:text-white">
                Editar Títulos & Carta de la Abuela
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Nombre Cariñoso
                </label>
                <input
                  type="text"
                  value={abuelaName}
                  onChange={(e) => setAbuelaName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Subtítulo de Bienvenida (Hero)
              </label>
              <textarea
                value={heroSubheadline}
                onChange={(e) => setHeroSubheadline(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Foto Principal de Portada
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={heroPhoto}
                  onChange={(e) => setHeroPhoto(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
                <label className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-300/40 cursor-pointer flex items-center gap-1 shrink-0 font-medium">
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

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Título de la Carta / Manifiesto
              </label>
              <input
                type="text"
                value={manifestoTitle}
                onChange={(e) => setManifestoTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Párrafos de la Carta (Separa con doble salto de línea)
              </label>
              <textarea
                value={paragraphsText}
                onChange={(e) => setParagraphsText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white leading-relaxed"
              />
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
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
