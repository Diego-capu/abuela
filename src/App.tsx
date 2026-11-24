import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Cloud, HardDrive } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { Chapters } from './components/Chapters';
import { BentoGrid } from './components/BentoGrid';
import { QuotesSection } from './components/QuotesSection';
import { InteractiveGallery } from './components/InteractiveGallery';
import { CinemaSection } from './components/CinemaSection';
import { AvatarsSection } from './components/AvatarsSection';
import { FooterCTA } from './components/FooterCTA';
import { EditGeneralModal } from './components/EditGeneralModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { ImageViewerProvider } from './context/ImageViewerContext';
import { ImageViewerModal } from './components/ImageViewerModal';

import {
  getStoredSiteConfig,
  getStoredManifesto,
  getStoredChapters,
  getStoredPillars,
  getStoredQuotes,
  getStoredGallery,
  getStoredAvatars,
  getStoredCinema,
  saveSiteConfig,
  saveManifesto,
  saveChapters,
  saveQuotes,
  saveGallery,
  saveAvatars,
  saveCinema,
  hydrateFromStorage,
  resetAllToDefaults,
} from './data/abuelaStorage';

import {
  isSupabaseConfigured,
  fetchRemoteChapters,
  saveChapterToSupabase,
  fetchRemoteQuotes,
  saveQuoteToSupabase,
  fetchRemoteGallery,
  saveGalleryPhotoToSupabase,
  fetchRemoteAvatarRoles,
  updateAvatarRoleInSupabase,
} from './lib/supabase';

import type {
  Chapter,
  Quote,
  GalleryPhoto,
  FamilyAvatar,
} from './data/abuelaData';

