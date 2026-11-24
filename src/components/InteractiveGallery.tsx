import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ZoomIn,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import type { GalleryPhoto } from '../data/abuelaData';
import { GalleryModal } from './GalleryModal';
import { useImageViewer } from '../context/ImageViewerContext';

interface InteractiveGalleryProps {
  photos: GalleryPhoto[];
  editMode?: boolean;
  onUpdatePhotos?: (photos: GalleryPhoto[]) => void;
}

export const InteractiveGallery: React.FC<InteractiveGalleryProps> = ({
  photos,
  editMode = false,
  onUpdatePhotos,
}) => {
  const { openImageViewer } = useImageViewer();
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [photoToEdit, setPhotoToEdit] = useState<GalleryPhoto | null>(null);

  const handleOpenRealSize = (photo: GalleryPhoto, e?: React.MouseEvent) => {
    e?.stopPropagation();
    openImageViewer({
      src: photo.imageUrl,
      alt: photo.title,
      title: photo.title,
      subtitle: `${photo.category} • ${photo.date} • ${photo.location}`,
      caption: photo.caption,
    });
  };

  const categories = ['Todas', 'Familia', 'Celebraciones', 'Retratos', 'Años Dorados'];

  const filteredPhotos =
    activeCategory === 'Todas'
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  const handleEdit = (p: GalleryPhoto) => {
    setPhotoToEdit(p);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setPhotoToEdit(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('¿Deseas eliminar esta fotografía?')) return;
    const updated = photos.filter((p) => p.id !== id);
    onUpdatePhotos?.(updated);
  };

  const handleSave = (photo: GalleryPhoto, isEdit: boolean) => {
    let updated: GalleryPhoto[];
    if (isEdit) {
      updated = photos.map((p) => (p.id === photo.id ? photo : p));
    } else {
      updated = [photo, ...photos];
    }
    onUpdatePhotos?.(updated);
  };

  const handlePrev = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev! > 0 ? prev! - 1 : filteredPhotos.length - 1
    );
  };

  const handleNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev! < filteredPhotos.length - 1 ? prev! + 1 : 0
    );
  };

  const selectedPhoto =
    selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  return (
    <section id="galeria" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-slate-900 dark:text-white tracking-tight mb-3">
          El Archivo Visual de Abuela Kata
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-light">
          Décadas de sonrisas, abrazos y momentos que desafían el olvido.
        </p>

        {/* Categories Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 font-medium'
                  : 'liquid-glass text-slate-700 dark:text-slate-300 hover:border-amber-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Upload Button */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Subir Foto desde Celular/PC</span>
          </button>
        </div>
      </div>

      {/* Grid of Photos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
            className="group relative rounded-2xl overflow-hidden liquid-glass border border-amber-300/60 dark:border-amber-400/20 shadow-md hover:shadow-xl transition-all duration-300 hover:border-amber-400 flex flex-col"
          >
            {/* Image Container with Aspect Ratio */}
            <div
              onClick={() => handleOpenRealSize(photo)}
              className={`relative overflow-hidden bg-slate-900 cursor-zoom-in ${
                photo.aspect === 'portrait'
                  ? 'aspect-[3/4]'
                  : photo.aspect === 'square'
                  ? 'aspect-square'
                  : 'aspect-[4/3]'
              }`}
              title="Toca para ver en tamaño real"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5 sm:p-3 text-white">
                <div className="self-end p-1.5 rounded-full bg-black/60 backdrop-blur-xs flex items-center gap-1 text-[10px]">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Tamaño real</span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold line-clamp-1">{photo.title}</p>
                  <p className="text-[9px] text-amber-300">{photo.date}</p>
                </div>
              </div>
            </div>

            {/* Bottom Caption Card */}
            <div
              onClick={() => setSelectedPhotoIndex(index)}
              className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-amber-700 dark:text-amber-400 mb-1">
                  <span className="font-semibold uppercase tracking-wider">{photo.category}</span>
                  <span className="text-slate-500 dark:text-slate-400">{photo.date}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-serif italic text-slate-900 dark:text-white line-clamp-1">
                  {photo.title}
                </h4>
              </div>

              {editMode && (
                <div className="mt-2 pt-2 border-t border-amber-200/40 dark:border-white/10 flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleEdit(photo)}
                    className="p-1 rounded-md bg-amber-500/10 hover:bg-amber-500 text-amber-700 hover:text-white transition-colors cursor-pointer"
                    title="Editar"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="p-1 rounded-md bg-rose-500/10 hover:bg-rose-500 text-rose-700 hover:text-white transition-colors cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal with Carousel Controls */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal Body */}
            <motion.div
              key={selectedPhoto.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative max-w-3xl w-full max-h-[90vh] flex flex-col rounded-3xl liquid-glass border border-amber-300/80 dark:border-amber-400/30 overflow-hidden shadow-2xl bg-slate-900/90 text-white"
            >
              <div
                onClick={(e) => handleOpenRealSize(selectedPhoto, e)}
                className="relative flex-1 min-h-[300px] sm:min-h-[450px] bg-black flex items-center justify-center overflow-hidden cursor-zoom-in group"
                title="Toca para ver la foto en tamaño real 100%"
              >
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="max-h-[65vh] w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-amber-500 text-white text-xs flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Tamaño real</span>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-slate-900/95 border-t border-white/10">
                <div className="flex items-center gap-3 text-xs text-amber-400 mb-1 font-semibold">
                  <span>{selectedPhoto.category}</span>
                  <span>•</span>
                  <span>{selectedPhoto.date}</span>
                  <span>•</span>
                  <span>{selectedPhoto.location}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif italic text-white mb-2">
                  {selectedPhoto.title}
                </h3>
                <p className="text-sm text-slate-300 font-light leading-relaxed">
                  {selectedPhoto.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <GalleryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        photoToEdit={photoToEdit}
        onSave={handleSave}
      />
    </section>
  );
};
