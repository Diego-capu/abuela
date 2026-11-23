import {
  SITE_CONFIG,
  MANIFESTO_DATA,
  CHAPTERS_DATA,
  PILLARS_DATA,
  QUOTES_DATA,
  GALLERY_DATA,
  FAMILY_AVATARS,
  INITIAL_PLAYLIST,
  CINEMA_CONFIG,
  type Chapter,
  type Pillar,
  type Quote,
  type GalleryPhoto,
  type FamilyAvatar,
  type Track,
} from './abuelaData';

const STORAGE_KEYS = {
  SITE: 'abuela_site_config',
  MANIFESTO: 'abuela_manifesto',
  CHAPTERS: 'abuela_chapters',
  PILLARS: 'abuela_pillars',
  QUOTES: 'abuela_quotes',
  GALLERY: 'abuela_gallery',
  AVATARS: 'abuela_avatars',
  PLAYLIST: 'abuela_playlist',
  CINEMA: 'abuela_cinema',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving to localStorage for ${key}`, e);
  }
}

// ----------------------------------------------------------------------------
// GETTERS
// ----------------------------------------------------------------------------
export function getStoredSiteConfig(): typeof SITE_CONFIG {
  return safeGet(STORAGE_KEYS.SITE, SITE_CONFIG);
}

export function getStoredManifesto(): typeof MANIFESTO_DATA {
  return safeGet(STORAGE_KEYS.MANIFESTO, MANIFESTO_DATA);
}

export function getStoredChapters(): Chapter[] {
  return safeGet(STORAGE_KEYS.CHAPTERS, CHAPTERS_DATA);
}

export function getStoredPillars(): Pillar[] {
  return safeGet(STORAGE_KEYS.PILLARS, PILLARS_DATA);
}

export function getStoredQuotes(): Quote[] {
  return safeGet(STORAGE_KEYS.QUOTES, QUOTES_DATA);
}

export function getStoredGallery(): GalleryPhoto[] {
  return safeGet(STORAGE_KEYS.GALLERY, GALLERY_DATA);
}

export function getStoredAvatars(): FamilyAvatar[] {
  return safeGet(STORAGE_KEYS.AVATARS, FAMILY_AVATARS);
}

export function getStoredPlaylist(): Track[] {
  return safeGet(STORAGE_KEYS.PLAYLIST, INITIAL_PLAYLIST);
}

export function getStoredCinema(): typeof CINEMA_CONFIG {
  return safeGet(STORAGE_KEYS.CINEMA, CINEMA_CONFIG);
}

// ----------------------------------------------------------------------------
// SETTERS & MUTATIONS
// ----------------------------------------------------------------------------
export function saveSiteConfig(config: typeof SITE_CONFIG): void {
  safeSet(STORAGE_KEYS.SITE, config);
}

export function saveManifesto(manifesto: typeof MANIFESTO_DATA): void {
  safeSet(STORAGE_KEYS.MANIFESTO, manifesto);
}

export function saveChapters(chapters: Chapter[]): void {
  safeSet(STORAGE_KEYS.CHAPTERS, chapters);
}

export function savePillars(pillars: Pillar[]): void {
  safeSet(STORAGE_KEYS.PILLARS, pillars);
}

export function saveQuotes(quotes: Quote[]): void {
  safeSet(STORAGE_KEYS.QUOTES, quotes);
}

export function saveGallery(gallery: GalleryPhoto[]): void {
  safeSet(STORAGE_KEYS.GALLERY, gallery);
}

export function saveAvatars(avatars: FamilyAvatar[]): void {
  safeSet(STORAGE_KEYS.AVATARS, avatars);
}

export function savePlaylist(playlist: Track[]): void {
  safeSet(STORAGE_KEYS.PLAYLIST, playlist);
}

export function saveCinema(cinema: typeof CINEMA_CONFIG): void {
  safeSet(STORAGE_KEYS.CINEMA, cinema);
}

/**
 * Restablece todos los datos a sus valores iniciales definidos en abuelaData.ts
 */
export function resetAllToDefaults(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
