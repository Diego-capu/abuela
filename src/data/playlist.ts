import musicFiles from 'virtual:music-playlist';
import type { DiscPattern } from '../components/ui/disc-cascade-carousel';
import type { RemotePlaylistTrack } from '../lib/supabase';

export interface PlaylistTrack {
  id: string;
  filename: string;
  title: string;
  subtitle: string;
  src: string;
  pattern: DiscPattern;
  palette: [string, string, string];
  coverImage?: string;
  isRemote?: boolean;
  platform?: 'upload' | 'spotify';
  spotifyId?: string;
  spotifyUrl?: string;
}

interface TrackOverride {
  order?: number;
  title?: string;
  subtitle?: string;
  pattern?: DiscPattern;
  palette?: [string, string, string];
  coverImage?: string;
}

const KNOWN_TRACKS: Record<string, TrackOverride> = {
  'amar como tu.mp3': {
    order: 1,
    title: 'Amar Como Tú',
    subtitle: 'Dedicado a Abuela Kata',
    pattern: 'eclipse',
    palette: ['#fef3c7', '#d97706', '#b45309'],
  },
  'hora-de-aventura.mp3': {
    order: 2,
    title: 'Melodía de Recuerdos',
    subtitle: 'Nostalgia y Alegría Familiar',
    pattern: 'horizon',
    palette: ['#bae6fd', '#0284c7', '#fef08a'],
  },
  'soy tu problema.mp3': {
    order: 3,
    title: 'Vibras Clásicas',
    subtitle: 'Tardes en Familia',
    pattern: 'rings',
    palette: ['#1e293b', '#d97706', '#38bdf8'],
  },
};

export const AVAILABLE_PATTERNS: DiscPattern[] = [
  'horizon',
  'eclipse',
  'rings',
  'sunburst',
  'halftone',
  'mosaic',
  'stripes',
];

export const AVAILABLE_PALETTES: [string, string, string][] = [
  ['#fef3c7', '#d97706', '#b45309'],
  ['#bae6fd', '#0284c7', '#fef08a'],
  ['#fbcfe8', '#db2777', '#fef08a'],
  ['#bbf7d0', '#16a34a', '#fef3c7'],
  ['#fed7aa', '#ea580c', '#7c2d12'],
  ['#e9d5ff', '#9333ea', '#3b82f6'],
];

const LOWERCASE_WORDS = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'en', 'con', 'a']);

export function formatFilenameToTitle(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, '');
  const clean = withoutExt.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) return 'Pista sin título';

  return clean
    .split(' ')
    .map((word, idx) => {
      const lower = word.toLowerCase();
      if (idx > 0 && LOWERCASE_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

export const BASE_PLAYLIST: PlaylistTrack[] = (musicFiles || [])
  .map((filename: string, index: number) => {
    const key = filename.toLowerCase();
    const override = KNOWN_TRACKS[key];

    const title = override?.title ?? formatFilenameToTitle(filename);
    const subtitle = override?.subtitle ?? 'Música para Abuela Kata';
    const pattern = override?.pattern ?? AVAILABLE_PATTERNS[index % AVAILABLE_PATTERNS.length];
    const palette = override?.palette ?? AVAILABLE_PALETTES[index % AVAILABLE_PALETTES.length];

    return {
      id: filename.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      filename,
      title,
      subtitle,
      src: `/music/${encodeURIComponent(filename)}`,
      pattern,
      palette,
      coverImage: override?.coverImage,
      order: override?.order ?? 100 + index,
    };
  })
  .sort((a, b) => (a.order ?? 100) - (b.order ?? 100))
  .map(({ order, ...rest }) => rest);

export const PLAYLIST: PlaylistTrack[] = BASE_PLAYLIST;

export function extractSpotifyTrackId(urlOrUri: string): string | null {
  if (!urlOrUri) return null;
  const uriMatch = urlOrUri.match(/spotify:track:([a-zA-Z0-9]+)/);
  if (uriMatch) return uriMatch[1];
  const urlMatch = urlOrUri.match(/spotify\.com\/(?:intl-[a-z]+\/)?track\/([a-zA-Z0-9]+)/);
  if (urlMatch) return urlMatch[1];
  return null;
}

export function isSpotifyUrl(urlOrUri: string): boolean {
  return Boolean(extractSpotifyTrackId(urlOrUri));
}

export function remoteTrackToPlaylistTrack(
  remote: RemotePlaylistTrack,
  indexOffset = 0
): PlaylistTrack {
  const spotifyId = extractSpotifyTrackId(remote.audio_url);
  const isSpotify = Boolean(spotifyId);

  const pattern = (AVAILABLE_PATTERNS.includes(remote.pattern as DiscPattern)
    ? remote.pattern
    : AVAILABLE_PATTERNS[indexOffset % AVAILABLE_PATTERNS.length]) as DiscPattern;

  const defaultPalette = isSpotify
    ? (['#1db954', '#121212', '#ffffff'] as [string, string, string])
    : AVAILABLE_PALETTES[indexOffset % AVAILABLE_PALETTES.length];

  const palette: [string, string, string] =
    Array.isArray(remote.palette) && remote.palette.length === 3
      ? [remote.palette[0], remote.palette[1], remote.palette[2]]
      : defaultPalette;

  return {
    id: `remote-${remote.id}`,
    filename: remote.title,
    title: remote.title,
    subtitle: remote.subtitle || (isSpotify ? 'Spotify • Para Abuela Kata' : 'Aporte Familiar'),
    src: remote.audio_url,
    pattern,
    palette,
    coverImage: isSpotify ? (remote as unknown as { cover_image?: string }).cover_image : undefined,
    isRemote: true,
    platform: isSpotify ? 'spotify' : 'upload',
    spotifyId: spotifyId || undefined,
    spotifyUrl: isSpotify ? remote.audio_url : undefined,
  };
}
