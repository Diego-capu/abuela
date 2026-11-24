import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  Sparkles,
} from 'lucide-react';
import { useImageViewer } from '../context/ImageViewerContext';

export const ImageViewerModal: React.FC = () => {
  const { activeImage, closeImageViewer } = useImageViewer();

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isRealSize, setIsRealSize] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom and position when image changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsRealSize(false);
    setDimensions(null);
  }, [activeImage]);

  if (!activeImage) return null;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((prev) => Math.min(prev + 0.35, 4));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((prev) => {
      const next = Math.max(prev - 0.35, 0.7);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsRealSize(false);
  };

  const handleToggleRealSize = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isRealSize && dimensions && containerRef.current) {
      // Calculate scale to show at 1:1 real pixel size relative to screen
      const containerWidth = containerRef.current.clientWidth;
      const naturalWidth = dimensions.width;
      const targetScale = Math.max(naturalWidth / (containerWidth * 0.85), 1.6);
      setScale(targetScale);
      setIsRealSize(true);
    } else {
      handleResetZoom();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale > 1.2) {
      handleResetZoom();
    } else {
      setScale(2.2);
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + 0.2, 4));
    } else {
      setScale((prev) => {
        const next = Math.max(prev - 0.2, 0.7);
        if (next <= 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Pan / Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || scale <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = activeImage.src;
    const filename = activeImage.src.split('/').pop() || 'foto-abuela-kata.jpg';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return createPortal(
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-2xl select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Control Bar */}
        <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-950/80 border-b border-white/10 backdrop-blur-md">
          {/* Image Info */}
          <div className="flex items-center gap-3 max-w-[50%] sm:max-w-[60%] truncate">
            <div>
              <h4 className="text-sm sm:text-base font-serif italic text-white truncate">
                {activeImage.title || activeImage.alt || 'Fotografía de la Familia'}
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-amber-400 font-light truncate">
                {activeImage.subtitle && <span>{activeImage.subtitle}</span>}
                {dimensions && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono text-[10px]">
                    {dimensions.width} × {dimensions.height} px
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Zoom Out */}
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Alejar (-)"
              aria-label="Alejar"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Current Zoom Indicator / Reset */}
            <button
              onClick={handleResetZoom}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-amber-300 transition-colors cursor-pointer min-w-[52px] text-center"
              title="Restablecer tamaño normal"
            >
              {Math.round(scale * 100)}%
            </button>

            {/* Zoom In */}
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Acercar (+)"
              aria-label="Acercar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Real Size (1:1) Toggle Button */}
            <button
              onClick={handleToggleRealSize}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isRealSize
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="Ver en tamaño real 100% original"
            >
              {isRealSize ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {isRealSize ? 'Ajustar' : 'Tamaño Real'}
              </span>
            </button>

            {/* Download Original Photo */}
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Descargar foto original"
              aria-label="Descargar"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={closeImageViewer}
              className="ml-2 p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors cursor-pointer"
              title="Cerrar (Esc)"
              aria-label="Cerrar visor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Viewport Canvas */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={(e) => {
            // If clicked on canvas background (not dragging), close viewer
            if (e.target === containerRef.current && scale <= 1) {
              closeImageViewer();
            }
          }}
          className={`relative flex-1 w-full h-full flex items-center justify-center overflow-hidden p-2 sm:p-6 ${
            scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
            className="relative flex items-center justify-center max-w-full max-h-full"
          >
            <img
              ref={imgRef}
              src={activeImage.src}
              alt={activeImage.alt || activeImage.title || 'Foto de Abuela Kata'}
              onLoad={handleImageLoad}
              onDoubleClick={handleDoubleClick}
              className="max-h-[82vh] max-w-[94vw] w-auto h-auto object-contain rounded-lg shadow-2xl pointer-events-auto"
              draggable={false}
            />
          </motion.div>

          {/* Quick Helper Tip on Mobile / Desktop */}
          {scale === 1 && (
            <div className="absolute bottom-4 inset-x-0 pointer-events-none flex items-center justify-center">
              <span className="text-[11px] text-white/60 bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Doble clic o rueda para ampliar • Botón «Tamaño Real» para resolución original</span>
              </span>
            </div>
          )}
        </div>

        {/* Caption Bar (if caption exists) */}
        {activeImage.caption && (
          <footer className="relative z-20 px-6 py-2.5 bg-slate-950/90 border-t border-white/10 text-center text-xs text-slate-300 font-light">
            <p className="max-w-2xl mx-auto italic">{activeImage.caption}</p>
          </footer>
        )}
      </div>
    </AnimatePresence>,
    document.body
  );
};
