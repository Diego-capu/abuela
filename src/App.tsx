import React, { useState } from 'react';
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
  resetAllToDefaults,
} from './data/abuelaStorage';

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

  // Synchronizers
  const handleUpdateChapters = (newChapters: Chapter[]) => {
    setChaptersState(newChapters);
    saveChapters(newChapters);
  };

  const handleUpdateQuotes = (newQuotes: Quote[]) => {
    setQuotesState(newQuotes);
    saveQuotes(newQuotes);
  };

  const handleUpdateGallery = (newGallery: GalleryPhoto[]) => {
    setGalleryState(newGallery);
    saveGallery(newGallery);
  };

  const handleUpdateAvatars = (newAvatars: FamilyAvatar[]) => {
    setAvatarsState(newAvatars);
    saveAvatars(newAvatars);
  };

  const handleUpdateCinema = (newCinema: typeof cinema) => {
    setCinemaState(newCinema);
    saveCinema(newCinema);
  };

  const handleSaveGeneral = (newConfig: typeof siteConfig, newManifesto: typeof manifesto) => {
    setSiteConfigState(newConfig);
    setManifestoState(newManifesto);
    saveSiteConfig(newConfig);
    saveManifesto(newManifesto);
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
        />

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

        {/* Global Real-Size Image Viewer Modal */}
        <ImageViewerModal />
      </div>
    </ImageViewerProvider>
  );
}

export default App;
