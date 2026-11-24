import React from 'react';
import { ZoomIn } from 'lucide-react';
import { useImageViewer } from '../context/ImageViewerContext';

interface ZoomableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  showHoverBadge?: boolean;
  containerClassName?: string;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt = '',
  title,
  subtitle,
  caption,
  showHoverBadge = true,
  containerClassName = '',
  className = '',
  onClick,
  ...props
}) => {
  const { openImageViewer } = useImageViewer();

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    openImageViewer({
      src,
      alt,
      title: title || alt,
      subtitle,
      caption,
    });
    onClick?.(e);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative group cursor-zoom-in overflow-hidden ${containerClassName}`}
      title="Haz clic para ver la imagen en tamaño real"
    >
      <img
        src={src}
        alt={alt}
        className={`transition-transform duration-500 group-hover:scale-105 ${className}`}
        {...props}
      />
      {showHoverBadge && (
        <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md shadow-md pointer-events-none">
          <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
        </div>
      )}
    </div>
  );
};
