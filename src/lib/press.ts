import { getCollection, type CollectionEntry } from 'astro:content';

export const PRESS_TYPE_LABELS = {
  radio: 'RADIO',
  entrevista: 'ENTREVISTA',
  reportaje: 'REPORTAJE',
  cronica: 'CRÓNICA',
  aparicion: 'APARICIÓN'
} as const;

export type PressType = keyof typeof PRESS_TYPE_LABELS;

export interface PressItem {
  id: string;
  title: string;
  date?: string;
  dateOrder?: string;
  medium: string;
  program?: string;
  types: PressType[];
  description: string;
  url?: string;
  relatedProjectId?: string;
  duration?: string;
  featured: boolean;
  featuredOrder?: number;
}

export type PressEntry = CollectionEntry<'prensa'>;

export function pressFromEntry(entry: PressEntry): PressItem {
  const data = entry.data;

  return {
    id: entry.id,
    title: data.titulo,
    date: data.fecha,
    dateOrder: data.fechaOrden,
    medium: data.medio,
    program: data.programa,
    types: [...data.tipos],
    description: data.descripcion,
    url: data.url,
    relatedProjectId: data.proyectoRelacionado,
    duration: data.duracion,
    featured: data.destacado,
    featuredOrder: data.ordenDestacado
  };
}

export async function loadPressEntries(): Promise<PressItem[]> {
  const entries = await getCollection('prensa');
  return entries.map(pressFromEntry);
}

export function getFeaturedPress(entries: PressItem[]): PressItem[] {
  return entries
    .filter(entry => entry.featured)
    .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999));
}

export function getPressArchive(entries: PressItem[]): PressItem[] {
  return [...entries].sort(comparePressDates);
}

function comparePressDates(a: PressItem, b: PressItem): number {
  if (a.dateOrder && b.dateOrder && a.dateOrder !== b.dateOrder) {
    return b.dateOrder.localeCompare(a.dateOrder);
  }

  if (a.dateOrder && !b.dateOrder) return -1;
  if (!a.dateOrder && b.dateOrder) return 1;

  return a.title.localeCompare(b.title, 'es');
}
