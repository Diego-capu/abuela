/**
 * ============================================================================
 * ARCHIVO MAESTRO DE DATOS: FELIZ CUMPLEAÑOS ABUELA KATA
 * ============================================================================
 * 
 * Este archivo contiene TODOS los textos, fotos y canciones de la página.
 * Puedes editar cualquier texto, reemplazar las rutas de fotos o agregar nuevas canciones.
 * Además, la página cuenta con un modo de edición interactivo directamente en el navegador.
 */

export interface Chapter {
  id: string;
  tag: string;
  location: string;
  date: string;
  title: string;
  story: string;
  quote: string;
  imageUrl: string;
}

export interface Pillar {
  id: string;
  title: string;
  description: string;
  icon: 'Heart' | 'Utensils' | 'Sparkles' | 'Users' | 'Sun' | 'Shield';
  badge: string;
}

export interface Quote {
  id: string;
  title: string;
  quote: string;
  author: string;
  context: string;
  imageUrl: string;
  category: 'Bendición' | 'Cocina' | 'Consejo' | 'Amor';
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Familia' | 'Celebraciones' | 'Retratos' | 'Años Dorados';
  location: string;
  date: string;
  imageUrl: string;
  caption: string;
  aspect?: 'square' | 'portrait' | 'landscape';
}

export interface FamilyAvatar {
  id: string;
  name: string;
  relation: string;
  role: string;
  message: string;
  avatarUrl: string;
  color: string;
}

export interface Track {
  id: string;
  title: string;
  subtitle: string;
  audio_url: string;
  palette: string[];
}

// ----------------------------------------------------------------------------
// 1. INFORMACIÓN GENERAL Y HERO
// ----------------------------------------------------------------------------
export const SITE_CONFIG = {
  abuelaName: 'Abuela Kata',
  fullName: 'Catalina "Kata"',
  birthdayBadge: '🎂 Línea Temporal de Honor',
  heroHeadline: 'Un Viaje en el Tiempo: El Legado de Abuela Kata',
  heroSubheadline: 'Madre, abuela y el corazón que mantiene unida a toda nuestra historia.',
  heroTagline: 'Un recorrido por las épocas, sonrisas y momentos inolvidables de nuestra reina.',
  heroPhoto: '/images/abuela/20191103_184529.jpg',
  yearsTraveling: 'Décadas de Amor Infinito',
  crewBadge: 'Tripulación Familiar: Hijos, Nietos y Bisnietos',
};

// ----------------------------------------------------------------------------
// 2. MANIFIESTO / CARTA DE AMOR
// ----------------------------------------------------------------------------
export const MANIFESTO_DATA = {
  tag: 'La Carta del Tiempo',
  title: 'Para la Mujer que Hizo de Cada Día un Recuerdo Eterno',
  paragraphs: [
    'Querida Abuela Kata: Si tuviéramos una máquina del tiempo capaz de viajar por cada uno de tus días, encontraríamos siempre la misma constante: tus manos bendiciendo, tu sonrisa iluminando la casa y un corazón inmenso donde siempre cabemos todos.',
    'Has sido el faro en nuestras noches más oscuras, la que convierte cualquier comida sencilla en un banquete de reyes, y la voz dulce que con una sola bendición nos devuelve la paz. No hay reloj en el universo que pueda medir todo el amor que nos has dado.',
    'Hoy no solo celebramos otro año de vida; celebramos cada lección, cada abrazo apretado, cada historia compartida y la fortuna inmensa de tenerte con nosotros. ¡Feliz Cumpleaños, Abuela Kata!',
  ],
  signature: 'Con todo el amor del mundo, tu familia que te adora.',
};

