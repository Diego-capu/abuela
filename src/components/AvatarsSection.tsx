import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Pencil, ZoomIn } from 'lucide-react';
import type { FamilyAvatar } from '../data/abuelaData';
import { EditAvatarRoleModal } from './EditAvatarRoleModal';
import { useImageViewer } from '../context/ImageViewerContext';

interface AvatarsSectionProps {
  avatars: FamilyAvatar[];
  editMode?: boolean;
  onUpdateAvatars?: (avatars: FamilyAvatar[]) => void;
}

export const AvatarsSection: React.FC<AvatarsSectionProps> = ({
  avatars,
  editMode = false,
  onUpdateAvatars,
}) => {
  const { openImageViewer } = useImageViewer();
  const [selectedAvatar, setSelectedAvatar] = useState<FamilyAvatar | null>(null);

  const handleOpenPhoto = (av: FamilyAvatar, e?: React.MouseEvent) => {
    e?.stopPropagation();
    openImageViewer({
      src: av.avatarUrl,
      alt: av.name,
      title: av.name,
      subtitle: `${av.role} • ${av.relation}`,
      caption: `«${av.message}»`,
    });
  };

  const handleSave = (updated: FamilyAvatar) => {
    const list = avatars.map((a) => (a.id === updated.id ? updated : a));
    onUpdateAvatars?.(list);
  };

  return (
    <section id="familia" className="py-20 sm:py-28 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 dark:bg-white/10 border border-amber-300/80 dark:border-amber-400/20 text-xs font-hand text-amber-800 dark:text-amber-300 shadow-sm uppercase mb-3">
          <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>La Tripulación del Viaje</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-slate-900 dark:text-white tracking-tight mb-3">
          Los Pasajeros del Tiempo
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-light">
          Mensajes y dedicatorias de las generaciones que florecieron gracias a la Abuela Kata.
        </p>
      </div>

      {/* Grid of Avatars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {avatars.map((av, idx) => (
          <motion.div
            key={av.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="liquid-glass rounded-3xl p-6 border border-amber-300/70 dark:border-amber-400/20 shadow-md hover:shadow-xl transition-all duration-300 hover:border-amber-400 flex flex-col justify-between group"
          >
            <div>
              {/* Header with Avatar and Role */}
              <div className="flex items-center gap-3.5 mb-4">
                <div
                  onClick={(e) => handleOpenPhoto(av, e)}
                  className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-amber-400 shadow-sm group-hover:scale-105 transition-transform cursor-zoom-in group/avatar"
                  title="Toca para ver la foto en tamaño real"
                >
                  <img
                    src={av.avatarUrl}
                    alt={av.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="w-4 h-4 text-amber-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-serif italic text-slate-900 dark:text-white">
                    {av.name}
                  </h3>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10">
                    {av.role}
                  </span>
                </div>
              </div>

              {/* Message */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed italic border-l-2 border-amber-400/50 pl-3 my-3">
                «{av.message}»
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/40 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-rose-500 font-medium">
                <Heart className="w-3.5 h-3.5 fill-current" />
                {av.relation}
              </span>

              {editMode && (
                <button
                  onClick={() => setSelectedAvatar(av)}
                  className="p-1 rounded-md bg-amber-500/10 hover:bg-amber-500 text-amber-700 hover:text-white transition-colors cursor-pointer"
                  title="Editar mensaje"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <EditAvatarRoleModal
        isOpen={Boolean(selectedAvatar)}
        onClose={() => setSelectedAvatar(null)}
        avatar={selectedAvatar}
        onSave={handleSave}
      />
    </section>
  );
};
