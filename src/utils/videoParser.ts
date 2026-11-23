export type VideoPlatform = 'youtube' | 'drive' | 'google-photos' | 'direct';

export interface ParsedVideoInfo {
  platform: VideoPlatform;
  cleanId?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  directUrl: string;
  isDirectEmbedSupported: boolean;
  message?: string;
}

/**
 * Parses a video URL or file path and detects the platform:
 * - YouTube (embeddable iframe)
 * - Google Drive (embeddable iframe)
 * - Google Photos (external link only, due to Google CSP/X-Frame-Options restrictions)
 * - Direct video file (.mp4, blob:, /videos/...)
 */
export function parseVideoUrl(rawUrl: string): ParsedVideoInfo | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const url = rawUrl.trim();

  // 1. YouTube Detection
  const ytMatch = url.match(
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      platform: 'youtube',
      cleanId: videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      directUrl: `https://www.youtube.com/watch?v=${videoId}`,
      isDirectEmbedSupported: true,
    };
  }

  // 2. Google Drive Detection
  const driveFileMatch = url.match(
    /(?:https?:\/\/)?drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]{20,})/i
  );
  if (driveFileMatch && driveFileMatch[1]) {
    const fileId = driveFileMatch[1];
    return {
      platform: 'drive',
      cleanId: fileId,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      thumbnailUrl: undefined,
      directUrl: `https://drive.google.com/file/d/${fileId}/view`,
      isDirectEmbedSupported: true,
    };
  }

  // 3. Google Photos Detection
  if (
    url.includes('photos.app.goo.gl') ||
    url.includes('photos.google.com')
  ) {
    return {
      platform: 'google-photos',
      directUrl: url,
      isDirectEmbedSupported: false,
      message:
        'Google Fotos no permite reproducir videos directamente dentro de páginas web externas por políticas de seguridad de Google (X-Frame-Options). Puedes descargarlo y subir el archivo .mp4, o abrirlo con el botón de acceso directo.',
    };
  }

  // 4. Direct video URL (.mp4, .webm, blob:, data:, local path)
  if (
    url.startsWith('blob:') ||
    url.startsWith('data:') ||
    url.startsWith('/') ||
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)
  ) {
    return {
      platform: 'direct',
      directUrl: url,
      isDirectEmbedSupported: true,
    };
  }

  // Generic fallback: treat as direct URL
  return {
    platform: 'direct',
    directUrl: url,
    isDirectEmbedSupported: true,
  };
}
