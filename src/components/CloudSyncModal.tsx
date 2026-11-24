import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudCheck, CloudOff, X, Check, ExternalLink, Key, Globe } from 'lucide-react';
import {
  isSupabaseConfigured,
  getActiveSupabaseUrl,
  getActiveSupabaseAnonKey,
  configureSupabaseCredentials,
  removeCustomSupabaseCredentials,
} from '../lib/supabase';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionChange?: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  onConnectionChange,
}) => {
  const [url, setUrl] = useState(getActiveSupabaseUrl());
  const [key, setKey] = useState(getActiveSupabaseAnonKey());
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      setStatusMsg({ type: 'error', text: 'Por favor completa la URL y la Anon Key de Supabase.' });
      return;
    }

    if (!url.startsWith('https://') || !url.includes('supabase.co')) {
      setStatusMsg({
        type: 'error',
        text: 'La URL debe comenzar con "https://" y contener "supabase.co".',
      });
      return;
    }

    const success = configureSupabaseCredentials(url, key);
    if (success) {
      setStatusMsg({
        type: 'success',
        text: '¡Conexión exitosa! Ahora todos tus cambios se sincronizarán con Supabase.',
      });
      onConnectionChange?.();
      setTimeout(() => {
        onClose();
      }, 1400);
    } else {
      setStatusMsg({
        type: 'error',
        text: 'No se pudo inicializar Supabase con esas credenciales. Revisa la URL y la Key.',
      });
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('¿Deseas desconectar Supabase de esta sesión? La página volverá al modo de guardado local.')) {
      removeCustomSupabaseCredentials();
      setUrl('');
      setKey('');
      setStatusMsg({ type: 'success', text: 'Supabase desconectado. Modo local activo.' });
      onConnectionChange?.();
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
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-amber-200/50 dark:border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-base font-serif italic text-slate-900 dark:text-white">
                Sincronización en la Nube (Supabase)
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Status Badge */}
          <div className="mb-5 p-3.5 rounded-2xl bg-white/70 dark:bg-white/5 border border-amber-200/60 dark:border-white/10 flex items-start gap-3">
            {isSupabaseConfigured ? (
              <>
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CloudCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Sincronización en la Nube Activa
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    Tus cambios se guardan en Supabase y son visibles en tiempo real para todos los familiares que abran la página.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                  <CloudOff className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    Modo Local Seguro Activo
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    Tus textos y fotos optimizadas se están guardando en la base de datos interna de este dispositivo (IndexedDB). Conecta Supabase abajo para que también se vean en otros teléfonos.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSave} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Project URL de Supabase</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://abcdefghijklm.supabase.co"
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Project API Key (`anon` public)</span>
              </label>
              <textarea
                value={key}
                onChange={(e) => setKey(e.target.value)}
                rows={2}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-white/10 text-slate-900 dark:text-white font-mono text-[10px] break-all"
              />
            </div>

            {/* Help Note */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-300/30 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
              <p className="font-semibold mb-1 flex items-center gap-1">
                <span>¿Dónde encuentras estos datos?</span>
              </p>
              <p>
                En tu panel de <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-medium inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-2.5 h-2.5" /></a>, entra a tu proyecto &gt; <strong>Project Settings ⚙️</strong> &gt; <strong>API</strong>.
              </p>
            </div>

            {statusMsg && (
              <div
                className={`p-2.5 rounded-xl text-xs ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30'
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-2">
              {isSupabaseConfigured && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-medium cursor-pointer"
                >
                  Desconectar Nube
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar y Conectar</span>
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
