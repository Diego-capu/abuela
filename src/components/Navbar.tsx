import React, { useState, useEffect } from 'react';
import { Clock, Edit3, Check } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { ThemeToggle } from './ThemeToggle';
import { Saturn02Icon } from './Saturn02Icon';

interface NavbarProps {
  editMode?: boolean;
  onToggleEditMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ editMode = false, onToggleEditMode }) => {
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
          className="flex items-center gap-1.5 group shrink-0"
          aria-label="Inicio — Abuela Kata"
        >
          <div className="relative">
            <Saturn02Icon
              size={22}
              className="text-[#d97706] dark:text-[#fbbf24] transition-transform duration-300 group-hover:rotate-45"
            />
            <Clock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-300 absolute -top-0.5 -right-0.5 animate-pulse" />
          </div>
          <span className="font-hand normal-case text-base sm:text-lg font-semibold tracking-wide text-slate-900 dark:text-white group-hover:text-[#d97706] dark:group-hover:text-[#fbbf24] transition-colors">
            Abuela Kata
          </span>
        </a>

        {/* Actions (Sound toggle, Theme toggle, Edit mode) */}
        <div className="flex items-center gap-2">
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
