import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Check, Image as ImageIcon } from 'lucide-react';
import type { FamilyAvatar } from '../data/abuelaData';

interface EditAvatarRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatar: FamilyAvatar | null;
  onSave: (avatar: FamilyAvatar) => void;
}

export const EditAvatarRoleModal: React.FC<EditAvatarRoleModalProps> = ({
  isOpen,
  onClose,
  avatar,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (avatar) {
      setName(avatar.name || '');
      setRelation(avatar.relation || '');
      setRole(avatar.role || '');
      setMessage(avatar.message || '');
      setAvatarUrl(avatar.avatarUrl || '');
    }
  }, [avatar, isOpen]);

  if (!isOpen || !avatar) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...avatar,
      name: name.trim() || avatar.name,
      relation: relation.trim() || avatar.relation,
      role: role.trim() || avatar.role,
      message: message.trim() || avatar.message,
      avatarUrl: avatarUrl.trim() || avatar.avatarUrl,
    });
    onClose();
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md rounded-3xl liquid-glass border border-amber-300/80 dark:border-amber-400/30 p-5 sm:p-7 shadow-2xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-amber-200/50 dark:border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-serif italic text-slate-900 dark:text-white">
                Editar Dedicatoria de la Familia
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
                Nombre o Grupo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Parentesco
                </label>
                <input
                  type="text"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  placeholder="Ej. Nietas y Nietos"
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Rol Cariñoso
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ej. Los Consentidos"
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Mensaje de Felicitación
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                required
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Foto de Avatar (Ruta o subir archivo)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
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
                <span>Guardar Mensaje</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
