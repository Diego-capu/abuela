import React from 'react';
import confetti from 'canvas-confetti';
import { ArrowUp, RotateCcw, Download } from 'lucide-react';

interface FooterCTAProps {
  onResetData?: () => void;
  onExportData?: () => void;
  editMode?: boolean;
}

export const FooterCTA: React.FC<FooterCTAProps> = ({
  onResetData,
  onExportData,
  editMode = false,
}) => {
  const triggerCelebration = () => {
    // Multi-shot golden and cosmic confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.75 },
      colors: ['#d97706', '#fbbf24', '#f59e0b', '#0284c7', '#ffffff'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#d97706', '#fbbf24', '#f43f5e'],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0284c7', '#38bdf8', '#fbbf24'],
      });
    }, 250);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="celebracion" className="relative pt-24 sm:pt-28 pb-12 overflow-hidden border-t border-amber-200/50 dark:border-white/10 bg-[#faf8f5] dark:bg-[#070d18] transition-colors duration-300">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-96 bg-gradient-to-t from-amber-400/15 via-orange-300/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 mb-16">
        {/* Big CTA Title */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
          ¡Feliz Cumpleaños, <br />
          <span className="not-italic font-bold bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-300 dark:to-yellow-200 bg-clip-text text-transparent">
            Abuela Kata!
          </span>
        </h2>

        <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-700 dark:text-slate-300 font-light leading-relaxed mb-8">
          Que la vida te siga regalando salud, risas infinitas y el amor incondicional
          de toda esta familia que tiene la dicha de caminar a tu lado.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={triggerCelebration}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-600/30 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>¡Lanzar Lluvia de Confeti!</span>
          </button>

          <button
            onClick={scrollToTop}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-full liquid-glass hover:bg-white/90 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-medium text-sm border border-amber-200/70 dark:border-white/10 transition-all hover:scale-105 cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 text-amber-500" />
            <span>Volver al Inicio</span>
          </button>
        </div>

        {/* Editing Management tools (Reset / Export JSON) */}
        {editMode && (
          <div className="mt-10 p-4 rounded-2xl liquid-glass border border-amber-300/50 max-w-md mx-auto flex items-center justify-center gap-3">
            {onExportData && (
              <button
                onClick={onExportData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-medium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Copia JSON</span>
              </button>
            )}

            {onResetData && (
              <button
                onClick={onResetData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-300/40 text-xs font-medium cursor-pointer hover:bg-rose-500 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Valores</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Copyright Subfooter */}
      <div className="max-w-4xl mx-auto px-4 pt-6 border-t border-amber-200/40 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <p>Hecho con todo el amor de la familia para la Abuela Kata • {new Date().getFullYear()}</p>
        <p>Un Viaje en el Tiempo Eterno</p>
      </div>
    </footer>
  );
};
