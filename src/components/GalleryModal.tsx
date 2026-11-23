import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Check, Image as ImageIcon } from 'lucide-react';
import type { GalleryPhoto } from '../data/abuelaData';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoToEdit?: GalleryPhoto | null;
  onSave: (photo: GalleryPhoto, isEdit: boolean) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  photoToEdit,
  onSave,
}) => {
  const isEdit = Boolean(photoToEdit);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Familia' | 'Celebraciones' | 'Retratos' | 'Años Dorados'>('Familia');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [aspect, setAspect] = useState<'landscape' | 'portrait' | 'square'>('landscape');

  useEffect(() => {
    if (photoToEdit) {
      setTitle(photoToEdit.title || '');
      setCategory(photoToEdit.category || 'Familia');
      setLocation(photoToEdit.location || '');
      setDate(photoToEdit.date || '');
      setImageUrl(photoToEdit.imageUrl || '');
      setCaption(photoToEdit.caption || '');
      setAspect(photoToEdit.aspect || 'landscape');
    } else {
      setTitle('');
      setCategory('Familia');
      setLocation('Reunión Familiar');
      setDate('Año o Fecha');
      setImageUrl('');
      setCaption('');
      setAspect('landscape');
    }
  }, [photoToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const newPhoto: GalleryPhoto = {
      id: photoToEdit?.id || `foto-${Date.now()}`,
      title: title.trim(),
      category,
      location: location.trim() || 'Hogar Familiar',
      date: date.trim() || 'Recuerdo Eterno',
      imageUrl: imageUrl.trim(),
      caption: caption.trim() || 'Un momento lleno de sonrisas y amor.',
      aspect,
    };

    onSave(newPhoto, isEdit);
    onClose();
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-3xl liquid-glass border border-amber-300/80 dark:border-amber-400/30 p-5 sm:p-7 shadow-2xl my-8"
        >
          <div className="flex items-center justify-between pb-3 border-b border-amber-200/50 dark:border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-base font-serif italic text-slate-900 dark:text-white">
                {isEdit ? 'Editar Foto del Álbum' : 'Subir Nueva Foto al Álbum'}
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
                Título del Recuerdo
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Tarde de Café con la Abuela"
                required
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
                >
                  <option value="Familia">Familia</option>
                  <option value="Celebraciones">Celebraciones</option>
                  <option value="Retratos">Retratos</option>
                  <option value="Años Dorados">Años Dorados</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Orientación
                </label>
                <select
                  value={aspect}
                  onChange={(e) => setAspect(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
                >
                  <option value="landscape">Horizontal (16:9)</option>
                  <option value="portrait">Vertical (4:5)</option>
                  <option value="square">Cuadrada (1:1)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Lugar
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej. Casa Familiar"
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Fecha o Año
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Ej. Enero 2019"
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Foto (Subir desde teléfono/PC o ruta)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/abuela/..."
                  required
                  className="flex-1 px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
                <label className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-300/40 cursor-pointer flex items-center gap-1 shrink-0 font-medium">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Subir</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Dedicatoria o Pie de Foto
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
                placeholder="Unas palabras sobre este recuerdo..."
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
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Foto</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
