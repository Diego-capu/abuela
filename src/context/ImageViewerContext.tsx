import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface ImageViewerData {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  caption?: string;
}

interface ImageViewerContextType {
  activeImage: ImageViewerData | null;
  openImageViewer: (data: ImageViewerData) => void;
  closeImageViewer: () => void;
}

const ImageViewerContext = createContext<ImageViewerContextType | undefined>(undefined);

export const ImageViewerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeImage, setActiveImage] = useState<ImageViewerData | null>(null);

  const openImageViewer = useCallback((data: ImageViewerData) => {
    setActiveImage(data);
  }, []);

  const closeImageViewer = useCallback(() => {
    setActiveImage(null);
  }, []);

  // Keyboard navigation: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeImage) {
        closeImageViewer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage, closeImageViewer]);

  // Lock body scroll when viewer is active
  useEffect(() => {
    if (activeImage) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [activeImage]);

  return (
    <ImageViewerContext.Provider value={{ activeImage, openImageViewer, closeImageViewer }}>
      {children}
    </ImageViewerContext.Provider>
  );
};

export function useImageViewer(): ImageViewerContextType {
  const context = useContext(ImageViewerContext);
  if (!context) {
    throw new Error('useImageViewer must be used within an ImageViewerProvider');
  }
  return context;
}
