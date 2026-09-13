import {
  PROJECT_SECTIONS,
  getObraProjects,
  type Project,
  type ProjectSectionId
} from './projects';
import type { TeachingExperience } from './teaching';

export type HomeAreaPattern = 'a' | 'b' | 'c';

interface HomeAreaBase {
  id: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  pattern: HomeAreaPattern;
}

export interface HomeProjectArea extends HomeAreaBase {
  kind: 'projects';
  id: ProjectSectionId;
  projects: Project[];
}

export interface HomeTeachingArea extends HomeAreaBase {
  kind: 'teaching';
  id: 'docencia';
  experiences: TeachingExperience[];
  disciplines: string[];
}

export type HomeArea = HomeProjectArea | HomeTeachingArea;

export interface HomeRecentWindow {
  currentYear: number;
  cutoffYear: number;
}

const HOME_AREA_ORDER = [
  { kind: 'projects', section: 'obra-exposiciones', href: '/obra/#obra-exposiciones', ctaLabel: 'Explorar obra y exposiciones' },
  { kind: 'projects', section: 'comic-edicion', href: '/obra/#comic-edicion', ctaLabel: 'Explorar cómic y edición' },
  { kind: 'teaching', id: 'docencia', href: '/docencia/', ctaLabel: 'Explorar mi experiencia docente' },
  { kind: 'projects', section: 'ilustracion-editorial', href: '/obra/#ilustracion-editorial', ctaLabel: 'Explorar ilustración editorial' },
  { kind: 'projects', section: 'animacion-audiovisual', href: '/obra/#animacion-audiovisual', ctaLabel: 'Explorar animación y audiovisual' }
] as const;

const HOME_PATTERNS: HomeAreaPattern[] = ['a', 'b', 'c'];

const TEACHING_DISCIPLINE_PRIORITY = [
  'Dibujo',
  'Pintura',
  'Cómic',
  'Ilustración digital',
  'Dibujo técnico',
  'Narrativa gráfica'
];

export function getHomeRecentWindow(currentYear = new Date().getFullYear()): HomeRecentWindow {
  return { currentYear, cutoffYear: currentYear - 2 };
}

export function projectActivityYear(project: Project): number | undefined {
  return project.year ?? yearFromDate(project.startDate) ?? yearFromDate(project.endDate);
}

export function isProjectRecent(project: Project, currentYear = new Date().getFullYear()): boolean {
  const { cutoffYear } = getHomeRecentWindow(currentYear);
  const activityYear = projectActivityYear(project);
  return activityYear !== undefined && activityYear >= cutoffYear && activityYear <= currentYear;
}

export function getRecentObraProjects(
  projects: Project[],
  section: ProjectSectionId,
  currentYear = new Date().getFullYear()
): Project[] {
  return getObraProjects(projects.filter(project => project.published), section)
    .filter(project => isProjectRecent(project, currentYear));
}

export function isTeachingRecent(
  experience: TeachingExperience,
  currentYear = new Date().getFullYear()
): boolean {
  if (!experience.published) return false;
  if (experience.current) return true;

  const { cutoffYear } = getHomeRecentWindow(currentYear);
  return [yearFromDate(experience.startDate), yearFromDate(experience.endDate)]
    .some(year => year !== undefined && year >= cutoffYear && year <= currentYear);
}

export function getRecentTeaching(
  experiences: TeachingExperience[],
  currentYear = new Date().getFullYear()
): TeachingExperience[] {
  return experiences
    .filter(experience => isTeachingRecent(experience, currentYear))
    .sort((first, second) => compareTeachingRecency(first, second, currentYear));
}

export function getHomeActiveAreas(
  projects: Project[],
  teaching: TeachingExperience[],
  currentYear = new Date().getFullYear()
): HomeArea[] {
  const activeAreas: HomeArea[] = [];
  const recentTeaching = getRecentTeaching(teaching, currentYear);

  for (const definition of HOME_AREA_ORDER) {
    const pattern = HOME_PATTERNS[activeAreas.length % HOME_PATTERNS.length];

    if (definition.kind === 'teaching') {
      if (recentTeaching.length === 0) continue;

      activeAreas.push({
        kind: 'teaching',
        id: definition.id,
        title: 'Docencia',
        description: 'Enseño desde la práctica artística y adapto cada proceso a distintos ritmos, edades y necesidades.',
        href: definition.href,
        ctaLabel: definition.ctaLabel,
        pattern,
        experiences: recentTeaching,
        disciplines: getTeachingDisciplines(recentTeaching)
      });
      continue;
    }

    const section = PROJECT_SECTIONS.find(item => item.id === definition.section);
    if (!section) continue;

    const recentProjects = getRecentObraProjects(projects, definition.section, currentYear);
    if (recentProjects.length === 0) continue;

    activeAreas.push({
      kind: 'projects',
      id: definition.section,
      title: section.title,
      description: section.description,
      href: definition.href,
      ctaLabel: definition.ctaLabel,
      pattern,
      projects: recentProjects.slice(0, 4)
    });
  }

  return activeAreas;
}

function getTeachingDisciplines(experiences: TeachingExperience[]): string[] {
  const available = new Set(experiences.flatMap(experience => experience.areas));
  return TEACHING_DISCIPLINE_PRIORITY.filter(discipline => available.has(discipline));
}

function compareTeachingRecency(
  first: TeachingExperience,
  second: TeachingExperience,
  currentYear: number
): number {
  if (first.current !== second.current) return first.current ? -1 : 1;

  const firstLatest = first.current
    ? currentYear
    : yearFromDate(first.endDate) ?? yearFromDate(first.startDate) ?? -Infinity;
  const secondLatest = second.current
    ? currentYear
    : yearFromDate(second.endDate) ?? yearFromDate(second.startDate) ?? -Infinity;
  if (firstLatest !== secondLatest) return secondLatest - firstLatest;

  const firstStart = yearFromDate(first.startDate) ?? -Infinity;
  const secondStart = yearFromDate(second.startDate) ?? -Infinity;
  if (firstStart !== secondStart) return secondStart - firstStart;

  return first.order - second.order;
}

function yearFromDate(value?: string): number | undefined {
  const match = value?.match(/^\d{4}/);
  return match ? Number(match[0]) : undefined;
}