// ----------------------------------------------------------------------------
// 3. CAPÍTULOS CRONOLÓGICOS (LÍNEA TEMPORAL DE VIDA)
// ----------------------------------------------------------------------------
export const CHAPTERS_DATA: Chapter[] = [
  {
    id: 'raices-doradas',
    tag: 'Estación 01',
    location: 'El Origen // Donde Todo Empezó',
    date: 'Primeros Años & Raíces',
    title: 'Los Cimientos de una Mujer Fuerte',
    story:
      'Desde sus primeros años, la Abuela Kata forjó un carácter lleno de ternura, valentía y trabajo incansable. Cada paso que dio fue construyendo el camino por donde hoy caminamos nosotros con orgullo.',
    quote: '«Las raíces más fuertes son las que se riegan con paciencia y fe.»',
    imageUrl: '/images/abuela/030007ae.jpg',
  },
  {
    id: 'el-hogar-florece',
    tag: 'Estación 02',
    location: 'El Hogar Familiar // Calor y Sazón',
    date: 'Años de Creación & Familia',
    title: 'La Mesa Donde Nadie Quedaba por Fuera',
    story:
      'Si algo define a la Abuela Kata es su don para acoger a todos. Su cocina siempre ha olido a hogar, a café recién colado y a sopa caliente que cura cualquier pena. En su casa siempre hubo un plato más para quien lo necesitara.',
    quote: '«Donde come uno, comen dos, y si Dios bendice la olla, comen todos.»',
    imageUrl: '/images/abuela/SAM_2299.JPG',
  },
  {
    id: 'la-llegada-nietos',
    tag: 'Estación 03',
    location: 'Generaciones // Nuevas Sonrisas',
    date: 'La Época de Oro de los Nietos',
    title: 'Abuela de Amor y Consentidera',
    story:
      'Con la llegada de los nietos, su corazón se multiplicó. Fue cómplice de juegos, guardiana de secretos y la protectora oficial ante cualquier regaño de los padres. Sus abrazos son el refugio seguro de la infancia.',
    quote: '«Los hijos se educan, pero a los nietos se les llena el alma de cariño.»',
    imageUrl: '/images/abuela/IMG_20170910_091522.jpg',
  },
  {
    id: 'celebraciones-inolvidables',
    tag: 'Estación 04',
    location: 'Noches de Fiesta // Año Nuevo y Risas',
    date: 'Reuniones Familiares • 2018 - 2024',
    title: 'Bailes, Fotos y Madrugadas Felices',
    story:
      'Las fiestas de fin de año, los cumpleaños y los domingos juntos tienen su centro en ella. Verla sonreír en la cabecera de la mesa, rodeada de su gente cantando y bromeando, es el mayor tesoro familiar.',
    quote: '«El tiempo pasa volando cuando el corazón está lleno de alegría.»',
    imageUrl: '/images/abuela/IMG_20190101_244110650.jpg',
  },
  {
    id: 'el-presente-luminoso',
    tag: 'Estación 05',
    location: 'Hoy // El Mejor Momento',
    date: 'Presente Infinito',
    title: 'Reina y Eje de Nuestra Historia',
    story:
      'Hoy miramos hacia atrás y vemos una vida hermosa, llena de victorias y bendiciones. Y miramos hacia el presente agradeciendo a Dios por cada segundo a su lado. ¡Que este viaje siga por muchos años más!',
    quote: '«Gracias por ser el milagro más bonito de nuestras vidas, Abuela Kata.»',
    imageUrl: '/images/abuela/20191103_184529.jpg',
  },
];

// ----------------------------------------------------------------------------
// 4. LOS CUATRO PILARES DEL HOGAR (BENTO GRID)
// ----------------------------------------------------------------------------
export const PILLARS_DATA: Pillar[] = [
  {
    id: 'amor-incondicional',
    title: 'Amor Incondicional',
    description: 'Un cariño que nunca juzga, siempre cobija y está presente sin importar la hora o la distancia.',
    icon: 'Heart',
    badge: 'Pilar 01',
  },
  {
    id: 'el-sazon-legendario',
    title: 'El Sazón de la Abuela',
    description: 'Ese toque mágico que no viene en ninguna receta: cocinar con el alma para ver felices a los suyos.',
    icon: 'Utensils',
    badge: 'Pilar 02',
  },
  {
    id: 'la-sabiduria',
    title: 'Sabiduría y Consejo',
    description: 'Palabras justas en el momento preciso. Escuchar a la Abuela Kata es encontrar siempre calma y dirección.',
    icon: 'Sparkles',
    badge: 'Pilar 03',
  },
  {
    id: 'la-union-familiar',
    title: 'Unión Sagrada',
    description: 'El pegamento que mantiene a toda la familia reunida, fuerte y con las manos entrelazadas.',
    icon: 'Users',
    badge: 'Pilar 04',
  },
];

