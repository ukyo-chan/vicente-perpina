# Vicente Perpiñá — Astro · Slice 4

Este slice cierra la migración estructural del portfolio: la colección de proyectos pasa a ser la **fuente de verdad** de Inicio, Obra, la cronología artística de Trayectoria y las fichas individuales.

## Qué incorpora

- Catálogo ampliado a **28 registros** de proyecto/hito/práctica ya presentes en la web.
- Separación entre:
  - `publicar`: el registro puede usarse públicamente;
  - `detalle`: genera o no una ficha `/proyectos/<slug>/`;
  - `mostrarObra`: aparece o no en Obra;
  - `mostrarTrayectoria`: aparece o no en la cronología;
  - `archivoObra`: aparece como elemento compacto del archivo de autoedición.
- `seccion` independiente de `categorias`, para que un proyecto pueda pertenecer editorialmente a una sección y a la vez tener varias categorías.
- Inicio generado desde `destacadoHome` y `hitoHome`.
- Obra generada completamente desde la colección.
- Filtros de Obra por Ilustración, Exposición, Cómic, Edición, Animación y Audiovisual.
- Cronología artística de Trayectoria generada desde la colección.
- Relacionados: primero respeta los slugs declarados y, si faltan, completa automáticamente por afinidad de categorías/sección.
- Soporte explícito para fechas ISO (`fechaInicio`, `fechaFin`) además de la presentación editorial (`fechaTexto`, `fechas`).
- Sitemap estático generado en `/sitemap.xml` y `robots.txt` apuntando a él.
- Capa `Project` intermedia para que componentes y páginas no dependan directamente del Markdown. Esto deja preparada una futura sustitución de Content Collections por Supabase/PostgreSQL u otra fuente de datos.

## Modelo de publicación

Un registro puede existir sin ficha larga:

```yaml
publicar: true
detalle: false
mostrarObra: true
mostrarTrayectoria: true
```

En ese caso aparece en Obra/Trayectoria, pero Astro no genera una URL propia.

Una ficha completa usa:

```yaml
publicar: true
detalle: true
```

y genera automáticamente:

```text
/proyectos/<slug>/
```

Los seis proyectos que ya tenían ficha en el Slice 3 mantienen `detalle: true`.

## Campos editoriales principales

Además de los datos generales del proyecto, el esquema admite:

```yaml
seccion: obra-exposiciones
categorias:
  - ilustracion
  - exposicion

anchor: oceanografic
aparienciaObra: lead

obraTitulo: "..."
obraResumen: "..."
obraMeta: "..."

destacadoHome: true
ordenHome: 1
homeTitulo: "..."
homeTipo: "..."
homeResumen: "..."

hitoHome: true
ordenHitoHome: 1
homeHitoTexto: "..."

trayectoriaFecha: "2025"
trayectoriaTitulo: "..."
trayectoriaDetalle: "..."
ordenTrayectoria: 2025
ordenTrayectoriaItem: 10
```

Los campos específicos de Home/Obra/Trayectoria son opcionales: si no existen, se reutilizan los datos generales.

## Fuente de datos y futura base de datos

La web ya no pasa los `CollectionEntry` de Astro a los componentes visuales. `src/lib/projects.ts` adapta el contenido Markdown al modelo común `Project`:

```text
Astro Content Collection
        ↓
projectFromEntry()
        ↓
Project
        ↓
Home / Obra / Trayectoria / componentes
```

En el futuro se puede sustituir la primera parte por:

```text
Supabase / PostgreSQL
        ↓
Project
        ↓
Home / Obra / Trayectoria / componentes
```

sin reescribir la presentación.

La única excepción lógica es la ruta de ficha, que sigue usando `render(entry)` para renderizar el cuerpo Markdown. Si la fuente se migra a base de datos, esa sería la capa concreta que se sustituiría por el cuerpo almacenado en BD/CMS.

## Filtros de Obra

Los filtros son JavaScript progresivo. Sin JavaScript se muestran todos los proyectos; con JS aparecen los botones de filtrado y se ocultan automáticamente las secciones que no tengan resultados para la categoría elegida.

No se ha añadido Vue/React: para este caso un script pequeño es suficiente.

## Compatibilidad de anchors

Se conservan los anchors históricos importantes, por ejemplo:

```text
/obra/#oceanografic
/obra/#37-ilustres
/obra/#vinyetari
/obra/#cuentos-populares
/obra/#grand-tour
```

por lo que los enlaces antiguos y los redirects del Slice 2 siguen siendo útiles.

## SEO técnico

Además del canonical y Open Graph que ya existían:

```text
/sitemap.xml
/robots.txt
```

El sitemap incluye las cinco páginas principales y todas las fichas con `detalle: true`.

## Archivos a eliminar

**Ninguno.**

Copia el ZIP encima del Slice 3 y sobrescribe los archivos existentes.

## Publicación

```bash
git add -A
git commit -m "Astro - Slice 4 - catalogo integrado"
git push
```

No hay que modificar GitHub Pages, GitHub Actions, DNS ni el dominio.

## Comprobaciones recomendadas

Después de que la Action termine en verde:

1. `/` debe seguir mostrando tres destacados y tres hitos.
2. `/obra/` debe mostrar todo el catálogo y los filtros.
3. Los anchors legacy de Obra deben seguir llevando al proyecto correcto.
4. `/trayectoria/` debe construir la cronología desde los proyectos.
5. Las seis fichas del Slice 3 deben seguir funcionando.
6. Una ficha debe mostrar dos relacionados aunque no tenga dos slugs explícitos, gracias al fallback por afinidad.
7. `/sitemap.xml` y `/robots.txt` deben responder correctamente.

## Siguiente fase

La migración estructural queda cerrada. A partir de aquí el trabajo puede centrarse en contenido y presentación: fotografías, imágenes de obra, nuevas fichas detalladas, revisión de proyectos históricos y, cuando tenga sentido, una posible migración de la fuente de datos a Supabase/PostgreSQL o un CMS.
