# Vicente Perpiñá — Astro · Slice 3

Este slice incorpora el **modelo estructurado de proyectos y las fichas reutilizables**. La web principal sigue manteniendo el contenido de la v1.1/v1.2, pero ya existe una única plantilla capaz de generar una URL propia por proyecto a partir de un fichero Markdown.

## Qué incorpora

- Colección Astro `proyectos` definida y validada en `src/content.config.ts`.
- Un fichero Markdown por proyecto en `src/content/proyectos/`.
- Una única ruta dinámica estática: `src/pages/proyectos/[slug].astro`.
- Componentes reutilizables para cabecera, metadatos, etiquetas, enlaces, galería, tarjetas y proyectos relacionados.
- SEO/Open Graph por ficha usando los datos del proyecto.
- Campos internos de verificación que **no se muestran públicamente**.
- Soporte de imágenes y galerías, aunque las primeras fichas funcionan correctamente sin imágenes.
- Enlaces `Ver ficha →` desde seis proyectos de la página Obra, sin hacer todavía que toda la página Obra dependa de la colección.

## Primeras fichas publicadas

```text
/proyectos/oceanografic-2026/
/proyectos/37-ilustres-2025/
/proyectos/vinyetari-5/
/proyectos/cuentos-populares-2015/
/proyectos/dkv-grand-tour-2012/
/proyectos/gianni-markel-2011/
```

Estas seis fichas sirven como casos de prueba de distintos tipos de proyecto: ilustración/divulgación, exposición colectiva, cómic/editorial, exposición individual, beca artística y audiovisual.

## Estructura nueva

```text
src/
  content.config.ts
  content/
    proyectos/
      37-ilustres-2025.md
      cuentos-populares-2015.md
      dkv-grand-tour-2012.md
      gianni-markel-2011.md
      oceanografic-2026.md
      vinyetari-5.md
  components/
    projects/
      ProjectCard.astro
      ProjectGallery.astro
      ProjectHeader.astro
      ProjectLinks.astro
      ProjectMeta.astro
      ProjectTags.astro
      RelatedProjects.astro
  lib/
    projects.ts
  pages/
    proyectos/
      [slug].astro
public/
  assets/
    img/
      proyectos/
```

## Modelo de proyecto

Cada proyecto tiene datos estructurados en el frontmatter y contenido editorial en Markdown.

Ejemplo simplificado:

```yaml
---
titulo: "Vinyetari 5"
subtitulo: "Una data, totes les dates"
anio: 2025
tipoPrincipal: comic
categorias:
  - comic
  - edicion
resumen: "..."
rol: "Coautor de la historieta"
colaboradores:
  - "Marc Zanón"
publicar: true
destacado: true
enlaces:
  - texto: "Selección del V Premi ARA de Còmic"
    url: "https://..."
verificacion:
  estado: externa
  notas: "..."
  fuentes:
    - nombre: "Diari ARA"
      url: "https://..."
---

## El proyecto

Texto largo de la ficha...
```

### Campos de control interno

`verificacion` permite mantener dentro del proyecto información útil para documentar de dónde sale cada dato:

- `externa`: confirmado por fuentes públicas.
- `vicente`: confirmado directamente por Vicente.
- `mixta`: combinación de ambas.
- `pendiente`: todavía en investigación.

Estos campos **no se renderizan en la web**. Como el repositorio es público, no deben contener secretos ni información que no queramos que sea visible al consultar el código en GitHub.

`publicar: false` permite además guardar una ficha en el repositorio sin generar todavía una página pública.

## Cómo añadir un proyecto nuevo

1. Crear `src/content/proyectos/mi-proyecto.md`.
2. Rellenar el frontmatter según el esquema.
3. Escribir el contenido de la ficha en Markdown.
4. Añadir, si procede, imágenes en:

```text
public/assets/img/proyectos/mi-proyecto/
```

5. Hacer el push habitual.

Astro generará automáticamente:

```text
https://vicenteperpina.com/proyectos/mi-proyecto/
```

No hay que crear ningún HTML ni registrar manualmente la ruta.

## Imágenes

El modelo ya admite:

```yaml
imagenPrincipal:
  src: "/assets/img/proyectos/mi-proyecto/principal.webp"
  alt: "Descripción accesible de la imagen"

galeria:
  - src: "/assets/img/proyectos/mi-proyecto/obra-01.webp"
    alt: "Descripción de la obra"
    pie: "Pie opcional"
```

Las fichas actuales no usan placeholders: si no hay imágenes seleccionadas, la galería simplemente no aparece.

## Qué NO hace todavía este slice

Para mantener separada la validación del modelo de la integración global, este slice todavía no:

- genera toda la página Obra desde la colección;
- genera los destacados de Inicio desde la colección;
- genera la cronología artística de Trayectoria desde la colección;
- añade filtros por categoría.

Eso corresponde al Slice 4.

## Archivos a eliminar

**Ninguno.**

Este slice se puede copiar directamente encima del Slice 2. No añade restos temporales ni sustituye rutas legacy que requieran limpieza.

## Publicación

```bash
git add -A
git commit -m "Astro - Slice 3 - fichas de proyectos"
git push
```

GitHub Pages sigue usando **GitHub Actions**. No hay que modificar Pages, DNS ni el dominio personalizado.

## Comprobaciones tras publicar

Además de las páginas principales, prueba al menos:

- `https://vicenteperpina.com/proyectos/oceanografic-2026/`
- `https://vicenteperpina.com/proyectos/vinyetari-5/`
- `https://vicenteperpina.com/proyectos/cuentos-populares-2015/`

Desde `/obra/`, los seis proyectos piloto deben mostrar un enlace `Ver ficha →`.

## Próximo slice

El Slice 4 hará que Inicio, Obra y la cronología artística reutilicen esta misma colección de proyectos y podrá incorporar filtros por categorías, eliminando la duplicación actual de datos.