// ----------------------------------------------------------------------------
// 5. FRASES CÉLEBRES DE LA ABUELA KATA
// ----------------------------------------------------------------------------
export const QUOTES_DATA: Quote[] = [
  {
    id: 'bendicion-diaria',
    title: 'La Bendición que Protege',
    quote: '«Que Dios y la Virgen me los bendigan, me los favorezcan y me los guarden en todo momento.»',
    author: 'Abuela Kata',
    context: 'Dicha cada vez que alguien sale de casa o al colgar una llamada por teléfono.',
    imageUrl: '/images/abuela/WhatsApp Image 2026-11-21 at 9.01.00 PM.jpeg',
    category: 'Bendición',
  },
  {
    id: 'comida-caliente',
    title: 'El Remedio para Todo',
    quote: '«¿Usted ya almorzó? Venga le sirvo un platico, que aquí nadie se queda con hambre.»',
    author: 'Abuela Kata',
    context: 'La bienvenida sagrada a cualquier hora del día al cruzar la puerta de su casa.',
    imageUrl: '/images/abuela/SAM_2334.JPG',
    category: 'Cocina',
  },
  {
    id: 'agradecimiento',
    title: 'Consejo de Vida',
    quote: '«Agradezcan por cada amanecer; cada día con salud es el regalo más grande.»',
    author: 'Abuela Kata',
    context: 'Enseñanza matutina sobre la gratitud y la humildad.',
    imageUrl: '/images/abuela/IMG_20190101_244448795.jpg',
    category: 'Consejo',
  },
  {
    id: 'cariño-eterno',
    title: 'Palabras de Corazón',
    quote: '«Ustedes son los ojos míos y la alegría más grande que Dios me pudo mandar.»',
    author: 'Abuela Kata',
    context: 'Dicho mientras acaricia el cabello de sus nietos al despedirse.',
    imageUrl: '/images/abuela/IMG_20250825_193245250.jpg',
    category: 'Amor',
  },
];

// ----------------------------------------------------------------------------
// 6. GALERÍA DE RECUERDOS (FOTOTECA TEMPORAL)
// ----------------------------------------------------------------------------
export const GALLERY_DATA: GalleryPhoto[] = [
  {
    id: 'gal-01',
    title: 'Reunión en Familia',
    category: 'Celebraciones',
    location: 'Sala Familiar',
    date: '1 de Enero, 2019',
    imageUrl: '/images/abuela/IMG_20190101_244110650.jpg',
    caption: 'Comenzando el año con la sonrisa más luminosa de la casa.',
    aspect: 'landscape',
  },
  {
    id: 'gal-02',
    title: 'El Retrato de Honor',
    category: 'Retratos',
    location: 'Atardecer Dorado',
    date: 'Noviembre, 2019',
    imageUrl: '/images/abuela/20191103_184529.jpg',
    caption: 'La mirada dulce de quien ha sembrado amor por generaciones.',
    aspect: 'portrait',
  },
  {
    id: 'gal-03',
    title: 'Risas Compartidas',
    category: 'Familia',
    location: 'Patio Familiar',
    date: 'Septiembre, 2017',
    imageUrl: '/images/abuela/IMG_20170910_091522.jpg',
    caption: 'Las mejores tardes son aquellas donde las anécdotas no tienen fin.',
    aspect: 'square',
  },
  {
    id: 'gal-04',
    title: 'Complicidad y Cariño',
    category: 'Familia',
    location: 'Reunión de Fin de Año',
    date: '2019',
    imageUrl: '/images/abuela/IMG_20190101_244406664.jpg',
    caption: 'Abrazos que quedan grabados para siempre en la memoria.',
    aspect: 'landscape',
  },
  {
    id: 'gal-05',
    title: 'Los Ojos del Pasado',
    category: 'Años Dorados',
    location: 'Archivo Histórico',
    date: 'Época Clásica',
    imageUrl: '/images/abuela/030007ae.jpg',
    caption: 'La belleza y la gracia inalterables que traspasan las décadas.',
    aspect: 'portrait',
  },
  {
    id: 'gal-06',
    title: 'Juntos en Cada Paso',
    category: 'Celebraciones',
    location: 'Celebración Familiar',
    date: 'Agosto, 2025',
    imageUrl: '/images/abuela/IMG_20250825_193246554.jpg',
    caption: 'Celebrando la vida, la salud y el honor de tener a Kata.',
    aspect: 'landscape',
  },
  {
    id: 'gal-07',
    title: 'Ternura Inagotable',
    category: 'Retratos',
    location: 'En Casa',
    date: '2026',
    imageUrl: '/images/abuela/WhatsApp Image 2026-11-21 at 9.01.01 PM.jpeg',
    caption: 'Cada cana es un trofeo de sabiduría y cariño bien vivido.',
    aspect: 'square',
  },
  {
    id: 'gal-08',
    title: 'Generaciones Unidas',
    category: 'Familia',
    location: 'Reunión Especial',
    date: 'Marzo, 2018',
    imageUrl: '/images/abuela/IMG_20180328_133315.jpg',
    caption: 'La foto que demuestra que su ejemplo vive en todos nosotros.',
    aspect: 'landscape',
  },
];

