# Vicente Perpiñá — migración a Astro · Slice 2

Este slice completa la migración de las páginas públicas de la v1.1 a Astro. A partir de aquí, la web principal ya no depende de los HTML legacy ni de los CSS/JS estáticos antiguos.

## Qué cambia

- Inicio, Obra, Docencia, Trayectoria y Contacto se generan ya con Astro.
- Las rutas públicas principales pasan a ser limpias:
  - `/`
  - `/obra/`
  - `/docencia/`
  - `/trayectoria/`
  - `/contacto/`
- `Header.astro`, `Footer.astro` y `BaseLayout.astro` son compartidos por todas las páginas.
- El CSS global pasa a `src/styles/global.css` y Astro lo procesa durante el build.
- El JavaScript común pasa a `src/scripts/main.js` y Astro lo empaqueta durante el build.
- Se conservan redirects estáticos desde las URL antiguas `.html` para no romper enlaces existentes.
- El contenido y el diseño siguen siendo los de la v1.1; este slice no introduce todavía el modelo de proyectos/fichas del Slice 3.

## Estructura relevante

```text
.github/workflows/deploy.yml
public/
  CNAME
  portfolio.html      # redirect legacy -> /obra/
  docencia.html       # redirect legacy -> /docencia/
  trayectoria.html    # redirect legacy -> /trayectoria/
  contacto.html       # redirect legacy -> /contacto/
  assets/
    img/
      vicente.png
src/
  components/
    Header.astro
    Footer.astro
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    obra/
      index.astro
    docencia/
      index.astro
    trayectoria/
      index.astro
    contacto/
      index.astro
  scripts/
    main.js
  styles/
    global.css
astro.config.mjs
package.json
tsconfig.json
.gitignore
```

## Limpieza necesaria en el repositorio

El ZIP no puede borrar archivos que ya existen. Después de copiarlo encima del repo, elimina los restos de la web pre-Astro que siguen en la raíz:

```text
/CNAME
/index.html
/portfolio.html
/docencia.html
/trayectoria.html
/contacto.html
/assets/
```

El `CNAME` válido pasa a ser `public/CNAME`; el `CNAME` antiguo de raíz se puede borrar.

La carpeta `/assets/` de raíz se puede borrar completa: la imagen necesaria ya está en `/public/assets/img/` y los estilos/scripts viven ahora en `/src/`.

También elimina, si siguen existiendo tras extraer el ZIP, estos dos archivos temporales del Slice 1:

```text
/public/assets/css/styles.css
/public/assets/js/main.js
```

NO elimines los siguientes HTML de `public/`, porque ahora son redirects de compatibilidad:

```text
/public/portfolio.html
/public/docencia.html
/public/trayectoria.html
/public/contacto.html
```

Tampoco elimines:

```text
/public/CNAME
/public/assets/img/vicente.png
```

## Publicación

```bash
git add -A
git commit -m "Migración Astro - Slice 2"
git push
```

Usa `git add -A` en este slice para que Git registre también correctamente las eliminaciones.

GitHub Pages debe seguir configurado con **Source: GitHub Actions**. No es necesario volver a tocar DNS ni el dominio personalizado.

## Comprobaciones tras publicar

Comprueba estas URL:

- `https://vicenteperpina.com/`
- `https://vicenteperpina.com/obra/`
- `https://vicenteperpina.com/docencia/`
- `https://vicenteperpina.com/trayectoria/`
- `https://vicenteperpina.com/contacto/`

Y verifica que una URL antigua como:

- `https://vicenteperpina.com/portfolio.html#vinyetari`

redirige a:

- `https://vicenteperpina.com/obra/#vinyetari`

## Próximo slice

El Slice 3 introducirá el modelo estructurado de proyectos, una colección de contenido y la plantilla reutilizable `/proyectos/[slug]/`.
