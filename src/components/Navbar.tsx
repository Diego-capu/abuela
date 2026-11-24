import React, { useState, useEffect } from 'react';
import { Edit3, Check, CloudCheck, CloudOff } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  editMode?: boolean;
  onToggleEditMode?: () => void;
  isCloudConnected?: boolean;
  onOpenCloudSync?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  editMode = false,
  onToggleEditMode,
  isCloudConnected = false,
  onOpenCloudSync,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-3 inset-x-0 z-50 mx-auto max-w-4xl px-3 sm:px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center justify-between rounded-full transition-all duration-300 py-2 px-3 sm:px-5 ${
          scrolled
            ? 'liquid-pill bg-white/95 dark:bg-[#0b1526]/90 shadow-lg shadow-amber-950/5 dark:shadow-black/50 border-amber-200/80 dark:border-amber-400/20'
            : 'liquid-pill bg-white/85 dark:bg-[#0b1526]/75 border-amber-100/70 dark:border-white/10'
        }`}
      >
        {/* Brand Logo */}
        <a
          href="#inicio"
          className="flex items-center gap-2 group shrink-0"
          aria-label="Inicio — Abuela Kata"
        >
          <img
            src="/logo.png"
            alt="Logo Feliz Cumpleaños Abuela Kata"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
          />
          <span className="font-hand normal-case text-base sm:text-lg font-semibold tracking-wide text-slate-900 dark:text-white group-hover:text-[#d97706] dark:group-hover:text-[#fbbf24] transition-colors">
            Abuela Kata
          </span>
        </a>

        {/* Actions (Sound toggle, Theme toggle, Edit mode, Cloud sync) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Cloud Sync Status Button */}
          {onOpenCloudSync && (
            <button
              onClick={onOpenCloudSync}
              title={
                isCloudConnected
                  ? 'Sincronizado en la nube (Supabase)'
                  : 'Modo Local (Clic para conectar Supabase)'
              }
              className={`p-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 text-xs px-2.5 ${
                isCloudConnected
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-500/30 hover:bg-emerald-500/25'
                  : 'bg-white/80 dark:bg-white/10 text-slate-700 dark:text-slate-300 border-amber-200/60 dark:border-white/10 hover:border-amber-400'
              }`}
            >
              {isCloudConnected ? (
                <>
                  <CloudCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[11px] font-medium hidden md:inline">Nube</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="text-[11px] font-medium hidden md:inline">Local</span>
                </>
              )}
            </button>
          )}

          {/* Edit Mode Toggle */}
          {onToggleEditMode && (
            <button
              onClick={onToggleEditMode}
              title={editMode ? 'Finalizar Edición' : 'Modo Edición'}
              className={`p-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 text-xs px-2.5 ${
                editMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md animate-pulse'
                  : 'bg-white/80 dark:bg-white/10 text-slate-700 dark:text-slate-200 border-amber-200/60 dark:border-white/10 hover:border-amber-400'
              }`}
            >
              {editMode ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium hidden sm:inline">Listo</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium hidden sm:inline">Editar</span>
                </>
              )}
            </button>
          )}

          <ThemeToggle />
          <AudioPlayer />
        </div>
      </nav>
    </header>
  );
};
