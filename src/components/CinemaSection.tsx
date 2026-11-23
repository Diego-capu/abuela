import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Video, Pencil, ExternalLink, AlertTriangle, Upload } from 'lucide-react';
import { CINEMA_CONFIG } from '../data/abuelaData';
import { UploadVideoModal } from './UploadVideoModal';
import { parseVideoUrl } from '../utils/videoParser';

interface CinemaSectionProps {
  cinemaConfig: typeof CINEMA_CONFIG;
  editMode?: boolean;
  onUpdateCinema?: (config: typeof CINEMA_CONFIG) => void;
}

export const CinemaSection: React.FC<CinemaSectionProps> = ({
  cinemaConfig,
  editMode = false,
  onUpdateCinema,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const parsedVideo = useMemo(() => {
    return parseVideoUrl(cinemaConfig.videoUrl);
  }, [cinemaConfig.videoUrl]);

  const handleSaveVideo = (url: string, title?: string) => {
    const updated = {
      ...cinemaConfig,
      videoUrl: url,
      title: title || cinemaConfig.title,
    };
    onUpdateCinema?.(updated);
    setIsPlaying(true);
  };

  return (
    <section id="cine" className="py-20 sm:py-28 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-slate-900 dark:text-white tracking-tight mb-3">
          {cinemaConfig.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-light">
          {cinemaConfig.subtitle}
        </p>

        {/* Video Load Button */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium shadow-md transition-all cursor-pointer"
          >
            {editMode ? <Pencil className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            <span>{cinemaConfig.videoUrl ? 'Cambiar Video Homenaje' : 'Cargar Video de la Familia'}</span>
          </button>
        </div>
      </div>

      {/* Retro Cinema Screen Container */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7 }}
        className="relative rounded-3xl p-3 sm:p-5 liquid-glass border border-amber-300/80 dark:border-amber-400/30 shadow-2xl overflow-hidden bg-slate-950/80"
      >
        {/* Glow ambient reflection behind screen */}
        <div className="absolute -inset-10 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
          {cinemaConfig.videoUrl && isPlaying ? (
            /* ACTIVE PLAYBACK VIEW */
            parsedVideo?.platform === 'google-photos' ? (
              /* Google Photos Specific Warning & Direct Link Fallback */
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900/95">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 mb-3 border border-amber-500/30">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-serif italic mb-2">
                  Enlace de Google Fotos Detectado
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mb-6 leading-relaxed">
                  Por políticas de seguridad y privacidad de Google, los enlaces de Google Fotos no permiten
                  la reproducción embebida directa dentro de páginas web externas (error de bloqueo de marco).
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={parsedVideo.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-lg transition-transform hover:scale-105"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Ver en Google Fotos (Nueva Pestaña)</span>
                  </a>

                  <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Descargar y Subir como Archivo MP4</span>
                  </button>
                </div>
              </div>
            ) : parsedVideo?.platform === 'youtube' || parsedVideo?.platform === 'drive' ? (
              /* YouTube or Google Drive Iframe */
              <iframe
                src={parsedVideo.embedUrl}
                title={cinemaConfig.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              /* Direct HTML5 Video (.mp4, blob:, etc.) */
              <video
                src={cinemaConfig.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            )
          ) : (
            /* POSTER / FACADE VIEW BEFORE PLAYING */
            <div className="relative w-full h-full">
              <img
                src={cinemaConfig.posterUrl}
                alt="Poster Sala de Cine"
                className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col items-center justify-center p-6 text-center text-white">
                <button
                  onClick={() => {
                    if (cinemaConfig.videoUrl) {
                      setIsPlaying(true);
                    } else {
                      setModalOpen(true);
                    }
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/90 hover:bg-amber-500 text-white flex items-center justify-center shadow-xl shadow-amber-500/40 transition-transform hover:scale-110 cursor-pointer mb-4"
                  aria-label="Reproducir video de la abuela"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
                </button>

                <h3 className="text-lg sm:text-2xl font-serif italic mb-1">
                  {cinemaConfig.videoUrl ? 'Reproducir Homenaje' : 'Homenaje en Video: Abuela Kata'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md font-light leading-relaxed">
                  {cinemaConfig.videoUrl
                    ? 'Toca para iniciar la reproducción'
                    : 'Toca el botón para cargar el video en MP4, YouTube o Google Drive.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Screen Bottom Bar / Caption */}
        {cinemaConfig.caption && (
          <div className="mt-3.5 px-3 py-2 text-center text-xs text-slate-400">
            <span className="italic">{cinemaConfig.caption}</span>
          </div>
        )}
      </motion.div>

      <UploadVideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveVideo}
      />
    </section>
  );
};