// ----------------------------------------------------------------------------
// 7. LOS PASAJEROS DEL TIEMPO (FAMILIA & MENSAJES)
// ----------------------------------------------------------------------------
export const FAMILY_AVATARS: FamilyAvatar[] = [
  {
    id: 'fam-hijos',
    name: 'Tus Hijos',
    relation: 'Hijos e Hijas',
    role: 'Guardianes del Legado',
    message: 'Gracias mamá por enseñarnos el valor del trabajo honrado, la fe y la generosidad. Todo lo que somos te lo debemos a ti.',
    avatarUrl: '/images/abuela/SAM_2336.JPG',
    color: '#0284c7',
  },
  {
    id: 'fam-nietos',
    name: 'Tus Nietos',
    relation: 'Nietas y Nietos',
    role: 'Los Consentidos',
    message: '¡Abuelita hermosa! Gracias por cada plato rico, por defendernos de nuestros papás y por querernos con tanta locura.',
    avatarUrl: '/images/abuela/IMG_20190101_244128813.jpg',
    color: '#d97706',
  },
  {
    id: 'fam-bisnietos',
    name: 'Bisnietos y Pequeños',
    relation: 'Nuevas Generaciones',
    role: 'Semillas del Futuro',
    message: 'Tener una bisabuela tan dulce y llena de historias es el regalo más grande del mundo. ¡Te amamos hasta el cielo!',
    avatarUrl: '/images/abuela/WhatsApp Image 2026-11-21 at 9.01.02 PM.jpeg',
    color: '#10b981',
  },
];

// ----------------------------------------------------------------------------
// 8. LISTA DE MÚSICA DE FONDO (EDITABLE)
// ----------------------------------------------------------------------------
export const INITIAL_PLAYLIST: Track[] = [
  {
    id: 'track-1',
    title: 'Amar Como Tú',
    subtitle: 'Melodía de Amor Incondicional',
    audio_url: '/music/Amar como tu.mp3',
    palette: ['#fef08a', '#d97706', '#92400e'],
  },
  {
    id: 'track-2',
    title: 'Melodía de Recuerdos',
    subtitle: 'Nostalgia y Alegría',
    audio_url: '/music/hora-de-aventura.mp3',
    palette: ['#7dd3fc', '#0284c7', '#0369a1'],
  },
];

// ----------------------------------------------------------------------------
// 9. CINE Y PROYECTOR FAMILIAR
// ----------------------------------------------------------------------------
export const CINEMA_CONFIG = {
  title: 'El Proyector de Recuerdos',
  subtitle: 'Revive los instantes más alegres de la Abuela Kata en movimiento.',
  tag: 'Sala Cinematográfica',
  videoUrl: '/videos/video_abuela.mp4',
  driveUrl: 'https://drive.google.com/file/d/1SteVnGiIFaiEg57omUtYrQ5Lka46AU_O/view?usp=sharing',
  posterUrl: '/images/abuela/20191103_184529.jpg',
  caption: 'El tiempo pasa, pero las risas y los momentos juntos quedan inmortalizados para siempre.',
};
