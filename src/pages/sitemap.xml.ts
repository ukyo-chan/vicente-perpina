import type { APIRoute } from 'astro';
import { loadProjects } from '../lib/projects';

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://vicenteperpina.com');
  const projects = await loadProjects();
  const paths = [
    '/',
    '/obra/',
    '/docencia/',
    '/trayectoria/',
    '/contacto/',
    ...projects.filter(project => project.detail).map(project => `/proyectos/${project.id}/`)
  ];

  const urls = paths
    .map(path => `  <url><loc>${new URL(path, base).href}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};