export function App(): React.JSX.Element {
  const [siteConfig, setSiteConfigState] = useState(getStoredSiteConfig);
  const [manifesto, setManifestoState] = useState(getStoredManifesto);
  const [chapters, setChaptersState] = useState<Chapter[]>(getStoredChapters);
  const [pillars] = useState(getStoredPillars);
  const [quotes, setQuotesState] = useState<Quote[]>(getStoredQuotes);
  const [gallery, setGalleryState] = useState<GalleryPhoto[]>(getStoredGallery);
  const [avatars, setAvatarsState] = useState<FamilyAvatar[]>(getStoredAvatars);
  const [cinema, setCinemaState] = useState(getStoredCinema);

  const [editMode, setEditMode] = useState(false);
  const [generalModalOpen, setGeneralModalOpen] = useState(false);
  const [cloudModalOpen, setCloudModalOpen] = useState(false);
  const [cloudConnected, setCloudConnected] = useState(isSupabaseConfigured);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  const showSaveToast = (text: string) => {
    setSaveNotification(text);
    setTimeout(() => {
      setSaveNotification(null);
    }, 2800);
  };

  // 1. Initial Hydration from IndexedDB and Supabase
  useEffect(() => {
    // A) Hydrate from IndexedDB for resilient local storage
    hydrateFromStorage().then((data) => {
      if (data.siteConfig) setSiteConfigState(data.siteConfig);
      if (data.manifesto) setManifestoState(data.manifesto);
      if (data.chapters && data.chapters.length > 0) setChaptersState(data.chapters);
      if (data.quotes && data.quotes.length > 0) setQuotesState(data.quotes);
      if (data.gallery && data.gallery.length > 0) setGalleryState(data.gallery);
      if (data.avatars && data.avatars.length > 0) setAvatarsState(data.avatars);
      if (data.cinema) setCinemaState(data.cinema);
    });

    // B) Sync from Supabase if configured
    if (isSupabaseConfigured) {
      setCloudConnected(true);
      Promise.all([
        fetchRemoteChapters(),
        fetchRemoteQuotes(),
        fetchRemoteGallery(),
        fetchRemoteAvatarRoles(),
      ])
        .then(([remoteChapters, remoteQuotes, remoteGallery, remoteRoles]) => {
          if (remoteChapters && remoteChapters.length > 0) {
            const mapped: Chapter[] = remoteChapters.map((rc) => ({
              id: rc.id,
              tag: rc.tag,
              location: rc.location,
              date: rc.date,
              title: rc.title,
              story: rc.story,
              quote: rc.quote,
              imageUrl: rc.image_url,
            }));
            setChaptersState(mapped);
            saveChapters(mapped);
          }

          if (remoteQuotes && remoteQuotes.length > 0) {
            const mapped: Quote[] = remoteQuotes.map((rq) => ({
              id: rq.id,
              title: rq.title,
              quote: rq.quote,
              author: rq.author,
              context: rq.context,
              imageUrl: rq.image_url,
              category: rq.category as Quote['category'],
            }));
            setQuotesState(mapped);
            saveQuotes(mapped);
          }

          if (remoteGallery && remoteGallery.length > 0) {
            const mapped: GalleryPhoto[] = remoteGallery.map((rg) => ({
              id: rg.id,
              title: rg.title,
              category: rg.category as GalleryPhoto['category'],
              location: rg.location,
              date: rg.date,
              imageUrl: rg.image_url,
              caption: rg.caption,
              aspect: rg.aspect as GalleryPhoto['aspect'],
            }));
            setGalleryState(mapped);
            saveGallery(mapped);
          }

          if (remoteRoles && Object.keys(remoteRoles).length > 0) {
            setAvatarsState((prev) => {
              const updated = prev.map((av) =>
                remoteRoles[av.id] ? { ...av, role: remoteRoles[av.id] } : av
              );
              saveAvatars(updated);
              return updated;
            });
          }
        })
        .catch((err) => {
          console.warn('Error fetching initial remote data from Supabase:', err);
        });
    }
  }, []);

  // Synchronizers with local storage + Supabase sync
  const handleUpdateChapters = (newChapters: Chapter[]) => {
    setChaptersState(newChapters);
    saveChapters(newChapters);
    showSaveToast(
      cloudConnected
        ? 'Estaciones guardadas en la nube para toda la familia'
        : 'Estaciones guardadas en este dispositivo'
    );

    if (cloudConnected) {
      newChapters.forEach((ch) => {
        saveChapterToSupabase(ch, true).catch((err) =>
          console.warn('Error syncing chapter to Supabase:', err)
        );
      });
    }
  };

  const handleUpdateQuotes = (newQuotes: Quote[]) => {
    setQuotesState(newQuotes);
    saveQuotes(newQuotes);
    showSaveToast(
      cloudConnected
        ? 'Frases guardadas en la nube para toda la familia'
        : 'Frases guardadas en este dispositivo'
    );

    if (cloudConnected) {
      newQuotes.forEach((q) => {
        saveQuoteToSupabase(q, true).catch((err) =>
          console.warn('Error syncing quote to Supabase:', err)
        );
      });
    }
  };

  const handleUpdateGallery = (newGallery: GalleryPhoto[]) => {
    setGalleryState(newGallery);
    saveGallery(newGallery);
    showSaveToast(
      cloudConnected
        ? 'Álbum guardado en la nube para toda la familia'
        : 'Álbum guardado en este dispositivo'
    );

    if (cloudConnected) {
      newGallery.forEach((p) => {
        saveGalleryPhotoToSupabase(p, true).catch((err) =>
          console.warn('Error syncing gallery to Supabase:', err)
        );
      });
    }
  };

  const handleUpdateAvatars = (newAvatars: FamilyAvatar[]) => {
    setAvatarsState(newAvatars);
    saveAvatars(newAvatars);
    showSaveToast(
      cloudConnected
        ? 'Mensajes familiares guardados en la nube'
        : 'Mensajes familiares guardados en este dispositivo'
    );

    if (cloudConnected) {
      newAvatars.forEach((av) => {
        updateAvatarRoleInSupabase(av.id, av.role).catch((err) =>
          console.warn('Error syncing avatar role to Supabase:', err)
        );
      });
    }
  };

  const handleUpdateCinema = (newCinema: typeof cinema) => {
    setCinemaState(newCinema);
    saveCinema(newCinema);
    showSaveToast('Configuración del cine guardada');
  };

  const handleSaveGeneral = (newConfig: typeof siteConfig, newManifesto: typeof manifesto) => {
    setSiteConfigState(newConfig);
    setManifestoState(newManifesto);
    saveSiteConfig(newConfig);
    saveManifesto(newManifesto);
    showSaveToast('Portada y Carta guardadas con éxito');
  };

  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer todos los textos y fotos a los valores originales?')) {
      resetAllToDefaults();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const backup = {
      siteConfig,
      manifesto,
      chapters,
      pillars,
      quotes,
      gallery,
      avatars,
      cinema,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abuela-kata-recuerdos-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ImageViewerProvider>
      <div className="relative min-h-screen bg-[#faf8f5] text-[#0f172a] dark:bg-[#070d18] dark:text-[#f1f5f9] font-sans selection:bg-amber-500/20 selection:text-amber-900 dark:selection:bg-amber-500/30 dark:selection:text-amber-200 transition-colors duration-300">
        {/* Floating Glass Pill Navbar */}
        <Navbar
          editMode={editMode}
          onToggleEditMode={() => setEditMode(!editMode)}
          isCloudConnected={cloudConnected}
          onOpenCloudSync={() => setCloudModalOpen(true)}
        />

        {/* Global Floating Save Notification Toast */}
        <AnimatePresence>
          {saveNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-18 sm:top-20 inset-x-0 mx-auto z-50 w-fit max-w-sm px-4 py-2 rounded-full liquid-glass border border-emerald-400/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 shadow-xl flex items-center gap-2 text-xs font-medium"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{saveNotification}</span>
              {cloudConnected ? (
                <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />
              ) : (
                <HardDrive className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 ml-1" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Sections */}
        <main>
          <Hero
            config={siteConfig}
            editMode={editMode}
            onEdit={() => setGeneralModalOpen(true)}
          />
          <Manifesto
            data={manifesto}
            editMode={editMode}
            onEdit={() => setGeneralModalOpen(true)}
          />
          <Chapters
            chapters={chapters}
            editMode={editMode}
            onUpdateChapters={handleUpdateChapters}
          />
          <BentoGrid
            pillars={pillars}
            editMode={editMode}
          />
          <QuotesSection
            quotes={quotes}
            editMode={editMode}
            onUpdateQuotes={handleUpdateQuotes}
          />
          <InteractiveGallery
            photos={gallery}
            editMode={editMode}
            onUpdatePhotos={handleUpdateGallery}
          />
          <CinemaSection
            cinemaConfig={cinema}
            editMode={editMode}
            onUpdateCinema={handleUpdateCinema}
          />
          <AvatarsSection
            avatars={avatars}
            editMode={editMode}
            onUpdateAvatars={handleUpdateAvatars}
          />
        </main>

        {/* Footer & Celebration CTA */}
        <FooterCTA
          editMode={editMode}
          onResetData={handleResetData}
          onExportData={handleExportData}
        />

        {/* General Configuration Modal (Hero & Manifesto) */}
        <EditGeneralModal
          isOpen={generalModalOpen}
          onClose={() => setGeneralModalOpen(false)}
          siteConfig={siteConfig}
          manifesto={manifesto}
          onSave={handleSaveGeneral}
        />

        {/* Cloud Sync Configuration Modal (Supabase) */}
        <CloudSyncModal
          isOpen={cloudModalOpen}
          onClose={() => setCloudModalOpen(false)}
          onConnectionChange={() => setCloudConnected(isSupabaseConfigured)}
        />

        {/* Global Real-Size Image Viewer Modal */}
        <ImageViewerModal />
      </div>
    </ImageViewerProvider>
  );
}

export default App;
