import { getCollection, type CollectionEntry } from 'astro:content';

export type TeachingEntry = CollectionEntry<'docencia'>;

export type TeachingScheduleItem = TeachingEntry['data']['temporalizacion'][number];
export type TeachingStep = TeachingEntry['data']['fases'][number];
export type TeachingImage = TeachingEntry['data']['galeria'][number];
export type TeachingLink = TeachingEntry['data']['enlaces'][number];

export interface TeachingExperience {
  slug: string;
  title: string;
  period: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
  entity: string;
  place?: string;
  summary: string;
  order: number;
  published: boolean;
  detail: boolean;
  areas: string[];
  context?: string;
  methodology?: string;
  schedule: TeachingScheduleItem[];
  steps: TeachingStep[];
  resources: string[];
  gallery: TeachingImage[];
  links: TeachingLink[];
  seo?: TeachingEntry['data']['seo'];
}

export function teachingFromEntry(entry: TeachingEntry): TeachingExperience {
  const { data } = entry;

  return {
    slug: entry.id,
    title: data.titulo,
    period: data.periodo,
    startDate: data.fechaInicio,
    endDate: data.fechaFin,
    current: data.actualidad,
    entity: data.entidad,
    place: data.lugar,
    summary: data.resumen,
    order: data.orden,
    published: data.publicar,
    detail: data.detalle,
    areas: data.areas,
    context: data.contexto,
    methodology: data.metodologia,
    schedule: data.temporalizacion,
    steps: data.fases,
    resources: data.recursos,
    gallery: data.galeria,
    links: data.enlaces,
    seo: data.seo
  };
}

export async function loadTeachingEntries(): Promise<TeachingEntry[]> {
  return getCollection('docencia', ({ data }) => data.publicar);
}

export async function loadTeaching(): Promise<TeachingExperience[]> {
  const entries = await loadTeachingEntries();

  return entries
    .map(teachingFromEntry)
    .sort((first, second) => first.order - second.order);
}
