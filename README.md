# Vicente Perpiñá Giner · Web profesional

Portfolio profesional de [Vicente Perpiñá Giner](https://vicenteperpina.com). Reúne obra gráfica, ilustración, cómic, edición, animación, audiovisual, docencia, trayectoria y referencias de prensa. El sitio funciona como un archivo vivo: se amplía con proyectos y materiales documentados sin limitarse a una selección cerrada.

## Tecnología

- Astro con TypeScript y módulos ESM; salida estática, sin servidor de aplicación.
- Content Collections con esquemas Zod y contenido editorial en Markdown.
- HTML semántico, CSS propio y JavaScript ligero para las interacciones.
- npm, GitHub Actions y GitHub Pages para construir y publicar la web.

La configuración de Astro está en `astro.config.mjs` y las dependencias y comandos disponibles, en `package.json`. Para desarrollo local, utiliza Node.js 24, como en el workflow de despliegue, y npm.

## Desarrollo local

```bash
npm install
npm run dev
```

Astro muestra en la terminal la dirección local del servidor. Para comprobar la versión de producción:

```bash
npm run build
npm run preview
```

El build genera el sitio estático en `dist/`. `preview` sirve ese resultado; si cambias contenido o código, vuelve a ejecutar el build antes de revisarlo con `preview`.

## Organización del proyecto

```text
src/
  content.config.ts       Esquemas de las colecciones
  content/
    proyectos/           Fichas de obra y actividad pública
    docencia/            Experiencias docentes
    prensa/              Referencias de prensa
  lib/                   Adaptación, selección y ordenación de datos
  components/            Componentes de presentación
  pages/                 Páginas y rutas estáticas
  layouts/BaseLayout.astro
  styles/
    global.css            Base compartida
    theme-teal.css        Variante Teal
    theme-comic.css       Variante Cómic
public/
  assets/img/             Imágenes publicadas
  CNAME                   Dominio propio
  robots.txt
.github/workflows/deploy.yml
```

`src/content.config.ts` es la referencia para los campos permitidos y obligatorios. La lógica que convierte entradas de contenido en datos para las páginas está en `src/lib/`; conviene revisarla antes de cambiar reglas de visibilidad o selección.

## Páginas y contenido

| Ruta | Contenido |
| --- | --- |
| `/` | Presentación y áreas de trabajo reciente, construidas a partir de proyectos y experiencias docentes publicados. |
| `/obra/` | Catálogo agrupado por secciones editoriales. |
| `/proyectos/<slug>/` | Ficha individual de un proyecto cuando tiene `detalle: true`. |
| `/docencia/` | Experiencias docentes, formación y enfoque de enseñanza. |
| `/docencia/<slug>/` | Ficha individual de una experiencia docente publicada con `detalle: true`. |
| `/trayectoria/` | Cronología y bloque separado de encuentros y actividad pública. |
| `/trayectoria/una-vida-dibujando/` | Relato biográfico. |
| `/prensa/` | Referencias destacadas y archivo de prensa. |
| `/contacto/` | Contacto y redes sociales. |

Los nombres de archivo Markdown identifican las entradas y, cuando se genera una ficha, forman parte de su URL. No cambies un slug o un `anchor` publicado sin prever la compatibilidad de sus enlaces.

### Proyectos

Cada archivo en `src/content/proyectos/` contiene frontmatter y, cuando procede, el texto de la ficha. Los campos `titulo`, `tipoPrincipal`, `categorias`, `resumen` y `verificacion` describen el proyecto y su respaldo documental. `seccion` decide su ubicación editorial en Obra; no equivale a `categorias`, que pueden ser varias.

Los indicadores de publicación tienen funciones distintas:

| Campo | Efecto |
| --- | --- |
| `publicar` | Permite utilizar la entrada en el sitio público. |
| `detalle` | Genera una ficha en `/proyectos/<slug>/`. |
| `mostrarObra` | Incluye la entrada en Obra, según su sección. |
| `mostrarTrayectoria` | Incluye la entrada en Trayectoria. |
| `bloqueTrayectoria` | La sitúa en la cronología o en el bloque independiente de actividad pública. |
| `archivoObra` | Le da el tratamiento compacto previsto para el archivo de Obra. |

Inicio no se construye a partir de una lista fija de destacados: muestra las áreas que tienen actividad reciente publicada, con una ventana que comprende el año del build y los dos anteriores. Las experiencias docentes vigentes también pueden mantener activa su área. Si cambia el año, hay que volver a construir y desplegar el sitio para actualizar esa selección.

Los campos `imagenPrincipal` y `galeria` permiten añadir imágenes reales del proyecto, cada una con texto alternativo apropiado. Los archivos se guardan en `public/assets/img/`, normalmente agrupados por proyecto o experiencia. `relacionados` admite identificadores de otros proyectos existentes; la presentación puede completar las sugerencias por afinidad. `enlaces` recoge recursos públicos y `verificacion` conserva el estado, las notas y las fuentes que sustentan los datos. El frontmatter también forma parte del repositorio público: no guardes información privada en él.

### Docencia

Las experiencias de `src/content/docencia/` se ordenan por el campo `orden`. `publicar` controla si aparecen en el sitio y `detalle` si generan una ficha propia. Según la experiencia, la ficha puede mostrar contexto, metodología, temporalización, fases, recursos, galería, enlaces y cuerpo Markdown. La formación y el enfoque general que aparecen en `/docencia/` se mantienen en la propia página, no en una colección independiente.

### Prensa

Cada archivo de `src/content/prensa/` crea una referencia en el archivo de `/prensa/`. `fechaOrden` permite ordenar cronológicamente cuando la fecha visible tiene otro formato. `destacado` y `ordenDestacado` controlan el bloque inicial; una referencia destacada sigue presente también en el archivo. `url` apunta a la fuente pública y `proyectoRelacionado`, cuando existe, enlaza con el proyecto correspondiente. No hay páginas individuales de prensa.

## Temas e interacciones

`global.css` contiene la base común. `theme-comic.css` y `theme-teal.css` aplican sus variantes visuales sin duplicar la estructura. Cómic es el tema inicial; el selector discreto del pie permite cambiar a Teal y guarda la preferencia en el navegador (`vicente-visual-theme`).

Las interacciones se resuelven con JavaScript del proyecto: menú móvil, selector de tema y galería con visor. La navegación y el contenido principal se generan como HTML estático.

## SEO y despliegue

El sitio se construye para `https://vicenteperpina.com` con barras finales en las rutas. El layout genera los metadatos de las páginas; `src/pages/sitemap.xml.ts` genera el sitemap de las rutas públicas y `public/robots.txt` lo anuncia. `public/CNAME` configura el dominio propio. También existen redirecciones de URLs antiguas en `public/`; consérvalas al modificar rutas.

El workflow `.github/workflows/deploy.yml` construye y publica en GitHub Pages al enviar cambios a `main`; también admite ejecución manual desde GitHub Actions. No se necesita backend ni despliegue de servidor.

## Comprobaciones antes de publicar

```bash
npm run build
git diff --check
git status --short
```

Al añadir contenido, comprueba además que las imágenes y los enlaces existen, que los identificadores de `relacionados` son válidos, que las fichas con `detalle: true` se generan y que las banderas de visibilidad sitúan cada entrada donde corresponde. Si has tocado rutas o anclas, revisa también los enlaces antiguos y `dist/sitemap.xml`.
