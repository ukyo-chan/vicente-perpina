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

const seccionObra = z.enum([
  'obra-exposiciones',
  'comic-edicion',
  'ilustracion-editorial',
  'animacion-audiovisual'
]);

const aparienciaObra = z.enum(['normal', 'lead', 'accent', 'note']);

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

const fechaISO = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: z.object({
    titulo: z.string(),
    subtitulo: z.string().optional(),
    anio: z.number().int().optional(),
    fechaTexto: z.string().optional(),
    fechaInicio: fechaISO.optional(),
    fechaFin: fechaISO.optional(),

    tipoPrincipal,
    categorias: z.array(categorias).min(1),
    seccion: seccionObra.optional(),
    resumen: z.string().optional(),
    rol: z.string().optional(),
    colaboradores: z.array(z.string()).default([]),
    entidad: z.string().optional(),
    lugar: z.string().optional(),
    fechas: z.string().optional(),

    publicar: z.boolean().default(true),
    detalle: z.boolean().default(false),
    mostrarObra: z.boolean().default(true),
    mostrarTrayectoria: z.boolean().default(true),
    archivoObra: z.boolean().default(false),
    aparienciaObra: aparienciaObra.default('normal'),
    anchor: z.string().optional(),

    obraTitulo: z.string().optional(),
    obraResumen: z.string().optional(),
    obraMeta: z.string().optional(),

    destacadoHome: z.boolean().default(false),
    ordenHome: z.number().int().optional(),
    homeTitulo: z.string().optional(),
    homeTipo: z.string().optional(),
    homeResumen: z.string().optional(),

    hitoHome: z.boolean().default(false),
    ordenHitoHome: z.number().int().optional(),
    homeHitoTexto: z.string().optional(),

    trayectoriaFecha: z.string().optional(),
    trayectoriaTitulo: z.string().optional(),
    trayectoriaDetalle: z.string().optional(),
    ordenTrayectoria: z.number().int().optional(),
    ordenTrayectoriaItem: z.number().int().default(0),

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
