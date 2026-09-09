import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const categorias = z.enum([
  'ilustracion',
  'dibujo',
  'exposicion',
  'comic',
  'edicion',
  'animacion',
  'audiovisual',
  'proyecto-social',
  'divulgacion',
  'beca'
]);

const tipoPrincipal = z.enum([
  'ilustracion',
  'exposicion',
  'comic',
  'edicion',
  'animacion',
  'audiovisual',
  'beca'
]);

const imagen = z.object({
  src: z.string(),
  alt: z.string(),
  pie: z.string().optional()
});

const enlace = z.object({
  texto: z.string(),
  url: z.string().url()
});

const fuente = z.object({
  nombre: z.string(),
  url: z.string().url().optional()
});

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: z.object({
    titulo: z.string(),
    subtitulo: z.string().optional(),
    anio: z.number().int(),
    fechaTexto: z.string().optional(),
    tipoPrincipal,
    categorias: z.array(categorias).min(1),
    resumen: z.string(),
    rol: z.string().optional(),
    colaboradores: z.array(z.string()).default([]),
    entidad: z.string().optional(),
    lugar: z.string().optional(),
    fechas: z.string().optional(),
    destacado: z.boolean().default(false),
    publicar: z.boolean().default(false),
    imagenPrincipal: imagen.optional(),
    galeria: z.array(imagen).default([]),
    enlaces: z.array(enlace).default([]),
    relacionados: z.array(z.string()).default([]),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional()
    }).optional(),
    verificacion: z.object({
      estado: z.enum(['externa', 'vicente', 'mixta', 'pendiente']),
      notas: z.string().optional(),
      fuentes: z.array(fuente).default([])
    })
  })
});

export const collections = { proyectos };
