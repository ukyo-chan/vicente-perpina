import { getCollection, type CollectionEntry } from 'astro:content';

export const PROJECT_CATEGORY_LABELS = {
  ilustracion: 'Ilustración',
  dibujo: 'Dibujo',
  exposicion: 'Exposición',
  comic: 'Cómic',
  edicion: 'Edición',
  animacion: 'Animación',
  audiovisual: 'Audiovisual',
  'proyecto-social': 'Proyecto social',
  divulgacion: 'Divulgación',
  encuentro: 'Encuentro',
  beca: 'Beca'
} as const;

export const PROJECT_TYPE_LABELS = {
  ilustracion: 'Ilustración',
  exposicion: 'Exposición',
  comic: 'Cómic',
  edicion: 'Edición',
  animacion: 'Animación',
  audiovisual: 'Audiovisual',
  beca: 'Beca'
} as const;

export const PROJECT_SECTIONS = [
  {
    id: 'obra-exposiciones',
    number: '01',
    title: 'Obra y exposiciones',
    description: 'Aquí reúno proyectos individuales y colectivos en los que el dibujo y la ilustración dialogan con el espacio expositivo.',
    layout: 'grid'
  },
  {
    id: 'comic-edicion',
    number: '02',
    title: 'Cómic y edición',
    description: 'Aquí comparto creación gráfica, autoedición y proyectos colectivos en los que la publicación es también un espacio de encuentro.',
    layout: 'grid'
  },
  {
    id: 'ilustracion-editorial',
    number: '03',
    title: 'Ilustración editorial',
    description: 'Aquí reúno encargos de portada e interior, publicaciones locales y proyectos donde la ilustración acompaña y amplía el texto.',
    layout: 'editorial'
  },
  {
    id: 'animacion-audiovisual',
    number: '04',
    title: 'Animación y audiovisual',
    description: 'Mi línea de trabajo en animación y audiovisual parte de la formación en Bellas Artes, Animación y Arte y Tecnología, y se desarrolla en proyectos reales.',
    layout: 'media'
  }
] as const;

export type ProjectSectionId = typeof PROJECT_SECTIONS[number]['id'];
export type ProjectLayout = typeof PROJECT_SECTIONS[number]['layout'];
export type ProjectAppearance = 'normal' | 'lead' | 'accent' | 'note';

export interface ProjectImage {
  src: string;
  alt: string;
  pie?: string;
}

export interface ProjectLink {
  texto: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  year?: number;
  dateText?: string;
  startDate?: string;
  endDate?: string;
  type: string;
  categories: string[];
  section?: ProjectSectionId;
  summary: string;
  role?: string;
  collaborators: string[];
  entity?: string;
  place?: string;
  dates?: string;
  time?: string;
  address?: string;

  published: boolean;
  detail: boolean;
  showInObra: boolean;
  showInTimeline: boolean;
  archiveInObra: boolean;
  appearance: ProjectAppearance;
  anchor?: string;

  obraTitle?: string;
  obraSummary?: string;
  obraMeta?: string;

  featuredHome: boolean;
  homeOrder?: number;
  homeTitle?: string;
  homeType?: string;
  homeSummary?: string;

  homeHighlight: boolean;
  homeHighlightOrder?: number;
  homeHighlightText?: string;

  timelineDate?: string;
  timelineTitle?: string;
  timelineDetail?: string;
  timelineOrder?: number;
  timelineItemOrder: number;

  image?: ProjectImage;
  gallery: ProjectImage[];
  links: ProjectLink[];
  relatedIds: string[];
  seo?: {
    title?: string;
    description?: string;
  };
}

export type ProjectEntry = CollectionEntry<'proyectos'>;

export function projectCategoryLabel(category: string) {
  return PROJECT_CATEGORY_LABELS[category as keyof typeof PROJECT_CATEGORY_LABELS] ?? category;
}

export function projectTypeLabel(type: string) {
  return PROJECT_TYPE_LABELS[type as keyof typeof PROJECT_TYPE_LABELS] ?? type;
}

export function projectFromEntry(entry: ProjectEntry): Project {
  const data = entry.data;

  return {
    id: entry.id,
    title: data.titulo,
    subtitle: data.subtitulo,
    year: data.anio,
    dateText: data.fechaTexto,
    startDate: data.fechaInicio,
    endDate: data.fechaFin,
    type: data.tipoPrincipal,
    categories: [...data.categorias],
    section: data.seccion,
    summary: data.resumen ?? '',
    role: data.rol,
    collaborators: [...data.colaboradores],
    entity: data.entidad,
    place: data.lugar,
    dates: data.fechas,
    time: data.hora,
    address: data.direccion,

    published: data.publicar,
    detail: data.detalle,
    showInObra: data.mostrarObra,
    showInTimeline: data.mostrarTrayectoria,
    archiveInObra: data.archivoObra,
    appearance: data.aparienciaObra,
    anchor: data.anchor,

    obraTitle: data.obraTitulo,
    obraSummary: data.obraResumen,
    obraMeta: data.obraMeta,

    featuredHome: data.destacadoHome,
    homeOrder: data.ordenHome,
    homeTitle: data.homeTitulo,
    homeType: data.homeTipo,
    homeSummary: data.homeResumen,

    homeHighlight: data.hitoHome,
    homeHighlightOrder: data.ordenHitoHome,
    homeHighlightText: data.homeHitoTexto,

    timelineDate: data.trayectoriaFecha,
    timelineTitle: data.trayectoriaTitulo,
    timelineDetail: data.trayectoriaDetalle,
    timelineOrder: data.ordenTrayectoria,
    timelineItemOrder: data.ordenTrayectoriaItem,

    image: data.imagenPrincipal,
    gallery: [...data.galeria],
    links: [...data.enlaces],
    relatedIds: [...data.relacionados],
    seo: data.seo
  };
}

