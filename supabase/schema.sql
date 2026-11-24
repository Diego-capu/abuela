-- ============================================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS SUPABASE: ABUELA KATA
-- ============================================================================
-- Ejecuta este script completo en el SQL Editor de tu proyecto en Supabase
-- (https://supabase.com/dashboard/project/_/sql)
--
-- Crea todas las tablas necesarias:
-- 1. squad_chapters (Estaciones del Viaje en el Tiempo)
-- 2. squad_quotes (Frases Célebres de la Abuela)
-- 3. squad_gallery (Álbum / Galería de Recuerdos)
-- 4. squad_avatars (Roles y Dedicatorias de la Familia)
-- 5. squad_videos (Proyector de Recuerdos / Videos)
-- 6. playlist_tracks (Música de Fondo y Aportes)
-- 7. Bucket de Almacenamiento 'music' para subir canciones
-- ============================================================================

-- Habilitar extensión pgcrypto para UUIDs si no está habilitada
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. TABLA: squad_chapters (Estaciones / Capítulos)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.squad_chapters (
    id TEXT PRIMARY KEY,
    tag TEXT NOT NULL DEFAULT 'Estación Temporal',
    location TEXT NOT NULL DEFAULT 'En el Corazón',
    date TEXT NOT NULL DEFAULT 'Tiempo Inolvidable',
    title TEXT NOT NULL,
    story TEXT NOT NULL,
    quote TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. TABLA: squad_quotes (Frases de la Abuela)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.squad_quotes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    quote TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Abuela Kata',
    context TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Bendición',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. TABLA: squad_gallery (Galería de Fotos)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.squad_gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Familia',
    location TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL,
    caption TEXT NOT NULL DEFAULT '',
    aspect TEXT NOT NULL DEFAULT 'landscape',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. TABLA: squad_avatars (Roles / Mensajes Familiares)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.squad_avatars (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. TABLA: squad_videos (Videos del Proyector de Cine)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.squad_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Familia',
    video_url TEXT NOT NULL,
    platform TEXT NOT NULL DEFAULT 'youtube',
    embed_url TEXT NOT NULL,
    thumbnail_url TEXT,
    tag TEXT NOT NULL DEFAULT 'Momentos',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. TABLA: playlist_tracks (Canciones de la Playlist Familiar)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.playlist_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL DEFAULT 'Aporte Familiar',
    audio_url TEXT NOT NULL,
    pattern TEXT NOT NULL DEFAULT 'horizon',
    palette TEXT[] NOT NULL DEFAULT ARRAY['#7dd3fc', '#0284c7', '#fef08a'],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. POLÍTICAS DE ACCESO (Row Level Security - RLS)
-- Permitir lectura y escritura pública para que la familia pueda editar y ver
-- ----------------------------------------------------------------------------

-- Habilitar RLS en cada tabla
ALTER TABLE public.squad_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;

-- Políticas para squad_chapters
DROP POLICY IF EXISTS "Public squad_chapters access" ON public.squad_chapters;
CREATE POLICY "Public squad_chapters access" ON public.squad_chapters
    FOR ALL TO public USING (true) WITH CHECK (true);

-- Políticas para squad_quotes
DROP POLICY IF EXISTS "Public squad_quotes access" ON public.squad_quotes;
CREATE POLICY "Public squad_quotes access" ON public.squad_quotes
    FOR ALL TO public USING (true) WITH CHECK (true);

-- Políticas para squad_gallery
DROP POLICY IF EXISTS "Public squad_gallery access" ON public.squad_gallery;
CREATE POLICY "Public squad_gallery access" ON public.squad_gallery
    FOR ALL TO public USING (true) WITH CHECK (true);

-- Políticas para squad_avatars
DROP POLICY IF EXISTS "Public squad_avatars access" ON public.squad_avatars;
CREATE POLICY "Public squad_avatars access" ON public.squad_avatars
    FOR ALL TO public USING (true) WITH CHECK (true);

-- Políticas para squad_videos
DROP POLICY IF EXISTS "Public squad_videos access" ON public.squad_videos;
CREATE POLICY "Public squad_videos access" ON public.squad_videos
    FOR ALL TO public USING (true) WITH CHECK (true);

-- Políticas para playlist_tracks
DROP POLICY IF EXISTS "Public playlist_tracks access" ON public.playlist_tracks;
CREATE POLICY "Public playlist_tracks access" ON public.playlist_tracks
    FOR ALL TO public USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 8. BUCKET DE ALMACENAMIENTO: 'music'
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de Storage para el bucket 'music'
DROP POLICY IF EXISTS "Public Access Music Files" ON storage.objects;
CREATE POLICY "Public Access Music Files" ON storage.objects
    FOR ALL TO public
    USING (bucket_id = 'music')
    WITH CHECK (bucket_id = 'music');
