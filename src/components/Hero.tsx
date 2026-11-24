import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Edit2, ZoomIn } from 'lucide-react';
import type { SITE_CONFIG } from '../data/abuelaData';
import { useImageViewer } from '../context/ImageViewerContext';

interface HeroProps {
  config: typeof SITE_CONFIG;
  editMode?: boolean;
  onEdit?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ config, editMode, onEdit }) => {
  const { openImageViewer } = useImageViewer();

  const handleOpenPhoto = () => {
    openImageViewer({
      src: config.heroPhoto,
      alt: config.abuelaName,
      title: config.fullName,
      subtitle: 'Foto de Portada • ' + config.abuelaName,
      caption: config.heroSubheadline,
    });
  };
  return (
    <section
      id="inicio"
      className="relative flex min-h-[92vh] sm:min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-24 sm:pt-28 pb-12"
      style={{ isolation: 'isolate' }}
    >
      {/* Background Ambient Glows & Stardust */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-gradient-to-tr from-amber-400/20 via-orange-300/15 to-sky-400/10 rounded-full blur-3xl opacity-70 dark:opacity-40" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full">
        {/* Main Serif Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] italic leading-[1.08] tracking-tight text-slate-900 dark:text-white max-w-3xl"
        >
          Un Viaje en el Tiempo: <br />
          <span className="not-italic font-bold bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 dark:from-amber-300 dark:via-amber-200 dark:to-yellow-200 bg-clip-text text-transparent">
            {config.abuelaName}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-4 sm:mt-5 max-w-xl text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 font-light leading-relaxed px-2"
        >
          {config.heroSubheadline}
        </motion.p>

        {/* Central Featured Portrait with Temporal Aura */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mt-8 sm:mt-10 group"
        >
          {/* Animated Halo Rings */}
          <div className="absolute -inset-3 sm:-inset-4 rounded-3xl bg-gradient-to-r from-amber-500/30 via-orange-400/20 to-yellow-400/30 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
          
          <div
            onClick={handleOpenPhoto}
            className="relative rounded-2xl sm:rounded-3xl p-2 liquid-glass border border-amber-300/80 dark:border-amber-400/30 shadow-2xl overflow-hidden max-w-[280px] sm:max-w-[340px] md:max-w-[380px] cursor-zoom-in"
            title="Toca para ver la foto en tamaño real"
          >
            <div className="relative aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img
                src={config.heroPhoto}
                alt={config.abuelaName}
                className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Hover Zoom Icon Badge */}
              <div className="absolute top-3 left-3 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md shadow-md pointer-events-none flex items-center gap-1 text-[11px]">
                <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
                <span className="pr-1">Tamaño real</span>
              </div>
              
              {/* Photo Caption Overlay */}
              <div className="absolute bottom-3 inset-x-3 text-left text-white drop-shadow-md">
                <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  Nuestra Gran Capitana
                </p>
                <p className="text-sm sm:text-base font-medium line-clamp-1">
                  {config.fullName}
                </p>
              </div>
            </div>

            {/* Quick Edit Overlay Button */}
            {editMode && onEdit && (
              <button
                onClick={onEdit}
                className="absolute top-4 right-4 p-2 rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-600 transition-colors cursor-pointer"
                title="Editar información de portada"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