export async function loadProjectEntries(): Promise<ProjectEntry[]> {
  return getCollection('proyectos');
}

export async function loadProjects({ publishedOnly = true } = {}): Promise<Project[]> {
  const entries = await loadProjectEntries();
  return entries
    .map(projectFromEntry)
    .filter(project => !publishedOnly || project.published);
}

export function projectDateLabel(project: Project): string {
  if (project.dateText) return project.dateText;
  if (project.year) return String(project.year);
  return '';
}

export function projectPeriodLabel(project: Project): string | undefined {
  const yearLabel = project.year ? String(project.year) : undefined;
  const dateText = project.dateText?.trim();
  const hasRange = Boolean(project.startDate || project.endDate || dateText?.match(/[–—→]/));

  if (hasRange) {
    if (project.dates && project.dates !== yearLabel) return project.dates;
    if (dateText && dateText !== yearLabel) return dateText;

    const start = project.startDate ? formatProjectDate(project.startDate) : undefined;
    const end = project.endDate ? formatProjectDate(project.endDate) : undefined;
    return [start, end].filter(Boolean).join(' – ') || undefined;
  }

  return undefined;
}

function formatProjectDate(value: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${value}T00:00:00Z`));
}

export function projectPrimaryHref(project: Project): string {
  if (project.detail) return `/proyectos/${project.id}/`;
  if (project.showInObra && project.anchor) return `/obra/#${project.anchor}`;
  if (project.showInObra) return `/obra/#${project.id}`;
  if (project.showInTimeline) return `/trayectoria/#${timelineGroupId(project.timelineDate ?? project.dateText ?? String(project.year ?? 'hitos'))}`;
  return '/obra/';
}

export function projectTimelineHref(project: Project): string | undefined {
  if (project.detail || project.showInObra) return projectPrimaryHref(project);
  return project.links[0]?.url;
}

export function getHomeFeaturedProjects(projects: Project[]): Project[] {
  return projects
    .filter(project => project.featuredHome)
    .sort((a, b) => (a.homeOrder ?? 999) - (b.homeOrder ?? 999));
}

export function getHomeHighlights(projects: Project[]): Project[] {
  return projects
    .filter(project => project.homeHighlight)
    .sort((a, b) => (a.homeHighlightOrder ?? 999) - (b.homeHighlightOrder ?? 999));
}

export function getObraProjects(projects: Project[], section: ProjectSectionId): Project[] {
  return projects
    .filter(project => project.showInObra && !project.archiveInObra && project.section === section)
    .sort(projectSortNewestFirst);
}

export function getObraArchiveProjects(projects: Project[], section: ProjectSectionId): Project[] {
  return projects
    .filter(project => project.showInObra && project.archiveInObra && project.section === section)
    .sort((a, b) => a.title.localeCompare(b.title, 'es'));
}

function projectSortNewestFirst(a: Project, b: Project): number {
  const aYear = a.year ?? -Infinity;
  const bYear = b.year ?? -Infinity;
  if (aYear !== bYear) return bYear - aYear;

  if (a.startDate && b.startDate && a.startDate !== b.startDate) {
    return b.startDate.localeCompare(a.startDate);
  }

  return a.title.localeCompare(b.title, 'es');
}

export interface TimelineGroup {
  id: string;
  label: string;
  order: number;
  projects: Project[];
}

export function getTimelineGroups(projects: Project[]): TimelineGroup[] {
  const groups = new Map<string, TimelineGroup>();

  for (const project of projects.filter(project => project.showInTimeline)) {
    const label = project.timelineDate ?? project.dateText ?? (project.year ? String(project.year) : 'Otros');
    const id = timelineGroupId(label);
    const order = project.timelineOrder ?? project.year ?? 0;

    const existing = groups.get(id);
    if (existing) {
      existing.projects.push(project);
      existing.order = Math.max(existing.order, order);
    } else {
      groups.set(id, { id, label, order, projects: [project] });
    }
  }

  return [...groups.values()]
    .map(group => ({
      ...group,
      projects: group.projects.sort((a, b) => {
        if (a.timelineItemOrder !== b.timelineItemOrder) {
          return a.timelineItemOrder - b.timelineItemOrder;
        }
        return projectSortNewestFirst(a, b);
      })
    }))
    .sort((a, b) => b.order - a.order);
}

export function timelineGroupId(label: string): string {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'hitos';
}

export function getRelatedProjects(source: Project, candidates: Project[], limit = 2): Project[] {
  const eligible = candidates.filter(project =>
    project.id !== source.id &&
    project.published &&
    project.detail
  );

  const explicit = source.relatedIds
    .map(id => eligible.find(project => project.id === id))
    .filter((project): project is Project => Boolean(project));

  if (explicit.length >= limit) return explicit.slice(0, limit);

  const used = new Set(explicit.map(project => project.id));
  const scored = eligible
    .filter(project => !used.has(project.id))
    .map(project => {
      const commonCategories = project.categories.filter(category => source.categories.includes(category)).length;
      const score = commonCategories * 3
        + (project.section && project.section === source.section ? 2 : 0)
        + (project.type === source.type ? 1 : 0);
      return { project, score };
    })
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return projectSortNewestFirst(a.project, b.project);
    });

  return [...explicit, ...scored.map(item => item.project)].slice(0, limit);
}
