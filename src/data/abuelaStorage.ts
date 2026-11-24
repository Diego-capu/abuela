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
import { idbGet, idbSet, idbClear } from './idbStorage';

export const STORAGE_KEYS = {
  SITE: 'abuela_site_config',
  MANIFESTO: 'abuela_manifesto',
  CHAPTERS: 'abuela_chapters',
  PILLARS: 'abuela_pillars',
  QUOTES: 'abuela_quotes',
  GALLERY: 'abuela_gallery',
  AVATARS: 'abuela_avatars',
  PLAYLIST: 'abuela_playlist',
  CINEMA: 'abuela_cinema',
} as const;

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
  // 1. Always attempt asynchronous write to IndexedDB (virtually unlimited quota)
  idbSet(key, value).catch((err) => {
    console.warn(`IndexedDB background write issue for ${key}:`, err);
  });

  // 2. Also attempt localStorage for synchronous fast retrieval on page boot
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // If localStorage quota (5MB) is exceeded, IndexedDB has already persisted it
    console.warn(`localStorage quota warning for ${key} (stored safely in IndexedDB):`, e);
  }
}

// ----------------------------------------------------------------------------
// ASYNC HYDRATION FROM INDEXEDDB
// ----------------------------------------------------------------------------
export interface HydratedStorageData {
  siteConfig: typeof SITE_CONFIG | null;
  manifesto: typeof MANIFESTO_DATA | null;
  chapters: Chapter[] | null;
  pillars: Pillar[] | null;
  quotes: Quote[] | null;
  gallery: GalleryPhoto[] | null;
  avatars: FamilyAvatar[] | null;
  cinema: typeof CINEMA_CONFIG | null;
}

export async function hydrateFromStorage(): Promise<HydratedStorageData> {
  const [
    siteConfig,
    manifesto,
    chapters,
    pillars,
    quotes,
    gallery,
    avatars,
    cinema,
  ] = await Promise.all([
    idbGet<typeof SITE_CONFIG>(STORAGE_KEYS.SITE),
    idbGet<typeof MANIFESTO_DATA>(STORAGE_KEYS.MANIFESTO),
    idbGet<Chapter[]>(STORAGE_KEYS.CHAPTERS),
    idbGet<Pillar[]>(STORAGE_KEYS.PILLARS),
    idbGet<Quote[]>(STORAGE_KEYS.QUOTES),
    idbGet<GalleryPhoto[]>(STORAGE_KEYS.GALLERY),
    idbGet<FamilyAvatar[]>(STORAGE_KEYS.AVATARS),
    idbGet<typeof CINEMA_CONFIG>(STORAGE_KEYS.CINEMA),
  ]);

  return {
    siteConfig,
    manifesto,
    chapters,
    pillars,
    quotes,
    gallery,
    avatars,
    cinema,
  };
}

// ----------------------------------------------------------------------------
// SYNCHRONOUS GETTERS (Initial State)
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
  const stored = safeGet(STORAGE_KEYS.CINEMA, CINEMA_CONFIG);
  if ((!stored.videoUrl || stored.videoUrl === '' || stored.videoUrl.includes('drive.google.com')) && CINEMA_CONFIG.videoUrl) {
    return { ...stored, videoUrl: CINEMA_CONFIG.videoUrl, driveUrl: CINEMA_CONFIG.driveUrl };
  }
  return stored;
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
  idbClear().catch(console.warn);
}
