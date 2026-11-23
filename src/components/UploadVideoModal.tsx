import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, X, Check, Video as VideoIcon, AlertTriangle, FileVideo, Loader2, Cloud } from 'lucide-react';
import { isSupabaseConfigured, addVideoToSupabase } from '../lib/supabase';
import { parseVideoUrl } from '../utils/videoParser';

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (videoUrl: string, title?: string) => void;
}

export const UploadVideoModal: React.FC<UploadVideoModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isGooglePhotos =
    videoUrl.includes('photos.app.goo.gl') ||
    videoUrl.includes('photos.google.com');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    const cleanTitle = title.trim() || 'Homenaje a Abuela Kata';
    const cleanUrl = videoUrl.trim();
    const parsed = parseVideoUrl(cleanUrl);

    setIsSubmitting(true);
    setStatusMsg(isSupabaseConfigured ? 'Guardando en la nube (Supabase)...' : null);

    if (isSupabaseConfigured) {
      try {
        await addVideoToSupabase({
          title: cleanTitle,
          author: 'Familia',
          videoUrl: parsed?.directUrl || cleanUrl,
          platform: parsed?.platform || 'drive',
          embedUrl: parsed?.embedUrl || cleanUrl,
          thumbnailUrl: parsed?.thumbnailUrl,
          tag: 'Abuela Kata',
        });
        setStatusMsg('¡Guardado en la nube con éxito!');
      } catch (err) {
        console.warn('Error al sincronizar con Supabase:', err);
      }
    }

    onSave(cleanUrl, cleanTitle);
    setIsSubmitting(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUseSample = () => {
    setVideoUrl('/videos/video_abuela.mp4');
    if (!title) setTitle('Video de Recuerdos de Abuela Kata');
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
              <Film className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-base font-serif italic text-slate-900 dark:text-white">
                Cargar Video de la Abuela
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Title field */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Título del Video (Opcional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Saludos de la Familia para Kata"
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            {/* Video File / URL field */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Archivo de Video o Enlace (Recomendado: Subir archivo MP4)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Pega un enlace de YouTube, Google Drive o sube un archivo..."
                  required
                  className="flex-1 px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
                <label className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md">
                  <VideoIcon className="w-3.5 h-3.5" />
                  <span>Subir Archivo</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Warning if Google Photos URL */}
            {isGooglePhotos && (
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <p className="font-semibold mb-1">¿Por qué Google Fotos no reproduce directamente en webs?</p>
                  <p>
                    Google bloquea por seguridad que sus enlaces compartidos se reproduzcan dentro de páginas web externas (error de marco bloqueado).
                  </p>
                  <p className="mt-1 font-medium text-amber-800 dark:text-amber-300">
                    Solución fácil: Descarga el video desde tu Google Fotos a tu teléfono o PC y pulsa el botón naranja <strong>"Subir Archivo"</strong> de arriba para que se reproduzca en la pantalla al instante.
                  </p>
                </div>
              </div>
            )}

            {/* Helper tips */}
            <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[11px] space-y-1">
              <p className="font-semibold text-slate-800 dark:text-white">Formatos 100% compatibles:</p>
              <p>• <strong>Archivos locales (MP4, WEBM, MOV)</strong>: Usa el botón "Subir Archivo" (¡funciona siempre!).</p>
              <p>• <strong>YouTube</strong>: Enlaces normales o Shorts.</p>
              <p>• <strong>Google Drive</strong>: Enlace con acceso público ("Cualquiera con el enlace").</p>
            </div>

            {/* Supabase status indicator */}
            {statusMsg && (
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                <Cloud className="w-4 h-4 animate-pulse" />
                <span>{statusMsg}</span>
              </div>
            )}

            {/* Quick sample button */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleUseSample}
                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FileVideo className="w-3.5 h-3.5" />
                <span>Usar video de ejemplo de la carpeta</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-medium flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Guardar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
